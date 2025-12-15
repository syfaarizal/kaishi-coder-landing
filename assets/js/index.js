// Enhanced glitch effect for messages
document.querySelectorAll('.message-bubble').forEach((bubble, index) => {
    bubble.style.animationDelay = `${index * 0.3}s`;
            
    // Random glitch effect
    setInterval(() => {
        if (Math.random() > 0.95) {
            bubble.style.transform = `translateX(${Math.random() * 4 - 2}px)`;
            setTimeout(() => {
                bubble.style.transform = 'translateX(0)';
            }, 50);
        }
    }, 100);
 });

 // Parallax effect for screens
 document.addEventListener('mousemove', (e) => {
    const screens = document.querySelectorAll('.screen-frame');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    screens.forEach((screen, index) => {
        const speed = (index + 1) * 8;
        const xMove = (x - 0.5) * speed;
        const yMove = (y - 0.5) * speed;
        screen.style.transform = `translate(${xMove}px, ${yMove}px)`;
    });
});

 // Terminal typing effect
const terminalMsg = document.querySelector('.message-bubble.terminal');
if (terminalMsg) {
    const text = terminalMsg.textContent;
    terminalMsg.textContent = '';
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            terminalMsg.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    };
    setTimeout(typeWriter, 2000);
}

// Search button with glitch effect
document.querySelector('.search-btn').addEventListener('click', function() {
    this.textContent = '[ SEARCHING... ]';
    setTimeout(() => {
        this.textContent = '[ ACCESS GRANTED ]';
        setTimeout(() => {
            this.textContent = '[ SEARCH ]';
        }, 1000);
    }, 1000);
});

 // Random screen flicker
setInterval(() => {
    if (Math.random() > 0.97) {
        document.querySelector('.grid-overlay').style.opacity = '0.5';
        setTimeout(() => {
            document.querySelector('.grid-overlay').style.opacity = '1';
        }, 50);
    }
}, 100);

// Update smooth scrolling untuk semua link navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Update active nav link
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        }
    });
});

// Project card interaction
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.boxShadow = '0 0 30px rgba(255, 0, 0, 0.5)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.2)';
    });
});

// Image loading fallback
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="100%" height="100%" fill="%230a0a0a"/><text x="50%" y="50%" font-family="Courier New, monospace" font-size="20" fill="%23ff0000" text-anchor="middle" dominant-baseline="middle">IMAGE NOT FOUND</text></svg>';
        this.alt = 'Image not available';
    });
});

// Add responsive behavior
function handleResponsive() {
    const isMobile = window.innerWidth <= 768;
    const parallaxEffect = document.querySelector('.parallax-effect');
    
    if (isMobile && parallaxEffect) {
        parallaxEffect.style.display = 'none';
    } else if (parallaxEffect) {
        parallaxEffect.style.display = 'block';
    }
}

// Initial check
handleResponsive();

// Listen for resize
window.addEventListener('resize', handleResponsive);

// Profile Section Functionality

// Counter Animation for Stats
function animateCounter() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.floor(current);
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target;
            }
        };
        
        // Start when in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
}

// Animate Skill Bars
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-fill');
    
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    bar.style.width = width + '%';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(bar);
    });
}

// Gallery Filtering
function initGallery() {
    const themeButtons = document.querySelectorAll('.theme-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.querySelector('.gallery-modal');
    const modalImg = modal.querySelector('.modal-img');
    const modalTitle = modal.querySelector('.modal-title');
    const modalDesc = modal.querySelector('.modal-desc');
    const modalTheme = modal.querySelector('.modal-theme');
    const modalClose = modal.querySelector('.modal-close');
    
    // Theme Filter
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            themeButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const selectedTheme = button.getAttribute('data-theme');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                if (selectedTheme === 'all' || item.getAttribute('data-theme') === selectedTheme) {
                    item.classList.remove('hidden');
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });
    
    // Gallery Image Click
    galleryItems.forEach(item => {
        const card = item.querySelector('.gallery-card');
        const img = card.querySelector('.gallery-img');
        const title = card.querySelector('h4').textContent;
        const desc = card.querySelector('p').textContent;
        const theme = card.querySelector('.theme-tag').textContent;
        
        card.addEventListener('click', () => {
            modalImg.src = img.src;
            modalImg.alt = img.alt;
            modalTitle.textContent = title;
            modalDesc.textContent = desc;
            modalTheme.textContent = theme;
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close Modal
    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// Initialize Profile Section
function initProfileSection() {
    if (document.querySelector('#profile')) {
        animateCounter();
        animateSkillBars();
        initGallery();
        
        // Add glitch effect to equipment cards
        document.querySelectorAll('.equipment-card').forEach(card => {
            setInterval(() => {
                if (Math.random() > 0.98) {
                    card.style.transform = `translateX(${Math.random() * 4 - 2}px)`;
                    setTimeout(() => {
                        card.style.transform = 'translateX(0)';
                    }, 100);
                }
            }, 500);
        });
    }
}

// Call initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initProfileSection);