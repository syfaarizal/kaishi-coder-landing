// js/sections/skills.js
import { $, $$ } from '../core/dom.js';
import { randomBool, randomRange, wait } from '../core/utils.js';
import { initMultiLineTyping } from '../effects/typing.js';
import { initGlitchEffect } from '../effects/glitch.js';

export const initSkills = () => {
    const skillsSection = $('#skills');
    if (!skillsSection) return null;

    // Initialize glitch effect for subtitle
    const glitch = initGlitchEffect('.skills-subtitle', {
        intensity: 0.04,
        maxShift: 4,
        duration: 120
    });

    // Animate intensity gauges with interactive effects
    const animateIntensityGauges = () => {
        const skillWeapons = $$('.skill-weapon');
        
        skillWeapons.forEach(weapon => {
            const fill = $('.gauge-fill', weapon);
            const gaugeValue = $('.gauge-value', weapon);
            if (!fill) return;
            
            const intensity = parseInt(weapon.dataset.intensity) || 80;
            
            // Reset to 0
            fill.style.width = '0%';
            
            // Set CSS variable for animation
            fill.style.setProperty('--target-width', `${intensity}%`);
            
            // Animate on scroll into view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            fill.classList.add('animating');
                            
                            // Animate metric numbers
                            const metrics = $$('.metric-value', weapon);
                            metrics.forEach(metric => {
                                const finalValue = metric.textContent;
                                metric.textContent = '0';
                                
                                let current = 0;
                                const increment = parseInt(finalValue.replace(/[^\d]/g, '')) / 30;
                                const timer = setInterval(() => {
                                    current += increment;
                                    if (current >= parseInt(finalValue.replace(/[^\d]/g, ''))) {
                                        metric.textContent = finalValue;
                                        clearInterval(timer);
                                    } else {
                                        metric.textContent = Math.floor(current).toLocaleString();
                                    }
                                }, 50);
                            });
                        }, 300);
                        
                        observer.unobserve(weapon);
                    }
                });
            }, { threshold: 0.3, rootMargin: '50px' });
            
            observer.observe(weapon);
        });
    };

    // Interactive hover effects for tech chips
    const initTechChipInteractions = () => {
        const techChips = $$('.tech-chip');
        
        techChips.forEach(chip => {
            chip.addEventListener('mouseenter', () => {
                // Create ripple effect
                const ripple = document.createElement('span');
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
                ripple.style.transform = 'scale(0)';
                ripple.style.animation = 'ripple 0.6s linear';
                
                const size = chip.offsetWidth;
                const pos = chip.getBoundingClientRect();
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = 0 + 'px';
                ripple.style.top = 0 + 'px';
                
                chip.style.position = 'relative';
                chip.style.overflow = 'hidden';
                chip.appendChild(ripple);
                
                // Add sound effect class
                chip.classList.add('chip-active');
            });
            
            chip.addEventListener('mouseleave', () => {
                chip.classList.remove('chip-active');
            });
        });
    };

    // Random flicker effects for status indicators
    const initStatusFlicker = () => {
        const statusIndicators = $$('.status-indicator');
        
        statusIndicators.forEach(indicator => {
            // Random occasional flicker
            setInterval(() => {
                if (randomBool(0.005) && document.hasFocus()) {
                    indicator.style.animation = 'none';
                    indicator.style.backgroundColor = '#ff0000';
                    indicator.style.boxShadow = '0 0 15px #ff0000';
                    
                    setTimeout(() => {
                        indicator.style.animation = '';
                        indicator.style.backgroundColor = '#28ca42';
                        indicator.style.boxShadow = '0 0 10px #28ca42';
                    }, 100);
                }
            }, 1000);
        });
    };

    // Interactive highlight keywords
    const initHighlightKeywords = () => {
        const keywords = $$('.highlight-keyword');
        
        keywords.forEach(keyword => {
            keyword.addEventListener('mouseenter', () => {
                keyword.style.transform = 'scale(1.05)';
                keyword.style.textShadow = '0 0 20px rgba(255, 0, 0, 0.5)';
                
                // Create particle effect
                for (let i = 0; i < 3; i++) {
                    createParticle(keyword);
                }
            });
            
            keyword.addEventListener('mouseleave', () => {
                keyword.style.transform = 'scale(1)';
                keyword.style.textShadow = '0 0 10px rgba(255, 0, 0, 0.3)';
            });
        });
    };

    // Particle effect helper
    const createParticle = (element) => {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.backgroundColor = '#ff0000';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1000';
        
        const rect = element.getBoundingClientRect();
        particle.style.left = (rect.left + rect.width / 2) + 'px';
        particle.style.top = (rect.top + rect.height / 2) + 'px';
        
        document.body.appendChild(particle);
        
        // Animate
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 3;
        const duration = 800 + Math.random() * 400;
        
        let startX = rect.left + rect.width / 2;
        let startY = rect.top + rect.height / 2;
        
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress >= 1) {
                document.body.removeChild(particle);
                return;
            }
            
            const x = startX + Math.cos(angle) * speed * elapsed;
            const y = startY + Math.sin(angle) * speed * elapsed;
            
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.opacity = 1 - progress;
            particle.style.transform = `scale(${1 - progress * 0.5})`;
            
            requestAnimationFrame(animate);
        };
        
        animate();
    };

    // Initialize all effects
    const init = () => {
        animateIntensityGauges();
        initTechChipInteractions();
        initStatusFlicker();
        initHighlightKeywords();
        initCardInteractions();
    };

    // Initialize when section is in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                init();
                observer.unobserve(skillsSection);
            }
        });
    }, { threshold: 0.2 });

    observer.observe(skillsSection);

    return {
        destroy: () => {
            glitch?.destroy();
            observer.disconnect();
            
            // Remove added styles
            const styles = $('#skills-styles');
            if (styles) styles.remove();
        }
    };
};

// Export convenience function
export const loadSkillsSection = () => {
    return initSkills();
};