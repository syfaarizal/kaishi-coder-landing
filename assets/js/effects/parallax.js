import { $$ } from '../core/dom.js';
import { throttle } from '../core/utils.js';

export class ParallaxEffect {
    constructor(options = {}) {
        this.options = {
            selector: '.parallax-target',
            intensity: 8,
            enabled: true,
            ...options
        };

        this._active = false; // internal active flag
        this.elements = $$(this.options.selector);
        this.handleMouseMove = throttle(this.handleMouseMove.bind(this), 16);
        this.isMobile = window.innerWidth <= 768;

        this.init();
    }

    init() {
        if (this.isMobile) {
            this.disable();
            return;
        }

        if (this.options.enabled) this.enable();

        // Listen for resize
        window.addEventListener('resize', () => {
            const wasMobile = this.isMobile;
            this.isMobile = window.innerWidth <= 768;

            if (wasMobile && !this.isMobile) {
                this.enable();
            } else if (!wasMobile && this.isMobile) {
                this.disable();
            }
        });
    }

    handleMouseMove(e) {
        if (!this._active || this.isMobile) return;

        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        this.elements.forEach((element, index) => {
            const speed = (index + 1) * this.options.intensity;
            const xMove = (x - 0.5) * speed;
            const yMove = (y - 0.5) * speed;
            element.style.transform = `translate(${xMove}px, ${yMove}px)`;
        });
    }

    enable() {
        if (this._active) return;         // already active
        this._active = true;
        this.options.enabled = true;
        document.addEventListener('mousemove', this.handleMouseMove);
    }

    disable() {
        if (!this._active) return;       // already disabled
        this._active = false;
        this.options.enabled = false;
        document.removeEventListener('mousemove', this.handleMouseMove);

        // Reset positions
        this.elements.forEach(element => {
            element.style.transform = '';
        });
    }

    // Hapus method destroy yang berlebihan atau perbaiki:
    destroy() {
        this.disable();
        // Hapus event listeners lain jika ada
    }
}

export const initParallax = (selector = '.parallax-target', options = {}) => {
    return new ParallaxEffect({ selector, ...options });
};