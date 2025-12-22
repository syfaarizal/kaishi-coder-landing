// js/sections/footer.js
import { $, $$ } from '../core/dom.js';
import { randomRange } from '../core/utils.js';

export const initFooter = () => {
    const footerSection = $('footer.footer-section');
    if (!footerSection) return null;

    // Initialize system status indicators animation
    const animateStatusIndicators = () => {
        const indicators = $$('.indicator-fill');
        
        indicators.forEach(fill => {
            const width = fill.style.width || '0%';
            fill.style.width = '0%';
            
            // Animate when in view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            fill.style.width = width;
                        }, 300);
                        observer.unobserve(fill);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(fill);
        });
    };

    // Initialize back to top button
    const initBackToTop = () => {
        const topButton = $('.top-button');
        if (!topButton) return;
        
        topButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Add visual feedback
            topButton.classList.add('clicked');
            setTimeout(() => {
                topButton.classList.remove('clicked');
            }, 300);
        });
        
        // Show/hide button based on scroll position
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            const shouldShow = currentScroll > 300;
            
            topButton.style.opacity = shouldShow ? '1' : '0';
            topButton.style.pointerEvents = shouldShow ? 'auto' : 'none';
            
            // Add glow effect when scrolling up
            if (currentScroll < lastScroll && currentScroll > 100) {
                topButton.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.4)';
            } else {
                topButton.style.boxShadow = '';
            }
            
            lastScroll = currentScroll;
        });
    };

    // Initialize footer link interactions
    const initFooterLinks = () => {
        const footerLinks = $$('.footer-link');
        
        footerLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                // Create a subtle ripple effect
                const ripple = document.createElement('span');
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
                ripple.style.transform = 'scale(0)';
                ripple.style.animation = 'ripple 0.6s linear';
                
                const size = link.offsetWidth;
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = '0';
                ripple.style.top = '50%';
                ripple.style.marginTop = -size/2 + 'px';
                
                link.style.position = 'relative';
                link.style.overflow = 'hidden';
                link.appendChild(ripple);
                
                // Remove ripple after animation
                setTimeout(() => {
                    if (ripple.parentNode === link) {
                        link.removeChild(ripple);
                    }
                }, 600);
            });
            
            // Handle clicks for internal links (smooth scroll)
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });
                        
                        // Add click effect
                        link.style.color = '#ff0000';
                        link.style.textShadow = '0 0 10px rgba(255, 0, 0, 0.5)';
                        
                        setTimeout(() => {
                            link.style.color = '';
                            link.style.textShadow = '';
                        }, 1000);
                    }
                }
            });
        });
    };

    // Animate Sicoder logo on hover
    const initSicoderLogo = () => {
        const sicoderLogo = $('.sicoder-logo');
        const sicoderContainer = $('.sicoder-container');
        
        if (!sicoderLogo || !sicoderContainer) return;
        
        sicoderContainer.addEventListener('mouseenter', () => {
            // Intensify the glow
            const glow = $('.sicoder-glow');
            if (glow) {
                glow.style.animation = 'sicoderPulse 1s ease-in-out infinite';
                glow.style.opacity = '0.8';
            }
            
            // Add particle effect
            for (let i = 0; i < 5; i++) {
                createLogoParticle(sicoderContainer);
            }
        });
        
        sicoderContainer.addEventListener('mouseleave', () => {
            const glow = $('.sicoder-glow');
            if (glow) {
                glow.style.animation = 'sicoderPulse 3s ease-in-out infinite';
                glow.style.opacity = '0.4';
            }
        });
    };

    // Create particles for logo hover
    const createLogoParticle = (container) => {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 3px;
            height: 3px;
            background: #e22b2bff;
            border-radius: 50%;
            pointer-events: none;
            z-index: 3;
            box-shadow: 0 0 10px #e22b2bff;
        `;
        
        const rect = container.getBoundingClientRect();
        const startX = rect.width / 2;
        const startY = rect.height / 2;
        
        particle.style.left = `${startX}px`;
        particle.style.top = `${startY}px`;
        
        container.appendChild(particle);
        
        // Animate
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 2;
        const distance = 30 + Math.random() * 20;
        const duration = 800 + Math.random() * 400;
        
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress >= 1) {
                container.removeChild(particle);
                return;
            }
            
            const currentDistance = distance * progress;
            const x = startX + Math.cos(angle) * currentDistance;
            const y = startY + Math.sin(angle) * currentDistance;
            
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.opacity = 1 - progress;
            particle.style.transform = `scale(${1 - progress * 0.5})`;
            
            requestAnimationFrame(animate);
        };
        
        animate();
    };

    // Simulate live system status updates
    const initSystemStatus = () => {
        const terminalLines = $$('.terminal-line');
        const indicators = $$('.indicator-fill');
        const values = $$('.indicator-value');
        
        // Random minor updates every 10 seconds
        setInterval(() => {
            if (!document.hasFocus()) return;
            
            // Update memory usage randomly
            if (Math.random() > 0.7) {
                const memoryLine = Array.from(terminalLines).find(line => 
                    line.textContent.includes('Memory:')
                );
                
                if (memoryLine) {
                    const currentMem = parseFloat(values[2]?.textContent || '1.2');
                    const newMem = Math.max(0.5, Math.min(5, currentMem + (Math.random() - 0.5) * 0.3));
                    
                    values[2].textContent = `${newMem.toFixed(1)}%`;
                    indicators[2].style.width = `${Math.min(100, newMem * 20)}%`;
                    
                    // Update terminal line
                    const memoryText = memoryLine.querySelector('.line-text');
                    if (memoryText) {
                        memoryText.textContent = `Memory: ${(45.2 * (newMem / 1.2)).toFixed(1)}M (resident)`;
                    }
                }
            }
            
            // Occasionally simulate small network spikes
            if (Math.random() > 0.9) {
                const networkValue = values[2];
                const networkBar = indicators[2];
                
                if (networkValue && networkBar) {
                    const originalWidth = parseFloat(networkBar.style.width);
                    
                    // Temporary spike
                    networkBar.style.width = '100%';
                    networkValue.textContent = '100%';
                    networkValue.style.color = '#ffff00';
                    
                    setTimeout(() => {
                        networkBar.style.width = `${originalWidth}%`;
                        networkValue.textContent = `${originalWidth}%`;
                        networkValue.style.color = '#00ff00';
                    }, 1000);
                }
            }
        }, 10000);
        
        // Simulate terminal typing effect for new lines occasionally
        let lineIndex = 0;
        const terminalBody = $('.terminal-body');
        
        setInterval(() => {
            if (!document.hasFocus() || Math.random() > 0.8) return;
            
            // Add a new log line
            const newLine = document.createElement('div');
            newLine.className = 'terminal-line';
            newLine.style.opacity = '0';
            
            const logs = [
                'System check: All services normal',
                'Security scan: No threats detected',
                'Performance: Optimal',
                'Connection: Stable',
                'Update: No pending updates'
            ];
            
            const randomLog = logs[Math.floor(Math.random() * logs.length)];
            
            newLine.innerHTML = `
                <span class="line-prefix">[${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}]</span>
                <span class="line-text">${randomLog}</span>
            `;
            
            terminalBody.appendChild(newLine);
            
            // Animate in
            setTimeout(() => {
                newLine.style.transition = 'opacity 0.5s';
                newLine.style.opacity = '1';
            }, 10);
            
            // Remove oldest line if too many
            const lines = $$('.terminal-line', terminalBody);
            if (lines.length > 8) {
                lines[1].style.opacity = '0';
                setTimeout(() => {
                    if (lines[1].parentNode === terminalBody) {
                        terminalBody.removeChild(lines[1]);
                    }
                }, 500);
            }
            
            lineIndex++;
        }, 15000);
    };

    // Initialize all effects
    const init = () => {
        animateStatusIndicators();
        initBackToTop();
        initFooterLinks();
        initSicoderLogo();
        initSystemStatus();
        
        // Add CSS for animations
        if (!document.querySelector('#footer-styles')) {
            const style = document.createElement('style');
            style.id = 'footer-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
                
                .top-button.clicked {
                    animation: buttonClick 0.3s ease;
                }
                
                @keyframes buttonClick {
                    0% { transform: scale(1); }
                    50% { transform: scale(0.95); }
                    100% { transform: scale(1); }
                }
                
                .logo-img.loading {
                    animation: logoSpin 2s linear infinite;
                }
                
                @keyframes logoSpin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    };

    // Initialize immediately (footer is usually visible)
    init();

    return {
        destroy: () => {
            // Remove added styles
            const styles = $('#footer-styles');
            if (styles) styles.remove();
            
            // Clean up any intervals
            // (We're using setInterval in initSystemStatus, need to track it)
            // For simplicity, we'll rely on page refresh
        }
    };
};

// Export convenience function
export const loadFooter = () => {
    return initFooter();
};