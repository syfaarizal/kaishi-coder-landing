import { $, $$ } from '../core/dom.js';
import { randomBool, randomRange, wait } from '../core/utils.js';
import { initMultiLineTyping } from '../effects/typing.js';
import { initGlitchEffect } from '../effects/glitch.js';
import { 
    fetchGitHubStats, 
    fetchYouTubeStats, 
    fetchInstagramStats, 
    fetchTikTokStats, 
    fetchTwitterStats,
    updateAllPlatformStats,
    saveStatsToLocalStorage,
    loadStatsFromLocalStorage,
    formatNumber,
    formatRelativeTime 
} from './contact-api.js';

export const initContact = () => {
    const contactSection = $('#contact');
    if (!contactSection) return null;

    // Initialize glitch effect for subtitle
    const glitch = initGlitchEffect('.contact-subtitle', {
        intensity: 0.04,
        maxShift: 4,
        duration: 120
    });

    // State untuk data platform
    let platformStats = {
        github: null,
        youtube: null,
        instagram: null,
        tiktok: null,
        twitter: null
    };

    // Load data awal dari localStorage
    const loadInitialStats = () => {
        const savedStats = loadStatsFromLocalStorage();
        if (savedStats) {
            platformStats = savedStats;
            updateAllStatsDisplays();
        }
    };

    // Update semua tampilan stats
    const updateAllStatsDisplays = () => {
        updatePlatformStats('github', platformStats.github);
        updatePlatformStats('youtube', platformStats.youtube);
        updatePlatformStats('instagram', platformStats.instagram);
        updatePlatformStats('tiktok', platformStats.tiktok);
        updatePlatformStats('twitter', platformStats.twitter);
        
        // Update network stats
        updateNetworkStats();
    };

    // Update stats untuk platform tertentu
    const updatePlatformStats = (platform, stats) => {
        const node = $(`.connection-node[data-platform="${platform}"]`);
        if (!node || !stats) return;

        switch (platform) {
            case 'github':
                $$('.stat-value', node).forEach((el, index) => {
                    if (index === 0) el.textContent = stats.publicRepos || '38';
                    if (index === 1) el.textContent = stats.commits || '421';
                });
                break;
                
            case 'youtube':
                $$('.stat-value', node).forEach((el, index) => {
                    if (index === 0) el.textContent = stats.videoCount || '31';
                    if (index === 1) el.textContent = formatNumber(stats.viewCount) || '1.2K';
                });
                break;
                
            case 'instagram':
                $$('.stat-value', node).forEach((el, index) => {
                    if (index === 0) el.textContent = stats.postCount || '35';
                    if (index === 1) el.textContent = '24/7';
                });
                break;
                
            case 'tiktok':
                $$('.stat-value', node).forEach((el, index) => {
                    if (index === 0) el.textContent = stats.videoCount || '26';
                    if (index === 1) el.textContent = '≤60s';
                });
                break;
                
            case 'twitter':
                $$('.stat-value', node).forEach((el, index) => {
                    if (index === 0) el.textContent = formatNumber(stats.tweetCount) || '1.5K';
                    if (index === 1) el.textContent = '280';
                });
                break;
        }
    };

    // Update network stats
    const updateNetworkStats = () => {
        const updateTime = $('.update-time');
        if (updateTime) {
            updateTime.textContent = formatRelativeTime(platformStats.lastUpdated || Date.now());
            updateTime.style.color = '#00ff00';
        }
    };

    // Fetch dan update semua data
    const refreshAllStats = async () => {
        // Tampilkan loading state
        const scanBtn = $('.scan-network');
        if (scanBtn) {
            scanBtn.classList.add('scan-active');
            scanBtn.disabled = true;
            scanBtn.innerHTML = '<span class="button-icon">⟳</span><span class="button-text">SCANNING...</span>';
        }

        const updateTime = $('.update-time');
        if (updateTime) {
            updateTime.textContent = 'SCANNING...';
            updateTime.style.color = '#ffbd2e';
        }

        try {
            const stats = await updateAllPlatformStats();
            if (stats) {
                platformStats = stats;
                saveStatsToLocalStorage(stats);
                updateAllStatsDisplays();
                
                // Tampilkan notifikasi sukses
                showNotification('Network scan complete. All stats updated.', '#00ffff');
            }
        } catch (error) {
            console.error('Error refreshing stats:', error);
            showNotification('Scan failed. Using cached data.', '#ff0000');
        } finally {
            // Reset button
            if (scanBtn) {
                setTimeout(() => {
                    scanBtn.classList.remove('scan-active');
                    scanBtn.disabled = false;
                    scanBtn.innerHTML = '<span class="button-icon">📡</span><span class="button-text">RESCAN NETWORK</span>';
                }, 1000);
            }
        }
    };

    // Platform-specific interactions
    const initPlatformInteractions = () => {
        const connectionNodes = $$('.connection-node');
        
        connectionNodes.forEach(node => {
            const platform = node.dataset.platform;
            const card = $('.node-card', node);
            const icon = $('.platform-svg', node);
            const actionBtn = $('.node-action', node);
            
            // Hover effects
            node.addEventListener('mouseenter', () => {
                // Add glow to all related nodes
                connectionNodes.forEach(otherNode => {
                    if (otherNode !== node) {
                        otherNode.style.filter = 'blur(1px) opacity(0.7)';
                        otherNode.style.transform = 'scale(0.98)';
                    }
                });
                
                // Highlight current node
                node.style.filter = 'none';
                node.style.transform = 'translateY(-15px)';
                
                // Create connection lines to other nodes
                createConnectionLines(node);
            });
            
            node.addEventListener('mouseleave', () => {
                // Reset all nodes
                connectionNodes.forEach(otherNode => {
                    otherNode.style.filter = '';
                    otherNode.style.transform = '';
                });
                
                // Remove connection lines
                removeConnectionLines();
            });
            
            // Click effects for Discord copy button
            if (platform === 'discord') {
                const copyBtn = $('.discord-copy', node);
                const copyText = $('.string-value.copyable', node);
                
                if (copyBtn && copyText) {
                    copyBtn.addEventListener('click', async (e) => {
                        e.preventDefault();
                        const username = copyBtn.dataset.username || 'kaishiscd';
                        
                        try {
                            await navigator.clipboard.writeText(username);
                            
                            // Visual feedback
                            copyBtn.classList.add('copy-feedback');
                            copyText.classList.add('copy-feedback');
                            
                            // Change button text temporarily
                            const originalText = copyBtn.querySelector('.action-text');
                            const originalHTML = originalText.innerHTML;
                            originalText.innerHTML = 'COPIED!';
                            
                            setTimeout(() => {
                                copyBtn.classList.remove('copy-feedback');
                                copyText.classList.remove('copy-feedback');
                                originalText.innerHTML = originalHTML;
                            }, 2000);
                            
                            // Show notification
                            showCopyNotification(username);
                        } catch (err) {
                            console.error('Failed to copy:', err);
                            // Fallback for older browsers
                            copyText.select();
                            document.execCommand('copy');
                        }
                    });
                    
                    // Hover effect for copyable text
                    copyText.addEventListener('click', async () => {
                        const text = copyText.dataset.copy || 'kaishiscd';
                        await navigator.clipboard.writeText(text);
                        
                        copyText.classList.add('copy-feedback');
                        setTimeout(() => {
                            copyText.classList.remove('copy-feedback');
                        }, 500);
                    });
                }
            }
            
            // Platform-specific sound effects (optional)
            if (actionBtn) {
                actionBtn.addEventListener('mouseenter', () => {
                    const platformSounds = {
                        github: 'click',
                        youtube: 'play',
                        instagram: 'snap',
                        tiktok: 'pop',
                        twitter: 'tweet',
                        discord: 'message'
                    };
                    
                    // Visual effect only (could add audio later)
                    actionBtn.style.transform = 'translateY(-3px) scale(1.02)';
                });
                
                actionBtn.addEventListener('mouseleave', () => {
                    actionBtn.style.transform = '';
                });
            }
        });
    };

    // Create dynamic connection lines between nodes
    const createConnectionLines = (activeNode) => {
        const nodes = $$('.connection-node');
        const activeRect = activeNode.getBoundingClientRect();
        const activeCenter = {
            x: activeRect.left + activeRect.width / 2,
            y: activeRect.top + activeRect.height / 2
        };
        
        nodes.forEach(node => {
            if (node === activeNode) return;
            
            const rect = node.getBoundingClientRect();
            const center = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };
            
            // Create line element
            const line = document.createElement('div');
            line.className = 'dynamic-connection-line';
            line.style.position = 'fixed';
            line.style.pointerEvents = 'none';
            line.style.zIndex = '5';
            
            // Calculate line properties
            const dx = center.x - activeCenter.x;
            const dy = center.y - activeCenter.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;
            
            line.style.width = `${length}px`;
            line.style.height = '2px';
            line.style.left = `${activeCenter.x}px`;
            line.style.top = `${activeCenter.y}px`;
            line.style.transform = `rotate(${angle}deg)`;
            line.style.transformOrigin = '0 0';
            line.style.background = `linear-gradient(90deg, 
                ${getComputedStyle(activeNode).getPropertyValue('--platform-color')}, 
                ${getComputedStyle(node).getPropertyValue('--platform-color')})`;
            line.style.opacity = '0';
            line.style.transition = 'opacity 0.3s';
            
            document.body.appendChild(line);
            
            // Animate in
            setTimeout(() => {
                line.style.opacity = '0.6';
            }, 100);
            
            // Store reference
            node._connectionLine = line;
        });
    };

    // Remove connection lines
    const removeConnectionLines = () => {
        const lines = $$('.dynamic-connection-line');
        lines.forEach(line => {
            line.style.opacity = '0';
            setTimeout(() => {
                if (line.parentNode) {
                    line.parentNode.removeChild(line);
                }
            }, 300);
        });
    };

    // Copy notification
    const showCopyNotification = (username) => {
        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">✓</span>
                <span class="notification-text">Copied: <strong>${username}</strong></span>
            </div>
        `;
        
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
            z-index: 10000;
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
    };

    // General notification
    const showNotification = (message, color = '#00ff00') => {
        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">📡</span>
                <span class="notification-text">${message}</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(100%);
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid ${color};
            border-radius: 8px;
            padding: 12px 20px;
            color: ${color};
            font-family: 'Courier New', monospace;
            z-index: 10000;
            transition: transform 0.3s;
            box-shadow: 0 0 30px ${color}40;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(-50%) translateY(0)';
        }, 10);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(-50%) translateY(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    };

    // Network scan button
    const initScanButton = () => {
        const scanBtn = $('.scan-network');
        if (!scanBtn) return;
        
        scanBtn.addEventListener('click', () => {
            refreshAllStats();
            
            // Animate nodes
            const nodes = $$('.pulse-node');
            nodes.forEach(node => {
                node.style.animation = 'nodePulse 0.5s infinite';
            });
            
            // Reset node animation setelah scan selesai
            setTimeout(() => {
                nodes.forEach(node => {
                    node.style.animation = 'nodePulse 3s infinite';
                });
            }, 2000);
        });
    };

    // Animated network visualization
    const initNetworkVisualization = () => {
        const canvas = $('.network-canvas');
        if (!canvas) return;
        
        // Create data flow particles
        const createDataParticle = () => {
            if (!document.hasFocus()) return;
            
            const particle = document.createElement('div');
            particle.className = 'data-particle';
            particle.style.cssText = `
                position: absolute;
                width: 3px;
                height: 3px;
                background: #00ffff;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1;
                box-shadow: 0 0 10px #00ffff;
            `;
            
            // Random start position along connection lines
            const lines = $$('.connection-line-viz');
            if (lines.length === 0) return;
            
            const line = lines[Math.floor(Math.random() * lines.length)];
            const lineRect = line.getBoundingClientRect();
            const canvasRect = canvas.getBoundingClientRect();
            
            const startX = lineRect.left - canvasRect.left;
            const startY = lineRect.top - canvasRect.top;
            
            particle.style.left = `${startX}px`;
            particle.style.top = `${startY}px`;
            
            canvas.appendChild(particle);
            
            // Animate along line
            const duration = 2000 + Math.random() * 1000;
            const angle = Math.random() * 360;
            const distance = 50 + Math.random() * 100;
            
            const startTime = Date.now();
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / duration;
                
                if (progress >= 1) {
                    canvas.removeChild(particle);
                    return;
                }
                
                const x = startX + Math.cos(angle) * distance * progress;
                const y = startY + Math.sin(angle) * distance * progress;
                
                particle.style.left = `${x}px`;
                particle.style.top = `${y}px`;
                particle.style.opacity = 1 - progress;
                
                requestAnimationFrame(animate);
            };
            
            animate();
        };
        
        // Create particles periodically
        let particleInterval = setInterval(() => {
            if (document.hasFocus() && Math.random() > 0.3) {
                createDataParticle();
            }
        }, 500);
        
        // Pause when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                clearInterval(particleInterval);
            } else {
                particleInterval = setInterval(() => {
                    if (document.hasFocus() && Math.random() > 0.3) {
                        createDataParticle();
                    }
                }, 500);
            }
        });
    };

    // Auto-refresh stats setiap 5 menit
    const initAutoRefresh = () => {
        setInterval(() => {
            if (document.visibilityState === 'visible') {
                refreshAllStats();
            }
        }, 5 * 60 * 1000); // 5 menit
    };

    // Initialize all effects
    const init = () => {
        // Load data awal
        loadInitialStats();
        
        initPlatformInteractions();
        initScanButton();
        initNetworkVisualization();
        initAutoRefresh();
        
        // Auto-refresh saat section terlihat
        if (document.visibilityState === 'visible') {
            setTimeout(() => refreshAllStats(), 2000);
        }
        
        // Add CSS for dynamic elements
        if (!document.querySelector('#contact-styles')) {
            const style = document.createElement('style');
            style.id = 'contact-styles';
            style.textContent = `
                .dynamic-connection-line {
                    position: fixed !important;
                    pointer-events: none !important;
                    z-index: 5 !important;
                    opacity: 0;
                    transition: opacity 0.3s !important;
                }
                
                .copy-notification {
                    position: fixed !important;
                    top: 20px !important;
                    right: 20px !important;
                    background: rgba(0, 0, 0, 0.9) !important;
                    border: 2px solid #00ff00 !important;
                    border-radius: 8px !important;
                    padding: 15px 20px !important;
                    color: #00ff00 !important;
                    font-family: 'Courier New', monospace !important;
                    z-index: 10000 !important;
                    transform: translateX(120%) !important;
                    transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
                    box-shadow: 0 0 30px rgba(0, 255, 0, 0.3) !important;
                }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .notification-icon {
                    color: #00ff00;
                    font-size: 1.2em;
                }
                
                .notification-text {
                    font-size: 0.9em;
                }
                
                .data-particle {
                    position: absolute;
                    width: 3px;
                    height: 3px;
                    background: #00ffff;
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 1;
                    box-shadow: 0 0 10px #00ffff;
                }
                
                @keyframes copyFeedback {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); color: #00ff00; }
                    100% { transform: scale(1); }
                }
                
                .copy-feedback {
                    animation: copyFeedback 0.5s ease !important;
                }
                
                @keyframes activeScan {
                    0% { background-position: 0% 50%; }
                    100% { background-position: 100% 50%; }
                }
                
                .scan-active {
                    background: linear-gradient(90deg, #ff0000, #8a2be2, #00ffff) !important;
                    background-size: 200% auto !important;
                    animation: activeScan 1s linear infinite !important;
                }
                
                @keyframes spinRefresh {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    };

    // Initialize when section is in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                init();
                observer.unobserve(contactSection);
            }
        });
    }, { threshold: 0.2 });

    observer.observe(contactSection);

    return {
        refreshStats: refreshAllStats,
        getCurrentStats: () => platformStats,
        destroy: () => {
            glitch?.destroy();
            observer.disconnect();
            
            // Remove added styles
            const styles = $('#contact-styles');
            if (styles) styles.remove();
            
            // Remove any remaining connection lines
            removeConnectionLines();
        }
    };
};

// Export convenience function
export const loadContactSection = () => {
    return initContact();
};