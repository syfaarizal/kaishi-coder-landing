// assets/js/sections/writeup.js
import { $, $$ } from '../core/dom.js';
import { modalManager } from '../components/modal.js';

export class WriteupSection {
    constructor() {
        this.writeupModal = $('#writeup-modal');
        this.writeupButtons = $$('.writeup-btn');
        
        if (this.writeupButtons.length > 0) {
            this.init();
        }
    }
    
    init() {
        this.initWriteupButtons();
        this.registerModal();
    }
    
    initWriteupButtons() {
        this.writeupButtons.forEach(button => {
            button.addEventListener('click', () => {
                const projectId = button.dataset.project;
                this.openWriteup(projectId);
            });
        });
    }
    
    openWriteup(projectId) {
        // Load writeup content based on projectId
        this.loadWriteupContent(projectId);
        
        // Open modal
        modalManager.openModal('#writeup-modal');
    }
    
    loadWriteupContent(projectId) {
        // Ini bisa diisi dengan data dinamis dari API
        // Untuk sekarang, kita hardcode dulu
        const writeupData = {
            'cyber-city': {
                title: 'CYBER CITY SIM',
                buildTime: '6 WEEKS',
                loc: '15,234',
                difficulty: 'ADVANCED',
                challenge: 'Creating a performant 3D city simulation in the browser that maintains 60fps while rendering thousands of particles and dynamic lighting.',
                techStack: [
                    {
                        name: 'THREE.JS',
                        description: 'Used for 3D rendering, camera controls, and scene management. Implemented custom shaders for neon effects.'
                    },
                    {
                        name: 'WEBGL SHADERS',
                        description: 'Custom GLSL shaders for particle systems, bloom effects, and real-time reflections.'
                    },
                    {
                        name: 'WEB WORKERS',
                        description: 'Offloaded physics calculations to prevent main thread blocking.'
                    }
                ],
                optimizations: [
                    'Instanced rendering for identical buildings (90% reduction in draw calls)',
                    'Level of Detail (LOD) system for distant objects',
                    'Frustum culling to avoid rendering off-screen objects',
                    'Texture atlas for all materials'
                ],
                metrics: [
                    { value: '60', label: 'FPS TARGET' },
                    { value: '10K', label: 'CONCURRENT PARTICLES' },
                    { value: '4MB', label: 'BUNDLE SIZE' },
                    { value: '2.1s', label: 'INITIAL LOAD' }
                ],
                lessons: 'WebGL requires careful memory management. Found that pooling object instances significantly improved garbage collection performance.'
            },
            'neural-viz': {
                title: 'NEURAL VISUALIZER',
                buildTime: '4 WEEKS',
                loc: '8,567',
                difficulty: 'ADVANCED',
                challenge: 'Visualizing neural network activations in real-time without blocking the main thread.',
                techStack: [
                    {
                        name: 'TENSORFLOW.JS',
                        description: 'Used for neural network inference and weight visualization.'
                    },
                    {
                        name: 'D3.JS',
                        description: 'For force-directed graph layouts of neural connections.'
                    },
                    {
                        name: 'WEB WORKERS',
                        description: 'Separated inference calculations from UI rendering.'
                    }
                ],
                optimizations: [
                    'Used requestAnimationFrame for smooth animations',
                    'Implemented virtual scrolling for large networks',
                    'Cached computed gradients',
                    'Used WebGL for neuron visualization'
                ],
                metrics: [
                    { value: '256', label: 'NEURONS' },
                    { value: '60', label: 'FPS' },
                    { value: '＜100ms', label: 'INFERENCE TIME' },
                    { value: '2.8KB', label: 'MODEL SIZE' }
                ],
                lessons: 'Real-time visualization requires balancing detail with performance. Found that simplifying neuron representations after 200 nodes maintained smooth FPS.'
            }
        };
        
        const data = writeupData[projectId] || writeupData['cyber-city'];
        
        // Update modal content
        const titleEl = $('.writeup-project-title', this.writeupModal);
        const metaEl = $('.writeup-meta', this.writeupModal);
        const challengeEl = $('.section-title + p', this.writeupModal);
        const techDetailsEl = $('.tech-details', this.writeupModal);
        const optimizationsEl = $('.optimization-list', this.writeupModal);
        const metricsEl = $('.metrics-grid', this.writeupModal);
        const lessonsEl = $('.writeup-section:last-child p', this.writeupModal);
        
        if (titleEl) titleEl.textContent = data.title;
        
        if (metaEl) {
            metaEl.innerHTML = `
                <span class="meta-item">⏱️ BUILD TIME: ${data.buildTime}</span>
                <span class="meta-item">📁 LOC: ${data.loc}</span>
                <span class="meta-item">🔥 DIFFICULTY: ${data.difficulty}</span>
            `;
        }
        
        if (challengeEl) challengeEl.textContent = data.challenge;
        
        if (techDetailsEl) {
            techDetailsEl.innerHTML = data.techStack.map(tech => `
                <div class="tech-item">
                    <h4>${tech.name}</h4>
                    <p>${tech.description}</p>
                </div>
            `).join('');
        }
        
        if (optimizationsEl) {
            optimizationsEl.innerHTML = data.optimizations.map(item => 
                `<li>${item}</li>`
            ).join('');
        }
        
        if (metricsEl) {
            metricsEl.innerHTML = data.metrics.map(metric => `
                <div class="metric-card">
                    <div class="metric-value">${metric.value}</div>
                    <div class="metric-label">${metric.label}</div>
                </div>
            `).join('');
        }
        
        if (lessonsEl) lessonsEl.textContent = data.lessons;
        
        // Update button actions
        const viewCodeBtn = $('.view-code-btn', this.writeupModal);
        const viewDemoBtn = $('.view-demo-btn', this.writeupModal);
        
        if (viewCodeBtn) {
            viewCodeBtn.onclick = () => {
                modalManager.closeModal('#writeup-modal');
                // Buka code modal
                // (Implementasi code modal ada di projects.js)
            };
        }
        
        if (viewDemoBtn) {
            viewDemoBtn.onclick = () => {
                modalManager.closeModal('#writeup-modal');
                // Buka demo modal
                // (Implementasi demo modal ada di projects.js)
            };
        }
    }
    
    registerModal() {
        if (!this.writeupModal) return;
        
        modalManager.registerModal('#writeup-modal', {
            closeOnOutsideClick: true,
            closeButton: '.writeup-close',
            onOpen: () => {
                document.body.style.overflow = 'hidden';
            },
            onClose: () => {
                document.body.style.overflow = '';
            }
        });
    }
    
    destroy() {
        // Cleanup
        this.writeupButtons.forEach(button => {
            button.replaceWith(button.cloneNode(true));
        });
    }
}

export const initWriteups = () => {
    return new WriteupSection();
};