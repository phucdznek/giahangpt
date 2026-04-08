# B2B ChatGPT Plus API Documentation

## Base URL
```
https://autosubai.com
```

## Authentication
No API keys required. Security is provided through unique **CDK (Customer Delivery Key)** codes.  
Each CDK code is single-use and tied to your B2B account.

---

## Quick Start

```bash
# Submit an order
curl -X POST https://autosubai.com/submit \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Accept: application/json" \
  -d "uniqueCode=YOUR_CDK_CODE" \
  -d "sessionData={\"accessToken\":\"ey...\"}" \
  -d "webhookUrl=https://yourapi.com/webhook"

# Check status
curl -X POST https://autosubai.com/check \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Accept: application/json" \
  -d "uniqueCode=YOUR_CDK_CODE"
```

---

## Endpoints

### POST /submit
Submit a new ChatGPT Plus order for processing.

**Request Headers:**
- `Content-Type: application/x-www-form-urlencoded` or `application/json`
- `Accept: application/json` (optional, for JSON response)

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `uniqueCode` | string | Yes | Your unique CDK code |
| `sessionData` | string | Yes | ChatGPT session JSON (must contain `accessToken`) |
| `notes` | string | No | Your reference/order ID (max 100 characters) |
| `webhookUrl` | string | No | HTTPS URL for order status notifications |

**Success Response (200 OK):**
```json
{
  "status": "processing",
  "uniqueCode": "YOUR_CDK_CODE",
  "message": "Order submitted successfully"
}
```

**Error Response (400/500):**
```json
{
  "error": "ERROR_CODE",
  "message": "Human readable error message"
}
```

**Error Codes:**
- `MISSING_CODE` - uniqueCode not provided
- `MISSING_SESSION` - sessionData not provided
- `INVALID_SESSION` - Invalid session JSON format
- `INVALID_WEBHOOK` - Invalid webhook URL (must be HTTPS)
- `INVALID_CODE` - CDK code not found
- `CODE_USED` - CDK already used
- `DATABASE_ERROR` - Database operation failed
- `WORKFLOW_ERROR` - Failed to start processing

---

### POST /check
Check order status by CDK code.

**Request Headers:**
- `Content-Type: application/x-www-form-urlencoded` or `application/json`
- `Accept: application/json` (optional, for JSON response)

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `uniqueCode` | string | Yes | Your unique CDK code |

**Success Response (200 OK):**

For completed order:
```json
{
  "status": "completed",
  "uniqueCode": "YOUR_CDK_CODE",
  "email": "user@example.com",
  "notes": "your-order-123"
}
```

For failed order:
```json
{
  "status": "failed",
  "uniqueCode": "YOUR_CDK_CODE",
  "error": "INVALID_TOKEN",
  "message": "Your session token is invalid or expired",
  "email": "user@example.com",
  "notes": "your-order-123"
}
```

For processing order:
```json
{
  "status": "processing",
  "uniqueCode": "YOUR_CDK_CODE",
  "email": "user@example.com",
  "notes": "your-order-123"
}
```

**Possible Status Values:**
- `available` - Code not used yet
- `processing` - Order being processed
- `completed` - Order successfully completed
- `failed` - Order failed (see `error` field)
- `pending` - Order submitted, not yet assigned to worker

---

### GET /status/:uniqueCode
Real-time status polling endpoint (same response format as `/check`).

**Example:**
```bash
curl https://autosubai.com/status/YOUR_CDK_CODE \
  -H "Accept: application/json"
```

---

## Data Schemas

### Session Data Format
The `sessionData` field must be a JSON string containing at minimum an `accessToken` field.

**Required Structure:**
```json
{
  "accessToken": "eyJhbGci...",
  "user": {
    "id": "user-...",
    "email": "user@example.com"
  },
  "account": {
    "id": "acc_...",
    "planType": "free"
  }
}
```

**Required Field:** `accessToken`  
**Optional Fields:** `user`, `account`, `expires`, `authProvider`

---

## Webhook Notifications

If you provide a `webhookUrl` when submitting an order, you'll receive HTTP POST notifications when the order completes or fails.

### Webhook Requirements
- Must be HTTPS URL
- Should respond with 2xx status code within 30 seconds
- We retry up to 3 times with exponential backoff (5s, 10s, 20s)

### Webhook Payload

**Success Notification:**
```json
{
  "uniqueCode": "YOUR_CDK_CODE",
  "status": "completed",
  "timestamp": "2025-12-24T10:30:00.000Z",
  "email": "user@example.com",
  "notes": "your-order-123"
}
```

**Failure Notification:**
```json
{
  "uniqueCode": "YOUR_CDK_CODE",
  "status": "failed",
  "timestamp": "2025-12-24T10:30:00.000Z",
  "error": "INVALID_TOKEN",
  "email": "user@example.com",
  "notes": "your-order-123"
}
```

### Webhook Security
Your webhook endpoint should:
1. Verify the request comes from our servers (check source IP if needed)
2. Validate the payload structure
3. Handle duplicate notifications idempotently (we may retry on network errors)

---

## Order Error Codes

| Code | Description | Retryable |
|------|-------------|-----------|
| `INVALID_TOKEN` | Session token is invalid or expired | Yes - get new token |
| `ALREADY_SUBSCRIBED` | Account already has active ChatGPT Plus subscription | No |
| `NO_DEFAULT_ACCOUNT` | Could not find ChatGPT account in session | No |
| `CHECKOUT_FAILED` | Failed to generate checkout link | Yes |
| `TIMEOUT` | Order expired after 24 hours waiting for worker | Yes |
| `WORKFLOW_ERROR` | Internal processing error | Yes |

---

## Integration Examples

### JavaScript / Node.js
```javascript
const response = await fetch('https://autosubai.com/submit', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify({
    uniqueCode: 'YOUR_CDK_CODE',
    sessionData: JSON.stringify({ 
      accessToken: 'ey...', 
      user: { email: 'user@example.com' } 
    }),
    notes: 'order-12345',
    webhookUrl: 'https://yourapi.com/webhook'
  })
});

const result = await response.json();
console.log(result.status); // "processing"
```

### Python
```python
import requests
import json

response = requests.post(
    'https://autosubai.com/submit',
    headers={'Accept': 'application/json'},
    data={
        'uniqueCode': 'YOUR_CDK_CODE',
        'sessionData': json.dumps({'accessToken': 'ey...'}),
        'notes': 'order-12345',
        'webhookUrl': 'https://yourapi.com/webhook'
    }
)

result = response.json()
print(result['status'])  # "processing"

# Poll for status
status_response = requests.post(
    'https://autosubai.com/check',
    headers={'Accept': 'application/json'},
    data={'uniqueCode': 'YOUR_CDK_CODE'}
)
print(status_response.json())
```

### PHP
```php
<?php
$data = [
    'uniqueCode' => 'YOUR_CDK_CODE',
    'sessionData' => json_encode(['accessToken' => 'ey...']),
    'notes' => 'order-12345',
    'webhookUrl' => 'https://yourapi.com/webhook'
];

$ch = curl_init('https://autosubai.com/submit');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json']);

$response = curl_exec($ch);
$result = json_decode($response, true);

echo $result['status']; // "processing"
curl_close($ch);
?>
```

---

## Best Practices

1. **Use Webhooks**: Implement webhook endpoints for real-time notifications instead of polling
2. **Fallback to Polling**: If webhook delivery fails, poll `/status/:uniqueCode` as backup
3. **Handle Retries**: For retryable errors, wait before resubmitting with a new session token
4. **Store CDK Codes**: Keep CDK codes in your database to track order status
5. **Validate Session Data**: Ensure session JSON is valid before submitting
6. **Set Notes Field**: Use the `notes` field to store your internal order ID for tracking
7. **HTTPS Webhooks**: Always use HTTPS for webhook URLs
8. **Idempotent Webhooks**: Handle duplicate webhook notifications gracefully

---

## Rate Limits

Current rate limits: **None**  
*Note: We reserve the right to implement rate limiting in the future if abuse is detected*

---

## Support

For API issues, integration questions, or to obtain CDK codes:  
Contact your account manager or technical support team.

---

## Changelog

### 2025-12-24
- Initial API release
- Added JSON response support via `Accept: application/json` header
- Added webhook notifications for order completion/failure
- Added comprehensive error codes and messages
