// assets/js/projects.js
import { $, $$ } from '../assets/js/core/dom.js';
import { randomRange, wait } from '../assets/js/core/utils.js';
import { initScanline } from '../assets/js/effects/scanline.js';
import { 
    projectsData, 
    getProjectsStats, 
    searchProjects, 
    getProjectsByCategory, 
    sortProjects,
    incrementViews,
    toggleLike 
} from './data/projects-data.js';

class ProjectsPage {
    constructor() {
        this.projects = [];
        this.filteredProjects = [];
        this.currentFilter = 'all';
        this.currentSort = 'newest';
        this.currentView = 'grid';
        this.currentPage = 1;
        this.projectsPerPage = 6;
        this.isLoading = false;
        this.selectedProject = null;
        this.isFullscreen = false;
        this.isZoomed = false;
        this.rotation = 0;
        
        this.init();
    }
    
    async init() {
        // Initialize scanline effect
        this.scanline = initScanline('.scanline', {
            flickerChance: 0.02,
            speed: 4
        });
        
        // Load projects data
        await this.loadProjectsData();
        
        // Initialize UI
        this.initUI();
        
        // Initialize events
        this.initEvents();
        
        // Simulate loading
        await this.simulateLoading();
        
        // Render initial projects
        this.renderProjects();
        
        console.log('🚀 Projects page initialized');
    }
    
    async loadProjectsData() {
        // Use data from projects-data.js
        this.projects = projectsData;
        this.filteredProjects = [...this.projects];
        
        // Update stats
        this.updateStats();
    }
    
    initUI() {
        // Update stats
        this.updateStats();
        
        // Update filter counts
        this.updateFilterCounts();
        
        // Update current count
        this.updateCurrentCount();
    }
    
    initEvents() {
        // Filter tags
        $$('.filter-tag').forEach(tag => {
            tag.addEventListener('click', () => this.handleFilterClick(tag));
        });
        
        // Sort options
        $$('.sort-option').forEach(option => {
            option.addEventListener('click', () => this.handleSortClick(option));
        });
        
        // View toggle
        const viewToggle = $('#view-toggle');
        if (viewToggle) {
            viewToggle.addEventListener('click', () => this.toggleView());
        }
        
        // Search input
        const searchInput = $('#project-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
            
            // Search animation
            searchInput.addEventListener('focus', () => {
                $('.search-terminal').style.borderColor = '#00ff00';
                $('.search-terminal').style.boxShadow = '0 0 25px rgba(0, 255, 0, 0.3)';
            });
            
            searchInput.addEventListener('blur', () => {
                if (!searchInput.value.trim()) {
                    $('.search-terminal').style.borderColor = '';
                    $('.search-terminal').style.boxShadow = '';
                }
            });
        }
        
        // Load more button
        const loadMoreBtn = $('#load-more');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMore());
        }
        
        // Modal close
        const modalClose = $('#modal-close');
        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeModal());
        }
        
        // Fullscreen close
        const fullscreenClose = $('#fullscreen-close');
        if (fullscreenClose) {
            fullscreenClose.addEventListener('click', () => this.closeFullscreen());
        }
        
        // Fullscreen controls
        const zoomBtn = $('#zoom-btn');
        const rotateBtn = $('#rotate-btn');
        if (zoomBtn) zoomBtn.addEventListener('click', () => this.toggleZoom());
        if (rotateBtn) rotateBtn.addEventListener('click', () => this.rotatePreview());
        
        // Clear search button
        const clearSearchBtn = $('#clear-search');
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', () => this.clearSearch());
        }
        
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if ($('#fullscreen-preview').classList.contains('active')) {
                    this.closeFullscreen();
                } else if ($('#project-modal').classList.contains('active')) {
                    this.closeModal();
                }
            }
            
            // Navigation in fullscreen
            if ($('#fullscreen-preview').classList.contains('active')) {
                switch(e.key) {
                    case 'ArrowLeft':
                        // Previous project logic if needed
                        break;
                    case 'ArrowRight':
                        // Next project logic if needed
                        break;
                    case ' ':
                        e.preventDefault();
                        this.toggleZoom();
                        break;
                }
            }
        });
        
        // Window events
        window.addEventListener('resize', () => this.handleResize());
        window.addEventListener('scroll', () => this.handleScroll());
    }
    
    async simulateLoading() {
        const loadingState = $('#loading-state');
        const loadingFill = $('#loading-fill');
        
        if (!loadingState || !loadingFill) return;
        
        // Show loading
        loadingState.style.display = 'block';
        loadingState.style.opacity = '1';
        
        // Simulate loading progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5 + Math.random() * 15;
            if (progress > 100) progress = 100;
            loadingFill.style.width = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(interval);
                
                // Fade out
                setTimeout(() => {
                    loadingState.style.opacity = '0';
                    setTimeout(() => {
                        loadingState.style.display = 'none';
                    }, 300);
                }, 500);
            }
        }, 50);
    }
    
    renderProjects() {
        const gridContainer = $('#projects-grid');
        if (!gridContainer) return;
        
        // Clear container with fade effect
        gridContainer.style.opacity = '0';
        setTimeout(() => {
            gridContainer.innerHTML = '';
            
            // Calculate pagination
            const startIndex = 0;
            const endIndex = Math.min(this.currentPage * this.projectsPerPage, this.filteredProjects.length);
            const currentProjects = this.filteredProjects.slice(startIndex, endIndex);
            
            // Show no results if empty
            if (currentProjects.length === 0) {
                this.showNoResults();
                gridContainer.style.opacity = '1';
                return;
            } else {
                this.hideNoResults();
            }
            
            // Update current count
            this.updateCurrentCount();
            
            // Render projects with staggered animation
            currentProjects.forEach((project, index) => {
                const card = this.createProjectCard(project, index);
                gridContainer.appendChild(card);
                
                // Stagger animation
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0) scale(1)';
                }, index * 100);
            });
            
            // Update load more button
            this.updateLoadMoreButton();
            
            // Fade in
            setTimeout(() => {
                gridContainer.style.opacity = '1';
            }, 300);
        }, 300);
    }
    
    createProjectCard(project, index) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.dataset.id = project.id;
        card.dataset.category = project.category;
        card.dataset.index = index;
        
        // Initial state for animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px) scale(0.9)';
        card.style.transition = 'opacity 0.5s, transform 0.5s';
        
        card.innerHTML = `
            <div class="card-header">
                <div class="card-badges">
                    ${project.badges.map(badge => 
                        `<span class="card-badge ${badge.toLowerCase()}">${badge}</span>`
                    ).join('')}
                </div>
                <h3 class="card-title">${project.title}</h3>
                <p class="card-description">${project.shortDescription}</p>
                <div class="card-tech">
                    ${project.techStack.slice(0, 3).map(tech => 
                        `<span class="tech-tag">${tech}</span>`
                    ).join('')}
                </div>
            </div>
            
            <div class="card-content">
                <div class="card-stats">
                    <div class="card-stat">
                        <span class="stat-label">Complexity</span>
                        <span class="stat-value">${project.complexity}/10</span>
                    </div>
                    <div class="card-stat">
                        <span class="stat-label">Fun Factor</span>
                        <span class="stat-value">${project.funFactor}/10</span>
                    </div>
                </div>
                
                <div class="card-preview">
                    <div class="preview-placeholder">
                        ${project.previewText || 'Project Preview'}
                    </div>
                </div>
                
                <div class="card-actions">
                    <a href="${project.demoLink}" class="action-btn demo-btn" target="_blank" data-action="demo">
                        <span class="btn-icon">▶</span>
                        <span class="btn-text">LIVE DEMO</span>
                    </a>
                    <a href="${project.codeLink}" class="action-btn code-btn" target="_blank" data-action="code">
                        <span class="btn-icon">{ }</span>
                        <span class="btn-text">VIEW CODE</span>
                    </a>
                </div>
            </div>
        `;
        
        // Add click events
        const demoBtn = card.querySelector('[data-action="demo"]');
        const codeBtn = card.querySelector('[data-action="code"]');
        
        // Card click opens modal
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.action-btn')) {
                this.openProjectModal(project);
            }
        });
        
        // Demo button
        demoBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Increment views
            incrementViews(project.id);
            // You could add analytics here
        });
        
        // Code button
        codeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // You could add analytics here
        });
        
        return card;
    }
    
    openProjectModal(project) {
        // Increment views
        incrementViews(project.id);
        
        // Set selected project
        this.selectedProject = project;
        
        // Update modal content
        this.updateModalContent(project);
        
        // Show modal with animation
        const modal = $('#project-modal');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Add entry animation
        modal.style.animation = 'modalIn 0.4s ease forwards';
        
        // Update like button
        this.updateLikeButton();
    }
    
    updateModalContent(project) {
        // Update basic info
        $('#modal-title').textContent = project.title;
        
        // Update badges
        const badgesContainer = $('#modal-badges');
        badgesContainer.innerHTML = project.badges.map(badge => 
            `<span class="modal-badge ${badge.toLowerCase()}">${badge}</span>`
        ).join('');
        
        // Update stats
        $('#modal-complexity').textContent = `${project.complexity}/10`;
        $('#modal-fun').textContent = `${project.funFactor}/10`;
        $('#modal-lines').textContent = project.linesOfCode.toLocaleString();
        $('#modal-build').textContent = project.buildTime;
        
        // Update description
        $('#modal-description').textContent = project.description;
        
        // Update tech stack
        const techContainer = $('#modal-tech');
        techContainer.innerHTML = project.techStack.map(tech => 
            `<span class="tech-tag">${tech}</span>`
        ).join('');
        
        // Update features
        const featuresContainer = $('#modal-features');
        featuresContainer.innerHTML = project.keyFeatures.map(feature => 
            `<li>${feature}</li>`
        ).join('');
        
        // Update links
        $('#demo-link').href = project.demoLink;
        $('#code-link').href = project.codeLink;
        
        // Update footer stats
        $('#modal-views').textContent = project.views.toLocaleString();
        $('#modal-likes').textContent = project.likes;
        $('#modal-date').textContent = project.date;
        
        // Update preview
        const previewContainer = $('#preview-container');
        previewContainer.innerHTML = `
            <div class="preview-content">
                <div class="preview-title">${project.previewTitle || project.title}</div>
                <div class="preview-text">${project.previewText || project.shortDescription}</div>
                ${project.previewCode ? `<pre class="preview-code">${project.previewCode}</pre>` : ''}
            </div>
        `;
        
        // Update fullscreen content
        this.updateFullscreenContent(project);
    }
    
    updateFullscreenContent(project) {
        $('#fullscreen-title').textContent = project.title;
        $('#fullscreen-description').textContent = project.description;
        
        const tagsContainer = $('#fullscreen-tags');
        tagsContainer.innerHTML = project.techStack.map(tech => 
            `<span class="viewer-tag">${tech}</span>`
        ).join('');
        
        const frame = $('#preview-frame');
        frame.innerHTML = `
            <div class="fullscreen-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                ${project.previewCode ? `
                <div class="code-preview">
                    <pre><code>${project.previewCode}</code></pre>
                </div>
                ` : ''}
                <div class="project-info">
                    <p><strong>Tech Stack:</strong> ${project.techStack.join(', ')}</p>
                    <p><strong>Complexity:</strong> ${project.complexity}/10</p>
                    <p><strong>Build Time:</strong> ${project.buildTime}</p>
                </div>
            </div>
        `;
    }
    
    updateLikeButton() {
        if (!this.selectedProject) return;
        
        const likeBtn = $('#modal-like');
        if (likeBtn) {
            likeBtn.onclick = () => {
                const newLikes = toggleLike(this.selectedProject.id);
                $('#modal-likes').textContent = newLikes;
                
                // Visual feedback
                likeBtn.classList.add('liked');
                setTimeout(() => {
                    likeBtn.classList.remove('liked');
                }, 300);
            };
        }
    }
    
    closeModal() {
        const modal = $('#project-modal');
        modal.style.animation = 'modalOut 0.3s ease forwards';
        
        setTimeout(() => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            modal.style.animation = '';
        }, 300);
    }
    
    openFullscreen() {
        if (!this.selectedProject) return;
        
        const fullscreen = $('#fullscreen-preview');
        fullscreen.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Reset zoom and rotation
        this.isZoomed = false;
        this.rotation = 0;
        $('#preview-frame').style.transform = 'scale(1) rotate(0deg)';
        
        // Add entry animation
        fullscreen.style.animation = 'fadeIn 0.3s ease forwards';
    }
    
    toggleZoom() {
        this.isZoomed = !this.isZoomed;
        const frame = $('#preview-frame');
        
        if (this.isZoomed) {
            frame.style.transform = `scale(1.5) rotate(${this.rotation}deg)`;
            $('#zoom-btn').innerHTML = '<span class="btn-icon">⎚</span>';
        } else {
            frame.style.transform = `scale(1) rotate(${this.rotation}deg)`;
            $('#zoom-btn').innerHTML = '<span class="btn-icon">🔍</span>';
        }
    }
    
    rotatePreview() {
        this.rotation = (this.rotation + 90) % 360;
        const frame = $('#preview-frame');
        const transform = this.isZoomed ? `scale(1.5) rotate(${this.rotation}deg)` : `scale(1) rotate(${this.rotation}deg)`;
        frame.style.transform = transform;
    }
    
    closeFullscreen() {
        const fullscreen = $('#fullscreen-preview');
        fullscreen.style.animation = 'fadeOut 0.3s ease forwards';
        
        setTimeout(() => {
            fullscreen.classList.remove('active');
            document.body.style.overflow = '';
            fullscreen.style.animation = '';
            
            // Reset transforms
            this.isZoomed = false;
            this.rotation = 0;
        }, 300);
    }
    
    handleFilterClick(tag) {
        const filter = tag.dataset.filter;
        
        // Update active filter
        $$('.filter-tag').forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
        
        // Update current filter
        this.currentFilter = filter;
        
        // Apply filter
        this.applyFilters();
        
        // Reset pagination
        this.currentPage = 1;
        
        // Render filtered projects
        this.renderProjects();
        
        // Update stats
        this.updateStats();
        
        // Animate filter change
        tag.style.animation = 'none';
        setTimeout(() => {
            tag.style.animation = 'filterPulse 0.5s ease';
        }, 10);
    }
    
    handleSortClick(option) {
        const sort = option.dataset.sort;
        
        // Update active sort
        $$('.sort-option').forEach(o => o.classList.remove('active'));
        option.classList.add('active');
        
        // Update current sort
        this.currentSort = sort;
        
        // Apply sorting
        this.applySorting();
        
        // Render sorted projects
        this.renderProjects();
        
        // Animate sort change
        option.style.animation = 'none';
        setTimeout(() => {
            option.style.animation = 'sortPulse 0.5s ease';
        }, 10);
    }
    
    toggleView() {
        const viewToggle = $('#view-toggle');
        const gridContainer = $('#projects-grid');
        
        this.currentView = this.currentView === 'grid' ? 'list' : 'grid';
        
        // Update button text
        const toggleText = viewToggle.querySelector('.toggle-text');
        const toggleIcon = viewToggle.querySelector('.toggle-icon');
        
        if (this.currentView === 'grid') {
            toggleText.textContent = 'GRID VIEW';
            toggleIcon.textContent = '☰';
            gridContainer.classList.remove('list-view');
            gridContainer.classList.add('grid-view');
        } else {
            toggleText.textContent = 'LIST VIEW';
            toggleIcon.textContent = '≡';
            gridContainer.classList.remove('grid-view');
            gridContainer.classList.add('list-view');
        }
        
        // Animate view change
        gridContainer.style.animation = 'none';
        setTimeout(() => {
            gridContainer.style.animation = 'viewChange 0.5s ease';
        }, 10);
    }
    
    handleSearch(query) {
        clearTimeout(this.searchTimeout);
        
        this.searchTimeout = setTimeout(() => {
            if (query.trim() === '') {
                this.clearSearch();
                return;
            }
            
            // Show search animation
            $('.search-terminal').style.borderColor = '#00ff00';
            $('.search-terminal').style.boxShadow = '0 0 25px rgba(0, 255, 0, 0.3)';
            
            // Search projects
            this.filteredProjects = searchProjects(query, this.currentFilter);
            
            // Update search query in no results
            $('#search-query').textContent = query;
            
            // Reset pagination
            this.currentPage = 1;
            
            // Apply current sort
            this.applySorting();
            
            // Render results
            this.renderProjects();
            
            // Update stats
            this.updateStats();
        }, 300);
    }
    
    clearSearch() {
        const searchInput = $('#project-search');
        searchInput.value = '';
        
        // Reset search terminal
        $('.search-terminal').style.borderColor = '';
        $('.search-terminal').style.boxShadow = '';
        
        // Reset filter
        this.currentFilter = 'all';
        $$('.filter-tag').forEach(t => t.classList.remove('active'));
        $$('.filter-tag[data-filter="all"]').forEach(t => t.classList.add('active'));
        
        // Reset to all projects
        this.filteredProjects = [...this.projects];
        
        // Reset pagination
        this.currentPage = 1;
        
        // Apply current sort
        this.applySorting();
        
        // Render all projects
        this.renderProjects();
        
        // Update stats
        this.updateStats();
    }
    
    applyFilters() {
        if (this.currentFilter === 'all') {
            this.filteredProjects = [...this.projects];
        } else {
            this.filteredProjects = getProjectsByCategory(this.currentFilter);
        }
    }
    
    applySorting() {
        this.filteredProjects = sortProjects(this.filteredProjects, this.currentSort);
    }
    
    updateStats() {
        // Update total projects count
        $('#total-projects').textContent = this.projects.length;
        
        // Update active projects in terminal
        $('#active-projects').textContent = this.filteredProjects.length;
        
        // Update last deployment time
        const now = new Date();
        const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        $('#last-deploy').textContent = timeString;
        
        // Update filter counts
        this.updateFilterCounts();
    }
    
    updateFilterCounts() {
        // Count projects by category
        const counts = {
            all: this.projects.length,
            web: this.projects.filter(p => p.category === 'web').length,
            game: this.projects.filter(p => p.category === 'game').length,
            tool: this.projects.filter(p => p.category === 'tool').length,
            exp: this.projects.filter(p => p.category === 'exp').length
        };
        
        // Update each filter tag count
        Object.keys(counts).forEach(category => {
            const countElement = document.querySelector(`.filter-tag[data-filter="${category}"] .tag-count`);
            if (countElement) {
                countElement.textContent = counts[category];
            }
        });
    }
    
    updateCurrentCount() {
        const currentCount = Math.min(this.currentPage * this.projectsPerPage, this.filteredProjects.length);
        const totalCount = this.filteredProjects.length;
        
        // You could update a counter element here if you add one to the UI
        console.log(`Showing ${currentCount} of ${totalCount} projects`);
    }
    
    updateLoadMoreButton() {
        const loadMoreBtn = $('#load-more');
        if (!loadMoreBtn) return;
        
        const hasMore = this.currentPage * this.projectsPerPage < this.filteredProjects.length;
        
        if (hasMore) {
            loadMoreBtn.style.display = 'flex';
            loadMoreBtn.querySelector('.btn-text').textContent = 'LOAD MORE';
            loadMoreBtn.disabled = false;
        } else {
            loadMoreBtn.querySelector('.btn-text').textContent = 'NO MORE PROJECTS';
            loadMoreBtn.disabled = true;
            
            // Fade out after showing message
            setTimeout(() => {
                loadMoreBtn.style.opacity = '0.5';
            }, 1000);
        }
    }
    
    loadMore() {
        if (this.isLoading) return;
        
        const loadMoreBtn = $('#load-more');
        loadMoreBtn.disabled = true;
        loadMoreBtn.querySelector('.btn-text').textContent = 'LOADING...';
        
        this.isLoading = true;
        this.currentPage++;
        
        // Simulate loading delay
        setTimeout(() => {
            this.renderProjects();
            this.isLoading = false;
        }, 800);
    }
    
    showNoResults() {
        const noResults = $('#no-results');
        const gridContainer = $('#projects-grid');
        
        gridContainer.style.display = 'none';
        noResults.style.display = 'block';
        noResults.style.opacity = '0';
        
        setTimeout(() => {
            noResults.style.opacity = '1';
            noResults.style.transform = 'translateY(0)';
        }, 100);
    }
    
    hideNoResults() {
        const noResults = $('#no-results');
        const gridContainer = $('#projects-grid');
        
        noResults.style.opacity = '0';
        noResults.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            noResults.style.display = 'none';
            gridContainer.style.display = 'grid';
        }, 300);
    }
    
    handleResize() {
        // Adjust layout on resize
        if (window.innerWidth < 768) {
            this.projectsPerPage = 4;
        } else {
            this.projectsPerPage = 6;
        }
        
        // Re-render if needed
        if (this.currentPage > 1) {
            this.renderProjects();
        }
    }
    
    handleScroll() {
        // Implement lazy loading if needed
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Load more when near bottom
        if (documentHeight - (scrollTop + windowHeight) < 500) {
            const hasMore = this.currentPage * this.projectsPerPage < this.filteredProjects.length;
            if (hasMore && !this.isLoading) {
                this.loadMore();
            }
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes modalIn {
            from {
                opacity: 0;
                transform: scale(0.8) translateY(50px);
            }
            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
        
        @keyframes modalOut {
            from {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
            to {
                opacity: 0;
                transform: scale(0.8) translateY(50px);
            }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        @keyframes filterPulse {
            0% { transform: scale(1); box-shadow: 0 0 20px rgba(255, 0, 0, 0.3); }
            50% { transform: scale(1.05); box-shadow: 0 0 30px rgba(255, 0, 0, 0.5); }
            100% { transform: scale(1); box-shadow: 0 0 20px rgba(255, 0, 0, 0.3); }
        }
        
        @keyframes sortPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        @keyframes viewChange {
            0% { opacity: 0.5; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
        }
        
        .liked {
            animation: likePulse 0.3s ease;
        }
        
        @keyframes likePulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
        
        .list-view {
            grid-template-columns: 1fr !important;
        }
        
        .list-view .project-card {
            display: flex;
            flex-direction: row;
            min-height: 200px;
        }
        
        .list-view .card-header {
            flex: 1;
            border-right: 1px solid rgba(255, 0, 0, 0.2);
            border-bottom: none;
        }
        
        .list-view .card-content {
            flex: 1;
        }
        
        @media (max-width: 768px) {
            .list-view .project-card {
                flex-direction: column;
            }
            
            .list-view .card-header {
                border-right: none;
                border-bottom: 1px solid rgba(255, 0, 0, 0.2);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Initialize projects page
    new ProjectsPage();
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Projects page error:', e.error);
    
    // Show error state to user
    const loadingState = $('#loading-state');
    if (loadingState && loadingState.style.display !== 'none') {
        loadingState.innerHTML = `
            <div class="error-terminal">
                <div class="terminal-header">
                    <div class="terminal-dots">
                        <span class="dot red"></span>
                        <span class="dot yellow"></span>
                        <span class="dot green"></span>
                    </div>
                    <span class="terminal-title">bash — error — 80×24</span>
                </div>
                <div class="terminal-body">
                    <div class="terminal-line">[✗] Failed to load projects</div>
                    <div class="terminal-line">[💡] Please check your connection</div>
                    <button class="terminal-btn" onclick="window.location.reload()">
                        RETRY
                    </button>
                </div>
            </div>
        `;
    }
});

// Export for module usage
export { ProjectsPage };
