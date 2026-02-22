// gallery.js — Self-contained, bug-fixed, optimized
import { 
    galleryImages, 
    getGalleryStats, 
    searchImages, 
    getImagesByTheme, 
    sortImages,
    incrementViews,
    toggleLike
} from './gallery-data.js';

// ── Helpers (inlined, no external deps) ────────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const wait = (ms) => new Promise(r => setTimeout(r, ms));

// ── Gallery Class ───────────────────────────────────────────────────────────
class Gallery {
    constructor() {
        this.images         = [];
        this.filteredImages = [];
        this.searchQuery    = '';
        this.currentFilter  = 'all';
        this.currentSort    = 'newest';
        this.currentLayout  = 'grid';
        this.currentPage    = 1;
        this.imagesPerPage  = 12;
        this.isLoading      = false;
        this.currentFSIndex = 0;
        this.isZoomed       = false;
        this.rotation       = 0;
        this.searchTimeout  = null;
        this.resizeTimeout  = null;

        this.init();
    }

    async init() {
        this.images         = galleryImages;
        this.filteredImages = [...this.images];

        this.updateStats();
        this.updateFilterCounts();
        this.updateCurrentCount();
        this.initEvents();
        await this.simulateLoading();
        this.renderGallery();
    }

    // ── Events ──────────────────────────────────────────────────────────────
    initEvents() {
        $$('.theme-filter-btn').forEach(btn =>
            btn.addEventListener('click', () => this.handleFilterClick(btn)));

        $$('.sort-btn').forEach(btn =>
            btn.addEventListener('click', () => this.handleSortClick(btn)));

        $$('.layout-btn').forEach(btn =>
            btn.addEventListener('click', () => this.handleLayoutClick(btn)));

        const searchInput = $('#gallery-search');
        if (searchInput) {
            searchInput.addEventListener('input', e => this.handleSearch(e.target.value));
            searchInput.addEventListener('focus', () => {
                const t = $('.search-terminal');
                if (t) { t.style.borderColor = '#00ff00'; t.style.boxShadow = '0 0 15px rgba(0,255,0,0.25)'; }
            });
            searchInput.addEventListener('blur', () => {
                const t = $('.search-terminal');
                if (t) { t.style.borderColor = ''; t.style.boxShadow = ''; }
            });
        }

        const loadMoreBtn = $('#load-more');
        if (loadMoreBtn) loadMoreBtn.addEventListener('click', () => this.loadMore());

        const modeToggle = $('.gallery-mode-toggle');
        if (modeToggle) modeToggle.addEventListener('click', () => this.toggleGalleryMode());

        const panelClose = $('.panel-close');
        if (panelClose) panelClose.addEventListener('click', () => this.closeInfoPanel());

        this.initFullscreenEvents();

        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => this.renderGallery(), 250);
        });

        document.addEventListener('keydown', e => {
            const fsActive = $('#fullscreen-viewer')?.classList.contains('active');
            const ipActive = $('#info-panel')?.classList.contains('active');

            if (e.key === 'Escape') {
                if (fsActive) this.closeFullscreen();
                else if (ipActive) this.closeInfoPanel();
            }
        });
    }

    initFullscreenEvents() {
        const on = (sel, ev, fn) => { const el = $(sel); if (el) el.addEventListener(ev, fn); };

        on('.viewer-close',    'click', () => this.closeFullscreen());
        on('.viewer-prev',     'click', () => this.prevImage());
        on('.viewer-next',     'click', () => this.nextImage());
        on('.viewer-zoom',     'click', () => this.toggleZoom());
        on('.viewer-rotate',   'click', () => this.rotateImage());
        on('.viewer-download', 'click', () => this.downloadCurrentImage());

        // Keyboard nav inside viewer
        document.addEventListener('keydown', e => {
            if (!$('#fullscreen-viewer')?.classList.contains('active')) return;
            switch (e.key) {
                case 'ArrowLeft':  this.prevImage(); break;
                case 'ArrowRight': this.nextImage(); break;
                case ' ': e.preventDefault(); this.toggleZoom(); break;
                case 'r': case 'R': this.rotateImage(); break;
                case 'd': case 'D': this.downloadCurrentImage(); break;
            }
        });

        // Touch swipe
        const vc = $('.viewer-content');
        if (vc) {
            let tx = 0, ty = 0;
            vc.addEventListener('touchstart', e => {
                tx = e.changedTouches[0].screenX;
                ty = e.changedTouches[0].screenY;
            }, { passive: true });
            vc.addEventListener('touchend', e => {
                const dx = tx - e.changedTouches[0].screenX;
                const dy = ty - e.changedTouches[0].screenY;
                if (Math.abs(dx) > Math.abs(dy)) {
                    if (dx >  50) this.nextImage();
                    if (dx < -50) this.prevImage();
                } else if (dy > 100) {
                    this.closeFullscreen();
                }
            }, { passive: true });
        }
    }

    // ── Loading simulation ──────────────────────────────────────────────────
    async simulateLoading() {
        const loadingEl  = $('#gallery-loading');
        const progressEl = $('#loading-progress');
        if (!loadingEl || !progressEl) return;

        loadingEl.style.display = 'flex';
        for (let i = 0; i <= 100; i += 10) {
            progressEl.style.width = `${i}%`;
            await wait(80 + Math.random() * 120);
        }
        await wait(400);
        loadingEl.style.opacity = '0';
        await wait(300);
        loadingEl.style.display = 'none';
        loadingEl.style.opacity = '1';
    }

    // ── Render ──────────────────────────────────────────────────────────────
    renderGallery() {
        const container = $('#gallery-container');
        if (!container) return;

        container.style.opacity = '0';

        setTimeout(() => {
            container.innerHTML = '';

            const endIdx  = Math.min(this.currentPage * this.imagesPerPage, this.filteredImages.length);
            const current = this.filteredImages.slice(0, endIdx);

            this.updateCurrentCount();

            current.forEach((image, index) => {
                const card = this.createGalleryCard(image, index);
                container.appendChild(card);
                // stagger reveal
                setTimeout(() => {
                    card.style.opacity   = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 40);
            });

            this.applyLayoutClass(container);
            this.updateLoadMoreButton();

            container.style.transition = 'opacity 0.3s';
            container.style.opacity    = '1';
        }, 200);
    }

    createGalleryCard(image, index) {
        const card = document.createElement('div');
        card.className    = 'gallery-card';
        card.dataset.id   = image.id;
        card.dataset.theme= image.theme;
        card.style.cssText= 'opacity:0;transform:translateY(20px);transition:opacity .3s,transform .3s';

        card.innerHTML = `
            <div class="card-image-container">
                <img src="${image.src}" alt="${image.title}" class="card-image" loading="lazy" decoding="async">
                <div class="card-loading"></div>
            </div>
            <div class="card-overlay">
                <div class="card-header">
                    <h3 class="card-title">${image.title}</h3>
                    <span class="card-theme">${image.theme.toUpperCase()}</span>
                </div>
                <div class="card-stats">
                    <span class="stat">
                        <span class="stat-icon">📅</span>
                        <span class="stat-date">${image.date}</span>
                    </span>
                </div>
                <div class="card-actions">
                    <button class="card-action info-action" title="View Info"><span class="action-icon">ⓘ</span></button>
                    <button class="card-action fullscreen-action" title="Fullscreen"><span class="action-icon">⛶</span></button>
                    <button class="card-action like-action" title="Like"><span class="action-icon">❤</span></button>
                </div>
            </div>`;

        const img          = card.querySelector('.card-image');
        const skeleton     = card.querySelector('.card-loading');
        const infoBtn      = card.querySelector('.info-action');
        const fsBtn        = card.querySelector('.fullscreen-action');
        const likeBtn      = card.querySelector('.like-action');

        img.addEventListener('load',  () => skeleton.style.display = 'none');
        img.addEventListener('error', () => skeleton.style.display = 'none');

        card.addEventListener('click', e => {
            if (!e.target.closest('.card-action')) this.openInfoPanel(image);
        });
        infoBtn.addEventListener('click', e => { e.stopPropagation(); this.openInfoPanel(image); });
        fsBtn.addEventListener('click',   e => { e.stopPropagation(); this.openFullscreen(image, index); });
        likeBtn.addEventListener('click', e => { e.stopPropagation(); this.handleLike(image, likeBtn); });

        return card;
    }

    // ── Info Panel ──────────────────────────────────────────────────────────
    openInfoPanel(image) {
        const panel = $('#info-panel');
        if (!panel) return;

        incrementViews(image.id);

        $('#info-image').src         = image.src;
        $('#info-filename').textContent  = image.src.split('/').pop();
        $('#info-resolution').textContent= image.resolution;
        $('#info-size').textContent      = image.size;
        $('#info-format').textContent    = image.format;
        $('#info-description').textContent = image.description;
        $('#info-date').textContent      = image.date;

        const tagsEl = $('#info-tags');
        tagsEl.innerHTML = '';
        image.tags.forEach(tag => {
            const t = document.createElement('span');
            t.className   = 'info-tag';
            t.textContent = `#${tag}`;
            tagsEl.appendChild(t);
        });

        const dlBtn = $('.info-download');
        if (dlBtn) dlBtn.onclick = () => this.downloadImage(image);

        const shBtn = $('.info-share');
        if (shBtn) shBtn.onclick = () => this.shareImage(image);

        panel.classList.add('active');
    }

    closeInfoPanel() {
        $('#info-panel')?.classList.remove('active');
    }

    // ── Fullscreen Viewer ───────────────────────────────────────────────────
    openFullscreen(image, index) {
        const viewer = $('#fullscreen-viewer');
        if (!viewer) return;

        incrementViews(image.id);

        $('#viewer-image').src = image.src;
        $('#viewer-title').textContent   = image.title;
        $('#viewer-counter').textContent = `${index + 1} / ${this.filteredImages.length}`;
        $('#viewer-description').textContent = image.description;

        const tagsEl = $('#viewer-tags');
        tagsEl.innerHTML = '';
        image.tags.forEach(tag => {
            const t = document.createElement('span');
            t.className   = 'viewer-tag';
            t.textContent = `#${tag}`;
            tagsEl.appendChild(t);
        });

        // Reset transforms
        this.isZoomed = false;
        this.rotation = 0;
        const vi = $('#viewer-image');
        vi.style.transform = '';
        vi.classList.remove('zoomed');

        this.currentFSIndex = index;
        viewer.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeFullscreen() {
        const viewer = $('#fullscreen-viewer');
        if (!viewer) return;
        viewer.classList.remove('active');
        document.body.style.overflow = '';
    }

    prevImage() {
        const idx = this.currentFSIndex > 0
            ? this.currentFSIndex - 1
            : this.filteredImages.length - 1;
        this.openFullscreen(this.filteredImages[idx], idx);
    }

    nextImage() {
        const idx = this.currentFSIndex < this.filteredImages.length - 1
            ? this.currentFSIndex + 1
            : 0;
        this.openFullscreen(this.filteredImages[idx], idx);
    }

    toggleZoom() {
        const vi = $('#viewer-image');
        if (!vi) return;
        this.isZoomed = !this.isZoomed;
        vi.style.transition = 'transform 0.3s';
        vi.style.transform  = this.isZoomed
            ? `scale(2) rotate(${this.rotation}deg)`
            : `scale(1) rotate(${this.rotation}deg)`;
        vi.classList.toggle('zoomed', this.isZoomed);
        setTimeout(() => { vi.style.transition = ''; }, 300);
    }

    rotateImage() {
        const vi = $('#viewer-image');
        if (!vi) return;
        this.rotation = (this.rotation + 90) % 360;
        vi.style.transition = 'transform 0.3s';
        vi.style.transform  = `scale(${this.isZoomed ? 2 : 1}) rotate(${this.rotation}deg)`;
        setTimeout(() => { vi.style.transition = ''; }, 300);
    }

    downloadCurrentImage() {
        this.downloadImage(this.filteredImages[this.currentFSIndex]);
    }

    downloadImage(image) {
        const link = Object.assign(document.createElement('a'), {
            href:     image.src,
            download: `${image.title.toLowerCase().replace(/\s+/g, '_')}.${image.format.toLowerCase()}`
        });
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.showNotification(`↓ Downloading: ${image.title}`);
    }

    shareImage(image) {
        const text = `${image.title}\n${image.description}\n\n${window.location.href}`;
        if (navigator.share) {
            navigator.share({ title: image.title, text: image.description, url: window.location.href })
                .then(() => this.showNotification('Shared successfully!'))
                .catch(() => {});
        } else {
            navigator.clipboard.writeText(text)
                .then(() => this.showNotification('↗ Link copied to clipboard!'))
                .catch(() => this.showNotification('Could not copy link'));
        }
    }

    handleLike(image, btn) {
        toggleLike(image.id);
        const icon = btn.querySelector('.action-icon');
        btn.classList.add('liked');
        icon.style.transform = 'scale(1.4)';
        setTimeout(() => { btn.classList.remove('liked'); icon.style.transform = ''; }, 350);
        this.showNotification('❤ Liked!');
    }

    // ── Filters / Sort / Layout ─────────────────────────────────────────────
    handleFilterClick(btn) {
        $$('.theme-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.dataset.theme;
        this.currentPage   = 1;
        this.applyFilters();
        this.renderGallery();
    }

    handleSortClick(btn) {
        $$('.sort-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentSort = btn.dataset.sort;
        this.applyFilters();
        this.renderGallery();
    }

    handleLayoutClick(btn) {
        $$('.layout-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentLayout = btn.dataset.layout;
        this.applyLayoutClass($('#gallery-container'));
        this.updateModeToggle();
    }

    handleSearch(query) {
        this.searchQuery = query;
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.currentPage = 1;
            this.applyFilters();
            this.renderGallery();
        }, 300);
    }

    /**
     * Single source of truth: search → theme filter → sort
     */
    applyFilters() {
        // 1. Start from search results (or all images if no query)
        let base = this.searchQuery.trim()
            ? searchImages(this.searchQuery)
            : [...this.images];

        // 2. Apply theme filter
        if (this.currentFilter !== 'all') {
            base = base.filter(img => img.theme === this.currentFilter);
        }

        // 3. Apply sort
        this.filteredImages = sortImages(base, this.currentSort);
    }

    // ── Layout ──────────────────────────────────────────────────────────────
    applyLayoutClass(container) {
        if (!container) return;
        container.classList.remove('layout-grid', 'layout-masonry', 'layout-fullwidth');
        const map = { grid: 'layout-grid', masonry: 'layout-masonry', fullscreen: 'layout-fullwidth' };
        container.classList.add(map[this.currentLayout] || 'layout-grid');
    }

    updateModeToggle() {
        const modeText = $('.mode-text');
        const modeIcon = $('.mode-icon');
        if (!modeText || !modeIcon) return;
        const map = {
            grid:       { text: 'GRID VIEW',     icon: '☰'  },
            masonry:    { text: 'MASONRY VIEW',   icon: '⊞'  },
            fullscreen: { text: 'FULLWIDTH',      icon: '⛶'  },
        };
        const m = map[this.currentLayout] || map.grid;
        modeText.textContent = m.text;
        modeIcon.textContent = m.icon;
    }

    toggleGalleryMode() {
        const layouts = ['grid', 'masonry', 'fullscreen'];
        const next    = layouts[(layouts.indexOf(this.currentLayout) + 1) % layouts.length];
        this.currentLayout = next;

        $$('.layout-btn').forEach(b => b.classList.remove('active'));
        $(`.layout-btn[data-layout="${next}"]`)?.classList.add('active');

        this.applyLayoutClass($('#gallery-container'));
        this.updateModeToggle();
    }

    // ── Load More ────────────────────────────────────────────────────────────
    async loadMore() {
        if (this.isLoading) return;
        this.isLoading = true;

        const btn     = $('#load-more');
        const btnText = btn?.querySelector('.btn-text');
        const btnIcon = btn?.querySelector('.btn-icon');
        if (btn) {
            btnText.textContent = 'LOADING...';
            btnIcon.textContent = '⏳';
            btn.disabled = true;
        }

        await wait(700 + Math.random() * 500);
        this.currentPage++;
        this.renderGallery();

        if (btn) {
            btnText.textContent = 'LOAD MORE';
            btnIcon.textContent = '↻';
            btn.disabled = false;
            const loaded = Math.min(this.currentPage * this.imagesPerPage, this.filteredImages.length);
            this.showNotification(`Loaded ${loaded} of ${this.filteredImages.length} images`);
        }

        this.isLoading = false;
    }

    // ── Stats & UI updates ──────────────────────────────────────────────────
    updateStats() {
        const stats = getGalleryStats();
        const set   = (id, val) => { const el = $(id); if (el) el.textContent = val; };
        set('#image-count', stats.totalImages);
        set('#theme-count', stats.totalThemes);
        set('#total-size',  stats.totalSize);
    }

    updateFilterCounts() {
        const stats = getGalleryStats();
        Object.entries(stats.themeCounts).forEach(([theme, count]) => {
            const el = $(`.theme-filter-btn[data-theme="${theme}"] .filter-count`);
            if (el) el.textContent = count;
        });
        const allEl = $('.theme-filter-btn[data-theme="all"] .filter-count');
        if (allEl) allEl.textContent = stats.totalImages;
    }

    updateCurrentCount() {
        const shown = Math.min(this.currentPage * this.imagesPerPage, this.filteredImages.length);
        const total = this.filteredImages.length;

        const el = $('#current-count');
        if (el) el.textContent = shown;

        const titleEl = $('.gallery-title');
        if (titleEl) titleEl.textContent = `// DIGITAL GALLERY (${shown}/${total}) //`;
    }

    updateLoadMoreButton() {
        const btn = $('#load-more');
        if (!btn) return;
        const allShown = this.currentPage * this.imagesPerPage >= this.filteredImages.length;
        btn.style.display = allShown ? 'none' : 'flex';
    }

    // ── Notification ────────────────────────────────────────────────────────
    showNotification(msg) {
        const existing = $('.gallery-notification');
        if (existing) existing.remove();

        const n = document.createElement('div');
        n.className = 'gallery-notification';
        n.innerHTML = `<span class="notif-icon">⚡</span><span>${msg}</span>`;
        document.body.appendChild(n);

        requestAnimationFrame(() => n.classList.add('visible'));

        setTimeout(() => {
            n.classList.remove('visible');
            setTimeout(() => n.remove(), 300);
        }, 2800);
    }
}

// ── Boot ──────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    window.gallery = new Gallery();
});

export default Gallery;