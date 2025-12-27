import { $, $$ } from '../assets/js/core/dom.js';
import { randomRange, wait } from '../assets/js/core/utils.js';
import { initScanline } from '../assets/js/effects/scanline.js';

class Gallery {
    constructor() {
        this.images = [];
        this.filteredImages = [];
        this.currentFilter = 'all';
        this.currentSort = 'newest';
        this.currentLayout = 'grid';
        this.currentPage = 1;
        this.imagesPerPage = 12;
        this.isLoading = false;
        this.currentFullscreenIndex = 0;
        
        this.init();
    }
    
    async init() {
        // Initialize scanline effect
        this.scanline = initScanline('.scanline', {
            flickerChance: 0.02,
            speed: 4
        });
        
        // Load gallery data
        await this.loadGalleryData();
        
        // Initialize UI
        this.initUI();
        
        // Initialize events
        this.initEvents();
        
        // Simulate loading
        await this.simulateLoading();
        
        // Render initial gallery
        this.renderGallery();
        
        console.log('🎨 Gallery initialized');
    }
    
    async loadGalleryData() {
        // This would typically come from an API
        // For now, we'll use mock data
        this.images = [
            {
                id: 1,
                src: '/assets/img/gallery/KaiShiPose1.png',
                title: 'CYBERPUNK OPERATIVE',
                theme: 'cyberpunk',
                description: 'Main character design with advanced cybernetic enhancements and tactical gear.',
                tags: ['cyberpunk', 'character', 'tactical', 'future'],
                resolution: '1920×1080',
                size: '3.8 MB',
                format: 'JPEG',
                views: 1247,
                likes: 356,
                date: '2024-01-15',
                featured: true
            },
            {
                id: 2,
                src: '/assets/img/gallery/KaiShiPose2.png',
                title: 'DIGITAL INFILTRATION',
                theme: 'cyberpunk',
                description: 'Stealth mode activated during digital infiltration mission.',
                tags: ['cyberpunk', 'hacking', 'stealth', 'code'],
                resolution: '1920×1080',
                size: '4.2 MB',
                format: 'PNG',
                views: 987,
                likes: 289,
                date: '2024-01-10',
                featured: true
            },
            {
                id: 3,
                src: '/assets/img/gallery/KaiShiPose3.png',
                title: 'NEON NIGHTS',
                theme: 'neon',
                description: 'City lights reflection on cybernetic armor during night patrol.',
                tags: ['neon', 'night', 'city', 'lights'],
                resolution: '1920×1080',
                size: '5.1 MB',
                format: 'PNG',
                views: 1567,
                likes: 421,
                date: '2024-01-05',
                featured: true
            },
            {
                id: 4,
                src: '/assets/img/gallery/KaiShiPose4.png',
                title: 'ELECTRIC DREAMS',
                theme: 'neon',
                description: 'Neon grid pattern overlay on cybernetic interface.',
                tags: ['neon', 'grid', 'interface', 'electric'],
                resolution: '1920×1080',
                size: '4.5 MB',
                format: 'PNG',
                views: 1134,
                likes: 312,
                date: '2024-01-02',
                featured: false
            },
            {
                id: 5,
                src: '/assets/img/gallery/KaiShiPose11.png',
                title: 'TECHNO-CORE',
                theme: 'techno',
                description: 'System interface view showing neural network connections.',
                tags: ['techno', 'system', 'interface', 'neural'],
                resolution: '2560×1440',
                size: '6.8 MB',
                format: 'PNG',
                views: 876,
                likes: 234,
                date: '2023-12-28',
                featured: true
            },
            {
                id: 6,
                src: '/assets/img/gallery/KaiShiPose6.png',
                title: 'GLITCH ARTIFACT',
                theme: 'glitch',
                description: 'Digital corruption effect during system malfunction.',
                tags: ['glitch', 'corruption', 'digital', 'artifact'],
                resolution: '1920×1080',
                size: '3.2 MB',
                format: 'PNG',
                views: 1345,
                likes: 398,
                date: '2023-12-25',
                featured: true
            },
            // Add more images as needed
            {
                id: 7,
                src: '/assets/img/gallery/KaiShiPose7.png',
                title: 'SYSTEM REBOOT',
                theme: 'cyberpunk',
                description: 'System reboot sequence with diagnostic overlay.',
                tags: ['cyberpunk', 'reboot', 'system', 'diagnostic'],
                resolution: '1920×1080',
                size: '4.7 MB',
                format: 'PNG',
                views: 765,
                likes: 201,
                date: '2023-12-20',
                featured: false
            },
            {
                id: 8,
                src: '/assets/img/gallery/KaiShiPose8.png',
                title: 'DATA STREAM',
                theme: 'neon',
                description: 'Real-time data stream visualization with neon aesthetics.',
                tags: ['neon', 'data', 'stream', 'visualization'],
                resolution: '2560×1440',
                size: '7.2 MB',
                format: 'PNG',
                views: 923,
                likes: 267,
                date: '2023-12-15',
                featured: false
            },
            {
                id: 9,
                src: '/assets/img/gallery/KaiShiPose9.png',
                title: 'DATA STREAM',
                theme: 'neon',
                description: 'Real-time data stream visualization with neon aesthetics.',
                tags: ['neon', 'data', 'stream', 'visualization'],
                resolution: '2560×1440',
                size: '7.2 MB',
                format: 'PNG',
                views: 923,
                likes: 267,
                date: '2023-12-15',
                featured: false
            },
            {
                id: 10,
                src: '/assets/img/gallery/KaiShiPose10.png',
                title: 'DATA STREAM',
                theme: 'neon',
                description: 'Real-time data stream visualization with neon aesthetics.',
                tags: ['neon', 'data', 'stream', 'visualization'],
                resolution: '2560×1440',
                size: '7.2 MB',
                format: 'PNG',
                views: 923,
                likes: 267,
                date: '2023-12-15',
                featured: false
            },
            {
                id: 11,
                src: '/assets/img/gallery/KaiShiPose12.png',
                title: 'DATA STREAM',
                theme: 'neon',
                description: 'Real-time data stream visualization with neon aesthetics.',
                tags: ['neon', 'data', 'stream', 'visualization'],
                resolution: '2560×1440',
                size: '7.2 MB',
                format: 'PNG',
                views: 923,
                likes: 267,
                date: '2023-12-15',
                featured: false
            },
            {
                id: 12,
                src: '/assets/img/gallery/KaiShiPose13.png',
                title: 'DATA STREAM',
                theme: 'neon',
                description: 'Real-time data stream visualization with neon aesthetics.',
                tags: ['neon', 'data', 'stream', 'visualization'],
                resolution: '2560×1440',
                size: '7.2 MB',
                format: 'PNG',
                views: 923,
                likes: 267,
                date: '2023-12-15',
                featured: false
            },
            {
                id: 7,
                src: '/assets/img/gallery/KaiShiPose14.png',
                title: 'SYSTEM REBOOT',
                theme: 'cyberpunk',
                description: 'System reboot sequence with diagnostic overlay.',
                tags: ['cyberpunk', 'reboot', 'system', 'diagnostic'],
                resolution: '1920×1080',
                size: '4.7 MB',
                format: 'PNG',
                views: 765,
                likes: 201,
                date: '2023-12-20',
                featured: false
            },
            {
                id: 7,
                src: '/assets/img/gallery/KaiShiPose15.png',
                title: 'SYSTEM REBOOT',
                theme: 'cyberpunk',
                description: 'System reboot sequence with diagnostic overlay.',
                tags: ['cyberpunk', 'reboot', 'system', 'diagnostic'],
                resolution: '1920×1080',
                size: '4.7 MB',
                format: 'PNG',
                views: 765,
                likes: 201,
                date: '2023-12-20',
                featured: false
            },
            {
                id: 7,
                src: '/assets/img/gallery/KaiShiPose16.png',
                title: 'SYSTEM REBOOT',
                theme: 'cyberpunk',
                description: 'System reboot sequence with diagnostic overlay.',
                tags: ['cyberpunk', 'reboot', 'system', 'diagnostic'],
                resolution: '1920×1080',
                size: '4.7 MB',
                format: 'PNG',
                views: 765,
                likes: 201,
                date: '2023-12-20',
                featured: false
            },
            {
                id: 7,
                src: '/assets/img/gallery/KaiShiPose17.png',
                title: 'SYSTEM REBOOT',
                theme: 'cyberpunk',
                description: 'System reboot sequence with diagnostic overlay.',
                tags: ['cyberpunk', 'reboot', 'system', 'diagnostic'],
                resolution: '1920×1080',
                size: '4.7 MB',
                format: 'PNG',
                views: 765,
                likes: 201,
                date: '2023-12-20',
                featured: false
            },
            {
                id: 7,
                src: '/assets/img/gallery/KaiShiPose18.png',
                title: 'SYSTEM REBOOT',
                theme: 'cyberpunk',
                description: 'System reboot sequence with diagnostic overlay.',
                tags: ['cyberpunk', 'reboot', 'system', 'diagnostic'],
                resolution: '1920×1080',
                size: '4.7 MB',
                format: 'PNG',
                views: 765,
                likes: 201,
                date: '2023-12-20',
                featured: false
            },
            {
                id: 7,
                src: '/assets/img/gallery/KaiShiPose19.png',
                title: 'SYSTEM REBOOT',
                theme: 'cyberpunk',
                description: 'System reboot sequence with diagnostic overlay.',
                tags: ['cyberpunk', 'reboot', 'system', 'diagnostic'],
                resolution: '1920×1080',
                size: '4.7 MB',
                format: 'PNG',
                views: 765,
                likes: 201,
                date: '2023-12-20',
                featured: false
            },
            {
                id: 7,
                src: '/assets/img/gallery/KaiShiPose20.png',
                title: 'SYSTEM REBOOT',
                theme: 'cyberpunk',
                description: 'System reboot sequence with diagnostic overlay.',
                tags: ['cyberpunk', 'reboot', 'system', 'diagnostic'],
                resolution: '1920×1080',
                size: '4.7 MB',
                format: 'PNG',
                views: 765,
                likes: 201,
                date: '2023-12-20',
                featured: false
            },
            {
                id: 7,
                src: '/assets/img/gallery/KaiShiPose21.png',
                title: 'SYSTEM REBOOT',
                theme: 'cyberpunk',
                description: 'System reboot sequence with diagnostic overlay.',
                tags: ['cyberpunk', 'reboot', 'system', 'diagnostic'],
                resolution: '1920×1080',
                size: '4.7 MB',
                format: 'PNG',
                views: 765,
                likes: 201,
                date: '2023-12-20',
                featured: false
            },
            {
                id: 7,
                src: '/assets/img/gallery/KaiShiPose22.png',
                title: 'SYSTEM REBOOT',
                theme: 'cyberpunk',
                description: 'System reboot sequence with diagnostic overlay.',
                tags: ['cyberpunk', 'reboot', 'system', 'diagnostic'],
                resolution: '1920×1080',
                size: '4.7 MB',
                format: 'PNG',
                views: 765,
                likes: 201,
                date: '2023-12-20',
                featured: false
            },
            {
                id: 7,
                src: '/assets/img/gallery/KaiShiPose23.png',
                title: 'SYSTEM REBOOT',
                theme: 'cyberpunk',
                description: 'System reboot sequence with diagnostic overlay.',
                tags: ['cyberpunk', 'reboot', 'system', 'diagnostic'],
                resolution: '1920×1080',
                size: '4.7 MB',
                format: 'PNG',
                views: 765,
                likes: 201,
                date: '2023-12-20',
                featured: false
            },
            {
                id: 7,
                src: '/assets/img/gallery/KaiShiPose24.png',
                title: 'SYSTEM REBOOT',
                theme: 'cyberpunk',
                description: 'System reboot sequence with diagnostic overlay.',
                tags: ['cyberpunk', 'reboot', 'system', 'diagnostic'],
                resolution: '1920×1080',
                size: '4.7 MB',
                format: 'PNG',
                views: 765,
                likes: 201,
                date: '2023-12-20',
                featured: false
            },
            {
                id: 7,
                src: '/assets/img/gallery/KaiShiPose25.png',
                title: 'SYSTEM REBOOT',
                theme: 'cyberpunk',
                description: 'System reboot sequence with diagnostic overlay.',
                tags: ['cyberpunk', 'reboot', 'system', 'diagnostic'],
                resolution: '1920×1080',
                size: '4.7 MB',
                format: 'PNG',
                views: 765,
                likes: 201,
                date: '2023-12-20',
                featured: false
            },
            // Continue adding until 24 images...
        ];
        
        // Fill with placeholder data if needed
        while (this.images.length < 24) {
            this.images.push({
                id: this.images.length + 1,
                src: `./assets/img/placeholder-${(this.images.length % 6) + 1}.jpg`,
                title: `CYBER ART ${this.images.length + 1}`,
                theme: ['cyberpunk', 'neon', 'techno', 'glitch'][this.images.length % 4],
                description: 'Advanced cybernetic design with futuristic aesthetics.',
                tags: ['cyber', 'future', 'design', 'art'],
                resolution: '1920×1080',
                size: `${(3 + Math.random() * 4).toFixed(1)} MB`,
                format: 'PNG',
                views: Math.floor(Math.random() * 2000),
                likes: Math.floor(Math.random() * 500),
                date: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
                featured: Math.random() > 0.7
            });
        }
        
        this.filteredImages = [...this.images];
    }
    
    initUI() {
        // Update stats
        this.updateStats();
        
        // Initialize theme filter counts
        this.updateFilterCounts();
    }
    
    initEvents() {
        // Theme filter buttons
        $$('.theme-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleFilterClick(btn));
        });
        
        // Sort buttons
        $$('.sort-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleSortClick(btn));
        });
        
        // Layout buttons
        $$('.layout-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleLayoutClick(btn));
        });
        
        // Search input
        const searchInput = $('#gallery-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }
        
        // Load more button
        const loadMoreBtn = $('#load-more');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMore());
        }
        
        // Gallery mode toggle
        const modeToggle = $('.gallery-mode-toggle');
        if (modeToggle) {
            modeToggle.addEventListener('click', () => this.toggleGalleryMode());
        }
        
        // Info panel close
        const panelClose = $('.panel-close');
        if (panelClose) {
            panelClose.addEventListener('click', () => this.closeInfoPanel());
        }
        
        // Fullscreen viewer events
        this.initFullscreenEvents();
        
        // Window resize
        window.addEventListener('resize', () => this.handleResize());
    }
    
    initFullscreenEvents() {
        const viewerClose = $('.viewer-close');
        const viewerPrev = $('.viewer-prev');
        const viewerNext = $('.viewer-next');
        const viewerZoom = $('.viewer-zoom');
        const viewerRotate = $('.viewer-rotate');
        const viewerDownload = $('.viewer-download');
        
        if (viewerClose) viewerClose.addEventListener('click', () => this.closeFullscreen());
        if (viewerPrev) viewerPrev.addEventListener('click', () => this.prevImage());
        if (viewerNext) viewerNext.addEventListener('click', () => this.nextImage());
        if (viewerZoom) viewerZoom.addEventListener('click', () => this.toggleZoom());
        if (viewerRotate) viewerRotate.addEventListener('click', () => this.rotateImage());
        if (viewerDownload) viewerDownload.addEventListener('click', () => this.downloadImage());
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (!$('#fullscreen-viewer').classList.contains('active')) return;
            
            switch(e.key) {
                case 'Escape':
                    this.closeFullscreen();
                    break;
                case 'ArrowLeft':
                    this.prevImage();
                    break;
                case 'ArrowRight':
                    this.nextImage();
                    break;
                case ' ':
                    e.preventDefault();
                    this.toggleZoom();
                    break;
                case 'r':
                case 'R':
                    this.rotateImage();
                    break;
            }
        });
    }
    
    async simulateLoading() {
        const loadingEl = $('#gallery-loading');
        const progressEl = $('#loading-progress');
        
        if (!loadingEl || !progressEl) return;
        
        // Show loading
        loadingEl.style.display = 'block';
        
        // Simulate progress
        for (let i = 0; i <= 100; i += 10) {
            progressEl.style.width = `${i}%`;
            await wait(100 + Math.random() * 200);
        }
        
        // Hide loading
        await wait(500);
        loadingEl.style.opacity = '0';
        await wait(300);
        loadingEl.style.display = 'none';
    }
    
    renderGallery() {
        const container = $('#gallery-container');
        if (!container) return;
        
        // Clear container
        container.innerHTML = '';
        
        // Calculate pagination
        const startIndex = 0;
        const endIndex = Math.min(this.currentPage * this.imagesPerPage, this.filteredImages.length);
        const currentImages = this.filteredImages.slice(startIndex, endIndex);
        
        // Update current count
        const currentCountEl = $('#current-count');
        if (currentCountEl) {
            currentCountEl.textContent = currentImages.length;
        }
        
        // Render images
        currentImages.forEach((image, index) => {
            const card = this.createGalleryCard(image, index);
            container.appendChild(card);
        });
        
        // Update layout
        this.updateLayout();
    }
    
    createGalleryCard(image, index) {
        const card = document.createElement('div');
        card.className = 'gallery-card';
        card.dataset.id = image.id;
        card.dataset.theme = image.theme;
        card.dataset.index = index;
        
        card.innerHTML = `
            <img src="${image.src}" alt="${image.title}" class="card-image">
            <div class="card-overlay">
                <h3 class="card-title">${image.title}</h3>
                <span class="card-theme">${image.theme.toUpperCase()}</span>
                <div class="card-stats">
                    <span class="stat">👁️ ${image.views.toLocaleString()}</span>
                    <span class="stat">❤️ ${image.likes}</span>
                    <span class="stat">📅 ${image.date}</span>
                </div>
            </div>
        `;
        
        // Add click event
        card.addEventListener('click', () => this.openImage(image, index));
        
        return card;
    }
    
    openImage(image, index) {
        // Open info panel
        this.openInfoPanel(image);
        
        // Set current fullscreen index
        this.currentFullscreenIndex = index;
    }
    
    openInfoPanel(image) {
        const panel = $('#info-panel');
        const imageEl = $('#info-image');
        const filenameEl = $('#info-filename');
        const resolutionEl = $('#info-resolution');
        const sizeEl = $('#info-size');
        const formatEl = $('#info-format');
        const tagsEl = $('#info-tags');
        const descriptionEl = $('#info-description');
        const viewsEl = $('#info-views');
        const likesEl = $('#info-likes');
        const dateEl = $('#info-date');
        
        if (!panel) return;
        
        // Update info
        imageEl.src = image.src;
        filenameEl.textContent = image.src.split('/').pop();
        resolutionEl.textContent = image.resolution;
        sizeEl.textContent = image.size;
        formatEl.textContent = image.format;
        
        // Update tags
        tagsEl.innerHTML = '';
        image.tags.forEach(tag => {
            const tagEl = document.createElement('span');
            tagEl.className = 'info-tag';
            tagEl.textContent = tag;
            tagsEl.appendChild(tagEl);
        });
        
        descriptionEl.textContent = image.description;
        viewsEl.textContent = image.views.toLocaleString();
        likesEl.textContent = image.likes;
        dateEl.textContent = image.date;
        
        // Download button
        const downloadBtn = $('.info-download');
        if (downloadBtn) {
            downloadBtn.onclick = () => this.downloadImage(image);
        }
        
        // Share button
        const shareBtn = $('.info-share');
        if (shareBtn) {
            shareBtn.onclick = () => this.shareImage(image);
        }
        
        // Show panel
        panel.classList.add('active');
    }
    
    closeInfoPanel() {
        const panel = $('#info-panel');
        if (panel) {
            panel.classList.remove('active');
        }
    }
    
    openFullscreen(image, index) {
        const viewer = $('#fullscreen-viewer');
        const viewerImage = $('#viewer-image');
        const viewerTitle = $('#viewer-title');
        const viewerCounter = $('#viewer-counter');
        const viewerTags = $('#viewer-tags');
        const viewerDescription = $('#viewer-description');
        
        if (!viewer) return;
        
        // Update content
        viewerImage.src = image.src;
        viewerTitle.textContent = image.title;
        viewerCounter.textContent = `${index + 1} / ${this.filteredImages.length}`;
        
        // Update tags
        viewerTags.innerHTML = '';
        image.tags.forEach(tag => {
            const tagEl = document.createElement('span');
            tagEl.className = 'viewer-tag';
            tagEl.textContent = tag;
            viewerTags.appendChild(tagEl);
        });
        
        viewerDescription.textContent = image.description;
        
        // Reset zoom and rotation
        viewerImage.style.transform = 'scale(1) rotate(0deg)';
        
        // Show viewer
        viewer.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeFullscreen() {
        const viewer = $('#fullscreen-viewer');
        if (viewer) {
            viewer.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    prevImage() {
        if (this.currentFullscreenIndex > 0) {
            this.currentFullscreenIndex--;
            const image = this.filteredImages[this.currentFullscreenIndex];
            this.openFullscreen(image, this.currentFullscreenIndex);
        }
    }
    
    nextImage() {
        if (this.currentFullscreenIndex < this.filteredImages.length - 1) {
            this.currentFullscreenIndex++;
            const image = this.filteredImages[this.currentFullscreenIndex];
            this.openFullscreen(image, this.currentFullscreenIndex);
        }
    }
    
    toggleZoom() {
        const viewerImage = $('#viewer-image');
        if (!viewerImage) return;
        
        if (viewerImage.classList.contains('zoomed')) {
            viewerImage.classList.remove('zoomed');
            viewerImage.style.transform = viewerImage.style.transform.replace('scale(2)', 'scale(1)');
        } else {
            viewerImage.classList.add('zoomed');
            viewerImage.style.transform += ' scale(2)';
        }
    }
    
    rotateImage() {
        const viewerImage = $('#viewer-image');
        if (!viewerImage) return;
        
        const currentRotation = parseInt(viewerImage.style.transform.match(/rotate\((\d+)deg\)/)?.[1] || '0');
        const newRotation = (currentRotation + 90) % 360;
        
        viewerImage.style.transform = viewerImage.style.transform.replace(
            /rotate\(\d+deg\)/,
            `rotate(${newRotation}deg)`
        );
        
        if (!viewerImage.style.transform.includes('rotate')) {
            viewerImage.style.transform += ` rotate(${newRotation}deg)`;
        }
    }
    
    downloadImage(image) {
        // For demo purposes, just show a notification
        this.showNotification(`Downloading: ${image.title}`);
    }
    
    shareImage(image) {
        // For demo purposes, just show a notification
        this.showNotification(`Sharing: ${image.title}`);
    }
    
    handleFilterClick(btn) {
        // Remove active class from all buttons
        $$('.theme-filter-btn').forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Update current filter
        this.currentFilter = btn.dataset.theme;
        
        // Apply filter
        this.applyFilter();
        
        // Reset pagination
        this.currentPage = 1;
        
        // Re-render gallery
        this.renderGallery();
    }
    
    handleSortClick(btn) {
        // Remove active class from all buttons
        $$('.sort-btn').forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Update current sort
        this.currentSort = btn.dataset.sort;
        
        // Apply sort
        this.applySort();
        
        // Re-render gallery
        this.renderGallery();
    }
    
    handleLayoutClick(btn) {
        // Remove active class from all buttons
        $$('.layout-btn').forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Update current layout
        this.currentLayout = btn.dataset.layout;
        
        // Apply layout
        this.updateLayout();
    }
    
    handleSearch(query) {
        if (!query.trim()) {
            this.filteredImages = [...this.images];
        } else {
            const searchTerm = query.toLowerCase();
            this.filteredImages = this.images.filter(image => 
                image.title.toLowerCase().includes(searchTerm) ||
                image.description.toLowerCase().includes(searchTerm) ||
                image.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
                image.theme.toLowerCase().includes(searchTerm)
            );
        }
        
        // Apply current filter
        this.applyFilter();
        
        // Reset pagination
        this.currentPage = 1;
        
        // Re-render gallery
        this.renderGallery();
    }
    
    applyFilter() {
        if (this.currentFilter === 'all') {
            this.filteredImages = [...this.images];
        } else {
            this.filteredImages = this.images.filter(image => 
                image.theme === this.currentFilter
            );
        }
        
        // Apply current sort
        this.applySort();
    }
    
    applySort() {
        switch(this.currentSort) {
            case 'newest':
                this.filteredImages.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'popular':
                this.filteredImages.sort((a, b) => b.views - a.views);
                break;
            case 'random':
                this.filteredImages.sort(() => Math.random() - 0.5);
                break;
        }
    }
    
    updateLayout() {
        const container = $('#gallery-container');
        if (!container) return;
        
        // Remove all layout classes
        container.classList.remove('grid', 'masonry', 'fullscreen');
        
        // Add current layout class
        container.classList.add(this.currentLayout);
        
        // Update mode toggle text
        const modeToggle = $('.gallery-mode-toggle');
        const modeText = $('.mode-text');
        const modeIcon = $('.mode-icon');
        
        if (modeToggle && modeText && modeIcon) {
            switch(this.currentLayout) {
                case 'grid':
                    modeText.textContent = 'GRID VIEW';
                    modeIcon.textContent = '☰';
                    break;
                case 'masonry':
                    modeText.textContent = 'MASONRY VIEW';
                    modeIcon.textContent = '⏹️';
                    break;
                case 'fullscreen':
                    modeText.textContent = 'FULLSCREEN';
                    modeIcon.textContent = '⛶';
                    break;
            }
        }
    }
    
    toggleGalleryMode() {
        const layouts = ['grid', 'masonry', 'fullscreen'];
        const currentIndex = layouts.indexOf(this.currentLayout);
        const nextIndex = (currentIndex + 1) % layouts.length;
        
        // Update layout
        this.currentLayout = layouts[nextIndex];
        
        // Update UI
        $$('.layout-btn').forEach(btn => btn.classList.remove('active'));
        $(`.layout-btn[data-layout="${this.currentLayout}"]`).classList.add('active');
        
        // Apply layout
        this.updateLayout();
    }
    
    async loadMore() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        
        // Show loading state
        const loadMoreBtn = $('#load-more');
        if (loadMoreBtn) {
            const originalText = loadMoreBtn.querySelector('.btn-text').textContent;
            loadMoreBtn.querySelector('.btn-text').textContent = 'LOADING...';
            loadMoreBtn.disabled = true;
        }
        
        // Simulate API call
        await wait(1000);
        
        // Increase page
        this.currentPage++;
        
        // Re-render gallery (will show more items)
        this.renderGallery();
        
        // Reset button
        if (loadMoreBtn) {
            loadMoreBtn.querySelector('.btn-text').textContent = 'LOAD MORE';
            loadMoreBtn.disabled = false;
            
            // Hide button if all images loaded
            if (this.currentPage * this.imagesPerPage >= this.filteredImages.length) {
                loadMoreBtn.style.display = 'none';
            }
        }
        
        this.isLoading = false;
    }
    
    handleResize() {
        // Re-render gallery on resize for responsive adjustments
        this.renderGallery();
    }
    
    updateStats() {
        const imageCountEl = $('#image-count');
        const themeCountEl = $('#theme-count');
        const totalSizeEl = $('#total-size');
        
        if (imageCountEl) imageCountEl.textContent = this.images.length;
        if (themeCountEl) themeCountEl.textContent = new Set(this.images.map(img => img.theme)).size;
        
        // Calculate total size (mock)
        if (totalSizeEl) {
            const totalSize = this.images.reduce((sum, img) => {
                const size = parseFloat(img.size) || 0;
                return sum + size;
            }, 0);
            totalSizeEl.textContent = `${totalSize.toFixed(0)}MB`;
        }
    }
    
    updateFilterCounts() {
        // Count images per theme
        const counts = {
            all: this.images.length,
            cyberpunk: this.images.filter(img => img.theme === 'cyberpunk').length,
            neon: this.images.filter(img => img.theme === 'neon').length,
            techno: this.images.filter(img => img.theme === 'techno').length,
            glitch: this.images.filter(img => img.theme === 'glitch').length
        };
        
        // Update filter buttons
        Object.entries(counts).forEach(([theme, count]) => {
            const filterBtn = $(`.theme-filter-btn[data-theme="${theme}"] .filter-count`);
            if (filterBtn) {
                filterBtn.textContent = count;
            }
        });
    }
    
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'gallery-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid #00ff00;
            border-radius: 8px;
            padding: 15px 20px;
            color: #00ff00;
            font-family: 'Courier New', monospace;
            z-index: 5000;
            transform: translateX(120%);
            transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            box-shadow: 0 0 30px rgba(0, 255, 0, 0.3);
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(120%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    destroy() {
        // Cleanup
        if (this.scanline) {
            this.scanline.destroy();
        }
    }
}

// Initialize gallery when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.gallery = new Gallery();
});

export default Gallery;