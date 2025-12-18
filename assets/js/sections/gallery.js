// assets/js/sections/gallery.js
import { $, $$, addClass, removeClass } from '../core/dom.js';
import { modalManager } from '../components/modal.js';

export class GallerySection {
    constructor() {
        this.section = document.getElementById('profile');
        if (!this.section) return;
        
        this.gallerySection = this.section.querySelector('.gallery-section');
        if (!this.gallerySection) return;
        
        this.themeButtons = $$('.theme-btn', this.gallerySection);
        this.galleryItems = $$('.gallery-item', this.gallerySection);
        this.modal = $('#gallery-modal');
        
        this.init();
    }
    
    init() {
        this.initThemeFilters();
        this.initGalleryItems();
        this.registerModal();
    }
    
    initThemeFilters() {
        if (!this.themeButtons.length) return;
        
        this.themeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.filterByTheme(button.dataset.theme);
                
                // Update active button
                this.themeButtons.forEach(btn => removeClass(btn, 'active'));
                addClass(button, 'active');
            });
        });
    }
    
    filterByTheme(theme) {
        if (!this.galleryItems.length) return;
        
        this.galleryItems.forEach(item => {
            const itemTheme = item.dataset.theme;
            
            if (theme === 'all' || itemTheme === theme) {
                // Show item
                item.classList.remove('hidden');
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 50);
            } else {
                // Hide item with animation
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.classList.add('hidden');
                }, 300);
            }
        });
    }
    
    initGalleryItems() {
        if (!this.galleryItems.length) return;
        
        this.galleryItems.forEach(item => {
            const card = item.querySelector('.gallery-card');
            if (!card) return;
            
            card.addEventListener('click', () => {
                this.openGalleryModal(item);
            });
            
            // Add hover effect
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.05)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    openGalleryModal(galleryItem) {
        const card = galleryItem.querySelector('.gallery-card');
        if (!card) return;
        
        const img = card.querySelector('.gallery-img');
        const title = card.querySelector('h4')?.textContent || '';
        const desc = card.querySelector('p')?.textContent || '';
        const theme = card.querySelector('.theme-tag')?.textContent || '';
        
        if (!img) return;
        
        // Update modal content
        const modalImg = this.modal?.querySelector('.modal-img');
        const modalTitle = this.modal?.querySelector('.modal-title');
        const modalDesc = this.modal?.querySelector('.modal-desc');
        const modalTheme = this.modal?.querySelector('.modal-theme');
        
        if (modalImg) modalImg.src = img.src;
        if (modalImg) modalImg.alt = img.alt || title;
        if (modalTitle) modalTitle.textContent = title;
        if (modalDesc) modalDesc.textContent = desc;
        if (modalTheme) modalTheme.textContent = theme;
        
        // Open modal
        modalManager.openModal('#gallery-modal');
    }
    
    registerModal() {
        if (!this.modal) return;
        
        modalManager.registerModal('#gallery-modal', {
            closeOnOutsideClick: true,
            closeButton: '.modal-close',
            onOpen: () => {
                document.body.style.overflow = 'hidden';
            },
            onClose: () => {
                document.body.style.overflow = '';
            }
        });
        
        // Keyboard navigation for gallery modal
        document.addEventListener('keydown', (e) => {
            if (!this.modal.classList.contains('active')) return;
            
            if (e.key === 'Escape') {
                modalManager.closeModal('#gallery-modal');
            }
            
            // Arrow key navigation between gallery items
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                this.navigateGallery(e.key);
            }
        });
    }
    
    navigateGallery(direction) {
        const activeTheme = this.gallerySection.querySelector('.theme-btn.active')?.dataset.theme || 'all';
        const visibleItems = Array.from(this.galleryItems)
            .filter(item => !item.classList.contains('hidden'))
            .filter(item => activeTheme === 'all' || item.dataset.theme === activeTheme);
        
        if (visibleItems.length === 0) return;
        
        const currentImg = this.modal?.querySelector('.modal-img')?.src;
        let currentIndex = visibleItems.findIndex(item => {
            const img = item.querySelector('.gallery-img');
            return img && img.src === currentImg;
        });
        
        if (currentIndex === -1) currentIndex = 0;
        
        let nextIndex;
        if (direction === 'ArrowLeft') {
            nextIndex = currentIndex - 1;
            if (nextIndex < 0) nextIndex = visibleItems.length - 1;
        } else {
            nextIndex = currentIndex + 1;
            if (nextIndex >= visibleItems.length) nextIndex = 0;
        }
        
        this.openGalleryModal(visibleItems[nextIndex]);
    }
    
    destroy() {
        // Cleanup event listeners
        this.themeButtons.forEach(button => {
            button.replaceWith(button.cloneNode(true));
        });
        
        this.galleryItems.forEach(item => {
            const card = item.querySelector('.gallery-card');
            if (card) {
                card.replaceWith(card.cloneNode(true));
            }
        });
    }
}

export const initGallery = () => {
    return new GallerySection();
};