/**
 * TRYAM AUTOMATIONS - FRONTEND INTERACTION & AVATAR ENGINE
 * Features:
 * - Dual Theme Switcher (Shanta Calm <-> Raudra Fierce)
 * - Canvas Background Particle FX Engine
 * - Interactive ROI & Time-Savings Calculator
 * - Multi-Step Intake Form with Webhook Simulator
 * - Interactive Floating AI Sales Agent Chatbot Widget
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // --- 1. DUAL THEME ENGINE (SHANTA vs RAUDRA) ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const avatarBadgeText = document.getElementById('avatar-badge-text');
    let currentTheme = 'shanta';

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            if (currentTheme === 'shanta') {
                currentTheme = 'raudra';
                document.body.classList.remove('theme-shanta');
                document.body.classList.add('theme-raudra');
                document.documentElement.setAttribute('data-theme', 'raudra');
                if (avatarBadgeText) {
                    avatarBadgeText.textContent = 'RAUDRA AVATAR: Fierce Transformation & Unstoppable Power';
                }
            } else {
                currentTheme = 'shanta';
                document.body.classList.remove('theme-raudra');
                document.body.classList.add('theme-shanta');
                document.documentElement.setAttribute('data-theme', 'shanta');
                if (avatarBadgeText) {
                    avatarBadgeText.textContent = 'SHANTA AVATAR: Serene Execution & Seamless Scale';
                }
            }
            // Update Canvas Colors
            initParticleCanvas();
        });
    }

    // --- 2. DYNAMIC PARTICLE CANVAS FX ENGINE ---
    const canvas = document.getElementById('particle-canvas');
    let ctx, particles = [];

    function initParticleCanvas() {
        if (!canvas) return;
        ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        particles = [];
        const particleCount = Math.floor(window.innerWidth / 20);

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.4,
                speedY: (Math.random() - 0.5) * 0.4,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    function renderParticles() {
        if (!ctx || !canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const particleColor = currentTheme === 'shanta' ? '#00F0FF' : '#FF6B00';

        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = particleColor;
            ctx.globalAlpha = p.opacity;
            ctx.shadowBlur = 10;
            ctx.shadowColor = particleColor;
            ctx.fill();
        });

        requestAnimationFrame(renderParticles);
    }

    window.addEventListener('resize', initParticleCanvas);
    initParticleCanvas();
    renderParticles();

    // --- 3. INTERACTIVE ROI SAVINGS CALCULATOR ENGINE ---
    const teamSizeInput = document.getElementById('team-size');
    const manualHoursInput = document.getElementById('manual-hours');
    const hourlyRateInput = document.getElementById('hourly-rate');

    const teamSizeVal = document.getElementById('team-size-val');
    const manualHoursVal = document.getElementById('manual-hours-val');
    const hourlyRateVal = document.getElementById('hourly-rate-val');

    const resMoney = document.getElementById('res-money');
    const resHours = document.getElementById('res-hours');
    const resRoi = document.getElementById('res-roi');

    function calculateROI() {
        if (!teamSizeInput || !manualHoursInput || !hourlyRateInput) return;

        const team = parseInt(teamSizeInput.value, 10);
        const hoursPerWeek = parseInt(manualHoursInput.value, 10);
        const hourlyRate = parseInt(hourlyRateInput.value, 10);

        // Update Slider Label Displays
        if (teamSizeVal) teamSizeVal.textContent = `${team} employees`;
        if (manualHoursVal) manualHoursVal.textContent = `${hoursPerWeek} hrs/week`;
        if (hourlyRateVal) hourlyRateVal.textContent = `$${hourlyRate} / hr`;

        // Business Logic: 80% Automation efficiency rate
        const totalHoursSavedMonthly = Math.round(team * hoursPerWeek * 4 * 0.8);
        const monthlyMoneySaved = Math.round(totalHoursSavedMonthly * hourlyRate);
        const estimatedRoiMultiplier = (monthlyMoneySaved / 2500).toFixed(1); // Baseline TRYAM engine tier

        if (resMoney) resMoney.textContent = `$${monthlyMoneySaved.toLocaleString()}`;
        if (resHours) resHours.textContent = `${totalHoursSavedMonthly.toLocaleString()} hrs`;
        if (resRoi) resRoi.textContent = `${Math.max(3.5, estimatedRoiMultiplier)}x`;
    }

    if (teamSizeInput && manualHoursInput && hourlyRateInput) {
        teamSizeInput.addEventListener('input', calculateROI);
        manualHoursInput.addEventListener('input', calculateROI);
        hourlyRateInput.addEventListener('input', calculateROI);
        calculateROI(); // Initial calculation
    }

    // --- 4. MULTI-STEP AUDIT INTAKE FORM ---
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const btnNext = document.getElementById('btn-next-step');
    const btnPrev = document.getElementById('btn-prev-step');
    const auditForm = document.getElementById('audit-form');
    const formSuccess = document.getElementById('form-success-message');

    if (btnNext && step1 && step2) {
        btnNext.addEventListener('click', () => {
            const nameInput = document.getElementById('name');
            const companyInput = document.getElementById('company');
            const emailInput = document.getElementById('email');

            if (!nameInput.value || !companyInput.value || !emailInput.value) {
                alert('Please complete all required fields in Step 1.');
                return;
            }

            step1.classList.remove('active');
            step2.classList.add('active');
        });
    }

    if (btnPrev && step1 && step2) {
        btnPrev.addEventListener('click', () => {
            step2.classList.remove('active');
            step1.classList.add('active');
        });
    }

    if (auditForm) {
        auditForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = document.getElementById('btn-submit');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<span>Dispatching to TRYAM Engine...</span>`;
            }

            // Simulate Webhook & n8n pipeline trigger
            setTimeout(() => {
                auditForm.classList.add('hidden');
                if (formSuccess) formSuccess.classList.remove('hidden');
            }, 1200);
        });
    }

    // --- 5. FLOATING AI ASSISTANT CHATBOT WIDGET ---
    const widgetTrigger = document.getElementById('widget-trigger');
    const widgetChat = document.getElementById('widget-chat');
    const chatClose = document.getElementById('chat-close');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatMessages = document.getElementById('chat-messages');
    const quickPrompts = document.querySelectorAll('.quick-btn');

    if (widgetTrigger && widgetChat) {
        widgetTrigger.addEventListener('click', () => {
            widgetChat.classList.toggle('hidden');
        });
    }

    if (chatClose && widgetChat) {
        chatClose.addEventListener('click', () => {
            widgetChat.classList.add('hidden');
        });
    }

    function addChatMessage(text, sender = 'bot') {
        if (!chatMessages) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${sender}-msg`;
        msgDiv.innerHTML = `<p>${text}</p>`;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function handleUserSend(text) {
        const query = text || (chatInput ? chatInput.value.trim() : '');
        if (!query) return;

        addChatMessage(query, 'user');
        if (chatInput) chatInput.value = '';

        // Simulate Intelligent AI SDR Response
        setTimeout(() => {
            let response = "TRYAM Automations builds custom AI agents and n8n CRM pipelines designed to scale your revenue fast. Would you like to schedule a 1-on-1 audit?";

            const qLower = query.toLowerCase();
            if (qLower.includes('automate') || qLower.includes('what can')) {
                response = "We automate lead qualification, sales email/call scheduling, custom CRM data entry, invoicing, and multi-app data syncing via n8n and AI agents.";
            } else if (qLower.includes('crm') || qLower.includes('fast')) {
                response = "Our custom CRM builds take under 7 days to deploy! We integrate seamlessly with HubSpot, GoHighLevel, Airtable, or custom SQL DBs.";
            } else if (qLower.includes('n8n') || qLower.includes('workflow')) {
                response = "n8n allows us to connect 400+ business applications with fail-safe error handling and zero per-execution licensing fees!";
            }

            addChatMessage(response, 'bot');
        }, 800);
    }

    if (chatSend) {
        chatSend.addEventListener('click', () => handleUserSend());
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleUserSend();
        });
    }

    quickPrompts.forEach(btn => {
        btn.addEventListener('click', () => {
            const prompt = btn.getAttribute('data-prompt');
            handleUserSend(prompt);
        });
    });
});
