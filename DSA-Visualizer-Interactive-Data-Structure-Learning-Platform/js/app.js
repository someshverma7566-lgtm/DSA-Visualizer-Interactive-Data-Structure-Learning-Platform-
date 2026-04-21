/**
 * DSA Learning Platform - Shared Utilities
 * Handles: Sidebar navigation, dark mode toggle, common helpers
 */

// ===== Sidebar Navigation =====
function initSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const toggle = document.querySelector('.sidebar-toggle');
    const overlay = document.querySelector('.sidebar-overlay');

    if (toggle) {
        toggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('active');
        });
    }

    if (overlay) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        });
    }

    // Mark active nav link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
}

// ===== Dark/Light Theme Toggle =====
function initTheme() {
    const saved = localStorage.getItem('dsa-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeIcon(saved);

    const btn = document.querySelector('.theme-toggle');
    if (btn) {
        btn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('dsa-theme', next);
            updateThemeIcon(next);
        });
    }
}

function updateThemeIcon(theme) {
    const btn = document.querySelector('.theme-toggle');
    if (btn) {
        btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    }
}

// ===== Fade-in on scroll =====
function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
}

// ===== Copy Code to Clipboard =====
function initCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const codeBlock = btn.closest('.code-block');
            const code = codeBlock.querySelector('code').textContent;
            navigator.clipboard.writeText(code).then(() => {
                const original = btn.textContent;
                btn.textContent = 'Copied!';
                btn.style.color = 'var(--accent-emerald)';
                btn.style.borderColor = 'var(--accent-emerald)';
                setTimeout(() => {
                    btn.textContent = original;
                    btn.style.color = '';
                    btn.style.borderColor = '';
                }, 2000);
            });
        });
    });
}

// ===== Delay Utility =====
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ===== Generate Sidebar HTML =====
function getSidebarHTML() {
    return `
    <button class="sidebar-toggle" aria-label="Toggle Menu">☰</button>
    <div class="sidebar-overlay"></div>
    <nav class="sidebar">
        <div class="sidebar-brand">
            <div class="brand-icon">💡</div>
            <div>
                <h2>ByteAcademy</h2>
                <small>Learn Byte by Byte</small>
            </div>
        </div>
        <div class="sidebar-nav">
            <div class="nav-section-title">Overview</div>
            <a href="index.html" class="nav-link">
                <span class="nav-icon">📊</span> Dashboard
            </a>

            <div class="nav-section-title">Visualizers</div>
            <a href="expression.html" class="nav-link">
                <span class="nav-icon">📚</span> Expression Converter
            </a>
            <a href="array.html" class="nav-link">
                <span class="nav-icon">📊</span> Array Operations
            </a>
            <a href="lru.html" class="nav-link">
                <span class="nav-icon">💾</span> LRU Cache
            </a>
            <a href="graph.html" class="nav-link">
                <span class="nav-icon">🔗</span> Graph Traversal
            </a>

            <div class="nav-section-title">Concepts</div>
            <a href="oop.html" class="nav-link">
                <span class="nav-icon">🏗️</span> OOP in C++
            </a>

            <div class="nav-section-title">Web Technologies</div>
            <a href="html-basics.html" class="nav-link"><span class="nav-icon">🌐</span> HTML</a>
            <a href="css-basics.html" class="nav-link"><span class="nav-icon">🎨</span> CSS</a>
            <a href="js-basics.html" class="nav-link"><span class="nav-icon">⚡</span> JavaScript</a>
            <a href="react-basics.html" class="nav-link"><span class="nav-icon">⚛️</span> React</a>
            <a href="bootstrap-basics.html" class="nav-link"><span class="nav-icon">🅱️</span> Bootstrap</a>

            <div class="nav-section-title">Practice</div>
            <a href="quiz.html" class="nav-link">
                <span class="nav-icon">✏️</span> Quiz
            </a>
        </div>
    </nav>`;
}

// ===== Page Header with Theme Toggle =====
function getPageHeaderHTML(title, subtitle) {
    return `
    <div class="page-header">
        <div>
            <h1>${title}</h1>
            <p>${subtitle}</p>
        </div>
        <button class="theme-toggle" aria-label="Toggle Theme">☀️</button>
    </div>`;
}

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    initTheme();
    initScrollAnimations();
    initCopyButtons();
});
