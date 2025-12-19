// js/effects/typing.js
import { $, $$ } from '../core/dom.js';
import { wait } from '../core/utils.js';

export class TypingEffect {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            speed: 50,
            deleteSpeed: 30,
            pause: 2000,
            loop: true,
            cursor: '█',
            ...options
        };
        
        this.originalText = this.element.dataset.text || this.element.textContent.replace(this.options.cursor, '').trim();
        this.isRunning = false;
        this.currentTimeout = null;
    }
    
    async type(text = this.originalText) {
        this.isRunning = true;
        
        for (let i = 0; i <= text.length; i++) {
            if (!this.isRunning) break;
            this.element.textContent = text.substring(0, i) + this.options.cursor;
            await wait(this.options.speed);
        }
        
        if (this.isRunning) {
            await wait(this.options.pause);
            await this.delete();
        }
    }
    
    async delete() {
        const currentText = this.element.textContent.replace(this.options.cursor, '');
        
        for (let i = currentText.length; i >= 0; i--) {
            if (!this.isRunning) break;
            this.element.textContent = currentText.substring(0, i) + this.options.cursor;
            await wait(this.options.deleteSpeed);
        }
        
        if (this.isRunning && this.options.loop) {
            await wait(500);
            this.type();
        }
    }
    
    start() {
        if (this.isRunning) return;
        this.element.textContent = this.options.cursor;
        setTimeout(() => this.type(), 1000);
    }
    
    stop() {
        this.isRunning = false;
        if (this.currentTimeout) {
            clearTimeout(this.currentTimeout);
        }
        this.element.textContent = this.originalText;
    }
    
    updateText(newText) {
        this.originalText = newText;
        this.stop();
        this.start();
    }
}

export const initTypingEffect = (selector, options = {}) => {
    const element = $(selector);
    if (!element) return null;
    
    const typing = new TypingEffect(element, options);
    typing.start();
    return typing;
};

export const initMultiLineTyping = (selector = '.terminal-line', options = {}) => {
    const lines = $$(selector);
    if (lines.length === 0) return []; // No lines found
    
    const typers = [];
    let delay = 0; // Initial delay before starting first line
    
    lines.forEach((line, index) => {
        const typer = new TypingEffect(line, {
            ...options,
            pause: index === lines.length - 1 ? options.pause || 1000 : 5000 // Longer pause on last line
        });
        
        setTimeout(() => typer.start(), delay);
        delay += 1000; // Stagger start times
        
        typers.push(typer); // Store reference for potential future use
    });
    
    return typers;
};