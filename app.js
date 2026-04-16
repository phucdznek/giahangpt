/* ============================================
   RenewGPT - Main Application
   ============================================ */

const API_BASE = '/api';

// ============================================
// i18n - INTERNATIONALIZATION
// ============================================
let currentLang = localStorage.getItem('lang') || 'vi';

const translations = {
    vi: {
        nav_home: 'Trang chủ', nav_renew: 'Gia hạn GPT', nav_lookup: 'Tra cứu CDK', nav_quick: 'Kích gói nhanh',
        nav_buy_cdk: 'Mua CDK', nav_buy_cdk_full: 'Mua CDK @ovartorr',
        hero_badge: 'Hệ thống hoạt động ổn định',
        hero_title: 'Nâng cấp <span class="gradient-text">ChatGPT Plus</span><br>Tự động & Nhanh chóng',
        hero_desc: 'Dịch vụ gia hạn ChatGPT Plus tự động bằng CDK code. An toàn, bảo mật, xử lý trong vài phút. Hỗ trợ cả tài khoản mới và gia hạn tài khoản cũ.',
        hero_btn_renew: 'Gia hạn ngay', hero_btn_lookup: 'Tra cứu CDK',
        stat_orders: 'Đơn hoàn thành', stat_success: 'Tỷ lệ thành công', stat_time: 'Thời gian xử lý', stat_time_value: '~2 phút',
        feat_title: 'Tại sao chọn chúng tôi?', feat_desc: 'Giải pháp nâng cấp ChatGPT Plus an toàn và nhanh chóng nhất',
        feat_fast: 'Xử lý siêu nhanh', feat_fast_desc: 'Đơn hàng được xử lý tự động trong vòng 2-5 phút. Không cần chờ đợi lâu.',
        feat_secure: 'An toàn & Bảo mật', feat_secure_desc: 'Hệ thống mã hóa đầu cuối, không lưu trữ thông tin nhạy cảm của bạn.',
        feat_auto: 'Hoàn toàn tự động', feat_auto_desc: 'Quy trình tự động 100%. Chỉ cần nhập CDK và session, hệ thống lo phần còn lại.',
        feat_support: 'Hỗ trợ 7:00 - 24:00', feat_support_desc: 'Đội ngũ hỗ trợ kỹ thuật sẵn sàng giải đáp mọi thắc mắc của bạn.',
        steps_title: 'Hướng dẫn sử dụng', steps_desc: 'Chỉ 3 bước đơn giản để nâng cấp ChatGPT Plus',
        step1_title: 'Mua CDK Code', step1_desc: 'Liên hệ Bot Telegram để mua CDK code. Mỗi code sử dụng 1 lần duy nhất.', step1_link: 'Mua CDK ngay →',
        step2_title: 'Lấy Session Data', step2_desc: 'Truy cập link bên dưới khi đã đăng nhập ChatGPT để lấy session data.', step2_link: 'Lấy Session →',
        step3_title: 'Nhập & Xác nhận', step3_desc: 'Dán CDK code và session data vào form, nhấn xác nhận và chờ kết quả.', step3_link: 'Gia hạn ngay →',
        video_title: 'Video hướng dẫn chi tiết', video_desc: 'Xem video hướng dẫn từng bước để thực hiện nhanh chóng và chính xác nhất.', video_btn: 'Xem Video',
        renew_title: 'Gia hạn GPT Plus', renew_desc: 'Nhập CDK code và session data để nâng cấp tài khoản ChatGPT Plus',
        renew_warning: '⚠️ CHỈ DÙNG KHI KHÔNG CÓ GÓI NÀO ĐANG HOẠT ĐỘNG. KHÔNG NÊN ĐÈ GÓI!',
        renew_step3: 'Xác nhận', renew_cdk_ph: 'Nhập CDK code của bạn...',
        renew_get_session: 'Lấy Session Data tại đây',
        renew_session_ph: 'Dán toàn bộ nội dung JSON từ chatgpt.com/api/auth/session vào đây...',
        renew_session_hint: 'Truy cập link trên khi đã đăng nhập ChatGPT, copy toàn bộ nội dung trang',
        renew_confirm_title: 'Xác nhận thông tin', renew_plan_type: 'Loại tài khoản:',
        renew_submit: 'Xác nhận & Gia hạn',
        btn_next: 'Tiếp tục', btn_back: 'Quay lại',
        processing_title: 'Đang xử lý yêu cầu', processing_msg: 'Hệ thống đang nâng cấp tài khoản của bạn...',
        success_title: '🎉 Nạp thành công!', success_msg: 'Tài khoản của bạn đã được nâng cấp lên ChatGPT Plus', success_btn: 'Thực hiện đơn mới',
        error_title: 'Nạp thất bại', error_msg: 'Đã có lỗi xảy ra', error_btn: 'Thử lại',
        lookup_title: 'Tra cứu CDK', lookup_desc: 'Kiểm tra trạng thái CDK code và đơn hàng của bạn (hỗ trợ nhiều mã)',
        lookup_label: 'Nhập CDK (hỗ trợ nhiều mã, mỗi dòng một mã)',
        lookup_ph: 'Nhập CDK code cần tra cứu...\nMỗi dòng một mã CDK\nVí dụ:\nABC-1234-XYZ\nDEF-5678-UVW',
        lookup_btn: 'Tra cứu trạng thái', lookup_loading: 'Đang tra cứu, vui lòng đợi...',
        lookup_result_title: 'Kết quả tra cứu', lookup_copy_label: 'Sao chép CDK nhanh',
        copy_all: 'Sao chép tất cả CDK', copy_unused: 'Sao chép CDK chưa dùng', copy_used: 'Sao chép CDK đã dùng', copy_invalid: 'Sao chép CDK không hợp lệ',
        stat_total: 'TỔNG SỐ', stat_used: 'ĐÃ DÙNG', stat_available: 'CHƯA DÙNG', stat_invalid: 'KHÔNG HỢP LỆ',
        th_no: 'STT', th_cdk: 'MÃ CDK', th_status: 'TRẠNG THÁI', th_time: 'THỜI GIAN DÙNG', th_account: 'TÀI KHOẢN',
        status_available: 'Chưa dùng', status_processing: 'Đang xử lý', status_completed: 'Đã sử dụng', status_failed: 'Thất bại', status_pending: 'Chờ xử lý', status_invalid: 'Không hợp lệ',
        quick_title: 'Kích gói nhanh', quick_desc: 'Nhập CDK và session trên cùng 1 form, hệ thống xử lý ngay lập tức',
        quick_cdk_ph: 'Nhập CDK code...', quick_get_here: 'Lấy tại đây ↗', quick_session_ph: 'Dán JSON session data vào đây...',
        quick_btn: 'Kích hoạt ngay', quick_processing: 'Đang xử lý kích hoạt', quick_wait: 'Vui lòng đợi trong giây lát...',
        quick_success: '🎉 Kích hoạt thành công!', quick_success_msg: 'Tài khoản đã được nâng cấp ChatGPT Plus', quick_new: 'Kích hoạt đơn khác',
        quick_fail: 'Kích hoạt thất bại',
        footer_brand_desc: 'Dịch vụ gia hạn ChatGPT Plus tự động, nhanh chóng và an toàn nhất Việt Nam.',
        footer_services: 'Dịch vụ', footer_renew: 'Gia hạn GPT Plus', footer_support: 'Hỗ trợ',
        footer_contact: 'Liên hệ @ovartorr', footer_video: 'Video hướng dẫn', footer_session: 'Lấy Session Data',
        footer_copyright: '© 2025 RenewGPT. Tất cả quyền được bảo lưu.', footer_hours: 'Hỗ trợ: 7:00 - 24:00 hàng ngày',
        toast_copied: 'Đã sao chép {n} mã CDK!', toast_none: 'Không có CDK nào thuộc nhóm này',
        toast_enter_cdk: 'Vui lòng nhập CDK code', toast_enter_session: 'Vui lòng nhập Session Data',
        toast_session_token: 'Session data phải chứa accessToken', toast_session_json: 'Session data không đúng định dạng JSON',
        toast_enter_all: 'Vui lòng nhập đầy đủ thông tin', toast_upgrade_ok: 'Nâng cấp thành công! 🎉', toast_error: 'Có lỗi xảy ra',
        toast_copy_ok: 'Đã sao chép CDK!', toast_copy_fail: 'Không thể sao chép',
    },
    en: {
        nav_home: 'Home', nav_renew: 'Renew GPT', nav_lookup: 'Check CDK', nav_quick: 'Quick Activate',
        nav_buy_cdk: 'Buy CDK', nav_buy_cdk_full: 'Buy CDK @ovartorr',
        hero_badge: 'System running stable',
        hero_title: 'Upgrade <span class="gradient-text">ChatGPT Plus</span><br>Auto & Fast',
        hero_desc: 'Automatic ChatGPT Plus renewal service using CDK code. Safe, secure, processed in minutes. Supports both new and existing accounts.',
        hero_btn_renew: 'Renew Now', hero_btn_lookup: 'Check CDK',
        stat_orders: 'Orders Completed', stat_success: 'Success Rate', stat_time: 'Processing Time', stat_time_value: '~2 min',
        feat_title: 'Why Choose Us?', feat_desc: 'The safest and fastest ChatGPT Plus upgrade solution',
        feat_fast: 'Super Fast', feat_fast_desc: 'Orders are automatically processed within 2-5 minutes. No long waits.',
        feat_secure: 'Safe & Secure', feat_secure_desc: 'End-to-end encryption system, your sensitive information is never stored.',
        feat_auto: 'Fully Automated', feat_auto_desc: '100% automated process. Just enter CDK and session, the system handles the rest.',
        feat_support: 'Support 7:00 - 24:00', feat_support_desc: 'Technical support team ready to answer all your questions.',
        steps_title: 'How to Use', steps_desc: 'Just 3 simple steps to upgrade ChatGPT Plus',
        step1_title: 'Buy CDK Code', step1_desc: 'Contact Telegram Bot to buy CDK code. Each code is single-use only.', step1_link: 'Buy CDK Now →',
        step2_title: 'Get Session Data', step2_desc: 'Visit the link below while logged into ChatGPT to get session data.', step2_link: 'Get Session →',
        step3_title: 'Enter & Confirm', step3_desc: 'Paste CDK code and session data into the form, confirm and wait for results.', step3_link: 'Renew Now →',
        video_title: 'Detailed Video Guide', video_desc: 'Watch the step-by-step video guide for the quickest and most accurate process.', video_btn: 'Watch Video',
        renew_title: 'Renew GPT Plus', renew_desc: 'Enter CDK code and session data to upgrade your ChatGPT Plus account',
        renew_warning: '⚠️ USE ONLY WHEN NO PLAN IS ACTIVE. DO NOT STACK PLANS!',
        renew_step3: 'Confirm', renew_cdk_ph: 'Enter your CDK code...',
        renew_get_session: 'Get Session Data here',
        renew_session_ph: 'Paste the full JSON content from chatgpt.com/api/auth/session here...',
        renew_session_hint: 'Visit the link above while logged into ChatGPT, copy all page content',
        renew_confirm_title: 'Confirm Information', renew_plan_type: 'Account Type:',
        renew_submit: 'Confirm & Renew',
        btn_next: 'Next', btn_back: 'Back',
        processing_title: 'Processing Request', processing_msg: 'System is upgrading your account...',
        success_title: '🎉 Success!', success_msg: 'Your account has been upgraded to ChatGPT Plus', success_btn: 'New Order',
        error_title: 'Failed', error_msg: 'An error occurred', error_btn: 'Try Again',
        lookup_title: 'Check CDK', lookup_desc: 'Check CDK code status and your orders (supports multiple codes)',
        lookup_label: 'Enter CDK (multiple codes supported, one per line)',
        lookup_ph: 'Enter CDK code to check...\nOne code per line\nExample:\nABC-1234-XYZ\nDEF-5678-UVW',
        lookup_btn: 'Check Status', lookup_loading: 'Checking, please wait...',
        lookup_result_title: 'Results', lookup_copy_label: 'Quick Copy CDK',
        copy_all: 'Copy All CDK', copy_unused: 'Copy Unused CDK', copy_used: 'Copy Used CDK', copy_invalid: 'Copy Invalid CDK',
        stat_total: 'TOTAL', stat_used: 'USED', stat_available: 'UNUSED', stat_invalid: 'INVALID',
        th_no: 'NO.', th_cdk: 'CDK CODE', th_status: 'STATUS', th_time: 'USED AT', th_account: 'ACCOUNT',
        status_available: 'Unused', status_processing: 'Processing', status_completed: 'Used', status_failed: 'Failed', status_pending: 'Pending', status_invalid: 'Invalid',
        quick_title: 'Quick Activate', quick_desc: 'Enter CDK and session in one form, system processes immediately',
        quick_cdk_ph: 'Enter CDK code...', quick_get_here: 'Get here ↗', quick_session_ph: 'Paste JSON session data here...',
        quick_btn: 'Activate Now', quick_processing: 'Processing Activation', quick_wait: 'Please wait a moment...',
        quick_success: '🎉 Activation Successful!', quick_success_msg: 'Account has been upgraded to ChatGPT Plus', quick_new: 'Activate Another',
        quick_fail: 'Activation Failed',
        footer_brand_desc: 'Automatic ChatGPT Plus renewal service, fast and secure.',
        footer_services: 'Services', footer_renew: 'Renew GPT Plus', footer_support: 'Support',
        footer_contact: 'Contact @ovartorr', footer_video: 'Video Guide', footer_session: 'Get Session Data',
        footer_copyright: '© 2025 RenewGPT. All rights reserved.', footer_hours: 'Support: 7:00 AM - 12:00 AM daily',
        toast_copied: 'Copied {n} CDK codes!', toast_none: 'No CDK in this category',
        toast_enter_cdk: 'Please enter CDK code', toast_enter_session: 'Please enter Session Data',
        toast_session_token: 'Session data must contain accessToken', toast_session_json: 'Session data is not valid JSON',
        toast_enter_all: 'Please fill in all fields', toast_upgrade_ok: 'Upgrade successful! 🎉', toast_error: 'An error occurred',
        toast_copy_ok: 'CDK copied!', toast_copy_fail: 'Cannot copy',
    }
};

function t(key) {
    return (translations[currentLang] && translations[currentLang][key]) || translations.vi[key] || key;
}

function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        if (translations[lang] && translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });

    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        const key = el.getAttribute('data-i18n-ph');
        if (translations[lang] && translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
}

function initLanguageSwitcher() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            applyLanguage(lang);
        });
    });

    applyLanguage(currentLang);
}

// ============================================
// PARTICLES BACKGROUND
// ============================================
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrame;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.fadeDir = Math.random() > 0.5 ? 1 : -1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity += this.fadeDir * 0.002;
            if (this.opacity <= 0.05 || this.opacity >= 0.5) this.fadeDir *= -1;
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(16, 185, 129, ${this.opacity})`;
            ctx.fill();
        }
    }

    function init() {
        resize();
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 80);
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(16, 185, 129, ${0.04 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        animFrame = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        cancelAnimationFrame(animFrame);
        init();
        animate();
    });

    init();
    animate();
}

// ============================================
// NAVIGATION & ROUTING
// ============================================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('nav-hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    // Scroll effect
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    });

    // Hamburger
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Page navigation with data-page
    document.querySelectorAll('[data-page]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const page = el.getAttribute('data-page');
            navigateTo(page);
        });
    });

    // Handle hash on load
    window.addEventListener('hashchange', handleHash);
    handleHash();
}

function handleHash() {
    const hash = window.location.hash.replace('#', '') || 'home';
    navigateTo(hash, false);
}

function navigateTo(page, pushHash = true) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    // Show target page
    const target = document.getElementById(`page-${page}`);
    if (target) {
        target.classList.add('active');
        // Re-trigger animation
        target.style.animation = 'none';
        target.offsetHeight; // trigger reflow
        target.style.animation = '';
    }

    // Update nav active state
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll(`.nav-link[data-page="${page}"]`).forEach(l => l.classList.add('active'));

    // Update mobile nav
    document.querySelectorAll('.mobile-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll(`.mobile-link[data-page="${page}"]`).forEach(l => l.classList.add('active'));

    if (pushHash) {
        history.pushState(null, '', `#${page}`);
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Trigger counter animation for home page
    if (page === 'home') {
        animateCounters();
    }
}

// ============================================
// COUNTER ANIMATION
// ============================================
function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const startTime = performance.now();
        const startVal = 0;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(startVal + (target - startVal) * eased);
            counter.textContent = current.toLocaleString('vi-VN') + '+';
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    });
}

// ============================================
// RENEW FORM - MULTI-STEP
// ============================================
let currentStep = 1;
let sessionDataParsed = null;

function initRenewForm() {
    const btnNext1 = document.getElementById('btn-next-1');
    const btnNext2 = document.getElementById('btn-next-2');
    const btnBack2 = document.getElementById('btn-back-2');
    const btnBack3 = document.getElementById('btn-back-3');
    const renewForm = document.getElementById('renew-form');

    btnNext1.addEventListener('click', async () => {
        const cdk = document.getElementById('cdk-input').value.trim();
        if (!cdk) {
            showToast('Vui lòng nhập CDK code', 'error');
            document.getElementById('cdk-input').focus();
            return;
        }

        // Check CDK status first
        btnNext1.disabled = true;
        btnNext1.innerHTML = '<span class="mini-spinner" style="width:18px;height:18px;border-width:2px;display:inline-block;vertical-align:middle;margin-right:8px;"></span> Đang kiểm tra...';
        
        const cdkFeedback = document.getElementById('cdk-feedback');
        cdkFeedback.className = 'cdk-feedback';
        cdkFeedback.classList.remove('hidden');
        cdkFeedback.innerHTML = '<span class="mini-spinner" style="width:16px;height:16px;border-width:2px;display:inline-block;vertical-align:middle;margin-right:6px;"></span> Đang xác minh mã CDK...';
        cdkFeedback.classList.add('cdk-checking');

        try {
            const response = await fetch(`${API_BASE}/check`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ uniqueCode: cdk })
            });

            const data = await response.json();

            if (!response.ok) {
                // API returned error (e.g. INVALID_CODE)
                cdkFeedback.innerHTML = '❌ ' + (data.message || 'Mã CDK không hợp lệ hoặc không tồn tại.');
                cdkFeedback.className = 'cdk-feedback cdk-error';
                document.getElementById('cdk-input').classList.add('input-error');
                document.getElementById('cdk-input').classList.remove('input-valid');
                return;
            }

            if (data.status === 'available') {
                // CDK is valid and unused
                cdkFeedback.innerHTML = '✅ Mã CDK hợp lệ và chưa sử dụng.';
                cdkFeedback.className = 'cdk-feedback cdk-valid';
                document.getElementById('cdk-input').classList.add('input-valid');
                document.getElementById('cdk-input').classList.remove('input-error');
                
                // Move to next step after brief delay
                setTimeout(() => goToStep(2), 600);

            } else if (data.status === 'completed' || data.status === 'processing' || data.status === 'pending') {
                // CDK already used
                const statusMsg = {
                    completed: 'Mã CDK này đã được sử dụng.',
                    processing: 'Mã CDK này đang được xử lý.',
                    pending: 'Mã CDK này đang chờ xử lý.'
                };
                cdkFeedback.innerHTML = '⚠️ ' + (statusMsg[data.status] || 'Mã CDK đã được sử dụng.');
                cdkFeedback.className = 'cdk-feedback cdk-used';
                document.getElementById('cdk-input').classList.add('input-error');
                document.getElementById('cdk-input').classList.remove('input-valid');

            } else if (data.status === 'failed') {
                // CDK was used but failed - might be retryable
                cdkFeedback.innerHTML = '⚠️ Mã CDK này đã xử lý thất bại trước đó. Liên hệ hỗ trợ.';
                cdkFeedback.className = 'cdk-feedback cdk-used';
                document.getElementById('cdk-input').classList.add('input-error');
                document.getElementById('cdk-input').classList.remove('input-valid');

            } else {
                // Unknown status
                cdkFeedback.innerHTML = '❌ Không thể xác minh mã CDK. Vui lòng thử lại.';
                cdkFeedback.className = 'cdk-feedback cdk-error';
            }

        } catch (error) {
            if (error.message && (error.message.includes('INVALID_CODE') || error.message.includes('not found'))) {
                cdkFeedback.innerHTML = '❌ Mã CDK không hợp lệ hoặc không tồn tại.';
                cdkFeedback.className = 'cdk-feedback cdk-error';
                document.getElementById('cdk-input').classList.add('input-error');
            } else {
                cdkFeedback.innerHTML = '❌ Lỗi kết nối. Vui lòng thử lại.';
                cdkFeedback.className = 'cdk-feedback cdk-error';
            }
        } finally {
            btnNext1.disabled = false;
            btnNext1.innerHTML = 'Tiếp tục <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
        }
    });

    btnNext2.addEventListener('click', () => {
        const session = document.getElementById('session-input').value.trim();
        if (!session) {
            showToast('Vui lòng nhập Session Data', 'error');
            document.getElementById('session-input').focus();
            return;
        }

        // Validate JSON
        try {
            sessionDataParsed = JSON.parse(session);
            if (!sessionDataParsed.accessToken) {
                showToast('Session data phải chứa accessToken', 'error');
                return;
            }
        } catch (e) {
            showToast('Session data không đúng định dạng JSON', 'error');
            return;
        }

        // Fill confirm info
        const cdk = document.getElementById('cdk-input').value.trim();
        document.getElementById('confirm-cdk').textContent = maskCDK(cdk);
        document.getElementById('confirm-email').textContent = sessionDataParsed.user?.email || 'Không xác định';
        document.getElementById('confirm-plan').textContent = sessionDataParsed.account?.planType || 'free';

        goToStep(3);
    });

    btnBack2.addEventListener('click', () => goToStep(1));
    btnBack3.addEventListener('click', () => goToStep(2));

    renewForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await submitOrder();
    });
}

function goToStep(step) {
    currentStep = step;

    // Update panels
    document.querySelectorAll('.form-panel').forEach(p => p.classList.remove('active'));
    document.getElementById(`step-${step}`).classList.add('active');

    // Update step indicators
    document.querySelectorAll('.form-step').forEach((s, i) => {
        s.classList.remove('active', 'completed');
        if (i + 1 === step) s.classList.add('active');
        if (i + 1 < step) s.classList.add('completed');
    });

    // Update step lines
    document.querySelectorAll('.step-line').forEach((l, i) => {
        l.classList.toggle('active', i < step - 1);
    });
}

function maskCDK(cdk) {
    if (cdk.length <= 8) return cdk;
    return cdk.substring(0, 4) + '****' + cdk.substring(cdk.length - 4);
}

async function submitOrder() {
    const cdk = document.getElementById('cdk-input').value.trim();
    const session = document.getElementById('session-input').value.trim();

    // Show processing state
    document.getElementById('renew-form').classList.add('hidden');
    document.getElementById('processing-state').classList.remove('hidden');

    // Start timer
    const timerEl = document.getElementById('processing-time');
    const progressEl = document.getElementById('progress-fill');
    let seconds = 0;
    const timer = setInterval(() => {
        seconds++;
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        timerEl.textContent = `${m}:${s.toString().padStart(2, '0')}`;
    }, 1000);

    // Animate progress bar (fake progress while waiting)
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress = Math.min(progress + Math.random() * 3, 85);
        progressEl.style.width = progress + '%';
    }, 500);

    try {
        // Submit order
        const response = await fetch(`${API_BASE}/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                uniqueCode: cdk,
                sessionData: session
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Có lỗi xảy ra khi gửi yêu cầu');
        }

        // Poll for status
        document.getElementById('processing-msg').textContent = 'Đơn hàng đang được xử lý, vui lòng chờ...';

        await pollStatus(cdk, timer, progressInterval, progressEl, 'renew');

    } catch (error) {
        clearInterval(timer);
        clearInterval(progressInterval);
        showError('renew', error.message);
    }
}

async function pollStatus(cdk, timer, progressInterval, progressEl, mode) {
    const maxAttempts = 120; // 10 minutes max
    let attempt = 0;

    const poll = async () => {
        attempt++;
        try {
            const res = await fetch(`${API_BASE}/check`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ uniqueCode: cdk })
            });

            const data = await res.json();

            if (data.status === 'completed') {
                clearInterval(timer);
                clearInterval(progressInterval);
                if (progressEl) progressEl.style.width = '100%';

                setTimeout(() => {
                    showSuccess(mode, data);
                }, 800);
                return;
            }

            if (data.status === 'failed') {
                clearInterval(timer);
                clearInterval(progressInterval);
                throw new Error(data.message || `Lỗi: ${data.error}`);
            }

            if (attempt >= maxAttempts) {
                clearInterval(timer);
                clearInterval(progressInterval);
                throw new Error('Hết thời gian chờ. Vui lòng kiểm tra trạng thái đơn hàng qua mục Tra cứu CDK.');
            }

            // Continue polling
            setTimeout(poll, 5000);
        } catch (error) {
            clearInterval(timer);
            clearInterval(progressInterval);
            showError(mode, error.message);
        }
    };

    setTimeout(poll, 3000);
}

function showSuccess(mode, data) {
    if (mode === 'renew') {
        document.getElementById('processing-state').classList.add('hidden');
        const successState = document.getElementById('success-state');
        successState.classList.remove('hidden');

        let details = '';
        if (data.email) details += `<div class="detail-row"><span class="detail-label">Email:</span><span class="detail-value">${data.email}</span></div>`;
        if (data.uniqueCode) details += `<div class="detail-row"><span class="detail-label">CDK:</span><span class="detail-value">${maskCDK(data.uniqueCode)}</span></div>`;
        details += `<div class="detail-row"><span class="detail-label">Trạng thái:</span><span class="detail-value" style="color: var(--accent-primary)">✅ Hoàn thành</span></div>`;
        document.getElementById('success-details').innerHTML = details;
    } else {
        document.getElementById('quick-processing').classList.add('hidden');
        const successState = document.getElementById('quick-success');
        successState.classList.remove('hidden');

        let details = '';
        if (data.email) details += `<div class="detail-row"><span class="detail-label">Email:</span><span class="detail-value">${data.email}</span></div>`;
        details += `<div class="detail-row"><span class="detail-label">Trạng thái:</span><span class="detail-value" style="color: var(--accent-primary)">✅ Hoàn thành</span></div>`;
        document.getElementById('quick-success-details').innerHTML = details;
    }
    showToast('Nâng cấp thành công! 🎉', 'success');
}

function showError(mode, message) {
    if (mode === 'renew') {
        document.getElementById('processing-state').classList.add('hidden');
        document.getElementById('error-state').classList.remove('hidden');
        document.getElementById('error-message').textContent = message;
    } else {
        document.getElementById('quick-processing').classList.add('hidden');
        document.getElementById('quick-error').classList.remove('hidden');
        document.getElementById('quick-error-message').textContent = message;
    }
    showToast('Có lỗi xảy ra', 'error');
}

// Reset renew form
window.resetRenewForm = function () {
    document.getElementById('renew-form').classList.remove('hidden');
    document.getElementById('processing-state').classList.add('hidden');
    document.getElementById('success-state').classList.add('hidden');
    document.getElementById('error-state').classList.add('hidden');
    document.getElementById('cdk-input').value = '';
    document.getElementById('cdk-input').classList.remove('input-valid', 'input-error');
    document.getElementById('session-input').value = '';
    document.getElementById('processing-time').textContent = '0:00';
    document.getElementById('progress-fill').style.width = '0%';
    document.getElementById('cdk-feedback').classList.add('hidden');
    document.getElementById('cdk-feedback').className = 'cdk-feedback hidden';
    goToStep(1);
    sessionDataParsed = null;
};

// ============================================
// QUICK ACTIVATE FORM
// ============================================
function initQuickForm() {
    const quickForm = document.getElementById('quick-form');

    quickForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const cdk = document.getElementById('quick-cdk').value.trim();
        const session = document.getElementById('quick-session').value.trim();

        if (!cdk || !session) {
            showToast('Vui lòng nhập đầy đủ thông tin', 'error');
            return;
        }

        // Validate JSON
        try {
            const parsed = JSON.parse(session);
            if (!parsed.accessToken) {
                showToast('Session data phải chứa accessToken', 'error');
                return;
            }
        } catch (e) {
            showToast('Session data không đúng định dạng JSON', 'error');
            return;
        }

        // Show processing
        quickForm.classList.add('hidden');
        document.getElementById('quick-processing').classList.remove('hidden');

        // Timer
        const timerEl = document.getElementById('quick-processing-time');
        const progressEl = document.getElementById('quick-progress-fill');
        let seconds = 0;
        const timer = setInterval(() => {
            seconds++;
            const m = Math.floor(seconds / 60);
            const s = seconds % 60;
            timerEl.textContent = `${m}:${s.toString().padStart(2, '0')}`;
        }, 1000);

        let progress = 0;
        const progressInterval = setInterval(() => {
            progress = Math.min(progress + Math.random() * 3, 85);
            progressEl.style.width = progress + '%';
        }, 500);

        try {
            const response = await fetch(`${API_BASE}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    uniqueCode: cdk,
                    sessionData: session
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Có lỗi xảy ra');
            }

            await pollStatus(cdk, timer, progressInterval, progressEl, 'quick');

        } catch (error) {
            clearInterval(timer);
            clearInterval(progressInterval);
            showError('quick', error.message);
        }
    });
}

window.resetQuickForm = function () {
    document.getElementById('quick-form').classList.remove('hidden');
    document.getElementById('quick-processing').classList.add('hidden');
    document.getElementById('quick-success').classList.add('hidden');
    document.getElementById('quick-error').classList.add('hidden');
    document.getElementById('quick-cdk').value = '';
    document.getElementById('quick-session').value = '';
    document.getElementById('quick-processing-time').textContent = '0:00';
    document.getElementById('quick-progress-fill').style.width = '0%';
};

// ============================================
// LOOKUP FORM (Multi-CDK)
// ============================================
let lookupResults = [];

function initLookupForm() {
    const lookupForm = document.getElementById('lookup-form');

    lookupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const raw = document.getElementById('lookup-cdk').value.trim();
        if (!raw) {
            showToast('Vui lòng nhập CDK code', 'error');
            return;
        }

        const cdkList = raw.split('\n').map(s => s.trim()).filter(Boolean);
        const uniqueCdks = [...new Set(cdkList)];

        if (uniqueCdks.length === 0) {
            showToast('Vui lòng nhập ít nhất 1 mã CDK', 'error');
            return;
        }

        document.getElementById('lookup-loading').classList.remove('hidden');
        document.getElementById('lookup-result').classList.add('hidden');
        document.getElementById('btn-lookup').disabled = true;

        lookupResults = [];

            const checkPromises = uniqueCdks.map(async (cdk) => {
            try {
                const response = await fetch(`${API_BASE}/check`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({ uniqueCode: cdk })
                });
                const data = await response.json();
                if (response.ok) {
                    return { cdk, ...data };
                } else {
                    return { cdk, status: 'invalid', message: data.message || 'Không tìm thấy' };
                }
            } catch {
                return { cdk, status: 'invalid', message: 'Lỗi kết nối' };
            }
        });

        lookupResults = await Promise.all(checkPromises);

        document.getElementById('lookup-loading').classList.add('hidden');
        document.getElementById('btn-lookup').disabled = false;

        displayMultiLookupResults(lookupResults);
    });

    document.querySelectorAll('.btn-copy-filter').forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            let cdks = [];
            if (filter === 'all') {
                cdks = lookupResults.map(r => r.cdk);
            } else if (filter === 'available') {
                cdks = lookupResults.filter(r => r.status === 'available').map(r => r.cdk);
            } else if (filter === 'used') {
                cdks = lookupResults.filter(r => ['completed', 'processing', 'pending'].includes(r.status)).map(r => r.cdk);
            } else if (filter === 'invalid') {
                cdks = lookupResults.filter(r => r.status === 'invalid' || r.status === 'failed').map(r => r.cdk);
            }

            if (cdks.length === 0) {
                showToast('Không có CDK nào thuộc nhóm này', 'info');
                return;
            }

            navigator.clipboard.writeText(cdks.join('\n')).then(() => {
                showToast(`Đã sao chép ${cdks.length} mã CDK!`, 'success');
            }).catch(() => {
                showToast('Không thể sao chép', 'error');
            });
        });
    });
}

function formatVnTime(timeStr) {
    if (!timeStr || timeStr === '-') return '-';
    try {
        let d = new Date(timeStr.replace(' ', 'T') + '+08:00');
        if (isNaN(d.getTime())) return timeStr;
        return d.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour12: false });
    } catch {
        return timeStr;
    }
}

function displayMultiLookupResults(results) {
    const statusMap = {
        available: { label: t('status_available'), class: 'status-available', group: 'available' },
        processing: { label: t('status_processing'), class: 'status-processing', group: 'used' },
        completed: { label: t('status_completed'), class: 'status-completed', group: 'used' },
        failed: { label: t('status_failed'), class: 'status-failed', group: 'invalid' },
        pending: { label: t('status_pending'), class: 'status-pending', group: 'used' },
        invalid: { label: t('status_invalid'), class: 'status-failed', group: 'invalid' }
    };

    let totalCount = results.length;
    let usedCount = 0;
    let availableCount = 0;
    let invalidCount = 0;

    results.forEach(r => {
        const info = statusMap[r.status] || { group: 'invalid' };
        if (info.group === 'used') usedCount++;
        else if (info.group === 'available') availableCount++;
        else invalidCount++;
    });

    document.getElementById('stat-total').textContent = totalCount;
    document.getElementById('stat-used').textContent = usedCount;
    document.getElementById('stat-available').textContent = availableCount;
    document.getElementById('stat-invalid').textContent = invalidCount;

    const tbody = document.getElementById('lookup-table-body');
    tbody.innerHTML = results.map((r, i) => {
        const info = statusMap[r.status] || { label: r.status, class: 'status-pending' };
        const account = r.account || r.email || '-';
        const time = formatVnTime(r.usedAt);
        return `<tr>
            <td>${i + 1}</td>
            <td><code class="cdk-code">${r.cdk}</code></td>
            <td><span class="status-badge ${info.class}">${info.label}</span></td>
            <td>${time}</td>
            <td>${account}</td>
        </tr>`;
    }).join('');

    document.getElementById('lookup-result').classList.remove('hidden');
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️'
    };

    toast.innerHTML = `<span>${icons[type] || icons.info}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.feature-card, .step-card, .warranty-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // ESC to close mobile menu
        if (e.key === 'Escape') {
            const hamburger = document.getElementById('nav-hamburger');
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
}

// ============================================
// INPUT ENHANCEMENTS
// ============================================
function initInputEnhancements() {
    // Auto-detect and format session JSON
    const sessionInputs = [document.getElementById('session-input'), document.getElementById('quick-session')];
    
    sessionInputs.forEach(input => {
        if (!input) return;
        input.addEventListener('paste', (e) => {
            setTimeout(() => {
                try {
                    const parsed = JSON.parse(input.value.trim());
                    input.value = JSON.stringify(parsed, null, 2);
                    input.style.borderColor = 'var(--accent-primary)';
                    setTimeout(() => { input.style.borderColor = ''; }, 2000);
                } catch (err) {
                    // Not valid JSON yet, that's ok
                }
            }, 100);
        });
    });

    // CDK input uppercase
    const cdkInputs = [document.getElementById('cdk-input'), document.getElementById('quick-cdk'), document.getElementById('lookup-cdk')];
    cdkInputs.forEach(input => {
        if (!input) return;
        input.addEventListener('input', () => {
            input.value = input.value.trim();
        });
    });
}

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initLanguageSwitcher();
    initParticles();
    initNavigation();
    initRenewForm();
    initQuickForm();
    initLookupForm();
    initScrollAnimations();
    initKeyboardShortcuts();
    initInputEnhancements();
    animateCounters();
});
