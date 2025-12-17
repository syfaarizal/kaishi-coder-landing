// Enhanced glitch effect for messages
document.querySelectorAll('.message-bubble').forEach((bubble, index) => {
    bubble.style.animationDelay = `${index * 0.3}s`;
            
    // Random glitch effect
    setInterval(() => {
        if (Math.random() > 0.95) {
            bubble.style.transform = `translateX(${Math.random() * 4 - 2}px)`;
            setTimeout(() => {
                bubble.style.transform = 'translateX(0)';
            }, 50);
        }
    }, 100);
 });

 // Parallax effect for screens
 document.addEventListener('mousemove', (e) => {
    const screens = document.querySelectorAll('.screen-frame');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    screens.forEach((screen, index) => {
        const speed = (index + 1) * 8;
        const xMove = (x - 0.5) * speed;
        const yMove = (y - 0.5) * speed;
        screen.style.transform = `translate(${xMove}px, ${yMove}px)`;
    });
});

 // Terminal typing effect
const terminalMsg = document.querySelector('.message-bubble.terminal');
if (terminalMsg) {
    const text = terminalMsg.textContent;
    terminalMsg.textContent = '';
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            terminalMsg.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    };
    setTimeout(typeWriter, 2000);
}

// Search button with glitch effect
document.querySelector('.search-btn').addEventListener('click', function() {
    this.textContent = '[ SEARCHING... ]';
    setTimeout(() => {
        this.textContent = '[ ACCESS GRANTED ]';
        setTimeout(() => {
            this.textContent = '[ SEARCH ]';
        }, 1000);
    }, 1000);
});

 // Random screen flicker
setInterval(() => {
    if (Math.random() > 0.97) {
        document.querySelector('.grid-overlay').style.opacity = '0.5';
        setTimeout(() => {
            document.querySelector('.grid-overlay').style.opacity = '1';
        }, 50);
    }
}, 100);

// Update smooth scrolling untuk semua link navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Update active nav link
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        }
    });
});

// Project card interaction
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.boxShadow = '0 0 30px rgba(255, 0, 0, 0.5)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.2)';
    });
});

// Image loading fallback
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="100%" height="100%" fill="%230a0a0a"/><text x="50%" y="50%" font-family="Courier New, monospace" font-size="20" fill="%23ff0000" text-anchor="middle" dominant-baseline="middle">IMAGE NOT FOUND</text></svg>';
        this.alt = 'Image not available';
    });
});

// Add responsive behavior
function handleResponsive() {
    const isMobile = window.innerWidth <= 768;
    const parallaxEffect = document.querySelector('.parallax-effect');
    
    if (isMobile && parallaxEffect) {
        parallaxEffect.style.display = 'none';
    } else if (parallaxEffect) {
        parallaxEffect.style.display = 'block';
    }
}

// Initial check
handleResponsive();

// Listen for resize
window.addEventListener('resize', handleResponsive);

// Profile Section Functionality

// Counter Animation for Stats
function animateCounter() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.floor(current);
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target;
            }
        };
        
        // Start when in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
}

// Animate Skill Bars
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-fill');
    
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    bar.style.width = width + '%';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(bar);
    });
}

// Gallery Filtering
function initGallery() {
    const themeButtons = document.querySelectorAll('.theme-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.querySelector('.gallery-modal');
    const modalImg = modal.querySelector('.modal-img');
    const modalTitle = modal.querySelector('.modal-title');
    const modalDesc = modal.querySelector('.modal-desc');
    const modalTheme = modal.querySelector('.modal-theme');
    const modalClose = modal.querySelector('.modal-close');
    
    // Theme Filter
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
    
    // Gallery Image Click
    galleryItems.forEach(item => {
        const card = item.querySelector('.gallery-card');
        const img = card.querySelector('.gallery-img');
        const title = card.querySelector('h4').textContent;
        const desc = card.querySelector('p').textContent;
        const theme = card.querySelector('.theme-tag').textContent;
        
        card.addEventListener('click', () => {
            modalImg.src = img.src;
            modalImg.alt = img.alt;
            modalTitle.textContent = title;
            modalDesc.textContent = desc;
            modalTheme.textContent = theme;
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close Modal
    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// Initialize Profile Section
function initProfileSection() {
    if (document.querySelector('#profile')) {
        animateCounter();
        animateSkillBars();
        initGallery();
        
        // Add glitch effect to equipment cards
        document.querySelectorAll('.equipment-card').forEach(card => {
            setInterval(() => {
                if (Math.random() > 0.98) {
                    card.style.transform = `translateX(${Math.random() * 4 - 2}px)`;
                    setTimeout(() => {
                        card.style.transform = 'translateX(0)';
                    }, 100);
                }
            }, 500);
        });
    }
}

// Call initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initProfileSection);

// Projects Section - Complete Interactive Playground
// ==================================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all project functionality
    initProjectsPlayground();
    initRealDemos();
    initTerminalTyping();
    initProjectFilters();
    initModalInteractions();
    initCodeViewer();
    initWriteupViewer();
    initAllProjectsButton();
    initKeyboardShortcuts();
    
    console.log('🚀 Projects Playground initialized');
});

// Initialize Projects Playground
function initProjectsPlayground() {
    const projectTiles = document.querySelectorAll('.project-tile');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortButtons = document.querySelectorAll('.sort-btn');
    const searchInput = document.querySelector('.search-input');
    
    let currentFilter = 'all';
    let currentSort = 'newest';
    
    // Filter Projects by Category
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            currentFilter = button.dataset.filter;
            filterAndSortProjects();
            
            // Play filter sound effect (simulated)
            playSoundEffect('filter');
        });
    });
    
    // Sort Projects
    sortButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            sortButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            currentSort = button.dataset.sort;
            filterAndSortProjects();
            
            // Play sort sound effect (simulated)
            playSoundEffect('sort');
        });
    });
    
    // Live Search Functionality
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                filterAndSortProjects();
                // Play search sound effect
                playSoundEffect('search');
            }, 300);
        });
        
        // Add placeholder animation
        const placeholderText = searchInput.getAttribute('placeholder');
        let placeholderIndex = 0;
        
        setInterval(() => {
            if (document.activeElement !== searchInput) {
                const typingPlaceholder = placeholderText.substring(0, placeholderIndex);
                searchInput.setAttribute('placeholder', typingPlaceholder + '█');
                placeholderIndex = (placeholderIndex + 1) % (placeholderText.length + 1);
            }
        }, 100);
    }
    
    // Filter and Sort Logic
    function filterAndSortProjects() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        let visibleProjects = 0;
        
        projectTiles.forEach(tile => {
            const category = tile.dataset.category;
            const name = tile.querySelector('.project-name').textContent.toLowerCase();
            const desc = tile.querySelector('.project-desc').textContent.toLowerCase();
            const hasWriteup = tile.dataset.hasWriteup === 'true';
            
            // Filter by category
            const categoryMatch = currentFilter === 'all' || category === currentFilter;
            
            // Filter by search term
            const searchMatch = !searchTerm || 
                name.includes(searchTerm) || 
                desc.includes(searchTerm) ||
                Array.from(tile.querySelectorAll('.tech')).some(tech => 
                    tech.textContent.toLowerCase().includes(searchTerm)
                );
            
            // Check if tile should be visible
            if (categoryMatch && searchMatch) {
                tile.classList.remove('hidden');
                setTimeout(() => {
                    tile.style.opacity = '1';
                    tile.style.transform = 'translateY(0)';
                }, 50);
                visibleProjects++;
                
                // Highlight search terms
                if (searchTerm) {
                    highlightSearchTerms(tile, searchTerm);
                } else {
                    removeHighlights(tile);
                }
            } else {
                tile.style.opacity = '0';
                tile.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    tile.classList.add('hidden');
                }, 300);
            }
        });
        
        // Sort visible projects
        sortVisibleProjects();
        
        // Update projects counter
        updateProjectsCounter(visibleProjects);
    }
    
    function sortVisibleProjects() {
        const container = document.querySelector('.projects-playground');
        const visibleTiles = Array.from(projectTiles)
            .filter(tile => !tile.classList.contains('hidden'));
        
        if (visibleTiles.length === 0) return;
        
        visibleTiles.sort((a, b) => {
            switch (currentSort) {
                case 'complexity':
                    return parseInt(b.dataset.complexity) - parseInt(a.dataset.complexity);
                case 'fun':
                    return parseInt(b.dataset.fun) - parseInt(a.dataset.fun);
                case 'newest':
                default:
                    // Random shuffle for "newest" to simulate new projects appearing
                    return Math.random() - 0.5;
            }
        });
        
        // Reorder in DOM with animation
        visibleTiles.forEach((tile, index) => {
            setTimeout(() => {
                container.appendChild(tile);
                // Add entrance animation
                tile.style.animation = `tileEntrance 0.5s ease ${index * 0.1}s forwards`;
            }, index * 50);
        });
    }
    
    function highlightSearchTerms(tile, term) {
        const elements = [
            ...tile.querySelectorAll('.project-name, .project-desc, .why-text, .tech')
        ];
        
        elements.forEach(element => {
            const originalText = element.textContent;
            const regex = new RegExp(`(${term})`, 'gi');
            const highlightedText = originalText.replace(regex, '<span class="search-highlight">$1</span>');
            
            if (highlightedText !== originalText) {
                element.innerHTML = highlightedText;
            }
        });
    }
    
    function removeHighlights(tile) {
        const highlights = tile.querySelectorAll('.search-highlight');
        highlights.forEach(highlight => {
            highlight.outerHTML = highlight.textContent;
        });
    }
    
    function updateProjectsCounter(count) {
        const counter = document.querySelector('.projects-counter') || createProjectsCounter();
        counter.textContent = `SHOWING ${count} OF ${projectTiles.length} PROJECTS`;
        counter.style.animation = 'counterPulse 0.5s ease';
        
        setTimeout(() => {
            counter.style.animation = '';
        }, 500);
    }
    
    function createProjectsCounter() {
        const counter = document.createElement('div');
        counter.className = 'projects-counter';
        counter.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(255, 0, 0, 0.2);
            color: #ff0000;
            padding: 10px 20px;
            border-radius: 5px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            border: 1px solid rgba(255, 0, 0, 0.3);
            z-index: 100;
            backdrop-filter: blur(10px);
        `;
        document.body.appendChild(counter);
        return counter;
    }
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes tileEntrance {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes counterPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        .search-highlight {
            background: rgba(255, 0, 0, 0.3);
            color: #ff0000;
            padding: 0 2px;
            border-radius: 2px;
            animation: highlightPulse 1s infinite;
        }
        
        @keyframes highlightPulse {
            0%, 100% { background-color: rgba(255, 0, 0, 0.3); }
            50% { background-color: rgba(255, 0, 0, 0.5); }
        }
    `;
    document.head.appendChild(style);
    
    // Initial filter
    filterAndSortProjects();
}

// Initialize Real Demos
function initRealDemos() {
    // Store demo implementations
    window.demoImplementations = {
        'cyber-city': initCyberCityDemo,
        'neural-viz': initNeuralDemo,
        'cyber-runner': initCyberRunnerDemo,
        'data-dashboard': initDataDashboardDemo,
        'audio-viz': initAudioVisualizerDemo,
        'terminal-quest': initTerminalQuestDemo
    };
    
    // Demo button handlers
    document.querySelectorAll('.demo-btn').forEach(button => {
        button.addEventListener('click', function() {
            const projectId = this.dataset.project;
            openDemoModal(projectId);
        });
    });
}

// Initialize Terminal Typing Effect
function initTerminalTyping() {
    const terminalLines = document.querySelectorAll('.terminal-line');
    if (terminalLines.length === 0) return;
    
    // Store original text and clear for typing effect
    terminalLines.forEach((line, index) => {
        const text = line.textContent;
        line.dataset.original = text;
        
        if (index === terminalLines.length - 1) {
            // Last line is the cursor line
            line.textContent = '$ ';
            line.dataset.remaining = text.substring(2);
        } else {
            line.textContent = '';
            line.dataset.remaining = text;
        }
    });
    
    // Start typing animation
    let currentLine = 0;
    let currentChar = 0;
    
    function typeNextChar() {
        const lines = document.querySelectorAll('.terminal-line');
        if (currentLine >= lines.length) {
            // All lines typed, start blinking cursor
            startBlinkingCursor();
            return;
        }
        
        const line = lines[currentLine];
        const remaining = line.dataset.remaining;
        
        if (currentChar < remaining.length) {
            line.textContent += remaining.charAt(currentChar);
            currentChar++;
            
            // Random typing speed variation
            const speed = 30 + Math.random() * 50;
            setTimeout(typeNextChar, speed);
        } else {
            // Move to next line
            currentLine++;
            currentChar = 0;
            setTimeout(typeNextChar, 500); // Pause between lines
        }
    }
    
    function startBlinkingCursor() {
        const cursorLine = document.querySelector('.terminal-line:last-child');
        setInterval(() => {
            const currentText = cursorLine.textContent;
            if (currentText.endsWith('█')) {
                cursorLine.textContent = currentText.slice(0, -1);
            } else {
                cursorLine.textContent = currentText + '█';
            }
        }, 500);
    }
    
    // Start typing after a short delay
    setTimeout(typeNextChar, 1000);
}

// Initialize Project Filters
function initProjectFilters() {
    // Add visual feedback for filter buttons
    document.querySelectorAll('.filter-btn, .sort-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Add ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 0, 0, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                top: ${y}px;
                left: ${x}px;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add CSS for ripple effect
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .filter-btn, .sort-btn {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(rippleStyle);
}

// Initialize Modal Interactions
function initModalInteractions() {
    const demoModal = document.querySelector('.demo-modal');
    const writeupModal = document.querySelector('.writeup-modal');
    const codeModal = document.querySelector('.code-modal');
    
    if (!demoModal || !writeupModal || !codeModal) return;
    
    // Close buttons
    document.querySelectorAll('.modal-close, .writeup-close, .code-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.demo-modal, .writeup-modal, .code-modal');
            closeModal(modal);
        });
    });
    
    // Close on background click
    [demoModal, writeupModal, codeModal].forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });
    
    // Fullscreen functionality
    const fullscreenBtn = demoModal.querySelector('.fullscreen-btn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }
    
    // Restart functionality
    const restartBtn = demoModal.querySelector('.restart-btn');
    if (restartBtn) {
        restartBtn.addEventListener('click', function() {
            const currentProject = document.querySelector('.demo-btn.active')?.dataset.project;
            if (currentProject) {
                openDemoModal(currentProject);
            }
        });
    }
}

// Initialize Code Viewer
function initCodeViewer() {
    // Code button handlers
    document.querySelectorAll('.code-btn').forEach(button => {
        button.addEventListener('click', function() {
            const projectId = this.dataset.project;
            openCodeModal(projectId);
        });
    });
    
    // Copy code functionality
    document.addEventListener('click', function(e) {
        if (e.target.closest('.copy-btn')) {
            const codeElement = document.querySelector('.code-display code');
            if (codeElement) {
                const code = codeElement.textContent;
                navigator.clipboard.writeText(code).then(() => {
                    const btn = e.target.closest('.copy-btn');
                    const originalText = btn.textContent;
                    btn.textContent = '✓ COPIED!';
                    btn.style.background = 'rgba(0, 255, 0, 0.2)';
                    btn.style.color = '#00ff00';
                    
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.style.background = '';
                        btn.style.color = '';
                    }, 2000);
                });
            }
        }
    });
}

// Initialize Writeup Viewer
function initWriteupViewer() {
    // Writeup button handlers
    document.querySelectorAll('.writeup-btn').forEach(button => {
        button.addEventListener('click', function() {
            const projectId = this.dataset.project;
            openWriteupModal(projectId);
        });
    });
    
    // View code from writeup
    document.addEventListener('click', function(e) {
        if (e.target.closest('.view-code-btn')) {
            const writeupModal = document.querySelector('.writeup-modal.active');
            if (writeupModal) {
                const projectTitle = writeupModal.querySelector('.writeup-project-title').textContent;
                const projectId = projectTitle.toLowerCase().replace(/\s+/g, '-');
                closeModal(writeupModal);
                setTimeout(() => openCodeModal(projectId), 300);
            }
        }
    });
    
    // View demo from writeup
    document.addEventListener('click', function(e) {
        if (e.target.closest('.view-demo-btn')) {
            const writeupModal = document.querySelector('.writeup-modal.active');
            if (writeupModal) {
                const projectTitle = writeupModal.querySelector('.writeup-project-title').textContent;
                const projectId = projectTitle.toLowerCase().replace(/\s+/g, '-');
                closeModal(writeupModal);
                setTimeout(() => openDemoModal(projectId), 300);
            }
        }
    });
}

// Initialize All Projects Button
function initAllProjectsButton() {
    const allProjectsBtn = document.querySelector('.all-projects-btn');
    if (!allProjectsBtn) return;
    
    allProjectsBtn.addEventListener('click', function() {
        // Animate button
        this.style.animation = 'buttonPress 0.3s ease';
        
        // Open GitHub in new tab
        setTimeout(() => {
            window.open('https://github.com/kaishiscd?tab=repositories', '_blank');
        }, 300);
        
        // Reset animation
        setTimeout(() => {
            this.style.animation = '';
        }, 300);
    });
    
    // Add CSS for button animation
    const buttonStyle = document.createElement('style');
    buttonStyle.textContent = `
        @keyframes buttonPress {
            0% { transform: translateY(0) scale(1); }
            50% { transform: translateY(2px) scale(0.98); }
            100% { transform: translateY(0) scale(1); }
        }
    `;
    document.head.appendChild(buttonStyle);
}

// Initialize Keyboard Shortcuts
function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Only handle if not in input field
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        switch(e.key.toLowerCase()) {
            case 'escape':
                // Close any open modal
                const openModal = document.querySelector('.demo-modal.active, .writeup-modal.active, .code-modal.active');
                if (openModal) {
                    closeModal(openModal);
                    e.preventDefault();
                }
                break;
                
            case 'f':
                if (document.querySelector('.demo-modal.active')) {
                    toggleFullscreen();
                    e.preventDefault();
                }
                break;
                
            case 'r':
                if (document.querySelector('.demo-modal.active')) {
                    const restartBtn = document.querySelector('.restart-btn');
                    if (restartBtn) restartBtn.click();
                    e.preventDefault();
                }
                break;
        }
    });
}

// Modal Functions
function openDemoModal(projectId) {
    const modal = document.querySelector('.demo-modal');
    const frame = modal.querySelector('.demo-frame');
    const loading = modal.querySelector('.demo-loading');
    const githubBtn = modal.querySelector('.github-btn');
    
    // Set active project
    document.querySelectorAll('.demo-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.demo-btn[data-project="${projectId}"]`)?.classList.add('active');
    
    // Set GitHub link based on project
    const githubUrls = {
        'cyber-city': 'https://github.com/kaishiscd/cyber-city-sim',
        'neural-viz': 'https://github.com/kaishiscd/neural-visualizer',
        'cyber-runner': 'https://github.com/kaishiscd/cyber-runner',
        'data-dashboard': 'https://github.com/kaishiscd/data-dashboard',
        'audio-viz': 'https://github.com/kaishiscd/audio-reactive-art',
        'terminal-quest': 'https://github.com/kaishiscd/terminal-quest'
    };
    
    if (githubUrls[projectId]) {
        githubBtn.href = githubUrls[projectId];
    }
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Clear previous demo
    frame.innerHTML = '';
    frame.appendChild(loading);
    loading.style.display = 'block';
    
    // Update modal stats
    updateModalStats('CONNECTING...', '--ms', 'LOADING');
    
    // Simulate loading with progress
    simulateLoading(projectId).then(() => {
        // Hide loading
        loading.style.display = 'none';
        
        // Load actual demo
        if (window.demoImplementations[projectId]) {
            window.demoImplementations[projectId](frame);
        } else {
            // Fallback to simulated demo
            loadSimulatedDemo(projectId, frame);
        }
        
        // Update stats
        updateModalStats('ESTABLISHED', '32ms', 'LIVE');
    });
}

function openWriteupModal(projectId) {
    const modal = document.querySelector('.writeup-modal');
    
    // Update writeup content based on project
    updateWriteupContent(projectId);
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function openCodeModal(projectId) {
    const modal = document.querySelector('.code-modal');
    const codeDisplay = modal.querySelector('.code-display code');
    
    // Update code based on project
    updateCodeContent(projectId);
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Initialize syntax highlighting
    highlightSyntax(codeDisplay);
}

function closeModal(modal) {
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Stop any running demos
    if (modal.classList.contains('demo-modal')) {
        stopAllDemos();
    }
}

function toggleFullscreen() {
    const modalContainer = document.querySelector('.modal-container');
    if (!document.fullscreenElement) {
        modalContainer.requestFullscreen().catch(err => {
            console.log(`Fullscreen error: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

// Demo Implementation Functions
function initCyberCityDemo(container) {
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        // Load Three.js dynamically
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.onload = () => createCyberCity(container);
        document.head.appendChild(script);
    } else {
        createCyberCity(container);
    }
    
    function createCyberCity(container) {
        container.innerHTML = `
            <div class="real-demo-frame">
                <div class="canvas-container" id="cyberCityCanvas"></div>
                <div class="demo-controls">
                    <div class="control-group">
                        <button class="control-btn-sm" onclick="rotateCamera(1)">ROTATE ↻</button>
                        <button class="control-btn-sm" onclick="rotateCamera(-1)">ROTATE ↺</button>
                        <button class="control-btn-sm" onclick="toggleParticles()">PARTICLES</button>
                        <button class="control-btn-sm" onclick="resetView()">RESET</button>
                    </div>
                    <div class="demo-stats">
                        FPS: <span id="fpsCounter">60</span> | PARTICLES: <span id="particleCount">10K</span>
                    </div>
                </div>
                <div class="keyboard-hint">
                    PRESS [F] FOR FULLSCREEN | [R] TO RESTART | [ESC] TO EXIT
                </div>
            </div>
        `;
        
        // Simple Three.js scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        
        const canvasContainer = container.querySelector('#cyberCityCanvas');
        canvasContainer.appendChild(renderer.domElement);
        
        // Add basic lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xff0000, 0.8);
        directionalLight.position.set(5, 10, 7);
        scene.add(directionalLight);
        
        // Create city geometry
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0xff0000,
            emissive: 0xff0000,
            emissiveIntensity: 0.3
        });
        
        // Create city grid
        const buildings = [];
        for (let x = -10; x <= 10; x += 2) {
            for (let z = -10; z <= 10; z += 2) {
                if (Math.random() > 0.4) {
                    const building = new THREE.Mesh(geometry, material);
                    building.position.set(x, 0, z);
                    building.scale.y = 2 + Math.random() * 3;
                    scene.add(building);
                    buildings.push(building);
                }
            }
        }
        
        // Create particles
        const particleCount = 1000;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 40;
            positions[i + 1] = Math.random() * 30;
            positions[i + 2] = (Math.random() - 0.5) * 40;
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.1,
            color: 0xff0000,
            transparent: true,
            opacity: 0.6
        });
        
        const particleSystem = new THREE.Points(particles, particleMaterial);
        scene.add(particleSystem);
        
        // Position camera
        camera.position.set(20, 15, 20);
        camera.lookAt(0, 0, 0);
        
        // Animation variables
        let rotationSpeed = 0.005;
        let particlesEnabled = true;
        let lastTime = 0;
        let frameCount = 0;
        
        // Animation loop
        function animate(time) {
            frameCount++;
            if (time - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (time - lastTime));
                document.getElementById('fpsCounter').textContent = fps;
                frameCount = 0;
                lastTime = time;
            }
            
            requestAnimationFrame(animate);
            
            // Rotate buildings
            buildings.forEach(building => {
                building.rotation.y += rotationSpeed;
            });
            
            // Animate particles
            if (particlesEnabled) {
                const positions = particleSystem.geometry.attributes.position.array;
                for (let i = 1; i < positions.length; i += 3) {
                    positions[i] += 0.05;
                    if (positions[i] > 30) positions[i] = 0;
                }
                particleSystem.geometry.attributes.position.needsUpdate = true;
            }
            
            renderer.render(scene, camera);
        }
        
        animate(0);
        
        // Control functions
        window.rotateCamera = (direction) => {
            rotationSpeed = direction * 0.005;
        };
        
        window.toggleParticles = () => {
            particlesEnabled = !particlesEnabled;
            particleSystem.visible = particlesEnabled;
            document.getElementById('particleCount').textContent = particlesEnabled ? '10K' : '0';
        };
        
        window.resetView = () => {
            rotationSpeed = 0.005;
            particlesEnabled = true;
            particleSystem.visible = true;
            camera.position.set(20, 15, 20);
            camera.lookAt(0, 0, 0);
        };
        
        // Handle resize
        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    }
}

function initNeuralDemo(container) {
    container.innerHTML = `
        <div class="real-demo-frame">
            <canvas id="neuralCanvas" width="800" height="500"></canvas>
            <div class="demo-controls">
                <div class="control-group">
                    <button class="control-btn-sm" onclick="startTraining()">START TRAINING</button>
                    <button class="control-btn-sm" onclick="pauseTraining()">PAUSE</button>
                    <button class="control-btn-sm" onclick="resetTraining()">RESET</button>
                </div>
                <div class="demo-stats">
                    EPOCH: <span id="epochCounter">0</span> | 
                    LOSS: <span id="lossCounter">0.000</span> | 
                    ACCURACY: <span id="accuracyCounter">0%</span>
                </div>
            </div>
        </div>
    `;
    
    const canvas = container.querySelector('#neuralCanvas');
    const ctx = canvas.getContext('2d');
    
    // Neural network visualization
    const layers = [4, 6, 6, 4];
    const neurons = [];
    const connections = [];
    
    // Initialize neurons
    layers.forEach((layerSize, layerIndex) => {
        const layerNeurons = [];
        for (let i = 0; i < layerSize; i++) {
            const x = (layerIndex + 1) * (canvas.width / (layers.length + 1));
            const y = (i + 1) * (canvas.height / (layerSize + 1));
            layerNeurons.push({ x, y, activation: 0 });
        }
        neurons.push(layerNeurons);
    });
    
    // Create connections
    for (let l = 0; l < layers.length - 1; l++) {
        for (let i = 0; i < neurons[l].length; i++) {
            for (let j = 0; j < neurons[l + 1].length; j++) {
                connections.push({
                    from: neurons[l][i],
                    to: neurons[l + 1][j],
                    weight: Math.random() * 2 - 1,
                    active: false
                });
            }
        }
    }
    
    // Drawing functions
    function drawNetwork() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw connections
        connections.forEach(conn => {
            ctx.beginPath();
            ctx.moveTo(conn.from.x, conn.from.y);
            ctx.lineTo(conn.to.x, conn.to.y);
            ctx.strokeStyle = conn.active ? 
                `rgba(0, 255, 0, ${0.3 + Math.abs(conn.weight) * 0.7})` : 
                'rgba(0, 50, 0, 0.1)';
            ctx.lineWidth = Math.abs(conn.weight) * 3;
            ctx.stroke();
        });
        
        // Draw neurons
        neurons.flat().forEach(neuron => {
            ctx.beginPath();
            ctx.arc(neuron.x, neuron.y, 10, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 255, 0, ${0.3 + neuron.activation * 0.7})`;
            ctx.fill();
            ctx.strokeStyle = '#00ff00';
            ctx.stroke();
        });
    }
    
    // Training simulation
    let trainingActive = false;
    let epoch = 0;
    let trainingInterval;
    
    function simulateTraining() {
        if (!trainingActive) return;
        
        epoch++;
        
        // Update neurons
        neurons.forEach(layer => {
            layer.forEach(neuron => {
                neuron.activation = Math.sin(Date.now() / 1000 + neuron.x * 0.01) * 0.5 + 0.5;
            });
        });
        
        // Update connections
        connections.forEach(conn => {
            conn.active = Math.random() > 0.5;
            conn.weight += (Math.random() - 0.5) * 0.1;
            conn.weight = Math.max(-1, Math.min(1, conn.weight));
        });
        
        // Update counters
        document.getElementById('epochCounter').textContent = epoch;
        document.getElementById('lossCounter').textContent = (Math.random() * 0.1).toFixed(3);
        document.getElementById('accuracyCounter').textContent = 
            `${Math.min(100, Math.floor(epoch / 10) * 10)}%`;
        
        drawNetwork();
    }
    
    // Control functions
    window.startTraining = () => {
        if (!trainingActive) {
            trainingActive = true;
            trainingInterval = setInterval(simulateTraining, 100);
        }
    };
    
    window.pauseTraining = () => {
        trainingActive = false;
        if (trainingInterval) {
            clearInterval(trainingInterval);
            trainingInterval = null;
        }
    };
    
    window.resetTraining = () => {
        pauseTraining();
        epoch = 0;
        neurons.flat().forEach(neuron => neuron.activation = 0);
        connections.forEach(conn => {
            conn.weight = Math.random() * 2 - 1;
            conn.active = false;
        });
        
        document.getElementById('epochCounter').textContent = '0';
        document.getElementById('lossCounter').textContent = '0.000';
        document.getElementById('accuracyCounter').textContent = '0%';
        
        drawNetwork();
    };
    
    // Initial draw
    drawNetwork();
}

function initCyberRunnerDemo(container) {
    container.innerHTML = `
        <div class="game-container">
            <canvas id="gameCanvas" width="800" height="500"></canvas>
            <div class="demo-controls">
                <div class="control-group">
                    <button class="control-btn-sm" onclick="startGame()">START GAME</button>
                    <button class="control-btn-sm" onclick="pauseGame()">PAUSE</button>
                    <button class="control-btn-sm" onclick="resetGame()">RESET</button>
                </div>
                <div class="demo-stats">
                    SCORE: <span id="gameScore">0</span> | 
                    SPEED: <span id="gameSpeed">1x</span> | 
                    LIVES: <span id="gameLives">3</span>
                </div>
            </div>
            <div class="keyboard-hint">
                USE ARROW KEYS TO MOVE | SPACE TO JUMP
            </div>
        </div>
    `;
    
    const canvas = container.querySelector('#gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // Game state
    let gameRunning = false;
    let score = 0;
    let speed = 1;
    let lives = 3;
    
    // Player
    const player = {
        x: 100,
        y: canvas.height - 100,
        width: 30,
        height: 50,
        velocityY: 0,
        jumping: false,
        color: '#ff0000'
    };
    
    // Obstacles
    const obstacles = [];
    const coins = [];
    
    // Drawing functions
    function drawPlayer() {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
        
        // Player details
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(player.x + 10, player.y + 10, 10, 10); // Eye
    }
    
    function drawObstacles() {
        ctx.fillStyle = '#ff4444';
        obstacles.forEach(obs => {
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        });
    }
    
    function drawCoins() {
        ctx.fillStyle = '#ffdd00';
        coins.forEach(coin => {
            ctx.beginPath();
            ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    
    function drawBackground() {
        // Road
        ctx.fillStyle = '#222222';
        ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
        
        // Road lines
        ctx.fillStyle = '#ff6666';
        for (let i = 0; i < canvas.width; i += 60) {
            const offset = (Date.now() / 20) % 60;
            ctx.fillRect(i - offset, canvas.height - 25, 30, 5);
        }
    }
    
    // Game loop
    function gameLoop() {
        if (!gameRunning) return;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update game state
        updateGame();
        
        // Draw everything
        drawBackground();
        drawPlayer();
        drawObstacles();
        drawCoins();
        
        // Continue loop
        requestAnimationFrame(gameLoop);
    }
    
    function updateGame() {
        // Update player
        player.y += player.velocityY;
        player.velocityY += 0.5; // Gravity
        
        // Ground collision
        if (player.y > canvas.height - player.height - 50) {
            player.y = canvas.height - player.height - 50;
            player.jumping = false;
            player.velocityY = 0;
        }
        
        // Move obstacles
        obstacles.forEach((obs, index) => {
            obs.x -= 5 * speed;
            
            // Remove off-screen obstacles
            if (obs.x < -obs.width) {
                obstacles.splice(index, 1);
                score += 10;
            }
            
            // Collision detection
            if (player.x < obs.x + obs.width &&
                player.x + player.width > obs.x &&
                player.y < obs.y + obs.height &&
                player.y + player.height > obs.y) {
                // Collision
                lives--;
                obstacles.splice(index, 1);
                if (lives <= 0) {
                    endGame();
                }
            }
        });
        
        // Move coins
        coins.forEach((coin, index) => {
            coin.x -= 5 * speed;
            
            // Remove off-screen coins
            if (coin.x < -coin.radius) {
                coins.splice(index, 1);
            }
            
            // Coin collection
            const dx = player.x + player.width/2 - coin.x;
            const dy = player.y + player.height/2 - coin.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < player.width/2 + coin.radius) {
                coins.splice(index, 1);
                score += 50;
            }
        });
        
        // Generate new obstacles and coins
        if (Math.random() < 0.02) {
            obstacles.push({
                x: canvas.width,
                y: canvas.height - 100,
                width: 20,
                height: 40
            });
        }
        
        if (Math.random() < 0.01) {
            coins.push({
                x: canvas.width,
                y: Math.random() * (canvas.height - 150) + 50,
                radius: 10
            });
        }
        
        // Increase speed gradually
        speed = 1 + Math.floor(score / 500) * 0.5;
        
        // Update UI
        document.getElementById('gameScore').textContent = score;
        document.getElementById('gameSpeed').textContent = speed.toFixed(1) + 'x';
        document.getElementById('gameLives').textContent = lives;
    }
    
    // Control functions
    window.startGame = () => {
        if (!gameRunning) {
            gameRunning = true;
            gameLoop();
        }
    };
    
    window.pauseGame = () => {
        gameRunning = !gameRunning;
        if (gameRunning) {
            gameLoop();
        }
    };
    
    window.resetGame = () => {
        gameRunning = false;
        score = 0;
        speed = 1;
        lives = 3;
        obstacles.length = 0;
        coins.length = 0;
        
        player.x = 100;
        player.y = canvas.height - 100;
        player.velocityY = 0;
        player.jumping = false;
        
        document.getElementById('gameScore').textContent = '0';
        document.getElementById('gameSpeed').textContent = '1x';
        document.getElementById('gameLives').textContent = '3';
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground();
        drawPlayer();
    };
    
    function endGame() {
        gameRunning = false;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#ff0000';
        ctx.font = '48px "Courier New"';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2 - 50);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '24px "Courier New"';
        ctx.fillText(`FINAL SCORE: ${score}`, canvas.width/2, canvas.height/2);
        ctx.fillText('CLICK RESET TO PLAY AGAIN', canvas.width/2, canvas.height/2 + 50);
    }
    
    // Keyboard controls
    const keys = {};
    window.addEventListener('keydown', (e) => {
        keys[e.key] = true;
        
        if (gameRunning) {
            if (e.key === 'ArrowUp' || e.key === ' ') {
                if (!player.jumping) {
                    player.velocityY = -15;
                    player.jumping = true;
                }
            }
        }
    });
    
    window.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });
    
    // Initial draw
    drawBackground();
    drawPlayer();
}

function initDataDashboardDemo(container) {
    container.innerHTML = `
        <div class="real-demo-frame">
            <canvas id="dashboardCanvas" width="800" height="500"></canvas>
            <div class="demo-controls">
                <div class="control-group">
                    <button class="control-btn-sm" onclick="toggleDataStream()">TOGGLE STREAM</button>
                    <button class="control-btn-sm" onclick="changeChartType()">CHART TYPE</button>
                    <button class="control-btn-sm" onclick="resetDashboard()">RESET</button>
                </div>
                <div class="demo-stats">
                    DATA POINTS: <span id="dataPoints">0</span> | 
                    UPTIME: <span id="uptime">00:00</span> | 
                    RATE: <span id="dataRate">0/s</span>
                </div>
            </div>
        </div>
    `;
    
    const canvas = container.querySelector('#dashboardCanvas');
    const ctx = canvas.getContext('2d');
    
    // Dashboard data
    let dataStreaming = false;
    let chartType = 'line'; // 'line', 'bar', 'scatter'
    let dataPoints = [];
    let startTime = Date.now();
    let dataCount = 0;
    
    // Initialize with some data
    for (let i = 0; i < 50; i++) {
        dataPoints.push({
            x: i,
            y: 50 + Math.sin(i * 0.3) * 30 + Math.random() * 20
        });
    }
    
    // Drawing functions
    function drawDashboard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid
        drawGrid();
        
        // Draw chart based on type
        switch(chartType) {
            case 'line':
                drawLineChart();
                break;
            case 'bar':
                drawBarChart();
                break;
            case 'scatter':
                drawScatterChart();
                break;
        }
        
        // Draw title
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px "Courier New"';
        ctx.fillText('REAL-TIME DATA DASHBOARD', 20, 30);
        
        // Draw legend
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(20, canvas.height - 40, 15, 15);
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px "Courier New"';
        ctx.fillText('Live Data Stream', 45, canvas.height - 30);
    }
    
    function drawGrid() {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        // Vertical lines
        for (let x = 0; x <= canvas.width; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x, 50);
            ctx.lineTo(x, canvas.height - 60);
            ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 50; y <= canvas.height - 60; y += 50) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }
    
    function drawLineChart() {
        if (dataPoints.length < 2) return;
        
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const firstPoint = dataPoints[0];
        const xScale = canvas.width / 100;
        const yScale = (canvas.height - 110) / 100;
        
        ctx.moveTo(firstPoint.x * xScale, canvas.height - 60 - firstPoint.y * yScale);
        
        for (let i = 1; i < dataPoints.length; i++) {
            const point = dataPoints[i];
            ctx.lineTo(
                point.x * xScale,
                canvas.height - 60 - point.y * yScale
            );
        }
        
        ctx.stroke();
        
        // Draw data points
        ctx.fillStyle = '#00ff00';
        dataPoints.forEach(point => {
            ctx.beginPath();
            ctx.arc(
                point.x * xScale,
                canvas.height - 60 - point.y * yScale,
                3, 0, Math.PI * 2
            );
            ctx.fill();
        });
    }
    
    function drawBarChart() {
        const barWidth = canvas.width / dataPoints.length;
        const maxValue = Math.max(...dataPoints.map(p => p.y));
        const scale = (canvas.height - 110) / maxValue;
        
        dataPoints.forEach((point, i) => {
            const height = point.y * scale;
            const x = i * barWidth;
            const y = canvas.height - 60 - height;
            
            // Create gradient for bars
            const gradient = ctx.createLinearGradient(0, y, 0, y + height);
            gradient.addColorStop(0, '#ff0000');
            gradient.addColorStop(1, '#ff4444');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x + 2, y, barWidth - 4, height);
        });
    }
    
    function drawScatterChart() {
        const xScale = canvas.width / 100;
        const yScale = (canvas.height - 110) / 100;
        
        dataPoints.forEach(point => {
            // Color based on value
            const intensity = point.y / 100;
            const red = Math.floor(255 * intensity);
            const green = Math.floor(255 * (1 - intensity));
            
            ctx.fillStyle = `rgb(${red}, ${green}, 0)`;
            ctx.beginPath();
            ctx.arc(
                point.x * xScale,
                canvas.height - 60 - point.y * yScale,
                5, 0, Math.PI * 2
            );
            ctx.fill();
        });
    }
    
    // Data streaming simulation
    let streamInterval;
    
    function simulateDataStream() {
        if (!dataStreaming) return;
        
        // Add new data point
        const lastX = dataPoints.length > 0 ? dataPoints[dataPoints.length - 1].x : 0;
        dataPoints.push({
            x: lastX + 1,
            y: 50 + Math.sin(lastX * 0.1) * 30 + Math.random() * 20
        });
        
        // Keep only last 100 points
        if (dataPoints.length > 100) {
            dataPoints.shift();
        }
        
        dataCount++;
        
        // Update UI
        document.getElementById('dataPoints').textContent = dataCount;
        
        const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(uptimeSeconds / 60);
        const seconds = uptimeSeconds % 60;
        document.getElementById('uptime').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        document.getElementById('dataRate').textContent = 
            `${Math.round(dataCount / (uptimeSeconds || 1))}/s`;
        
        // Redraw
        drawDashboard();
    }
    
    // Control functions
    window.toggleDataStream = () => {
        dataStreaming = !dataStreaming;
        
        if (dataStreaming) {
            streamInterval = setInterval(simulateDataStream, 500);
        } else {
            clearInterval(streamInterval);
        }
    };
    
    window.changeChartType = () => {
        const types = ['line', 'bar', 'scatter'];
        const currentIndex = types.indexOf(chartType);
        chartType = types[(currentIndex + 1) % types.length];
        drawDashboard();
    };
    
    window.resetDashboard = () => {
        dataStreaming = false;
        clearInterval(streamInterval);
        
        dataPoints = [];
        dataCount = 0;
        startTime = Date.now();
        
        // Initialize with fresh data
        for (let i = 0; i < 50; i++) {
            dataPoints.push({
                x: i,
                y: 50 + Math.sin(i * 0.3) * 30 + Math.random() * 20
            });
        }
        
        document.getElementById('dataPoints').textContent = '0';
        document.getElementById('uptime').textContent = '00:00';
        document.getElementById('dataRate').textContent = '0/s';
        
        drawDashboard();
    };
    
    // Initial draw
    drawDashboard();
    
    // Start data stream
    setTimeout(() => {
        dataStreaming = true;
        streamInterval = setInterval(simulateDataStream, 500);
    }, 1000);
}

function initAudioVisualizerDemo(container) {
    container.innerHTML = `
        <div class="real-demo-frame">
            <canvas id="audioCanvas" width="800" height="500"></canvas>
            <div class="demo-controls">
                <div class="control-group">
                    <button class="control-btn-sm" onclick="startAudio()">START AUDIO</button>
                    <button class="control-btn-sm" onclick="stopAudio()">STOP</button>
                    <button class="control-btn-sm" onclick="changeVisualization()">CHANGE VIS</button>
                </div>
                <div class="demo-stats">
                    FREQUENCY: <span id="frequency">0Hz</span> | 
                    AMPLITUDE: <span id="amplitude">0%</span> | 
                    VISUALIZATION: <span id="visType">WAVEFORM</span>
                </div>
            </div>
            <div class="keyboard-hint">
                PRESS SPACE TO TOGGLE AUDIO | UP/DOWN TO CHANGE FREQUENCY
            </div>
        </div>
    `;
    
    const canvas = container.querySelector('#audioCanvas');
    const ctx = canvas.getContext('2d');
    
    // Audio visualization state
    let audioPlaying = false;
    let visualizationType = 'waveform'; // 'waveform', 'frequency', 'particles'
    let audioContext;
    let analyser;
    let oscillator;
    
    // Visualization data
    let frequency = 440; // A4 note
    let amplitude = 0.5;
    
    // Drawing functions
    function drawVisualization() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#000000');
        gradient.addColorStop(1, '#1a0505');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw visualization based on type
        switch(visualizationType) {
            case 'waveform':
                drawWaveform();
                break;
            case 'frequency':
                drawFrequencyBars();
                break;
            case 'particles':
                drawParticles();
                break;
        }
        
        // Draw info
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px "Courier New"';
        ctx.fillText(`FREQUENCY: ${frequency}Hz`, 20, 30);
        ctx.fillText(`AMPLITUDE: ${Math.round(amplitude * 100)}%`, 20, 55);
        ctx.fillText(`VISUALIZATION: ${visualizationType.toUpperCase()}`, 20, 80);
    }
    
    function drawWaveform() {
        const centerY = canvas.height / 2;
        const amplitudeHeight = amplitude * 100;
        
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        for (let x = 0; x < canvas.width; x++) {
            const t = (x / canvas.width) * Math.PI * 8;
            const y = centerY + Math.sin(t * frequency / 100) * amplitudeHeight;
            
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
        
        // Add glow effect
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 20;
        ctx.stroke();
        ctx.shadowBlur = 0;
    }
    
    function drawFrequencyBars() {
        const barCount = 64;
        const barWidth = canvas.width / barCount;
        
        for (let i = 0; i < barCount; i++) {
            const x = i * barWidth;
            const barHeight = (Math.sin((i / barCount) * Math.PI * 4 + Date.now() / 1000) * 0.5 + 0.5) * 
                            amplitude * canvas.height * 0.8;
            
            // Create gradient for each bar
            const gradient = ctx.createLinearGradient(x, canvas.height - barHeight, x, canvas.height);
            gradient.addColorStop(0, '#ff0000');
            gradient.addColorStop(1, '#ff4444');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x + 1, canvas.height - barHeight, barWidth - 2, barHeight);
        }
    }
    
    function drawParticles() {
        const particleCount = 100;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const distance = (Math.sin(angle * 3 + Date.now() / 1000) * 0.5 + 0.5) * 150;
            const size = (Math.sin(angle * 5 + Date.now() / 500) * 0.5 + 0.5) * 10;
            
            const x = canvas.width / 2 + Math.cos(angle) * distance;
            const y = canvas.height / 2 + Math.sin(angle) * distance;
            
            // Color based on position
            const hue = (angle * 180 / Math.PI + Date.now() / 20) % 360;
            ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Audio functions
    function initAudio() {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            oscillator = audioContext.createOscillator();
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            oscillator.connect(analyser);
            analyser.connect(audioContext.destination);
            
            // Start oscillator but can be muted
            oscillator.start();
            oscillator.connect(audioContext.destination);
            
            // Update UI
            document.getElementById('frequency').textContent = `${frequency}Hz`;
            document.getElementById('amplitude').textContent = `${Math.round(amplitude * 100)}%`;
            document.getElementById('visType').textContent = visualizationType.toUpperCase();
            
            return true;
        } catch (error) {
            console.error('Audio initialization failed:', error);
            return false;
        }
    }
    
    // Control functions
    window.startAudio = () => {
        if (!audioPlaying) {
            if (initAudio()) {
                audioPlaying = true;
                updateAudio();
            }
        }
    };
    
    window.stopAudio = () => {
        if (audioPlaying && audioContext) {
            audioContext.close();
            audioPlaying = false;
            amplitude = 0;
            updateAudio();
        }
    };
    
    window.changeVisualization = () => {
        const types = ['waveform', 'frequency', 'particles'];
        const currentIndex = types.indexOf(visualizationType);
        visualizationType = types[(currentIndex + 1) % types.length];
        document.getElementById('visType').textContent = visualizationType.toUpperCase();
        drawVisualization();
    };
    
    function updateAudio() {
        if (audioPlaying && oscillator) {
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            
            // Update UI
            document.getElementById('frequency').textContent = `${frequency}Hz`;
            document.getElementById('amplitude').textContent = `${Math.round(amplitude * 100)}%`;
        }
        
        drawVisualization();
        
        // Continue animation
        if (audioPlaying || visualizationType === 'particles') {
            requestAnimationFrame(updateAudio);
        }
    }
    
    // Keyboard controls for audio
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            if (audioPlaying) {
                window.stopAudio();
            } else {
                window.startAudio();
            }
        } else if (e.code === 'ArrowUp') {
            frequency = Math.min(2000, frequency + 10);
            updateAudio();
        } else if (e.code === 'ArrowDown') {
            frequency = Math.max(20, frequency - 10);
            updateAudio();
        }
    });
    
    // Initial draw
    drawVisualization();
    
    // Start with audio visualization (without sound)
    updateAudio();
}

function initTerminalQuestDemo(container) {
    container.innerHTML = `
        <div class="real-demo-frame">
            <div class="terminal-output" id="terminalOutput"></div>
            <div class="demo-controls">
                <div class="control-group">
                    <input type="text" id="terminalInput" placeholder="Type a command...">
                    <button class="control-btn-sm" onclick="sendCommand()">SEND</button>
                    <button class="control-btn-sm" onclick="clearTerminal()">CLEAR</button>
                </div>
                <div class="demo-stats">
                    LOCATION: <span id="gameLocation">ENTRANCE</span> | 
                    HEALTH: <span id="gameHealth">100</span> | 
                    SCORE: <span id="terminalScore">0</span>
                </div>
            </div>
            <div class="keyboard-hint">
                TYPE COMMANDS LIKE: look, go north, take item, use key
            </div>
        </div>
    `;
    
    const terminalOutput = container.querySelector('#terminalOutput');
    const terminalInput = container.querySelector('#terminalInput');
    
    // Game state
    let gameState = {
        location: 'entrance',
        health: 100,
        score: 0,
        inventory: [],
        visited: ['entrance']
    };
    
    // Game world
    const locations = {
        entrance: {
            name: 'Ancient Entrance',
            description: 'You stand before a massive stone door covered in glowing runes. The air hums with energy.',
            exits: ['hallway'],
            items: ['glowing_rune']
        },
        hallway: {
            name: 'Dark Hallway',
            description: 'A long hallway stretches before you. Strange symbols flicker on the walls.',
            exits: ['entrance', 'chamber'],
            items: ['ancient_torch']
        },
        chamber: {
            name: 'Central Chamber',
            description: 'A circular room with a pedestal in the center. Three doors lead in different directions.',
            exits: ['hallway', 'library', 'treasury', 'dungeon'],
            items: ['mysterious_key']
        },
        library: {
            name: 'Forgotten Library',
            description: 'Dusty scrolls and ancient tomes line the shelves. Something moves in the shadows.',
            exits: ['chamber'],
            items: ['spell_scroll'],
            enemy: 'shadow_creature'
        },
        treasury: {
            name: 'Hidden Treasury',
            description: 'Gold coins and jewels glitter in the dim light. A chest sits in the corner.',
            exits: ['chamber'],
            items: ['gold_coins', 'crystal'],
            locked: true
        },
        dungeon: {
            name: 'Dark Dungeon',
            description: 'Chains hang from the walls. The air is cold and damp.',
            exits: ['chamber'],
            items: ['rusty_sword'],
            enemy: 'dungeon_guard'
        }
    };
    
    // Items
    const items = {
        glowing_rune: {
            name: 'Glowing Rune',
            description: 'A stone tablet with pulsating energy.',
            usable: true
        },
        ancient_torch: {
            name: 'Ancient Torch',
            description: 'It burns with an eternal flame.',
            usable: true
        },
        mysterious_key: {
            name: 'Mysterious Key',
            description: 'Ornate key that seems to glow.',
            usable: true
        },
        spell_scroll: {
            name: 'Spell Scroll',
            description: 'Ancient magic words are written here.',
            usable: true
        },
        gold_coins: {
            name: 'Gold Coins',
            description: 'A pouch of ancient currency.',
            usable: false
        },
        crystal: {
            name: 'Mystic Crystal',
            description: 'It hums with magical energy.',
            usable: true
        },
        rusty_sword: {
            name: 'Rusty Sword',
            description: 'Old but still sharp.',
            usable: true
        }
    };
    
    // Enemies
    const enemies = {
        shadow_creature: {
            name: 'Shadow Creature',
            health: 30,
            damage: 10,
            description: 'A formless being of darkness.'
        },
        dungeon_guard: {
            name: 'Dungeon Guard',
            health: 50,
            damage: 15,
            description: 'A skeletal warrior wielding a massive axe.'
        }
    };
    
    // Initialize terminal
    function initTerminal() {
        printToTerminal('<span class="command">$</span> Welcome to TERMINAL QUEST');
        printToTerminal('<span class="command">$</span> Type <span class="command">help</span> for commands');
        printToTerminal('');
        updateLocation();
    }
    
    function printToTerminal(text, className = 'output') {
        const line = document.createElement('div');
        line.className = className;
        line.innerHTML = text;
        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
    
    function updateLocation() {
        const location = locations[gameState.location];
        
        printToTerminal(`<span class="command">></span> You are in: <span class="success">${location.name}</span>`);
        printToTerminal(`<span class="output">${location.description}</span>`);
        
        // Show exits
        if (location.exits.length > 0) {
            printToTerminal(`<span class="command">Exits:</span> ${location.exits.join(', ')}`);
        }
        
        // Show items
        if (location.items && location.items.length > 0) {
            const itemNames = location.items.map(itemId => items[itemId]?.name || itemId);
            printToTerminal(`<span class="command">Items here:</span> ${itemNames.join(', ')}`);
        }
        
        // Check for enemy
        if (location.enemy) {
            const enemy = enemies[location.enemy];
            printToTerminal(`<span class="error">⚠️  ${enemy.name} blocks your path!</span>`);
        }
        
        // Check if locked
        if (location.locked) {
            printToTerminal(`<span class="error">The door is locked. You need a key.</span>`);
        }
        
        updateStats();
    }
    
    function updateStats() {
        document.getElementById('gameLocation').textContent = 
            locations[gameState.location].name.toUpperCase();
        document.getElementById('gameHealth').textContent = gameState.health;
        document.getElementById('terminalScore').textContent = gameState.score;
    }
    
    // Command processing
    function processCommand(command) {
        const parts = command.toLowerCase().split(' ');
        const action = parts[0];
        const target = parts.slice(1).join(' ');
        
        printToTerminal(`<span class="command">$</span> ${command}`);
        
        switch(action) {
            case 'help':
                showHelp();
                break;
            case 'look':
                updateLocation();
                break;
            case 'go':
            case 'move':
                moveTo(target);
                break;
            case 'take':
            case 'get':
                takeItem(target);
                break;
            case 'inventory':
            case 'inv':
                showInventory();
                break;
            case 'use':
                useItem(target);
                break;
            case 'attack':
                attackEnemy(target);
                break;
            case 'clear':
                clearTerminal();
                break;
            case 'restart':
                restartGame();
                break;
            default:
                printToTerminal(`<span class="error">Unknown command: ${action}</span>`);
                printToTerminal('<span class="output">Try: look, go [direction], take [item], inventory, use [item], attack</span>');
        }
    }
    
    function showHelp() {
        printToTerminal('<span class="command">Available Commands:</span>');
        printToTerminal('  <span class="success">look</span> - Examine current location');
        printToTerminal('  <span class="success">go [direction]</span> - Move to a new location');
        printToTerminal('  <span class="success">take [item]</span> - Pick up an item');
        printToTerminal('  <span class="success">inventory</span> - Show your items');
        printToTerminal('  <span class="success">use [item]</span> - Use an item');
        printToTerminal('  <span class="success">attack</span> - Attack an enemy');
        printToTerminal('  <span class="success">clear</span> - Clear terminal');
        printToTerminal('  <span class="success">restart</span> - Start new game');
    }
    
    function moveTo(direction) {
        const location = locations[gameState.location];
        const exit = location.exits.find(exit => 
            exit.includes(direction) || direction.includes(exit)
        );
        
        if (!exit) {
            printToTerminal(`<span class="error">You cannot go ${direction} from here.</span>`);
            return;
        }
        
        const targetLocation = locations[exit];
        
        // Check if locked
        if (targetLocation.locked) {
            const hasKey = gameState.inventory.includes('mysterious_key');
            if (hasKey) {
                printToTerminal('<span class="success">You use the Mysterious Key to unlock the door.</span>');
                targetLocation.locked = false;
            } else {
                printToTerminal('<span class="error">The door is locked. You need a key.</span>');
                return;
            }
        }
        
        // Check for enemy
        if (targetLocation.enemy) {
            printToTerminal(`<span class="error">${enemies[targetLocation.enemy].name} blocks your path!</span>`);
            printToTerminal('<span class="output">You must defeat it first with the <span class="command">attack</span> command.</span>');
            return;
        }
        
        gameState.location = exit;
        
        if (!gameState.visited.includes(exit)) {
            gameState.visited.push(exit);
            gameState.score += 50;
        }
        
        printToTerminal(`<span class="success">You move to ${targetLocation.name}.</span>`);
        updateLocation();
    }
    
    function takeItem(itemName) {
        const location = locations[gameState.location];
        
        if (!location.items || location.items.length === 0) {
            printToTerminal('<span class="error">There are no items here.</span>');
            return;
        }
        
        const itemId = location.items.find(id => 
            items[id]?.name.toLowerCase().includes(itemName.toLowerCase()) ||
            id.includes(itemName.toLowerCase())
        );
        
        if (!itemId) {
            printToTerminal(`<span class="error">There is no "${itemName}" here.</span>`);
            return;
        }
        
        // Remove from location
        location.items = location.items.filter(id => id !== itemId);
        
        // Add to inventory
        gameState.inventory.push(itemId);
        gameState.score += 25;
        
        printToTerminal(`<span class="success">You take the ${items[itemId].name}.</span>`);
        updateStats();
    }
    
    function showInventory() {
        if (gameState.inventory.length === 0) {
            printToTerminal('<span class="output">Your inventory is empty.</span>');
            return;
        }
        
        printToTerminal('<span class="command">Your Inventory:</span>');
        gameState.inventory.forEach(itemId => {
            const item = items[itemId];
            if (item) {
                printToTerminal(`  <span class="success">${item.name}</span> - ${item.description}`);
            }
        });
    }
    
    function useItem(itemName) {
        const itemId = gameState.inventory.find(id => 
            items[id]?.name.toLowerCase().includes(itemName.toLowerCase()) ||
            id.includes(itemName.toLowerCase())
        );
        
        if (!itemId) {
            printToTerminal(`<span class="error">You don't have "${itemName}".</span>`);
            return;
        }
        
        const item = items[itemId];
        
        if (!item.usable) {
            printToTerminal(`<span class="error">You cannot use the ${item.name}.</span>`);
            return;
        }
        
        // Item effects
        switch(itemId) {
            case 'ancient_torch':
                printToTerminal('<span class="success">The torch illuminates the area. You can see hidden passages.</span>');
                // Reveal hidden exits
                const location = locations[gameState.location];
                if (!location.revealed) {
                    location.revealed = true;
                    location.exits.push('secret_room');
                    printToTerminal('<span class="success">You discover a secret passage!</span>');
                }
                break;
            case 'glowing_rune':
                printToTerminal('<span class="success">The rune pulses with energy. You feel stronger.</span>');
                gameState.health = Math.min(100, gameState.health + 20);
                break;
            case 'spell_scroll':
                printToTerminal('<span class="success">You read the ancient words. Magic energy surrounds you.</span>');
                // Remove enemy if present
                const currentLocation = locations[gameState.location];
                if (currentLocation.enemy) {
                    printToTerminal(`<span class="success">The ${enemies[currentLocation.enemy].name} vanishes!</span>`);
                    delete currentLocation.enemy;
                    gameState.score += 100;
                }
                break;
            default:
                printToTerminal(`<span class="success">You use the ${item.name}.</span>`);
        }
        
        updateStats();
    }
    
    function attackEnemy() {
        const location = locations[gameState.location];
        
        if (!location.enemy) {
            printToTerminal('<span class="error">There is nothing to attack here.</span>');
            return;
        }
        
        const enemy = enemies[location.enemy];
        const hasWeapon = gameState.inventory.includes('rusty_sword');
        
        if (hasWeapon) {
            enemy.health -= 25;
            gameState.health -= enemy.damage;
            
            printToTerminal(`<span class="success">You attack the ${enemy.name} with your sword!</span>`);
            printToTerminal(`<span class="output">${enemy.name} health: ${Math.max(0, enemy.health)}</span>`);
            printToTerminal(`<span class="output">Your health: ${gameState.health}</span>`);
            
            if (enemy.health <= 0) {
                printToTerminal(`<span class="success">You defeated the ${enemy.name}!</span>`);
                delete location.enemy;
                gameState.score += 150;
                
                // Drop loot
                if (enemy.name === 'Dungeon Guard') {
                    location.items = [...(location.items || []), 'treasure_chest'];
                    printToTerminal('<span class="success">The guard drops a treasure chest!</span>');
                }
            }
        } else {
            gameState.health -= enemy.damage * 2;
            printToTerminal(`<span class="error">You attack the ${enemy.name} with your fists!</span>`);
            printToTerminal(`<span class="output">You take ${enemy.damage * 2} damage.</span>`);
            printToTerminal(`<span class="output">Your health: ${gameState.health}</span>`);
        }
        
        // Check for game over
        if (gameState.health <= 0) {
            printToTerminal('<span class="error">💀 YOU HAVE DIED 💀</span>');
            printToTerminal(`<span class="output">Final Score: ${gameState.score}</span>`);
            printToTerminal('<span class="command">Type "restart" to play again</span>');
        }
        
        updateStats();
    }
    
    // Terminal input handling
    terminalInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendCommand();
        }
    });
    
    window.sendCommand = () => {
        const command = terminalInput.value.trim();
        if (command) {
            processCommand(command);
            terminalInput.value = '';
        }
    };
    
    window.clearTerminal = () => {
        terminalOutput.innerHTML = '';
        initTerminal();
    };
    
    function restartGame() {
        gameState = {
            location: 'entrance',
            health: 100,
            score: 0,
            inventory: [],
            visited: ['entrance']
        };
        
        // Reset enemies
        Object.values(locations).forEach(location => {
            if (location.enemy) {
                const enemy = enemies[location.enemy];
                if (enemy) {
                    enemy.health = enemy.name === 'Shadow Creature' ? 30 : 50;
                }
            }
        });
        
        clearTerminal();
    }
    
    // Initialize the game
    initTerminal();
}

// Utility Functions
function simulateLoading(projectId) {
    return new Promise((resolve) => {
        const loading = document.querySelector('.demo-loading .loading-text');
        let progress = 0;
        
        const loadingInterval = setInterval(() => {
            progress += 10;
            loading.textContent = `INITIALIZING ${projectId.toUpperCase().replace(/-/g, ' ')}... ${progress}%`;
            
            if (progress >= 100) {
                clearInterval(loadingInterval);
                setTimeout(resolve, 500);
            }
        }, 100);
    });
}

function loadSimulatedDemo(projectId, container) {
    container.innerHTML = `
        <div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#000;color:#ff0000;font-family:'Courier New',monospace;padding:20px;text-align:center;">
            <h3 style="margin-bottom:20px;color:#ff0000;text-shadow:0 0 10px rgba(255,0,0,0.5);">${projectId.toUpperCase().replace(/-/g, ' ')} DEMO</h3>
            <p style="color:#ff6666;margin-bottom:30px;">Interactive simulation loaded successfully!</p>
            <div style="display:flex;gap:20px;margin-bottom:30px;">
                <button onclick="demoAction1()" class="control-btn-sm">ACTION 1</button>
                <button onclick="demoAction2()" class="control-btn-sm">ACTION 2</button>
                <button onclick="demoAction3()" class="control-btn-sm">ACTION 3</button>
            </div>
            <div style="color:#00ff00;font-size:0.9em;margin-top:20px;">
                <div>SYSTEM STATUS: <span style="color:#00ff00;">OPERATIONAL</span></div>
                <div>PERFORMANCE: <span style="color:#00ff00;">OPTIMAL</span></div>
                <div>INTERACTION: <span style="color:#00ff00;">ENABLED</span></div>
            </div>
        </div>
    `;
    
    window.demoAction1 = () => {
        alert(`Action 1 triggered for ${projectId}`);
    };
    
    window.demoAction2 = () => {
        alert(`Action 2 triggered for ${projectId}`);
    };
    
    window.demoAction3 = () => {
        alert(`Action 3 triggered for ${projectId}`);
    };
}

function updateModalStats(connection, latency, status) {
    const stats = document.querySelectorAll('.modal-stats .value');
    if (stats.length >= 3) {
        stats[0].textContent = connection;
        stats[1].textContent = latency;
        stats[2].textContent = status;
    }
}

function updateWriteupContent(projectId) {
    const writeupContent = document.querySelector('.writeup-content');
    if (!writeupContent) return;
    
    // This would typically fetch content from a database or API
    // For now, we'll update the title
    const title = writeupContent.querySelector('.writeup-project-title');
    if (title) {
        title.textContent = projectId.toUpperCase().replace(/-/g, ' ');
    }
}

function updateCodeContent(projectId) {
    const codeDisplay = document.querySelector('.code-display code');
    if (!codeDisplay) return;
    
    // This would typically fetch code from GitHub or a database
    // For now, we'll show sample code
    const sampleCode = `// Sample code for ${projectId}
// This would be the actual project code
    
function init${projectId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}() {
    console.log('Initializing ${projectId}...');
    
    // Main functionality here
    const config = {
        debug: true,
        performance: 'high',
        features: ['interactive', 'real-time', 'cyberpunk']
    };
    
    return {
        start: function() {
            console.log('${projectId} started successfully!');
            return 'READY';
        },
        stop: function() {
            console.log('${projectId} stopped');
        }
    };
}

// Export module
module.exports = init${projectId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())};`;
    
    // Format code with line numbers
    const lines = sampleCode.split('\n');
    const formattedCode = lines.map((line, index) => 
        `<span class="line">${escapeHtml(line)}</span>`
    ).join('\n');
    
    codeDisplay.innerHTML = formattedCode;
    highlightSyntax(codeDisplay);
}

function highlightSyntax(element) {
    // Simple syntax highlighting
    const code = element.innerHTML;
    
    // Keywords
    const keywords = ['function', 'return', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'console', 'log', 'module', 'exports', 'true', 'false', 'null', 'undefined'];
    let highlighted = code;
    
    keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        highlighted = highlighted.replace(regex, `<span class="keyword">${keyword}</span>`);
    });
    
    // Strings
    highlighted = highlighted.replace(/(".*?"|'.*?')/g, '<span class="string">$&</span>');
    
    // Comments
    highlighted = highlighted.replace(/\/\/.*/g, '<span class="comment">$&</span>');
    
    // Numbers
    highlighted = highlighted.replace(/\b\d+\b/g, '<span class="number">$&</span>');
    
    // Functions
    highlighted = highlighted.replace(/\b(init\w+)\b/g, '<span class="function">$1</span>');
    
    element.innerHTML = highlighted;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function stopAllDemos() {
    // Stop any running animations or intervals
    if (window.demoInterval) {
        clearInterval(window.demoInterval);
    }
    
    // Clean up Three.js scenes
    if (window.threeScene) {
        // Proper cleanup for Three.js
        window.threeScene = null;
    }
    
    // Stop audio contexts
    if (window.audioContext) {
        window.audioContext.close();
        window.audioContext = null;
    }
}

function playSoundEffect(type) {
    // Simulated sound effects - in a real implementation, you would play actual audio
    console.log(`Playing ${type} sound effect`);
    
    // Visual feedback instead of audio
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: rgba(255, 0, 0, 0.2);
        color: #ff0000;
        padding: 10px 20px;
        border-radius: 5px;
        font-family: 'Courier New', monospace;
        z-index: 1000;
        animation: feedbackFade 2s ease-out;
    `;
    
    feedback.textContent = `${type.toUpperCase()} ACTION`;
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.remove();
    }, 2000);
    
    // Add CSS for animation
    if (!document.querySelector('#feedbackStyle')) {
        const style = document.createElement('style');
        style.id = 'feedbackStyle';
        style.textContent = `
            @keyframes feedbackFade {
                0% { opacity: 1; transform: translateY(0); }
                70% { opacity: 1; transform: translateY(-10px); }
                100% { opacity: 0; transform: translateY(-20px); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Export for global access
window.initProjectsPlayground = initProjectsPlayground;
window.openDemoModal = openDemoModal;
window.openWriteupModal = openWriteupModal;
window.openCodeModal = openCodeModal;
window.closeModal = closeModal;
window.toggleFullscreen = toggleFullscreen;