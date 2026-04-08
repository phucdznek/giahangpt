/* ============================================
   RenewGPT - Main Application
   ============================================ */

const API_BASE = '/api';

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

function displayMultiLookupResults(results) {
    const statusMap = {
        available: { label: 'Chưa dùng', class: 'status-available', group: 'available' },
        processing: { label: 'Đang xử lý', class: 'status-processing', group: 'used' },
        completed: { label: 'Đã sử dụng', class: 'status-completed', group: 'used' },
        failed: { label: 'Thất bại', class: 'status-failed', group: 'invalid' },
        pending: { label: 'Chờ xử lý', class: 'status-pending', group: 'used' },
        invalid: { label: 'Không hợp lệ', class: 'status-failed', group: 'invalid' }
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
        const email = r.email || '-';
        const time = r.usedAt || r.completedAt || '-';
        return `<tr>
            <td>${i + 1}</td>
            <td><code class="cdk-code">${r.cdk}</code></td>
            <td><span class="status-badge ${info.class}">${info.label}</span></td>
            <td>${time}</td>
            <td>${email}</td>
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
