document.addEventListener('DOMContentLoaded', () => {
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
    const yf = document.getElementById('year-foot');
    if (yf) yf.textContent = new Date().getFullYear();

    const grid = document.querySelector('.grid-bg');
    const header = document.querySelector('.pill-header');
    let lastScrollY = 0;
    let ticking = false;

    // Image loading optimization
    function handleImageLoad() {
        const images = document.querySelectorAll('img[loading]');
        images.forEach(img => {
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
                img.addEventListener('error', () => {
                    img.style.opacity = '0.5';
                });
            }
        });
    }

    // Intersection Observer for lazy loading
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    function updateNavbar() {
        const scrollY = window.scrollY || 0;

        // Only apply on desktop (screen width > 768px)
        if (window.innerWidth > 768) {
            if (scrollY > lastScrollY && scrollY > 100) {
                // Scrolling down - move to bottom
                header.classList.add('navbar-bottom');
            } else if (scrollY < lastScrollY) {
                // Scrolling up - move to top
                header.classList.remove('navbar-bottom');
            }
        } else {
            // On mobile/tablet, always keep at top
            header.classList.remove('navbar-bottom');
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        const y = window.scrollY || 0;
        if (grid) grid.style.transform = `translateY(${y * 0.03}px)`;

        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }, { passive: true });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            header.classList.remove('navbar-bottom');
        }
    });

    // Initialize image loading
    handleImageLoad();

    // Smooth scrolling for navigation links
    function handleNavClick(e) {
        const href = e.target.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    }

    // Add click handlers to all navigation links
    document.querySelectorAll('.nav-links a, .btn[href^="#"]').forEach(link => {
        link.addEventListener('click', handleNavClick);
    });

    // Clear any saved theme to use default black theme
    localStorage.removeItem('theme');
});