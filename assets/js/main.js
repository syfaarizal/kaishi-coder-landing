// js/main.js
import { handleResponsive, initSmoothScroll, initImageFallback, initCardHover } from './core/helpers.js';
import { initParallax } from './effects/parallax.js';
import { initGlitchEffect } from './effects/glitch.js';
import { initTypingEffect } from './effects/typing.js';
import { initProfile } from './sections/profile.js';
import { initProjects } from './sections/projects.js';
import { initNavigation } from './sections/navigation.js';
import { modalManager } from './components/modal.js';
import { initScanline } from './effects/scanline.js';
import { initGallery } from './sections/gallery.js';
import { initWriteups } from './sections/writeup.js';

class App {
    constructor() {
        this.components = {
            parallax: null,
            glitch: null,
            typing: null,
            scanline: null,
            profile: null,
            projects: null,
            navigation: null,
            gallery: null,
            writeups: null
        };
        
        this.init();
    }
    
    init() {
        // Initialize core features
        this.initCore();
        
        // Initialize effects
        this.initEffects();
        
        // Initialize sections
        this.initSections();
        
        // Initialize modals
        this.initModals();
        
        // Setup global event listeners
        this.setupEventListeners();
        
        console.log('🚀 App initialized successfully!');
    }
    
    initCore() {
        // Responsive handling
        handleResponsive();
        
        // Smooth scroll
        initSmoothScroll();
        
        // Image fallback
        initImageFallback();
        
        // Card hover effects
        initCardHover();
    }
    
    initEffects() {
        // Parallax effect (only on desktop)
        if (window.innerWidth > 768) {
            this.parallaxConfig = { intensity: 8 };
        }
        
        // Glitch effects
        this.components.glitch = initGlitchEffect('.message-bubble', {
            intensity: 0.05,
            maxShift: 4
        });
        
        // Terminal typing effect
        const terminalMsg = document.querySelector('.message-bubble.terminal');
        if (terminalMsg) {
            this.components.typing = initTypingEffect('.message-bubble.terminal', {
                speed: 50,
                pause: 2000,
                loop: false
            });
        }

        // Scanline effect
        this.components.scanline = initScanline('.scanline', {
            flickerChance: 0.03,
            speed: 1.5
        });
    }
    
    initSections() {
        // Initialize sections if they exist on page
        if (document.getElementById('profile')) {
            this.components.profile = initProfile();
        }
        
        if (document.getElementById('projects')) {
            this.components.projects = initProjects();
        }
        
        // Navigation (always exists)
        this.components.navigation = initNavigation();

        // Gallery section
        if (document.querySelector('.gallery-section')) {
            this.components.gallery = initGallery();
        }

        // Writeup section
        if (document.querySelector('.writeup-btn')) {
            this.components.writeups = initWriteups();
        }
    }
    
    initModals() {
        // Register all modals used in the app
        modalManager.registerModal('#gallery-modal');
        modalManager.registerModal('#demo-modal');
        // Add more modals as needed
    }
    
    setupEventListeners() {
        // Search button with glitch effect
        const searchBtn = document.querySelector('.search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                searchBtn.textContent = '[ SEARCHING... ]';
                setTimeout(() => {
                    searchBtn.textContent = '[ ACCESS GRANTED ]';
                    setTimeout(() => {
                        searchBtn.textContent = '[ SEARCH ]';
                    }, 1000);
                }, 1000);
            });
        }
        
        // Responsive handling on resize
        this.onResize = () => {
            handleResponsive();
            
            // Reinitialize parallax if needed
            if (window.innerWidth > 768 && !this.components.parallax) {
                this.parallaxConfig = { intensity: 8 };
            } else if (window.innerWidth <= 768 && this.components.parallax) {
                this.components.parallax.destroy();
                this.components.parallax = null;
            }
        };

        window.addEventListener('resize', this.onResize);
        
        // Random screen flicker (optimized)
        const gridOverlay = document.querySelector('.grid-overlay');
        if (gridOverlay) {
            this.setupScreenFlicker(gridOverlay);
        }
    }
    
    setupScreenFlicker(element) {
        let flickerInterval = null;
        
        const startFlicker = () => {
            if (flickerInterval) return;
            
            flickerInterval = setInterval(() => {
                if (Math.random() > 0.97 && document.hasFocus()) {
                    element.style.opacity = '0.5';
                    setTimeout(() => {
                        element.style.opacity = '1';
                    }, 50);
                }
            }, 1000); // Reduced frequency
        };
        
        const stopFlicker = () => {
            if (flickerInterval) {
                clearInterval(flickerInterval);
                flickerInterval = null;
            }
        };
        
        // Only flicker when page is visible and user is active
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopFlicker();
            } else {
                startFlicker();
            }
        });
        
        // Start initially if page is visible
        if (!document.hidden) {
            startFlicker();
        }
    }
    
    destroy() {
        // Cleanup all components
        Object.values(this.components).forEach(component => {
            if (component && typeof component.destroy === 'function') {
                component.destroy();
            }
        });
        
        modalManager.destroy();
        
        // Remove global event listeners
        window.removeEventListener('resize', this.onResize);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});

// Export for debugging/access
export default App;