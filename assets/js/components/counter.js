import { $$ } from '../core/dom.js';

export class AnimatedCounter {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            duration: 2000,
            startValue: 0,
            separator: '',
            prefix: '',
            suffix: '',
            easing: t => t, // linear
            ...options
        };
        
        this.targetValue = parseInt(element.dataset.count || element.textContent);
        this.currentValue = this.options.startValue;
        this.isAnimating = false;
        this.observer = null;
    }
    
    formatNumber(num) {
        const { prefix, suffix, separator } = this.options;
        let formatted = num.toLocaleString();
        
        if (separator) {
            formatted = formatted.replace(/,/g, separator);
        }
        
        return `${prefix}${formatted}${suffix}`;
    }
    
    animate() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const startTime = performance.now();
        const duration = this.options.duration;
        const startValue = this.currentValue;
        const valueRange = this.targetValue - startValue;
        
        const update = (currentTime) => {
            if (!this.isAnimating) return;
            
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = this.options.easing(progress);
            
            this.currentValue = startValue + (valueRange * easedProgress);
            this.element.textContent = this.formatNumber(Math.floor(this.currentValue));
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                this.isAnimating = false;
                this.element.textContent = this.formatNumber(this.targetValue);
            }
        };
        
        requestAnimationFrame(update);
    }
    
    observe() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isAnimating) {
                    this.animate();
                    if (this.observer) {
                        this.observer.unobserve(this.element);
                    }
                }
            });
        }, { threshold: 0.5 });
        
        this.observer.observe(this.element);
    }
    
    destroy() {
        this.isAnimating = false;
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
    }
}

export const initCounters = (selector = '.counter', options = {}) => {
    const elements = $$(selector);
    const counters = [];
    
    elements.forEach(element => {
        const counter = new AnimatedCounter(element, options);
        counter.observe();
        counters.push(counter);
    });
    
    return counters;
};