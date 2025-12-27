// assets/js/gallery.js
import { $, $$ } from '../assets/js/core/dom.js';
import { randomRange, wait } from '../assets/js/core/utils.js';
import { initScanline } from '../assets/js/effects/scanline.js';
import { 
    galleryImages, 
    getGalleryStats, 
    searchImages, 
    getImagesByTheme, 
    sortImages,
    incrementViews,
    toggleLike
} from './gallery-data.js';

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
        this.viewMode = 'info'; // 'info' or 'fullscreen'
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
        // Use data from gallery-data.js
        this.images = galleryImages;
        this.filteredImages = [...this.images];
        
        // Update stats
        this.updateStats();
    }
    
    initUI() {
        // Update stats
        this.updateStats();
        
        // Initialize theme filter counts
        this.updateFilterCounts();
        
        // Update current count
        this.updateCurrentCount();
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
            
            // Add search animation
            searchInput.addEventListener('focus', () => {
                $('.search-terminal').style.borderColor = '#00ff00';
                $('.search-terminal').style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.3)';
            });
            
            searchInput.addEventListener('blur', () => {
                $('.search-terminal').style.borderColor = '';
                $('.search-terminal').style.boxShadow = '';
            });
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
        
        // Window scroll for load more detection
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Escape key for closing panels
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if ($('#fullscreen-viewer').classList.contains('active')) {
                    this.closeFullscreen();
                } else if ($('#info-panel').classList.contains('active')) {
                    this.closeInfoPanel();
                }
            }
        });
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
        if (viewerDownload) viewerDownload.addEventListener('click', () => this.downloadCurrentImage());
        
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
                case 'f':
                case 'F':
                    this.toggleFullscreen();
                    break;
                case 'd':
                case 'D':
                    this.downloadCurrentImage();
                    break;
            }
        });
        
        // Swipe gestures for mobile
        let touchStartX = 0;
        let touchStartY = 0;
        
        const viewerContent = $('.viewer-content');
        if (viewerContent) {
            viewerContent.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                touchStartY = e.changedTouches[0].screenY;
            });
            
            viewerContent.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].screenX;
                const touchEndY = e.changedTouches[0].screenY;
                const diffX = touchStartX - touchEndX;
                const diffY = touchStartY - touchEndY;
                
                // Horizontal swipe (prev/next)
                if (Math.abs(diffX) > Math.abs(diffY)) {
                    if (diffX > 50) {
                        this.nextImage(); // Swipe left
                    } else if (diffX < -50) {
                        this.prevImage(); // Swipe right
                    }
                }
                
                // Vertical swipe (close)
                if (diffY > 100) {
                    this.closeFullscreen(); // Swipe down
                }
            });
        }
    }
    
    async simulateLoading() {
        const loadingEl = $('#gallery-loading');
        const progressEl = $('#loading-progress');
        
        if (!loadingEl || !progressEl) return;
        
        // Show loading
        loadingEl.style.display = 'block';
        loadingEl.style.opacity = '1';
        
        // Simulate progress with random intervals for realism
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10 + Math.random() * 20;
            if (progress > 100) progress = 100;
            progressEl.style.width = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(interval);
                
                // Add completion delay for realism
                setTimeout(() => {
                    loadingEl.style.opacity = '0';
                    setTimeout(() => {
                        loadingEl.style.display = 'none';
                    }, 300);
                }, 500);
            }
        }, 100 + Math.random() * 200);
    }
    
    renderGallery() {
        const container = $('#gallery-container');
        if (!container) return;
        
        // Clear container with fade effect
        container.style.opacity = '0';
        setTimeout(() => {
            container.innerHTML = '';
            
            // Calculate pagination
            const startIndex = 0;
            const endIndex = Math.min(this.currentPage * this.imagesPerPage, this.filteredImages.length);
            const currentImages = this.filteredImages.slice(startIndex, endIndex);
            
            // Update current count
            this.updateCurrentCount();
            
            // Render images with staggered animation
            currentImages.forEach((image, index) => {
                const card = this.createGalleryCard(image, index);
                container.appendChild(card);
                
                // Stagger animation
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 50);
            });
            
            // Update layout
            this.updateLayout();
            
            // Fade in
            container.style.opacity = '1';
        }, 300);
    }
    
    createGalleryCard(image, index) {
        const card = document.createElement('div');
        card.className = 'gallery-card';
        card.dataset.id = image.id;
        card.dataset.theme = image.theme;
        card.dataset.index = index;
        
        // Initial state for animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.3s, transform 0.3s';
        
        card.innerHTML = `
            <div class="card-image-container">
                <img src="${image.src}" alt="${image.title}" class="card-image" 
                     loading="lazy"
                     onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 400 300\"><rect width=\"100%\" height=\"100%\" fill=\"%230a0a0a\"/><text x=\"50%\" y=\"50%\" font-family=\"Courier New, monospace\" font-size=\"16\" fill=\"%23ff0000\" text-anchor=\"middle\" dominant-baseline=\"middle\">IMAGE NOT FOUND</text></svg>'">
                <div class="card-loading"></div>
            </div>
            <div class="card-overlay">
                <div class="card-header">
                    <h3 class="card-title">${image.title}</h3>
                    <span class="card-theme">${image.theme.toUpperCase()}</span>
                </div>
                <div class="card-stats">
                    <span class="stat">
                        <span class="stat-icon">👁️</span>
                        <span class="stat-value">${image.views.toLocaleString()}</span>
                    </span>
                    <span class="stat">
                        <span class="stat-icon">❤️</span>
                        <span class="stat-value">${image.likes}</span>
                    </span>
                    <span class="stat">
                        <span class="stat-icon">📅</span>
                        <span class="stat-value">${image.date}</span>
                    </span>
                </div>
                <div class="card-actions">
                    <button class="card-action info-action" title="View Info">
                        <span class="action-icon">ⓘ</span>
                    </button>
                    <button class="card-action fullscreen-action" title="Fullscreen">
                        <span class="action-icon">⛶</span>
                    </button>
                    <button class="card-action like-action" title="Like">
                        <span class="action-icon">❤️</span>
                    </button>
                </div>
            </div>
        `;
        
        // Add click events
        const cardImage = card.querySelector('.card-image');
        const infoBtn = card.querySelector('.info-action');
        const fullscreenBtn = card.querySelector('.fullscreen-action');
        const likeBtn = card.querySelector('.like-action');
        
        // Whole card click for quick view
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.card-action')) {
                this.openImage(image, index);
            }
        });
        
        // Info button
        infoBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openInfoPanel(image);
        });
        
        // Fullscreen button
        fullscreenBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openFullscreen(image, index);
        });
        
        // Like button
        likeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleLike(image, likeBtn);
        });
        
        // Image load event
        cardImage.addEventListener('load', () => {
            card.querySelector('.card-loading').style.display = 'none';
        });
        
        return card;
    }
    
    openImage(image, index) {
        // Increment views
        incrementViews(image.id);
        
        // Update the card view count immediately
        const card = $(`.gallery-card[data-id="${image.id}"] .stat-value`);
        if (card) {
            // This would normally come from the updated data
            // For now, we'll just increment locally
            const currentViews = parseInt(card.textContent.replace(/,/g, ''));
            card.textContent = (currentViews + 1).toLocaleString();
        }
        
        // Open based on current view mode
        if (this.viewMode === 'fullscreen') {
            this.openFullscreen(image, index);
        } else {
            this.openInfoPanel(image);
        }
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
            tagEl.textContent = `#${tag}`;
            tagsEl.appendChild(tagEl);
        });
        
        descriptionEl.textContent = image.description;
        viewsEl.textContent = image.views.toLocaleString();
        likesEl.textContent = image.likes;
        dateEl.textContent = image.date;
        
        // Download button
        const downloadBtn = $('.info-download');
        if (downloadBtn) {
            downloadBtn.onclick = (e) => {
                e.stopPropagation();
                this.downloadImage(image);
            };
        }
        
        // Share button
        const shareBtn = $('.info-share');
        if (shareBtn) {
            shareBtn.onclick = (e) => {
                e.stopPropagation();
                this.shareImage(image);
            };
        }
        
        // Show panel with animation
        panel.classList.add('active');
        
        // Add subtle glow effect
        panel.style.boxShadow = '-20px 0 60px rgba(255, 0, 0, 0.3)';
        setTimeout(() => {
            panel.style.boxShadow = '';
        }, 1000);
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
        
        // Increment views
        incrementViews(image.id);
        
        // Update content
        viewerImage.src = image.src;
        viewerTitle.textContent = image.title;
        viewerCounter.textContent = `${index + 1} / ${this.filteredImages.length}`;
        
        // Update tags
        viewerTags.innerHTML = '';
        image.tags.forEach(tag => {
            const tagEl = document.createElement('span');
            tagEl.className = 'viewer-tag';
            tagEl.textContent = `#${tag}`;
            viewerTags.appendChild(tagEl);
        });
        
        viewerDescription.textContent = image.description;
        
        // Reset zoom and rotation
        this.isZoomed = false;
        this.rotation = 0;
        viewerImage.style.transform = 'scale(1) rotate(0deg)';
        viewerImage.classList.remove('zoomed');
        
        // Set current index
        this.currentFullscreenIndex = index;
        
        // Show viewer with animation
        viewer.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Add entry animation
        viewer.style.opacity = '0';
        setTimeout(() => {
            viewer.style.transition = 'opacity 0.3s';
            viewer.style.opacity = '1';
        }, 10);
    }
    
    closeFullscreen() {
        const viewer = $('#fullscreen-viewer');
        if (viewer) {
            viewer.style.opacity = '0';
            setTimeout(() => {
                viewer.classList.remove('active');
                document.body.style.overflow = '';
                viewer.style.opacity = '1';
            }, 300);
        }
    }
    
    prevImage() {
        if (this.currentFullscreenIndex > 0) {
            this.currentFullscreenIndex--;
            const image = this.filteredImages[this.currentFullscreenIndex];
            this.openFullscreen(image, this.currentFullscreenIndex);
        } else {
            // Loop to last image
            this.currentFullscreenIndex = this.filteredImages.length - 1;
            const image = this.filteredImages[this.currentFullscreenIndex];
            this.openFullscreen(image, this.currentFullscreenIndex);
        }
    }
    
    nextImage() {
        if (this.currentFullscreenIndex < this.filteredImages.length - 1) {
            this.currentFullscreenIndex++;
            const image = this.filteredImages[this.currentFullscreenIndex];
            this.openFullscreen(image, this.currentFullscreenIndex);
        } else {
            // Loop to first image
            this.currentFullscreenIndex = 0;
            const image = this.filteredImages[this.currentFullscreenIndex];
            this.openFullscreen(image, this.currentFullscreenIndex);
        }
    }
    
    toggleZoom() {
        const viewerImage = $('#viewer-image');
        if (!viewerImage) return;
        
        if (this.isZoomed) {
            viewerImage.classList.remove('zoomed');
            viewerImage.style.cursor = 'default';
            this.isZoomed = false;
            
            // Add zoom out animation
            viewerImage.style.transition = 'transform 0.3s';
            setTimeout(() => {
                viewerImage.style.transition = '';
            }, 300);
        } else {
            viewerImage.classList.add('zoomed');
            viewerImage.style.cursor = 'zoom-out';
            this.isZoomed = true;
            
            // Add zoom in animation
            viewerImage.style.transition = 'transform 0.3s';
            setTimeout(() => {
                viewerImage.style.transition = '';
            }, 300);
        }
    }
    
    rotateImage() {
        const viewerImage = $('#viewer-image');
        if (!viewerImage) return;
        
        this.rotation = (this.rotation + 90) % 360;
        
        // Apply rotation with animation
        viewerImage.style.transition = 'transform 0.3s';
        viewerImage.style.transform = `scale(${this.isZoomed ? 2 : 1}) rotate(${this.rotation}deg)`;
        
        setTimeout(() => {
            viewerImage.style.transition = '';
        }, 300);
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
    
    downloadCurrentImage() {
        const currentImage = this.filteredImages[this.currentFullscreenIndex];
        this.downloadImage(currentImage);
    }
    
    downloadImage(image) {
        // Create a temporary link for download
        const link = document.createElement('a');
        link.href = image.src;
        link.download = `${image.title.toLowerCase().replace(/\s+/g, '_')}.${image.format.toLowerCase()}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show notification
        this.showNotification(`Downloading: ${image.title}`);
    }
    
    shareImage(image) {
        if (navigator.share) {
            navigator.share({
                title: image.title,
                text: image.description,
                url: window.location.href,
            })
            .then(() => this.showNotification('Image shared successfully!'))
            .catch((error) => this.showNotification('Error sharing image'));
        } else {
            // Fallback: Copy to clipboard
            const shareText = `${image.title}\n${image.description}\n\nView at: ${window.location.href}`;
            navigator.clipboard.writeText(shareText)
                .then(() => this.showNotification('Link copied to clipboard!'))
                .catch(() => this.showNotification('Could not share image'));
        }
    }
    
    handleLike(image, likeBtn) {
        // Toggle like in data
        const newLikes = toggleLike(image.id);
        
        // Update UI
        const likeIcon = likeBtn.querySelector('.action-icon');
        const likeCount = likeBtn.closest('.gallery-card').querySelector('.like-action + .stat-value');
        
        // Visual feedback
        likeBtn.classList.add('liked');
        likeIcon.style.transform = 'scale(1.3)';
        
        // Update count if available
        if (likeCount) {
            likeCount.textContent = newLikes.toLocaleString();
        }
        
        // Reset animation
        setTimeout(() => {
            likeBtn.classList.remove('liked');
            likeIcon.style.transform = '';
        }, 300);
        
        // Show notification
        this.showNotification('Image liked! ❤️');
    }
    
    handleFilterClick(btn) {
        // Remove active class from all buttons
        $$('.theme-filter-btn').forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button with animation
        btn.classList.add('active');
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 150);
        
        // Update current filter
        this.currentFilter = btn.dataset.theme;
        
        // Apply filter
        this.applyFilter();
        
        // Reset pagination
        this.currentPage = 1;
        
        // Update load more button
        this.updateLoadMoreButton();
        
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
        
        // Update view mode based on layout
        if (this.currentLayout === 'fullscreen') {
            this.viewMode = 'fullscreen';
        } else {
            this.viewMode = 'info';
        }
        
        // Apply layout
        this.updateLayout();
    }
    
    handleSearch(query) {
        // Show searching indicator
        const searchTerminal = $('.search-terminal');
        if (searchTerminal) {
            searchTerminal.style.borderColor = '#ffff00';
        }
        
        // Debounce search
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            if (!query.trim()) {
                this.filteredImages = [...this.images];
            } else {
                this.filteredImages = searchImages(query);
            }
            
            // Apply current filter
            this.applyFilter();
            
            // Reset pagination
            this.currentPage = 1;
            
            // Update load more button
            this.updateLoadMoreButton();
            
            // Re-render gallery
            this.renderGallery();
            
            // Reset search terminal style
            if (searchTerminal) {
                searchTerminal.style.borderColor = query.trim() ? '#00ff00' : '';
            }
        }, 300);
    }
    
    applyFilter() {
        if (this.currentFilter === 'all') {
            this.filteredImages = [...this.images];
        } else {
            this.filteredImages = getImagesByTheme(this.currentFilter);
        }
        
        // Apply current sort
        this.applySort();
    }
    
    applySort() {
        this.filteredImages = sortImages(this.filteredImages, this.currentSort);
    }
    
    updateLayout() {
        const container = $('#gallery-container');
        if (!container) return;
        
        // Remove all layout classes
        container.classList.remove('grid', 'masonry', 'fullscreen');
        
        // Add current layout class
        container.classList.add(this.currentLayout);
        
        // Update mode toggle text
        this.updateModeToggle();
        
        // Add transition for layout change
        container.style.transition = 'grid-template-columns 0.3s';
        setTimeout(() => {
            container.style.transition = '';
        }, 300);
    }
    
    updateModeToggle() {
        const modeToggle = $('.gallery-mode-toggle');
        const modeText = $('.mode-text');
        const modeIcon = $('.mode-icon');
        
        if (modeToggle && modeText && modeIcon) {
            switch(this.currentLayout) {
                case 'grid':
                    modeText.textContent = 'GRID VIEW';
                    modeIcon.textContent = '☰';
                    modeToggle.style.borderColor = 'rgba(255, 0, 0, 0.3)';
                    break;
                case 'masonry':
                    modeText.textContent = 'MASONRY VIEW';
                    modeIcon.textContent = '⏹️';
                    modeToggle.style.borderColor = 'rgba(0, 255, 255, 0.3)';
                    break;
                case 'fullscreen':
                    modeText.textContent = 'FULLSCREEN';
                    modeIcon.textContent = '⛶';
                    modeToggle.style.borderColor = 'rgba(255, 255, 0, 0.3)';
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
        const activeBtn = $(`.layout-btn[data-layout="${this.currentLayout}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        // Apply layout
        this.updateLayout();
        
        // Visual feedback
        const modeToggle = $('.gallery-mode-toggle');
        if (modeToggle) {
            modeToggle.style.transform = 'scale(0.95)';
            setTimeout(() => {
                modeToggle.style.transform = '';
            }, 150);
        }
    }
    
    async loadMore() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        
        // Show loading state
        const loadMoreBtn = $('#load-more');
        if (loadMoreBtn) {
            const originalText = loadMoreBtn.querySelector('.btn-text').textContent;
            const originalIcon = loadMoreBtn.querySelector('.btn-icon').textContent;
            
            loadMoreBtn.querySelector('.btn-text').textContent = 'LOADING...';
            loadMoreBtn.querySelector('.btn-icon').textContent = '⏳';
            loadMoreBtn.disabled = true;
            loadMoreBtn.style.opacity = '0.7';
        }
        
        // Simulate API call with random delay for realism
        const delay = 800 + Math.random() * 700;
        await wait(delay);
        
        // Increase page
        this.currentPage++;
        
        // Re-render gallery (will show more items)
        this.renderGallery();
        
        // Reset button
        if (loadMoreBtn) {
            loadMoreBtn.querySelector('.btn-text').textContent = 'LOAD MORE';
            loadMoreBtn.querySelector('.btn-icon').textContent = '↻';
            loadMoreBtn.disabled = false;
            loadMoreBtn.style.opacity = '1';
            
            // Hide button if all images loaded
            if (this.currentPage * this.imagesPerPage >= this.filteredImages.length) {
                loadMoreBtn.style.display = 'none';
                this.showNotification('All images loaded!');
            } else {
                // Show loaded count
                const loadedCount = Math.min(this.currentPage * this.imagesPerPage, this.filteredImages.length);
                this.showNotification(`Loaded ${loadedCount} of ${this.filteredImages.length} images`);
            }
        }
        
        this.isLoading = false;
    }
    
    handleResize() {
        // Debounce resize events
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            // Re-render gallery on resize for responsive adjustments
            this.renderGallery();
        }, 250);
    }
    
    handleScroll() {
        // Infinite scroll implementation (optional)
        if (this.enableInfiniteScroll) {
            const scrollPosition = window.innerHeight + window.scrollY;
            const pageHeight = document.documentElement.offsetHeight;
            const threshold = 100; // pixels from bottom
            
            if (scrollPosition >= pageHeight - threshold && 
                !this.isLoading && 
                this.currentPage * this.imagesPerPage < this.filteredImages.length) {
                this.loadMore();
            }
        }
    }
    
    updateStats() {
        const stats = getGalleryStats();
        
        const imageCountEl = $('#image-count');
        const themeCountEl = $('#theme-count');
        const totalSizeEl = $('#total-size');
        
        if (imageCountEl) imageCountEl.textContent = stats.totalImages;
        if (themeCountEl) themeCountEl.textContent = stats.totalThemes;
        if (totalSizeEl) totalSizeEl.textContent = stats.totalSize;
    }
    
    updateFilterCounts() {
        const stats = getGalleryStats();
        
        // Update filter buttons
        Object.entries(stats.themeCounts).forEach(([theme, count]) => {
            const filterBtn = $(`.theme-filter-btn[data-theme="${theme}"] .filter-count`);
            if (filterBtn) {
                filterBtn.textContent = count;
            }
        });
        
        // Update "all" filter count
        const allFilterBtn = $('.theme-filter-btn[data-theme="all"] .filter-count');
        if (allFilterBtn) {
            allFilterBtn.textContent = stats.totalImages;
        }
    }
    
    updateCurrentCount() {
        const currentCount = Math.min(this.currentPage * this.imagesPerPage, this.filteredImages.length);
        const totalCount = this.filteredImages.length;
        
        const currentCountEl = $('#current-count');
        if (currentCountEl) {
            currentCountEl.textContent = currentCount;
            
            // Update footer stat
            const footerStat = $('.footer-stat:first-child .stat-number');
            if (footerStat) {
                footerStat.textContent = currentCount;
            }
        }
        
        // Update title with count
        const title = $('.gallery-title');
        if (title) {
            title.textContent = `// DIGITAL GALLERY (${currentCount}/${totalCount}) //`;
        }
    }
    
    updateLoadMoreButton() {
        const loadMoreBtn = $('#load-more');
        if (loadMoreBtn) {
            if (this.currentPage * this.imagesPerPage >= this.filteredImages.length) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'flex';
            }
        }
    }
    
    showNotification(message) {
        // Remove existing notification
        const existingNotification = $('.gallery-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'gallery-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">⚠</span>
                <span class="notification-text">${message}</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(10, 10, 10, 0.95);
            border: 2px solid #00ff00;
            border-radius: 8px;
            padding: 15px 20px;
            color: #00ff00;
            font-family: 'Courier New', monospace;
            z-index: 5000;
            transform: translateX(120%);
            transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            box-shadow: 0 0 30px rgba(0, 255, 0, 0.3);
            max-width: 300px;
            backdrop-filter: blur(10px);
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
        
        // Clear timeouts
        clearTimeout(this.searchTimeout);
        clearTimeout(this.resizeTimeout);
        
        // Remove event listeners
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('scroll', this.handleScroll);
        document.removeEventListener('keydown', this.handleKeydown);
    }
}

// Initialize gallery when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.gallery = new Gallery();
});

export default Gallery;