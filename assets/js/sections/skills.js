import { $, $$ } from '../core/dom.js';
import { randomBool } from '../core/utils.js';

export const initSkills = () => {
    const skillsSection = $('#skills');
    if (!skillsSection) return null;

    // Debounce function for performance
    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    // Optimized intensity gauge animation
    const animateIntensityGauges = () => {
        const skillWeapons = $$('.skill-weapon');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const weapon = entry.target;
                    const fill = $('.gauge-fill', weapon);
                    if (!fill) return;
                    
                    const intensity = parseInt(weapon.dataset.intensity) || 80;
                    
                    // Use CSS animation instead of JS animation
                    fill.style.setProperty('--target-width', `${intensity}%`);
                    fill.classList.add('animating');
                    
                    // Animate metric numbers with optimized intervals
                    const metrics = $$('.metric-value', weapon);
                    metrics.forEach(metric => {
                        const finalValue = metric.textContent.replace(/[^\d]/g, '');
                        const numValue = parseInt(finalValue) || 0;
                        
                        if (numValue > 1000) {
                            // For large numbers, jump directly
                            metric.textContent = finalValue;
                        } else {
                            // For small numbers, animate quickly
                            let current = 0;
                            const increment = Math.ceil(numValue / 10);
                            const timer = setInterval(() => {
                                current += increment;
                                if (current >= numValue) {
                                    metric.textContent = finalValue;
                                    clearInterval(timer);
                                } else {
                                    metric.textContent = current;
                                }
                            }, 30);
                        }
                    });
                    
                    observer.unobserve(weapon);
                }
            });
        }, { threshold: 0.2, rootMargin: '50px' });
        
        skillWeapons.forEach(weapon => observer.observe(weapon));
    };

    // Simplified tech chip interactions
    const initTechChipInteractions = () => {
        const techChips = $$('.tech-chip');
        
        techChips.forEach(chip => {
            const handleMouseEnter = debounce(() => {
                chip.classList.add('chip-active');
            }, 50);
            
            const handleMouseLeave = debounce(() => {
                chip.classList.remove('chip-active');
            }, 50);
            
            chip.addEventListener('mouseenter', handleMouseEnter);
            chip.addEventListener('mouseleave', handleMouseLeave);
            
            // Clean up on destroy
            chip._handlers = { mouseenter: handleMouseEnter, mouseleave: handleMouseLeave };
        });
    };

    // Optimized status flicker - less frequent
    const initStatusFlicker = () => {
        const statusIndicators = $$('.status-indicator');
        let flickerTimer = null;
        
        const flicker = () => {
            if (!document.hasFocus()) return;
            
            statusIndicators.forEach(indicator => {
                if (randomBool(0.002)) { // Reduced probability
                    indicator.style.backgroundColor = '#ff0000';
                    indicator.style.boxShadow = '0 0 12px #ff0000';
                    
                    setTimeout(() => {
                        indicator.style.backgroundColor = '#28ca42';
                        indicator.style.boxShadow = '0 0 8px #28ca42';
                    }, 80);
                }
            });
        };
        
        flickerTimer = setInterval(flicker, 2000); // Increased interval
        
        return flickerTimer;
    };

    // Simplified highlight keywords
    const initHighlightKeywords = () => {
        const keywords = $$('.highlight-keyword');
        
        keywords.forEach(keyword => {
            const handleMouseEnter = debounce(() => {
                keyword.style.textShadow = '0 0 15px rgba(255, 0, 0, 0.5)';
            }, 50);
            
            const handleMouseLeave = debounce(() => {
                keyword.style.textShadow = '0 0 8px rgba(255, 0, 0, 0.3)';
            }, 50);
            
            keyword.addEventListener('mouseenter', handleMouseEnter);
            keyword.addEventListener('mouseleave', handleMouseLeave);
            
            // Store for cleanup
            keyword._handlers = { mouseenter: handleMouseEnter, mouseleave: handleMouseLeave };
        });
    };

    // Optimized initialization
    const init = () => {
        const flickerTimer = initStatusFlicker();
        animateIntensityGauges();
        initTechChipInteractions();
        initHighlightKeywords();
        
        return flickerTimer;
    };

    // Initialize when section is in view
    let flickerTimer = null;
    let sectionObserver = null;
    
    sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                flickerTimer = init();
                sectionObserver.unobserve(skillsSection);
            }
        });
    }, { threshold: 0.1, rootMargin: '100px' });

    sectionObserver.observe(skillsSection);

    // Clean up function
    const destroy = () => {
        if (flickerTimer) clearInterval(flickerTimer);
        if (sectionObserver) sectionObserver.disconnect();
        
        // Remove event listeners
        $$('.tech-chip').forEach(chip => {
            if (chip._handlers) {
                chip.removeEventListener('mouseenter', chip._handlers.mouseenter);
                chip.removeEventListener('mouseleave', chip._handlers.mouseleave);
            }
        });
        
        $$('.highlight-keyword').forEach(keyword => {
            if (keyword._handlers) {
                keyword.removeEventListener('mouseenter', keyword._handlers.mouseenter);
                keyword.removeEventListener('mouseleave', keyword._handlers.mouseleave);
            }
        });
    };

    return { destroy };
};

// Export convenience function
export const loadSkillsSection = () => {
    return initSkills();
};