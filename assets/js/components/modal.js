import { $, $$, addClass, removeClass, safeAddEvent } from '../core/dom.js';

export class ModalSystem {
    constructor() {
        this.modals = new Map();
        this.currentModal = null;
        this.initGlobalListeners();
    }
    
    initGlobalListeners() {
        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentModal) {
                this.closeCurrent();
            }
        });
    }
    
    registerModal(modalId, options = {}) {
        const modal = $(modalId);
        if (!modal) return null;
        
        const config = {
            closeOnOutsideClick: true,
            closeButton: '.modal-close',
            onOpen: () => {},
            onClose: () => {},
            ...options
        };
        
        // Find close button
        const closeBtn = config.closeButton ? $(config.closeButton, modal) : null;
        
        // Setup event listeners
        const closeHandler = () => this.closeModal(modalId);
        
        if (closeBtn) {
            safeAddEvent(closeBtn, 'click', closeHandler);
        }
        
        if (config.closeOnOutsideClick) {
            safeAddEvent(modal, 'click', (e) => {
                if (e.target === modal) closeHandler();
            });
        }
        
        this.modals.set(modalId, {
            element: modal,
            config,
            closeHandler
        });
        
        return modalId;
    }
    
    openModal(modalId) {
        const modalData = this.modals.get(modalId);
        if (!modalData || this.currentModal === modalId) return false;
        
        // Close current modal if exists
        if (this.currentModal) {
            this.closeModal(this.currentModal);
        }
        
        this.currentModal = modalId;
        addClass(modalData.element, 'active');
        document.body.style.overflow = 'hidden';
        
        // Call onOpen callback
        if (typeof modalData.config.onOpen === 'function') {
            modalData.config.onOpen();
        }
        
        return true;
    }
    
    closeModal(modalId) {
        const modalData = this.modals.get(modalId);
        if (!modalData) return false;
        
        removeClass(modalData.element, 'active');
        document.body.style.overflow = '';
        
        // Call onClose callback
        if (typeof modalData.config.onClose === 'function') {
            modalData.config.onClose();
        }
        
        if (this.currentModal === modalId) {
            this.currentModal = null;
        }
        
        return true;
    }
    
    closeCurrent() {
        if (this.currentModal) {
            return this.closeModal(this.currentModal);
        }
        return false;
    }
    
    toggleModal(modalId) {
        if (this.currentModal === modalId) {
            return this.closeModal(modalId);
        } else {
            return this.openModal(modalId);
        }
    }
    
    getModal(modalId) {
        return this.modals.get(modalId);
    }
    
    destroy() {
        this.modals.forEach((modalData, modalId) => {
            this.closeModal(modalId);
        });
        this.modals.clear();
        this.currentModal = null;
    }
}

// Singleton instance
export const modalManager = new ModalSystem();

// Convenience functions
export const openModal = (modalId) => modalManager.openModal(modalId);
export const closeModal = (modalId) => modalManager.closeModal(modalId);
export const toggleModal = (modalId) => modalManager.toggleModal(modalId);