import { $, $$, addClass, removeClass } from '../core/dom.js';
import { debounce } from '../core/utils.js';
import { modalManager } from '../components/modal.js';
import { initMultiLineTyping } from '../effects/typing.js';

export class ProjectsSection {
    constructor() {
        this.section = document.getElementById('projects');
        if (!this.section) return;
        
        this.projectTiles = $$('.project-tile');
        this.filterButtons = $$('.filter-btn');
        this.sortButtons = $$('.sort-btn');
        this.searchInput = $('.search-input');
        this.demoButtons = $$('.demo-btn');
        this.codeButtons = $$('.code-btn');
        this.writeupButtons = $$('.writeup-btn');
        
        // Tambahkan selector untuk modal
        this.demoModal = $('#demo-modal');
        this.modalClose = this.demoModal ? $('.modal-close', this.demoModal) : null;
        this.fullscreenBtn = this.demoModal ? $('.fullscreen-btn', this.demoModal) : null;
        this.restartBtn = this.demoModal ? $('.restart-btn', this.demoModal) : null;
        this.githubBtn = this.demoModal ? $('.github-btn', this.demoModal) : null;
        
        this.currentFilter = 'all';
        this.currentSort = 'newest';
        this.currentProjectId = null;
        
        this.projectCache = this.cacheProjectData();
        
        // GitHub URLs
        this.githubUrls = {
            'cyber-city': 'https://github.com/kaishiscd/cyber-city-sim',
            'neural-viz': 'https://github.com/kaishiscd/neural-visualizer',
            'cyber-runner': 'https://github.com/kaishiscd/cyber-runner',
            'data-dashboard': 'https://github.com/kaishiscd/data-dashboard',
            'audio-viz': 'https://github.com/kaishiscd/audio-reactive-art',
            'terminal-quest': 'https://github.com/kaishiscd/terminal-quest'
        };
        
        this.init();
    }
    
    cacheProjectData() {
        return Array.from(this.projectTiles).map(tile => ({
            element: tile,
            id: tile.dataset.projectId || tile.dataset.category,
            name: tile.querySelector('.project-name')?.textContent.toLowerCase() || '',
            desc: tile.querySelector('.project-desc')?.textContent.toLowerCase() || '',
            category: tile.dataset.category || '',
            techs: Array.from(tile.querySelectorAll('.tech')).map(t => t.textContent.toLowerCase()),
            complexity: parseInt(tile.dataset.complexity) || 0,
            fun: parseInt(tile.dataset.fun) || 0
        }));
    }
    
    init() {
        this.initFilters();
        this.initSorting();
        this.initSearch();
        this.initDemoButtons();
        this.initCodeButtons();
        this.initWriteupButtons();
        this.initTerminal();
        this.initTileEffects();
        this.initModalHandlers();
        this.initKeyboardShortcuts();
    }
    
    initFilters() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.currentFilter = button.dataset.filter;
                this.updateProjects();
            });
        });
    }
    
    initSorting() {
        this.sortButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.sortButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.currentSort = button.dataset.sort;
                this.sortProjects();
            });
        });
    }
    
    initSearch() {
        const debouncedSearch = debounce(() => {
            this.updateProjects();
        }, 300);
        
        this.searchInput.addEventListener('input', debouncedSearch);
    }
    
    initDemoButtons() {
        this.demoButtons.forEach(button => {
            button.addEventListener('click', () => {
                const projectId = button.dataset.project;
                this.openDemoModal(projectId);
            });
        });
    }
    
    initCodeButtons() {
        this.codeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const projectId = button.dataset.project;
                const url = this.githubUrls[projectId];
                
                if (url) {
                    window.open(url, '_blank');
                    
                    // Button feedback
                    const originalHTML = button.innerHTML;
                    button.innerHTML = '<span class="btn-icon">✓</span><span class="btn-text">OPENING...</span>';
                    button.style.opacity = '0.7';
                    
                    setTimeout(() => {
                        button.innerHTML = originalHTML;
                        button.style.opacity = '1';
                    }, 1500);
                }
            });
        });
    }
    
    initWriteupButtons() {
        this.writeupButtons.forEach(button => {
            button.addEventListener('click', () => {
                const projectId = button.dataset.project;
                // Anda bisa menambahkan fungsi untuk modal write-up di sini
                console.log('Write-up untuk project:', projectId);
            });
        });
    }
    
    initModalHandlers() {
        if (!this.demoModal || !this.modalClose) return;
        
        // Close modal
        this.modalClose.addEventListener('click', () => this.closeDemoModal());
        
        // Close on outside click
        this.demoModal.addEventListener('click', (e) => {
            if (e.target === this.demoModal) this.closeDemoModal();
        });
        
        // Fullscreen toggle
        if (this.fullscreenBtn) {
            this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        }
        
        // Restart demo
        if (this.restartBtn) {
            this.restartBtn.addEventListener('click', () => {
                if (this.currentProjectId) {
                    this.openDemoModal(this.currentProjectId);
                }
            });
        }
    }
    
    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (!this.demoModal || !this.demoModal.classList.contains('active')) return;
            
            switch(e.key) {
                case 'Escape':
                    this.closeDemoModal();
                    break;
                case 'f':
                case 'F':
                    if (this.fullscreenBtn) this.toggleFullscreen();
                    break;
                case 'r':
                case 'R':
                    if (this.restartBtn && this.currentProjectId) {
                        this.openDemoModal(this.currentProjectId);
                    }
                    break;
            }
        });
    }
    
    openDemoModal(projectId) {
        this.currentProjectId = projectId;
        
        // Show modal
        addClass(this.demoModal, 'active');
        document.body.style.overflow = 'hidden';
        
        // Update GitHub button link
        if (this.githubBtn && this.githubUrls[projectId]) {
            this.githubBtn.href = this.githubUrls[projectId];
        }
        
        // Show loading
        const loading = $('.demo-loading', this.demoModal);
        const frame = $('.demo-frame', this.demoModal);
        
        if (loading) loading.style.display = 'block';
        if (frame) {
            frame.style.background = '#000';
            frame.innerHTML = '<div class="demo-loading"><div class="loading-spinner"></div><div class="loading-text">INITIALIZING PLAYGROUND...</div></div>';
        }
        
        // Simulate demo after 2 seconds
        setTimeout(() => {
            this.simulateDemo(projectId);
        }, 2000);
    }
    
    simulateDemo(projectId) {
        const frame = $('.demo-frame', this.demoModal);
        if (!frame) return;
        
        const loading = $('.demo-loading', this.demoModal);
        if (loading) loading.style.display = 'none';
        
        // Add demo styles
        const styleId = 'demo-styles';
        if (!$(`#${styleId}`)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                @keyframes progress {
                    0% { width: 0%; }
                    100% { width: 100%; }
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 0.7; }
                    50% { transform: scale(1.2); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        switch(projectId) {
            case 'cyber-city':
                frame.style.background = 'linear-gradient(45deg, #0a0a0a, #1a0505)';
                frame.innerHTML = `
                    <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#ff0000;font-family:'Courier New',monospace;text-align:center;">
                        <h3 style="margin-bottom:20px;">CYBER CITY SIMULATION</h3>
                        <p style="color:#ff6666;">3D City rendering in progress...</p>
                        <div style="margin-top:30px;width:200px;height:2px;background:#ff0000;position:relative;overflow:hidden;">
                            <div style="position:absolute;top:0;left:0;height:100%;width:70%;background:#ff4444;animation:progress 2s infinite;"></div>
                        </div>
                    </div>
                `;
                break;
                
            case 'neural-viz':
                frame.style.background = 'linear-gradient(135deg, #0a0a0a, #05051a)';
                frame.innerHTML = `
                    <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#00ff00;font-family:'Courier New',monospace;text-align:center;">
                        <h3 style="margin-bottom:20px;">NEURAL NETWORK VISUALIZER</h3>
                        <p style="color:#66ff66;">Processing neural connections...</p>
                        <div style="margin-top:30px;display:flex;justify-content:center;gap:20px;">
                            <div style="width:20px;height:20px;background:#00ff00;border-radius:50%;animation:pulse 1s infinite;"></div>
                            <div style="width:20px;height:20px;background:#00ff00;border-radius:50%;animation:pulse 1s infinite 0.2s;"></div>
                            <div style="width:20px;height:20px;background:#00ff00;border-radius:50%;animation:pulse 1s infinite 0.4s;"></div>
                        </div>
                    </div>
                `;
                break;
                
            default:
                frame.innerHTML = `
                    <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#ff0000;font-family:'Courier New',monospace;text-align:center;">
                        <h3 style="margin-bottom:20px;">DEMO PLAYGROUND</h3>
                        <p style="color:#ff6666;">Interactive demo would run here</p>
                        <p style="margin-top:20px;font-size:0.9em;">(This is a simulation - real demo would connect to actual project)</p>
                    </div>
                `;
        }
    }
    
    closeDemoModal() {
        removeClass(this.demoModal, 'active');
        document.body.style.overflow = '';
        this.currentProjectId = null;
    }
    
    toggleFullscreen() {
        const container = $('.modal-container', this.demoModal);
        if (!container) return;
        
        if (!document.fullscreenElement) {
            container.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    updateProjects() {
        const searchTerm = this.searchInput.value.toLowerCase();
        
        this.projectCache.forEach(project => {
            const categoryMatch = this.currentFilter === 'all' || project.category === this.currentFilter;
            const searchMatch = !searchTerm || 
                project.name.includes(searchTerm) || 
                project.desc.includes(searchTerm) ||
                project.techs.some(tech => tech.includes(searchTerm));
            
            if (categoryMatch && searchMatch) {
                project.element.classList.remove('hidden');
                setTimeout(() => {
                    project.element.style.opacity = '1';
                    project.element.style.transform = 'translateY(0)';
                }, 50);
            } else {
                project.element.style.opacity = '0';
                project.element.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    project.element.classList.add('hidden');
                }, 300);
            }
        });
        
        this.sortProjects();
    }
    
    sortProjects() {
        const visibleProjects = this.projectCache.filter(p => !p.element.classList.contains('hidden'));
        
        if (visibleProjects.length === 0) return;
        
        visibleProjects.sort((a, b) => {
            switch (this.currentSort) {
                case 'complexity':
                    return b.complexity - a.complexity;
                case 'fun':
                    return b.fun - a.fun;
                case 'newest':
                default:
                    return 0;
            }
        });
        
        // Reorder in DOM
        const container = $('.projects-playground');
        visibleProjects.forEach(project => {
            container.appendChild(project.element);
        });
    }
    
    initTerminal() {
        initMultiLineTyping('.terminal-line', {
            speed: 50,
            deleteSpeed: 50,
            pause: 2000,
            loop: true
        });
    }
    
    initTileEffects() {
        // Optimized effects that only run when tiles are visible
        this.projectTiles.forEach(tile => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.activateTileEffects(tile);
                    } else {
                        this.deactivateTileEffects(tile);
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(tile);
        });
    }
    
    activateTileEffects(tile) {
        // Start effects for this tile
        tile.dataset.effectsActive = 'true';
        
        // Add hover effects
        tile.addEventListener('mouseenter', this.handleTileHover);
        tile.addEventListener('mouseleave', this.handleTileLeave);
    }
    
    deactivateTileEffects(tile) {
        // Stop effects for this tile
        tile.dataset.effectsActive = 'false';
        
        // Remove hover effects
        tile.removeEventListener('mouseenter', this.handleTileHover);
        tile.removeEventListener('mouseleave', this.handleTileLeave);
    }
    
    handleTileHover(e) {
        const tile = e.currentTarget;
        tile.style.transform = 'translateY(-15px) scale(1.02)';
    }
    
    handleTileLeave(e) {
        const tile = e.currentTarget;
        tile.style.transform = 'translateY(-10px) scale(1)';
    }
    
    destroy() {
        // Cleanup all event listeners
        if (this.demoModal) {
            removeClass(this.demoModal, 'active');
        }
        
        // Remove keyboard listeners
        document.removeEventListener('keydown', this.handleKeydown);
        
        // Remove modal handlers
        if (this.modalClose) {
            this.modalClose.removeEventListener('click', this.closeDemoModal);
        }
        
        // Reset body overflow
        document.body.style.overflow = '';
    }
}

export const initProjects = () => {
    return new ProjectsSection();
};