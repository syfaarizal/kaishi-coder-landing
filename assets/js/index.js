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

// Add smooth scrolling
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