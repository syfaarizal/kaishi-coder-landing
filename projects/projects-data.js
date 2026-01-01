// Projects database
export const projectsData = [
    {
        id: 1,
        title: "Cyberpunk Terminal",
        category: "web",
        badges: ["EXPERIMENTAL", "REALTIME"],
        shortDescription: "A futuristic web terminal with real-time effects",
        description: "A fully interactive cyberpunk-style terminal built with modern web technologies. Features real-time particle effects, command line interface, and dynamic data visualization.",
        techStack: ["JavaScript", "Canvas API", "WebGL", "CSS3", "HTML5"],
        complexity: 8,
        funFactor: 9,
        linesOfCode: 3500,
        buildTime: "3 weeks",
        previewTitle: "Terminal v1.0",
        previewText: "> system status: ONLINE\n> memory: 87%\n> cpu: 45%\n> network: STABLE",
        previewCode: "function initTerminal() {\n  const matrix = new ParticleMatrix();\n  matrix.start();\n  return matrix;\n}",
        demoLink: "https://demo.cyberpunk-terminal.com",
        codeLink: "https://github.com/kaishi/cyberpunk-terminal",
        keyFeatures: [
            "Real-time particle system",
            "Interactive command line",
            "Dynamic data visualization",
            "Responsive design",
            "Custom shader effects"
        ],
        views: 1250,
        likes: 320,
        date: "2024-03-15"
    },
    {
        id: 2,
        title: "Neon Glitch Game",
        category: "game",
        badges: ["RETRO", "EXPERIMENTAL"],
        shortDescription: "80s-inspired arcade game with glitch effects",
        description: "A retro arcade game inspired by 80s cyberpunk aesthetics. Features neon visuals, glitch effects, and challenging gameplay mechanics.",
        techStack: ["Phaser 3", "WebGL", "GLSL", "Howler.js"],
        complexity: 7,
        funFactor: 10,
        linesOfCode: 5200,
        buildTime: "6 weeks",
        previewTitle: "Neon Runner",
        previewText: "Score: 24500\nLevel: 5\nLives: 3\nTime: 02:45",
        previewCode: "class Player extends Phaser.Physics.Arcade.Sprite {\n  constructor(scene, x, y) {\n    super(scene, x, y, 'player');\n    scene.add.existing(this);\n    scene.physics.add.existing(this);\n  }\n}",
        demoLink: "https://play.neon-glitch.com",
        codeLink: "https://github.com/kaishi/neon-glitch",
        keyFeatures: [
            "Retro pixel art graphics",
            "Dynamic glitch effects",
            "Multiple game modes",
            "Leaderboard system",
            "Original soundtrack"
        ],
        views: 2100,
        likes: 450,
        date: "2024-02-28"
    },
    {
        id: 3,
        title: "AI Code Assistant",
        category: "tool",
        badges: ["AI", "PRODUCTIVITY"],
        shortDescription: "Intelligent code completion and analysis tool",
        description: "An AI-powered code assistant that provides intelligent suggestions, error detection, and code optimization recommendations in real-time.",
        techStack: ["Python", "TensorFlow", "React", "Node.js", "WebSocket"],
        complexity: 9,
        funFactor: 7,
        linesOfCode: 8900,
        buildTime: "2 months",
        previewTitle: "CodeMind AI",
        previewText: "Analyzing your code...\nFound 3 optimizations\nSuggesting improvements\nAutocomplete ready",
        previewCode: "const model = await loadModel('code-assistant');\nconst suggestions = model.predict(codeContext);\nreturn optimize(suggestions);",
        demoLink: "https://ai.kaishi.dev/code-assistant",
        codeLink: "https://github.com/kaishi/ai-code-assistant",
        keyFeatures: [
            "Real-time code analysis",
            "Intelligent autocomplete",
            "Performance optimization",
            "Multi-language support",
            "Custom model training"
        ],
        views: 1800,
        likes: 380,
        date: "2024-01-10"
    },
    {
        id: 4,
        title: "Blockchain Visualizer",
        category: "web",
        badges: ["REALTIME", "EXPERIMENTAL"],
        shortDescription: "Real-time blockchain data visualization",
        description: "A web application that visualizes blockchain transactions and network activity in real-time using 3D graphics and interactive charts.",
        techStack: ["Three.js", "WebSocket", "D3.js", "Ethereum API"],
        complexity: 8,
        funFactor: 8,
        linesOfCode: 4200,
        buildTime: "4 weeks",
        previewTitle: "Blockchain Explorer",
        previewText: "Block #15428763\nTransactions: 142\nGas: 45.2 Gwei\nTime: 12.4s",
        previewCode: "function visualizeTransaction(tx) {\n  const node = createNode(tx.from);\n  const edge = createEdge(tx.to);\n  animateFlow(node, edge);\n}",
        demoLink: "https://blockchain-viz.kaishi.dev",
        codeLink: "https://github.com/kaishi/blockchain-visualizer",
        keyFeatures: [
            "Real-time transaction streaming",
            "3D network visualization",
            "Interactive charts",
            "Multi-chain support",
            "Historical data analysis"
        ],
        views: 1950,
        likes: 290,
        date: "2024-03-01"
    },
    {
        id: 5,
        title: "CLI Dashboard",
        category: "tool",
        badges: ["CLI", "PRODUCTIVITY"],
        shortDescription: "Terminal-based system monitoring dashboard",
        description: "A command-line interface dashboard for monitoring system resources, network activity, and process management with a modern UI.",
        techStack: ["Node.js", "Bash", "Socket.io", "Chart.js"],
        complexity: 6,
        funFactor: 6,
        linesOfCode: 2800,
        buildTime: "3 weeks",
        previewTitle: "SysMon CLI",
        previewText: "CPU: ████████░░ 78%\nMEM: ██████░░░░ 62%\nNET: ██████████ 100%\nDISK: ████░░░░░░ 42%",
        previewCode: "class Dashboard {\n  constructor() {\n    this.metrics = new SystemMetrics();\n    this.ui = new CLIInterface();\n  }\n}",
        demoLink: "https://cli.kaishi.dev/dashboard",
        codeLink: "https://github.com/kaishi/cli-dashboard",
        keyFeatures: [
            "Real-time system monitoring",
            "Customizable widgets",
            "Process management",
            "Network analysis",
            "Plugin system"
        ],
        views: 1400,
        likes: 210,
        date: "2024-02-15"
    },
    {
        id: 6,
        title: "Audio Visualizer",
        category: "exp",
        badges: ["EXPERIMENTAL", "REALTIME"],
        shortDescription: "Interactive audio visualization with Web Audio API",
        description: "An experimental audio visualization tool that creates dynamic visual effects based on audio input using the Web Audio API and Canvas.",
        techStack: ["Web Audio API", "Canvas", "JavaScript", "FFT"],
        complexity: 7,
        funFactor: 9,
        linesOfCode: 3100,
        buildTime: "2 weeks",
        previewTitle: "SoundScape",
        previewText: "Frequency: 440Hz\nAmplitude: 0.75\nBPM: 128\nVisual: Spectrum",
        previewCode: "const analyzer = audioContext.createAnalyser();\nconst dataArray = new Uint8Array(analyzer.frequencyBinCount);\nanalyzer.getByteFrequencyData(dataArray);",
        demoLink: "https://audio-viz.kaishi.dev",
        codeLink: "https://github.com/kaishi/audio-visualizer",
        keyFeatures: [
            "Real-time audio analysis",
            "Multiple visualization modes",
            "Microphone/File input",
            "Customizable effects",
            "Beat detection"
        ],
        views: 2300,
        likes: 410,
        date: "2024-03-10"
    },
    {
        id: 7,
        title: "API Gateway",
        category: "web",
        badges: ["PRODUCTION", "SCALABLE"],
        shortDescription: "High-performance API gateway with monitoring",
        description: "A scalable API gateway solution with rate limiting, authentication, monitoring, and load balancing capabilities.",
        techStack: ["Go", "Redis", "Docker", "Prometheus", "Grafana"],
        complexity: 9,
        funFactor: 5,
        linesOfCode: 12500,
        buildTime: "3 months",
        previewTitle: "APIGate v2.0",
        previewText: "Requests/sec: 2450\nLatency: 42ms\nErrors: 0.2%\nUptime: 99.99%",
        previewCode: "func (g *Gateway) HandleRequest(r *http.Request) {\n  if !g.RateLimit(r) {\n    return ErrRateLimited\n  }\n  return g.Proxy(r)\n}",
        demoLink: "https://api.kaishi.dev/gateway",
        codeLink: "https://github.com/kaishi/api-gateway",
        keyFeatures: [
            "Rate limiting",
            "JWT authentication",
            "Real-time monitoring",
            "Load balancing",
            "Circuit breaker"
        ],
        views: 1600,
        likes: 180,
        date: "2024-01-25"
    },
    {
        id: 8,
        title: "Pixel Art Editor",
        category: "tool",
        badges: ["RETRO", "CREATIVE"],
        shortDescription: "Web-based pixel art creation tool",
        description: "A feature-rich pixel art editor with animation support, palette management, and export capabilities for game development.",
        techStack: ["React", "Canvas", "IndexedDB", "PWA"],
        complexity: 7,
        funFactor: 8,
        linesOfCode: 6500,
        buildTime: "5 weeks",
        previewTitle: "PixelForge",
        previewText: "Canvas: 32x32\nColors: 16\nLayers: 3\nTools: Brush, Fill, Line",
        previewCode: "class PixelEditor {\n  constructor(canvas) {\n    this.canvas = canvas;\n    this.ctx = canvas.getContext('2d');\n    this.palette = new Palette();\n  }\n}",
        demoLink: "https://pixel-art.kaishi.dev",
        codeLink: "https://github.com/kaishi/pixel-art-editor",
        keyFeatures: [
            "Layer-based editing",
            "Animation timeline",
            "Palette management",
            "Multiple export formats",
            "Offline support"
        ],
        views: 2750,
        likes: 520,
        date: "2024-02-05"
    }
];

// Helper functions
export function getProjectsStats() {
    const totalProjects = projectsData.length;
    const totalViews = projectsData.reduce((sum, project) => sum + project.views, 0);
    const totalLikes = projectsData.reduce((sum, project) => sum + project.likes, 0);
    const avgComplexity = projectsData.reduce((sum, project) => sum + project.complexity, 0) / totalProjects;
    
    return {
        totalProjects,
        totalViews,
        totalLikes,
        avgComplexity: avgComplexity.toFixed(1),
        categories: [...new Set(projectsData.map(p => p.category))]
    };
}

export function searchProjects(query, category = 'all') {
    const lowerQuery = query.toLowerCase();
    
    return projectsData.filter(project => {
        // Filter by category first
        if (category !== 'all' && project.category !== category) {
            return false;
        }
        
        // Search in multiple fields
        return (
            project.title.toLowerCase().includes(lowerQuery) ||
            project.description.toLowerCase().includes(lowerQuery) ||
            project.shortDescription.toLowerCase().includes(lowerQuery) ||
            project.techStack.some(tech => tech.toLowerCase().includes(lowerQuery)) ||
            project.keyFeatures.some(feature => feature.toLowerCase().includes(lowerQuery))
        );
    });
}

export function getProjectsByCategory(category) {
    if (category === 'all') {
        return [...projectsData];
    }
    return projectsData.filter(project => project.category === category);
}

export function sortProjects(projects, sortBy = 'newest') {
    const sorted = [...projects];
    
    switch(sortBy) {
        case 'newest':
            return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
            
        case 'complexity':
            return sorted.sort((a, b) => b.complexity - a.complexity);
            
        case 'popular':
            return sorted.sort((a, b) => b.views - a.views);
            
        case 'random':
            return sorted.sort(() => Math.random() - 0.5);
            
        default:
            return sorted;
    }
}

export function incrementViews(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (project) {
        project.views += 1;
        return project.views;
    }
    return 0;
}

export function toggleLike(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (project) {
        // Simple toggle logic - in real app, this would check user's like status
        project.likes += 1;
        return project.likes;
    }
    return 0;
}

// Export default untuk kemudahan import
export default {
    projectsData,
    getProjectsStats,
    searchProjects,
    getProjectsByCategory,
    sortProjects,
    incrementViews,
    toggleLike
};