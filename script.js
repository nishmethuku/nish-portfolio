// Smooth scroll for navigation links
// CSS scroll-margin-top handles the offset, so we just need smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const hero = document.querySelector('.hero');
            const heroHeight = hero ? hero.offsetHeight : 0;
            
            // For projects section, scroll past the entire hero section
            if (target.id === 'projects') {
                window.scrollTo({
                    top: heroHeight,
                    behavior: 'smooth'
                });
            } else {
                // For other sections, calculate position with proper offset
                const navHeight = document.querySelector('.nav').offsetHeight;
                
                // For Skills section, scroll to the section title to ensure clean alignment
                if (target.id === 'skills') {
                    const sectionTitle = target.querySelector('.section-title');
                    if (sectionTitle) {
                        const titlePosition = sectionTitle.getBoundingClientRect().top + window.pageYOffset;
                        const targetPosition = titlePosition - navHeight - 20;
                        window.scrollTo({
                            top: Math.max(0, targetPosition),
                            behavior: 'smooth'
                        });
                    } else {
                        const targetPosition = target.offsetTop - navHeight - 100;
                        window.scrollTo({
                            top: Math.max(0, targetPosition),
                            behavior: 'smooth'
                        });
                    }
                } else {
                    // For other sections, use standard offset
                    const targetPosition = target.offsetTop - navHeight - 60;
                    window.scrollTo({
                        top: Math.max(0, targetPosition),
                        behavior: 'smooth'
                    });
                }
            }
        }
    });
});

// Navbar background on scroll
let lastScroll = 0;
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    const heroHeight = document.querySelector('.hero').offsetHeight;
    
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    if (currentScroll > heroHeight - 100) {
        nav.style.backgroundColor = isDark ? 'rgba(26, 26, 26, 0.98)' : 'rgba(255, 255, 255, 0.98)';
        nav.style.boxShadow = isDark ? '0 2px 10px rgba(0, 0, 0, 0.3)' : '0 2px 10px rgba(0, 0, 0, 0.05)';
        navLinks.forEach(link => {
            link.style.color = isDark ? '#e5e5e5' : '#1a1a1a';
        });
    } else {
        nav.style.backgroundColor = 'transparent';
        nav.style.boxShadow = 'none';
        navLinks.forEach(link => {
            link.style.color = '#ffffff';
        });
    }
    
    lastScroll = currentScroll;
});

// IntersectionObserver for scroll animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        } else {
            // Remove visible class when element leaves viewport so it can animate again
            entry.target.classList.remove('visible');
        }
    });
}, observerOptions);

// Smooth parallax and scroll-based movement effects
let ticking = false;

function updateScrollEffects() {
    const scrolled = window.pageYOffset;
    
    // Parallax effect for project images
    document.querySelectorAll('.project-image-wrapper').forEach((wrapper) => {
        const rect = wrapper.getBoundingClientRect();
        const elementTop = rect.top + scrolled;
        const windowCenter = scrolled + window.innerHeight / 2;
        const elementCenter = elementTop + rect.height / 2;
        const distance = windowCenter - elementCenter;
        
        // Only apply parallax when element is visible
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const speed = 0.15;
            const translateY = distance * speed;
            wrapper.style.transform = `translateY(${translateY}px)`;
        }
    });
    
    // Subtle movement for project content
    document.querySelectorAll('.project-content').forEach((content) => {
        const rect = content.getBoundingClientRect();
        
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const progress = Math.max(0, Math.min(1, 
                (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
            ));
            const translateY = (1 - progress) * 20;
            content.style.transform = `translateY(${translateY}px)`;
        }
    });
    
    // Parallax effect for skill categories
    document.querySelectorAll('.skill-category').forEach((category) => {
        const rect = category.getBoundingClientRect();
        
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const progress = Math.max(0, Math.min(1, 
                (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
            ));
            const translateY = (1 - progress) * 10;
            category.style.transform = `translateY(${translateY}px) translateZ(0)`;
        }
    });
    
    ticking = false;
}

function requestScrollUpdate() {
    if (!ticking) {
        window.requestAnimationFrame(updateScrollEffects);
        ticking = true;
    }
}

window.addEventListener('scroll', requestScrollUpdate, { passive: true });

// Observe elements for scroll animations
document.querySelectorAll('.fade-in-up').forEach((element) => {
    scrollObserver.observe(element);
});

// Hero section elements - animate immediately on load
window.addEventListener('load', () => {
    const heroElements = document.querySelectorAll('.hero .fade-in-up');
    heroElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('visible');
        }, index * 100);
    });
});

// Dark/Light mode toggle
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle?.querySelector('.theme-icon');
const html = document.documentElement;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);
if (themeIcon) {
    themeIcon.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
}

// Theme toggle functionality
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        if (themeIcon) {
            themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        }
    });
}
