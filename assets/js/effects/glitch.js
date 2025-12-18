// js/effects/glitch.js
import { $, $$ } from '../core/dom.js';
import { randomBool, randomRange } from '../core/utils.js';

export class GlitchEffect {
    constructor(options = {}) {
        this.options = {
            selector: '.glitch-target',
            intensity: 0.05,
            duration: 100,
            maxShift: 4,
            ...options
        };
        
        this.elements = $$(this.options.selector);
        this.observers = new Map();
        this.intervals = new Map();
        this.isActive = false;
    }
    
    static createCSS() {
        if (!$('#glitch-styles')) {
            const style = document.createElement('style');
            style.id = 'glitch-styles';
            style.textContent = `
                .glitch-active {
                    animation: glitch 0.1s linear;
                }
                
                @keyframes glitch {
                    0% { transform: translateX(0); }
                    20% { transform: translateX(-2px); }
                    40% { transform: translateX(2px); }
                    60% { transform: translateX(-1px); }
                    80% { transform: translateX(1px); }
                    100% { transform: translateX(0); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    applySingleGlitch(element) {
        if (!element || !randomBool(this.options.intensity)) return;
        
        const shiftX = randomRange(-this.options.maxShift, this.options.maxShift);
        element.style.transform = `translateX(${shiftX}px)`;
        
        setTimeout(() => {
            element.style.transform = 'translateX(0)';
        }, this.options.duration);
    }
    
    startForElement(element) {
        if (this.intervals.has(element)) return;
        
        const interval = setInterval(() => {
            if (document.hasFocus() && this.isElementVisible(element)) {
                this.applySingleGlitch(element);
            }
        }, 1000);
        
        this.intervals.set(element, interval);
    }
    
    stopForElement(element) {
        const interval = this.intervals.get(element);
        if (interval) {
            clearInterval(interval);
            this.intervals.delete(element);
        }
    }
    
    isElementVisible(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top < window.innerHeight &&
            rect.bottom > 0 &&
            rect.left < window.innerWidth &&
            rect.right > 0
        );
    }
    
    start() {
        if (this.isActive) return;
        
        GlitchEffect.createCSS();
        this.isActive = true;
        
        this.elements.forEach(element => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.startForElement(element);
                    } else {
                        this.stopForElement(element);
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(element);
            this.observers.set(element, observer);
        });
    }
    
    stop() {
        this.isActive = false;
        
        // Clear all intervals
        this.intervals.forEach(interval => clearInterval(interval));
        this.intervals.clear();
        
        // Disconnect all observers
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        
        // Reset elements
        this.elements.forEach(element => {
            element.style.transform = '';
        });
    }
    
    destroy() {
        this.stop();
        this.elements = [];
    }
}

// Convenience function
export const initGlitchEffect = (selector = '.glitch-target', options = {}) => {
    const glitch = new GlitchEffect({ selector, ...options });
    glitch.start();
    return glitch;
};