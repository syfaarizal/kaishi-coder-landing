import { $$ } from '../core/dom.js';
import { initCounters } from '../components/counter.js';
import { initGlitchEffect } from '../effects/glitch.js';

export class ProfileSection {
    constructor() {
        this.section = document.getElementById('profile');
        if (!this.section) return;
        
        this.init();
    }
    
    init() {
        this.initStats();
        this.initSkillBars();
        this.initGallery();
        this.initEquipmentGlitch();
    }
    
    initStats() {
        initCounters('.stat-number', {
            duration: 1500,
            easing: (t) => 1 - Math.pow(1 - t, 3) // easeOutCubic
        });
    }
    
    initSkillBars() {
        const skillBars = $$('.skill-fill');
        
        skillBars.forEach(bar => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const width = bar.getAttribute('data-width');
                        bar.style.width = width + '%';
                        observer.unobserve(bar);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(bar);
        });
    }
    
    initGallery() {
        const themeButtons = $$('.theme-btn');
        const galleryItems = $$('.gallery-item');
        
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
    }
    
    initEquipmentGlitch() {
        initGlitchEffect('.equipment-card', {
            intensity: 0.02,
            maxShift: 2
        });
    }
    
    destroy() {
        // Cleanup jika diperlukan
    }
}

export const initProfile = () => {
    return new ProfileSection();
};