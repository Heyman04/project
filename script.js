// script.js

document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Sticky Navbar & Active Link Highlight --- */
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    window.addEventListener('scroll', () => {
        // Sticky Navbar Glass Effect
        if (window.scrollY > 50) {
            navbar.classList.add('backdrop-blur-md', 'bg-bgMain/80', 'shadow-lg');
            navbar.querySelector('.glass-panel').classList.remove('glass-panel');
        } else {
            navbar.classList.remove('backdrop-blur-md', 'bg-bgMain/80', 'shadow-lg');
            navbar.querySelector('div').classList.add('glass-panel');
        }

        // Active Link Highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
        
        mobileLinks.forEach(link => {
            link.classList.remove('text-accent1');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('text-accent1');
            }
        });
    });

    /* --- 2. Mobile Menu Toggle --- */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    /* --- 3. Scroll Animations (Intersection Observer) --- */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear', 'visible');
                
                // If it contains stats, trigger counter animation
                if (entry.target.querySelector('.stat-number')) {
                    animateStats(entry.target);
                    // Unobserve after animating once to prevent re-animating
                    observer.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in-up, .fade-in-scroll');
    fadeElements.forEach(el => observer.observe(el));

    /* --- 4. Stats Counter Animation --- */
    function animateStats(container) {
        const counters = container.querySelectorAll('.stat-number');
        const speed = 200; // Lower is faster

        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target + (target > 100 ? '+' : '');
                }
            };
            updateCount();
        });
    }

    /* --- 5. Contact Form Submission (Demo) --- */
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin ml-2"></i>';
            btn.classList.add('opacity-80');
            
            // Simulate network request
            setTimeout(() => {
                btn.innerHTML = 'Message Sent! <i class="fas fa-check ml-2"></i>';
                btn.classList.replace('btn-primary', 'bg-green-600');
                contactForm.reset();
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.classList.replace('bg-green-600', 'btn-primary');
                    btn.classList.remove('opacity-80');
                }, 3000);
            }, 1500);
        });
    }

    /* --- 6. Hero 3D Tilt Effect --- */
    const imageContainer = document.querySelector('.image-container');
    const imageCard = document.querySelector('.hero-image-card');

    if (imageContainer && imageCard) {
        imageContainer.addEventListener('mousemove', (e) => {
            const rect = imageContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const tiltX = (y - centerY) / 10;
            const tiltY = (centerX - x) / 10;
            
            imageCard.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        imageContainer.addEventListener('mouseleave', () => {
            imageCard.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            imageCard.style.transition = 'transform 0.5s ease';
        });

        imageContainer.addEventListener('mouseenter', () => {
            imageCard.style.transition = 'none'; // Remove transition for smooth mouse tracking
        });
    }

    /* --- 7. Simple Particle Canvas Background --- */
    initParticles();
});

function initParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;

    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.color = Math.random() > 0.5 ? '#6408BF' : '#B1164E';
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
        }
    }

    // Create particles
    const particleCount = Math.min(window.innerWidth / 15, 100); // Responsive amount
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
}
