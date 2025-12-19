// js/sections/projects.js
import { $, $$ } from '../core/dom.js';
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
        
        this.currentFilter = 'all';
        this.currentSort = 'newest';
        
        this.projectCache = this.cacheProjectData();
        
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
        this.initTerminal();
        this.initTileEffects();
        this.registerDemoModal();
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
        const githubUrls = {
            'cyber-city': 'https://github.com/kaishiscd/cyber-city-sim',
            'neural-viz': 'https://github.com/kaishiscd/neural-visualizer',
            'cyber-runner': 'https://github.com/kaishiscd/cyber-runner',
            'data-dashboard': 'https://github.com/kaishiscd/data-dashboard',
            'audio-viz': 'https://github.com/kaishiscd/audio-reactive-art',
            'terminal-quest': 'https://github.com/kaishiscd/terminal-quest'
        };
        
        this.codeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const projectId = button.dataset.project;
                const url = githubUrls[projectId];
                
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
    
    registerDemoModal() {
        modalManager.registerModal('#demo-modal', {
            closeOnOutsideClick: true,
            onOpen: () => {
                this.setupDemoModal();
            },
            onClose: () => {
                // Cleanup
            }
        });
    }
    
    openDemoModal(projectId) {
        // Store current project ID in modal
        const modal = $('#demo-modal');
        if (modal) {
            modal.dataset.currentProject = projectId;
        }
        
        modalManager.openModal('#demo-modal');
    }
    
    setupDemoModal() {
        const modal = $('#demo-modal');
        const projectId = modal?.dataset.currentProject;
        
        if (!projectId) return;
        
        // Setup modal content based on project
        this.loadDemoContent(projectId);
    }
    
    loadDemoContent(projectId) {
        // Implementation for loading demo content
        // This would be specific to demo system
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
        // Cleanup semua event listeners
        this.filterButtons.forEach(btn => btn.replaceWith(btn.cloneNode(true)));
        this.sortButtons.forEach(btn => btn.replaceWith(btn.cloneNode(true)));
        this.searchInput.replaceWith(this.searchInput.cloneNode(true));
    }
}

export const initProjects = () => {
    return new ProjectsSection();
};