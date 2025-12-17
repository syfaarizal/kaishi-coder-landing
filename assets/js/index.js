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

// Add smooth scrolling
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

// Projects Section Functionality

function initProjectsPlayground() {
    if (!document.querySelector('#projects')) return;
    
    const projectTiles = document.querySelectorAll('.project-tile');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortButtons = document.querySelectorAll('.sort-btn');
    const searchInput = document.querySelector('.search-input');
    const demoButtons = document.querySelectorAll('.demo-btn');
    const codeButtons = document.querySelectorAll('.code-btn');
    const demoModal = document.querySelector('.demo-modal');
    const modalClose = demoModal.querySelector('.modal-close');
    const fullscreenBtn = demoModal.querySelector('.fullscreen-btn');
    const restartBtn = demoModal.querySelector('.restart-btn');
    const githubBtn = demoModal.querySelector('.github-btn');
    
    let currentFilter = 'all';
    let currentSort = 'newest';
    
    // GitHub URLs untuk masing-masing project
    const githubUrls = {
        'cyber-city': 'https://github.com/kaishiscd/cyber-city-sim',
        'neural-viz': 'https://github.com/kaishiscd/neural-visualizer',
        'cyber-runner': 'https://github.com/kaishiscd/cyber-runner',
        'data-dashboard': 'https://github.com/kaishiscd/data-dashboard',
        'audio-viz': 'https://github.com/kaishiscd/audio-reactive-art',
        'terminal-quest': 'https://github.com/kaishiscd/terminal-quest'
    };
    
    // Demo URLs (contoh - bisa diganti dengan URL asli)
    const demoUrls = {
        'cyber-city': 'https://cyber-city-sim.vercel.app',
        'neural-viz': 'https://neural-viz.vercel.app',
        'cyber-runner': 'https://cyber-runner.vercel.app',
        'data-dashboard': 'https://data-dashboard.vercel.app',
        'audio-viz': 'https://audio-viz.vercel.app',
        'terminal-quest': 'https://terminal-quest.vercel.app'
    };
    
    // Filter Projects
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.dataset.filter;
            filterAndSortProjects();
        });
    });
    
    // Sort Projects
    sortButtons.forEach(button => {
        button.addEventListener('click', () => {
            sortButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentSort = button.dataset.sort;
            filterAndSortProjects();
        });
    });
    
    // Live Search
    searchInput.addEventListener('input', () => {
        filterAndSortProjects();
    });
    
    // Filter and Sort Logic
    function filterAndSortProjects() {
        const searchTerm = searchInput.value.toLowerCase();
        
        projectTiles.forEach(tile => {
            const category = tile.dataset.category;
            const name = tile.querySelector('.project-name').textContent.toLowerCase();
            const desc = tile.querySelector('.project-desc').textContent.toLowerCase();
            
            // Filter by category
            const categoryMatch = currentFilter === 'all' || category === currentFilter;
            
            // Filter by search term
            const searchMatch = !searchTerm || 
                name.includes(searchTerm) || 
                desc.includes(searchTerm) ||
                Array.from(tile.querySelectorAll('.tech')).some(tech => 
                    tech.textContent.toLowerCase().includes(searchTerm)
                );
            
            if (categoryMatch && searchMatch) {
                tile.classList.remove('hidden');
                setTimeout(() => {
                    tile.style.opacity = '1';
                    tile.style.transform = 'translateY(0)';
                }, 50);
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
                    return 0; // Keep original order for newest
            }
        });
        
        // Reorder in DOM
        visibleTiles.forEach(tile => {
            container.appendChild(tile);
        });
    }
    
    // Demo Button Click
    demoButtons.forEach(button => {
        button.addEventListener('click', () => {
            const projectId = button.dataset.project;
            openDemoModal(projectId);
        });
    });
    
    // Code Button Click
    codeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const projectId = button.dataset.project;
            if (githubUrls[projectId]) {
                window.open(githubUrls[projectId], '_blank');
                
                // Button feedback
                button.innerHTML = '<span class="btn-icon">✓</span><span class="btn-text">OPENING...</span>';
                setTimeout(() => {
                    button.innerHTML = '<span class="btn-icon">{ }</span><span class="btn-text">SOURCE CODE</span>';
                }, 1500);
            }
        });
    });
    
    // Open Demo Modal
    function openDemoModal(projectId) {
        demoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Update GitHub button link
        if (githubUrls[projectId]) {
            githubBtn.href = githubUrls[projectId];
        }
        
        // Simulate loading
        const loading = demoModal.querySelector('.demo-loading');
        const frame = demoModal.querySelector('.demo-frame');
        
        loading.style.display = 'block';
        frame.style.background = '#000';
        
        // Simulate demo after 2 seconds
        setTimeout(() => {
            loading.style.display = 'none';
            simulateDemo(projectId);
        }, 2000);
    }
    
    // Simulate different demos based on project
    function simulateDemo(projectId) {
        const frame = demoModal.querySelector('.demo-frame');
        
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
        
        // Add CSS for animations
        const style = document.createElement('style');
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
        frame.appendChild(style);
    }
    
    // Close Modal
    modalClose.addEventListener('click', closeModal);
    demoModal.addEventListener('click', (e) => {
        if (e.target === demoModal) closeModal();
    });
    
    // Fullscreen Toggle
    fullscreenBtn.addEventListener('click', () => {
        const container = demoModal.querySelector('.modal-container');
        if (!document.fullscreenElement) {
            container.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    });
    
    // Restart Demo
    restartBtn.addEventListener('click', () => {
        const currentProject = document.querySelector('.demo-btn.active')?.dataset.project;
        if (currentProject) {
            openDemoModal(currentProject);
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (!demoModal.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'f':
            case 'F':
                fullscreenBtn.click();
                break;
            case 'r':
            case 'R':
                restartBtn.click();
                break;
        }
    });
    
    function closeModal() {
        demoModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    // Initialize terminal typing effect
    initTerminalTyping();
    
    // Add interactive effects to project tiles
    projectTiles.forEach(tile => {
        // Random glitch effect
        setInterval(() => {
            if (Math.random() > 0.97 && !tile.classList.contains('hidden')) {
                tile.style.transform = `translateY(-10px) rotate(${Math.random() * 2 - 1}deg)`;
                setTimeout(() => {
                    tile.style.transform = 'translateY(-10px) rotate(0deg)';
                }, 100);
            }
        }, 2000);
        
        // Stats animation
        const stats = tile.querySelectorAll('.stat');
        stats.forEach(stat => {
            const originalText = stat.textContent;
            setInterval(() => {
                if (Math.random() > 0.98 && document.hasFocus()) {
                    const values = ['🔥', '⚡', '🎮', '📊', '🧠', '🎵', '💻'];
                    const randomValue = values[Math.floor(Math.random() * values.length)];
                    stat.textContent = `${randomValue} ${Math.floor(Math.random() * 100)}%`;
                    
                    setTimeout(() => {
                        stat.textContent = originalText;
                    }, 500);
                }
            }, 3000);
        });
    });
}

// Terminal typing effect for playground
function initTerminalTyping() {
    const terminalLines = document.querySelectorAll('.terminal-line');
    if (terminalLines.length === 0) return;
    
    let lineIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isWaiting = false;
    
    function typeLine() {
        const currentLine = terminalLines[lineIndex];
        const text = currentLine.dataset.text || currentLine.textContent.replace('█', '');
        
        if (!isWaiting) {
            if (!isDeleting && charIndex < text.length) {
                currentLine.textContent = text.substring(0, charIndex + 1) + '█';
                charIndex++;
                setTimeout(typeLine, 50);
            } else if (isDeleting && charIndex > 0) {
                currentLine.textContent = text.substring(0, charIndex - 1) + '█';
                charIndex--;
                setTimeout(typeLine, 30);
            } else if (!isDeleting && charIndex === text.length) {
                isWaiting = true;
                setTimeout(() => {
                    isWaiting = false;
                    isDeleting = true;
                    setTimeout(typeLine, 1000);
                }, 2000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                lineIndex = (lineIndex + 1) % terminalLines.length;
                setTimeout(typeLine, 500);
            }
        }
    }
    
    // Store original text
    terminalLines.forEach((line, index) => {
        line.dataset.text = line.textContent.replace('█', '');
        line.textContent = index === 0 ? '█' : '';
    });
    
    // Start typing after delay
    setTimeout(typeLine, 1000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initProjectsPlayground);