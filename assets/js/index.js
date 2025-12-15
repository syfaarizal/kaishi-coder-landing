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

// Smooth scroll untuk navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Project card interaction
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.borderColor = '#ff4444';
    });
    card.addEventListener('mouseleave', () => {
        card.style.borderColor = '#ff0000';
    });
});