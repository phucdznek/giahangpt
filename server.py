"""
RenewGPT Proxy Server
Serves static files and proxies API requests to autosubai.com to avoid CORS issues.
"""

import http.server
import json
import os
import urllib.request
import urllib.parse
import urllib.error

PORT = 3000
API_BASE = "https://autosubai.com"

class ProxyHandler(http.server.SimpleHTTPRequestHandler):
    
    def do_POST(self):
        # Proxy API calls
        if self.path in ['/api/submit', '/api/check']:
            self.proxy_request()
        else:
            self.send_error(404)
    
    def do_GET(self):
        # Proxy status endpoint
        if self.path.startswith('/api/status/'):
            self.proxy_request()
        else:
            super().do_GET()
    
    def proxy_request(self):
        try:
            # Build target URL
            api_path = self.path.replace('/api/', '/')
            target_url = API_BASE + api_path
            
            # Read request body for POST
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length) if content_length > 0 else None
            
            # Build request
            req = urllib.request.Request(target_url)
            req.add_header('Accept', 'application/json')
            req.add_header('User-Agent', 'RenewGPT-Proxy/1.0')
            
            if body:
                req.add_header('Content-Type', self.headers.get('Content-Type', 'application/json'))
                req.data = body
            
            # Make request
            response = urllib.request.urlopen(req, timeout=30)
            response_data = response.read()
            
            # Send response
            self.send_response(response.status)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(response_data)
            
        except urllib.error.HTTPError as e:
            error_body = e.read()
            self.send_response(e.code)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(error_body)
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({
                'error': 'PROXY_ERROR',
                'message': str(e)
            }).encode())
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Accept')
        self.end_headers()
    
    def log_message(self, format, *args):
        print(f"[{self.log_date_time_string()}] {format % args}")

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    server = http.server.HTTPServer(('0.0.0.0', PORT), ProxyHandler)
    print("")
    print(f"  [OK] RenewGPT Server running!")
    print(f"  [WEB] http://localhost:{PORT}")
    print(f"  [API] Proxy -> {API_BASE}")
    print("")
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        server.server_close()
