import { $, $$ } from '../core/dom.js';

export class Navigation {
    constructor() {
        this.navLinks = $$('nav a[href^="#"]');
        this.currentSection = null;
        this.init();
    }
    
    init() {
        this.initScrollSpy();
        this.initNavLinks();
    }
    
    initScrollSpy() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                this.currentSection = entry.target.id;
                this.updateActiveNav();
                }
            });
        }, {
            rootMargin: '-90px 0px -60% 0px', // Adjust the margin as needed
            threshold: 0 // Trigger as soon as even one pixel is visible
        });
        
        $$('section').forEach(section => { // Adjust selector as needed
            observer.observe(section); // Observe each section
        }); 
    }
    
    updateActiveNav() {
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${this.currentSection}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    initNavLinks() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = $(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    destroy() {
        // Cleanup
    }
}

export const initNavigation = () => {
    return new Navigation();
};