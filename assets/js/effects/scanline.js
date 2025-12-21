import { $ } from '../core/dom.js';
import { randomBool } from '../core/utils.js';

export class ScanlineEffect {
    constructor(options = {}) {
        this.options = {
            selector: '.scanline',
            flickerChance: 0.03,
            flickerDuration: 50,
            speed: 2,
            enabled: true,
            ...options
        };
        
        this.element = $(this.options.selector);
        this.isFlickering = false;
        this.interval = null;
        this.animationId = null;
        
        if (this.element) {
            this.init();
        }
    }
    
    init() {
        if (!this.options.enabled) return;
        
        // Start scan animation
        this.startScanAnimation();
        
        // Start random flicker
        this.startFlicker();
        
        // Pause when page is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
    }
    
    startScanAnimation() {
        let position = 0;
        
        const animate = () => {
            if (!this.options.enabled || !this.element) return;
            
            position += this.options.speed;
            if (position > 100) {
                position = -20; // Reset above viewport
            }
            
            this.element.style.top = `${position}%`;
            this.animationId = requestAnimationFrame(animate);
        };
        
        this.animationId = requestAnimationFrame(animate);
    }
    
    startFlicker() {
        this.interval = setInterval(() => {
            if (!this.options.enabled || 
                !this.element || 
                this.isFlickering || 
                !document.hasFocus()) return;
            
            if (randomBool(this.options.flickerChance)) {
                this.flicker();
            }
        }, 100);
    }
    
    flicker() {
        if (this.isFlickering || !this.element) return;
        
        this.isFlickering = true;
        const originalOpacity = this.element.style.opacity || '1';
        
        // Quick flicker
        this.element.style.opacity = '0.3';
        
        setTimeout(() => {
            this.element.style.opacity = originalOpacity;
            
            setTimeout(() => {
                this.element.style.opacity = '0.6';
                
                setTimeout(() => {
                    this.element.style.opacity = originalOpacity;
                    this.isFlickering = false;
                }, 20);
            }, 10);
        }, this.options.flickerDuration);
    }
    
    pause() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        
        if (this.element) {
            this.element.style.display = 'none';
        }
    }
    
    resume() {
        if (!this.options.enabled || !this.element) return;
        
        this.element.style.display = 'block';
        
        if (!this.animationId) {
            this.startScanAnimation();
        }
        
        if (!this.interval) {
            this.startFlicker();
        }
    }
    
    setSpeed(speed) {
        this.options.speed = speed;
    }
    
    setFlickerChance(chance) {
        this.options.flickerChance = chance;
    }
    
    enable() {
        this.options.enabled = true;
        this.resume();
    }
    
    disable() {
        this.options.enabled = false;
        this.pause();
    }
    
    destroy() {
        this.pause();
        this.element = null;
    }
}

export const initScanline = (selector = '.scanline', options = {}) => {
    return new ScanlineEffect({ selector, ...options });
};