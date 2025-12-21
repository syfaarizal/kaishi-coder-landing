import { $, $$ } from './dom.js';
import { randomBool, randomRange } from './utils.js';

export const handleResponsive = () => {
    const isMobile = window.innerWidth <= 768;
    const parallaxEffect = $('.parallax-effect');
    
    if (parallaxEffect) {
        parallaxEffect.style.display = isMobile ? 'none' : 'block';
    }
    
    return isMobile;
};

export const initSmoothScroll = () => {
    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = $(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
};

export const initImageFallback = () => {
    $$('img').forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="100%" height="100%" fill="%230a0a0a"/><text x="50%" y="50%" font-family="Courier New, monospace" font-size="20" fill="%23ff0000" text-anchor="middle" dominant-baseline="middle">IMAGE NOT FOUND</text></svg>';
            this.alt = 'Image not available';
        });
    });
};

export const initCardHover = () => {
    $$('.project-card, .equipment-card, .gallery-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.boxShadow = '0 0 30px rgba(255, 0, 0, 0.5)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.2)';
        });
    });
};