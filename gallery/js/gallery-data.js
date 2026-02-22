// gallery-data.js — Fixed: views/likes defaults added, NaN errors resolved

export const galleryImages = [
    { id: 1,  src: '/assets/img/gallery/KaiShiPose1.png',  title: 'URBAN RONIN',        theme: 'ronin',    description: 'Kai Shi moves through the city like a modern ronin, mixing ancient warrior spirit with street survival.',              tags: ['cyberpunk','samurai','night city','streetwear','katana'],       resolution: '1920×1080', size: '3.8 MB', format: 'PNG', date: '2025-12-26', featured: true,  views: 0, likes: 0 },
    { id: 2,  src: '/assets/img/gallery/KaiShiPose2.png',  title: 'NEON HACKER',         theme: 'cyberpunk',description: 'Kai Shi dives into layers of data, fingers moving fast as neon screens surround her.',                              tags: ['hacker','cyber','technology','neon lights','night'],            resolution: '1920×1080', size: '4.2 MB', format: 'PNG', date: '2025-01-10', featured: true,  views: 0, likes: 0 },
    { id: 3,  src: '/assets/img/gallery/KaiShiPose3.png',  title: 'REBEL GLITCH',        theme: 'urban',    description: 'With a teasing grin and glitchy neon details, Kai Shi shows her rebellious side without saying a word.',           tags: ['punk','rebel','neon','attitude','close-up'],                    resolution: '1920×1080', size: '5.1 MB', format: 'PNG', date: '2025-01-05', featured: true,  views: 0, likes: 0 },
    { id: 4,  src: '/assets/img/gallery/KaiShiPose4.png',  title: 'NIGHT ENFORCER',      theme: 'ronin',    description: 'Kai Shi rests with her blade close, watching the city from the shadows during her night patrol.',                  tags: ['ronin','street patrol','jacket','night city','katana'],         resolution: '1920×1080', size: '4.5 MB', format: 'PNG', date: '2025-01-02', featured: false, views: 0, likes: 0 },
    { id: 5,  src: '/assets/img/gallery/KaiShiPose11.png', title: 'VIOLET CONFESSION',   theme: 'gothic',   description: 'Kai Shi stands quietly in the dark, her eyes glowing softly as emotions linger beneath the surface.',              tags: ['gothic','dark mood','night','soft light','introspective'],      resolution: '2560×1440', size: '6.8 MB', format: 'PNG', date: '2025-12-28', featured: true,  views: 0, likes: 0 },
    { id: 6,  src: '/assets/img/gallery/KaiShiPose6.png',  title: 'SHADOW WINGS',        theme: 'gothic',   description: 'With black wings and a cold gaze, Kai Shi feels more myth than human.',                                           tags: ['dark angel','wings','gothic','fantasy'],                        resolution: '1920×1080', size: '3.2 MB', format: 'PNG', date: '2025-12-25', featured: true,  views: 0, likes: 0 },
    { id: 7,  src: '/assets/img/gallery/KaiShiPose7.png',  title: 'CONTROL ROOM',        theme: 'cyberpunk',description: 'Surrounded by cables and screens, Kai Shi controls her digital domain deep into the night.',                      tags: ['hacker room','servers','technology','night shift'],             resolution: '1920×1080', size: '4.7 MB', format: 'PNG', date: '2025-12-20', featured: false, views: 0, likes: 0 },
    { id: 8,  src: '/assets/img/gallery/KaiShiPose8.png',  title: 'CRIMSON FOCUS',       theme: 'portrait', description: 'Kai Shi stares forward with calm intensity, the city lights reflecting in her eyes.',                              tags: ['portrait','red eyes','night','serious mood'],                   resolution: '2560×1440', size: '7.2 MB', format: 'PNG', date: '2025-12-15', featured: false, views: 0, likes: 0 },
    { id: 9,  src: '/assets/img/gallery/KaiShiPose9.png',  title: 'SUNSET WATCH',        theme: 'ronin',    description: 'Kai Shi pauses at sunset, letting the city breathe before darkness fully takes over.',                             tags: ['sunset','urban','quiet moment','city view'],                    resolution: '2560×1440', size: '7.2 MB', format: 'PNG', date: '2025-12-15', featured: false, views: 0, likes: 0 },
    { id: 10, src: '/assets/img/gallery/KaiShiPose10.png', title: 'NEON RIOT STAGE',     theme: 'gothic',   description: 'Under flashing lights, Kai Shi tears through the night with raw sound and fearless energy.',                       tags: ['music','guitar','stage','neon','performance'],                  resolution: '2560×1440', size: '7.2 MB', format: 'PNG', date: '2025-12-15', featured: false, views: 0, likes: 0 },
    { id: 11, src: '/assets/img/gallery/KaiShiPose12.png', title: 'WHITE JACKET CODE',   theme: 'ronin',    description: 'Wearing her signature jacket, Kai Shi stands as a symbol of resistance in the city.',                             tags: ['cyberpunk','jacket','urban','street fighter'],                  resolution: '2560×1440', size: '7.2 MB', format: 'PNG', date: '2025-12-15', featured: false, views: 0, likes: 0 },
    { id: 12, src: '/assets/img/gallery/KaiShiPose13.png', title: 'BLADE PROTOCOL',      theme: 'ronin',    description: 'This is the moment before action — Kai Shi ready, focused, and deadly.',                                          tags: ['katana','combat stance','cyberpunk','tension'],                 resolution: '2560×1440', size: '7.2 MB', format: 'PNG', date: '2025-12-15', featured: false, views: 0, likes: 0 },
    { id: 13, src: '/assets/img/gallery/KaiShiPose14.png', title: 'STEEL RESOLVE',       theme: 'ronin',    description: 'Kai Shi holds her katana with confidence, her resolve sharpened by countless battles.',                            tags: ['samurai','weapon','urban warrior','discipline'],                resolution: '1920×1080', size: '4.7 MB', format: 'PNG', date: '2025-12-20', featured: false, views: 0, likes: 0 },
    { id: 14, src: '/assets/img/gallery/KaiShiPose15.png', title: 'NIGHT EXECUTIONER',   theme: 'ronin',    description: 'Blade in hand, Kai Shi prepares to strike — silent, precise, and unstoppable.',                                   tags: ['katana','assassin','dark city','combat'],                       resolution: '1920×1080', size: '4.7 MB', format: 'PNG', date: '2025-12-20', featured: false, views: 0, likes: 0 },
    { id: 15, src: '/assets/img/gallery/KaiShiPose16.png', title: 'GRAFFITI PULSE',      theme: 'urban',    description: 'Standing against vibrant graffiti, Kai Shi blends street culture with quiet rebellion.',                          tags: ['graffiti','street art','urban','rebel'],                        resolution: '1920×1080', size: '4.7 MB', format: 'PNG', date: '2025-12-20', featured: false, views: 0, likes: 0 },
    { id: 16, src: '/assets/img/gallery/KaiShiPose17.png', title: 'NEON COMPANION',      theme: 'urban',    description: 'In her quiet room, Kai Shi relaxes with her loyal companion while the city glows outside.',                       tags: ['cozy','wolf','night room','city lights'],                       resolution: '1920×1080', size: '4.7 MB', format: 'PNG', date: '2025-12-20', featured: false, views: 0, likes: 0 },
    { id: 17, src: '/assets/img/gallery/KaiShiPose18.png', title: 'CYBER NOEL',          theme: 'event',    description: 'Even in a neon future, Kai Shi finds a moment of warmth during the holiday season.',                              tags: ['christmas','cyberpunk','festive','night lights'],               resolution: '1920×1080', size: '4.7 MB', format: 'PNG', date: '2025-12-20', featured: false, views: 0, likes: 0 },
    { id: 18, src: '/assets/img/gallery/KaiShiPose19.png', title: 'WINTER GUARDIAN',     theme: 'event',    description: 'Wrapped in winter warmth, Kai Shi holds her companion close as soft lights glow around them.',                    tags: ['winter','christmas','wolf','soft mood'],                        resolution: '1920×1080', size: '4.7 MB', format: 'PNG', date: '2025-12-20', featured: false, views: 0, likes: 0 },
    { id: 19, src: '/assets/img/gallery/KaiShiPose20.png', title: 'MIDNIGHT OPERATOR',   theme: 'cyberpunk',description: 'Alone in her command room, Kai Shi works through the night, surrounded by humming machines and red light.',       tags: ['hacker','server room','night shift','technology'],              resolution: '1920×1080', size: '4.7 MB', format: 'PNG', date: '2025-12-20', featured: false, views: 0, likes: 0 },
    { id: 20, src: '/assets/img/gallery/KaiShiPose21.png', title: 'NEON NIGHT SHIFT',    theme: 'cyberpunk',description: 'Kai Shi works late into the night, neon screens glowing as she stays locked into her digital world.',              tags: ['cyberpunk','headphones','night','neon light','focused'],        resolution: '1920×1080', size: '4.7 MB', format: 'PNG', date: '2025-12-20', featured: false, views: 0, likes: 0 },
    { id: 21, src: '/assets/img/gallery/KaiShiPose22.png', title: 'ABYSS GAZE',          theme: 'portrait', description: "A close look into Kai Shi's eyes reveals exhaustion, focus, and something deeper beneath.",                       tags: ['close-up','intense eyes','dark mood','portrait'],               resolution: '1920×1080', size: '4.7 MB', format: 'PNG', date: '2025-12-20', featured: false, views: 0, likes: 0 },
    { id: 22, src: '/assets/img/gallery/KaiShiPose23.png', title: 'STREET VANGUARD',     theme: 'ronin',    description: "Adjusting her jacket, Kai Shi stands ready — a frontline figure in the city's quiet resistance.",               tags: ['cyberpunk','street fighter','jacket','urban'],                  resolution: '1920×1080', size: '4.7 MB', format: 'PNG', date: '2025-12-20', featured: false, views: 0, likes: 0 },
    { id: 23, src: '/assets/img/gallery/KaiShiPose24.png', title: 'FALLEN HALO',         theme: 'gothic',   description: 'Black wings spread behind her, Kai Shi walks the path of a fallen angel without regret.',                         tags: ['fallen angel','wings','dark fantasy','red glow'],              resolution: '1920×1080', size: '4.7 MB', format: 'PNG', date: '2025-12-20', featured: false, views: 0, likes: 0 },
    { id: 24, src: '/assets/img/gallery/KaiShiPose25.png', title: 'SOFT RED MOON',       theme: 'cute',     description: 'Under a soft red glow, Kai Shi turns back with a calm and slightly distant expression.',                          tags: ['soft lighting','romantic mood','portrait','red tones'],         resolution: '1920×1080', size: '4.7 MB', format: 'PNG', date: '2026-01-01', featured: false, views: 0, likes: 0 },
    { id: 25, src: '/assets/img/gallery/KaiShiPose26.png', title: 'QUIET POISE',         theme: 'urban',    description: 'With a subtle look and relaxed posture, Kai Shi carries quiet confidence without effort.',                         tags: ['minimal','dark fashion','calm','portrait'],                     resolution: '1920×1080', size: '4.7 MB', format: 'PNG', date: '2026-01-01', featured: false, views: 0, likes: 0 },
    { id: 26, src: '/assets/img/gallery/KaiShiPose27.png', title: 'ELEGANT STILLNESS',   theme: 'gothic',   description: 'Dressed with refined details, Kai Shi sits in silence, graceful yet untouchable.',                               tags: ['elegant','gothic','jewelry','soft light'],                      resolution: '1920×1080', size: '4.7 MB', format: 'PNG', date: '2026-01-01', featured: false, views: 0, likes: 0 },
    { id: 27, src: '/assets/img/gallery/KaiShiPose28.png', title: 'MIDNIGHT RIFF',       theme: 'urban',    description: 'With her bass in hand, Kai Shi lets music speak where words fall short.',                                         tags: ['music','bass guitar','night','street vibe'],                    resolution: '1920×1080', size: '4.7 MB', format: 'PNG', date: '2026-01-01', featured: false, views: 0, likes: 0 },
    { id: 28, src: '/assets/img/gallery/KaiShiPose29.png', title: 'RESTLESS GAZE',       theme: 'urban',    description: 'Leaning into the quiet, Kai Shi looks tired yet thoughtful, lost in her own head.',                               tags: ['introspective','dark mood','close-up','night'],                 resolution: '1920×1080', size: '4.7 MB', format: 'PNG', date: '2026-01-01', featured: false, views: 0, likes: 0 },
    { id: 29, src: '/assets/img/gallery/KaiShiPose30.png', title: 'PLAYFUL SIGNAL',      theme: 'cute',     description: 'Bright colors and playful energy show a lighter side of Kai Shi rarely seen.',                                    tags: ['cute','headphones','playful','anime style'],                    resolution: '1920×1080', size: '4.7 MB', format: 'PNG', date: '2026-01-01', featured: false, views: 0, likes: 0 },
    { id: 30, src: '/assets/img/gallery/KaiShiPose31.png', title: 'WARM SPARK',          theme: 'cute',     description: 'Wrapped in warmth, Kai Shi smiles softly, enjoying a simple and comforting moment.',                              tags: ['cozy','soft colors','warm mood','casual'],                      resolution: '1920×1080', size: '4.7 MB', format: 'PNG', date: '2026-01-01', featured: false, views: 0, likes: 0 },
    { id: 31, src: '/assets/img/gallery/KaiShiPose32.png', title: 'NEW YEAR LIGHTS',     theme: 'event',    description: 'As fireworks fill the sky, Kai Shi watches with quiet wonder, holding onto the moment.',                          tags: ['fireworks','night','cinematic','winter'],                       resolution: '1920×1080', size: '4.7 MB', format: 'PNG', date: '2026-01-01', featured: false, views: 0, likes: 0 },
    { id: 32, src: '/assets/img/gallery/KaiShiPose33.png', title: 'SHADOW FORM',         theme: 'portrait', description: 'Hidden in shadow, Kai Shi moves with a quiet presence that feels both distant and dangerous.',                    tags: ['gothic','dark outfit','mysterious','night'],                    resolution: '1920×1080', size: '4.7 MB', format: 'PNG', date: '2026-01-01', featured: false, views: 0, likes: 0 },
    { id: 33, src: '/assets/img/gallery/KaiShiPose34.png', title: 'URBAN STATIC',        theme: 'urban',    description: 'Against the cold city backdrop, Kai Shi stands firm, grounded in her own world.',                               tags: ['urban','streetwear','jacket','night city'],                     resolution: '1920×1080', size: '4.7 MB', format: 'PNG', date: '2026-01-01', featured: false, views: 0, likes: 0 },
    { id: 34, src: '/assets/img/gallery/KaiShiPose35.png', title: 'URBAN COMPANION',     theme: 'urban',    description: 'Kai Shi stands under city lights with her loyal companion, finding warmth in a cold urban night.',               tags: ['urban','night city','companion','soft light','streetwear'],     resolution: '1920×1080', size: '4.7 MB', format: 'PNG', date: '2026-01-01', featured: false, views: 0, likes: 0 },
    { id: 35, src: '/assets/img/gallery/KaiShiPose36.png', title: 'REDLINE SIGNAL',      theme: 'urban',    description: 'With wires and red accents around her, Kai Shi moves fast through chaos and raw energy.',                        tags: ['cyberpunk','rebel','red accents','techwear'],                   resolution: '1920×1080', size: '4.7 MB', format: 'PNG', date: '2026-01-01', featured: false, views: 0, likes: 0 },
    { id: 36, src: '/assets/img/gallery/KaiShiPose37.png', title: 'EMBER FALL',          theme: 'gothic',   description: 'Surrounded by rising flames, Kai Shi remains calm, letting fire reflect her inner resolve.',                     tags: ['fire','dark fantasy','intense mood','cinematic'],               resolution: '1920×1080', size: '4.7 MB', format: 'PNG', date: '2026-01-01', featured: false, views: 0, likes: 0 },
    { id: 37, src: '/assets/img/gallery/KaiShiPose38.png', title: 'SKULL STRIKE',        theme: 'urban',    description: 'Weapon raised and eyes locked forward, Kai Shi shows no hesitation when it\'s time to act.',                   tags: ['combat','urban fighter','weapon','aggressive'],                 resolution: '1920×1080', size: '4.7 MB', format: 'PNG', date: '2026-01-01', featured: false, views: 0, likes: 0 },
    { id: 38, src: '/assets/img/gallery/KaiShiPose39.png', title: 'CHAINED WILL',        theme: 'urban',    description: 'Even bound by chains, Kai Shi stares back with defiance, unbroken and unafraid.',                               tags: ['chains','rebellion','dark mood','defiance'],                    resolution: '1920×1080', size: '4.7 MB', format: 'PNG', date: '2026-01-01', featured: false, views: 0, likes: 0 },
    { id: 39, src: '/assets/img/gallery/KaiShiPose40.png', title: 'NEON FOCUS',          theme: 'cyberpunk',description: 'Headphones on and mind locked in, Kai Shi disappears into code and glowing screens.',                            tags: ['cyberpunk','hacker','headphones','night work'],                 resolution: '1920×1080', size: '4.7 MB', format: 'PNG', date: '2026-01-01', featured: false, views: 0, likes: 0 },
    { id: 40, src: '/assets/img/gallery/KaiShiPose41.png', title: 'BLUE HOUR SILENCE',   theme: 'urban',    description: 'In the quiet blue glow of the city, Kai Shi takes a moment to breathe and observe.',                            tags: ['night','city lights','calm','introspective'],                   resolution: '1920×1080', size: '4.7 MB', format: 'PNG', date: '2026-01-01', featured: false, views: 0, likes: 0 },
    { id: 41, src: '/assets/img/gallery/KaiShiPose42.png', title: 'CRIMSON EDGE',        theme: 'urban',    description: 'Leaning forward with a sharp smile, Kai Shi carries danger in both attitude and presence.',                      tags: ['punk','dark style','attitude','close-up'],                      resolution: '1920×1080', size: '4.7 MB', format: 'PNG', date: '2026-01-01', featured: false, views: 0, likes: 0 },
    { id: 42, src: '/assets/img/gallery/KaiShiPose43.png', title: 'VENOM SMILE',         theme: 'gothic',   description: 'With a teasing grin and cold eyes, Kai Shi blurs the line between charm and threat.',                            tags: ['gothic','dark portrait','seductive','dangerous'],               resolution: '1920×1080', size: '4.7 MB', format: 'PNG', date: '2026-01-01', featured: false, views: 0, likes: 0 },
];

// ── Helpers ────────────────────────────────────────────────────────────────
export const getImageById = (id) =>
    galleryImages.find(img => img.id === parseInt(id));

export const getImagesByTheme = (theme) =>
    theme === 'all' ? galleryImages : galleryImages.filter(img => img.theme === theme);

export const getFeaturedImages = () =>
    galleryImages.filter(img => img.featured);

export const searchImages = (query) => {
    const q = query.toLowerCase().trim();
    if (!q) return galleryImages;
    return galleryImages.filter(img =>
        img.title.toLowerCase().includes(q) ||
        img.description.toLowerCase().includes(q) ||
        img.tags.some(t => t.toLowerCase().includes(q)) ||
        img.theme.toLowerCase().includes(q)
    );
};

export const sortImages = (images, sortBy) => {
    const sorted = [...images];
    switch (sortBy) {
        case 'newest':  return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        case 'popular': return sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
        case 'random':  return sorted.sort(() => Math.random() - 0.5);
        default:        return sorted;
    }
};

export const getUniqueThemes = () => [...new Set(galleryImages.map(img => img.theme))];

export const getGalleryStats = () => {
    const totalImages  = galleryImages.length;
    const totalThemes  = getUniqueThemes().length;
    const totalSize    = galleryImages.reduce((sum, img) => sum + (parseFloat(img.size) || 0), 0);
    const themeCounts  = {};
    galleryImages.forEach(img => {
        themeCounts[img.theme] = (themeCounts[img.theme] || 0) + 1;
    });
    return {
        totalImages,
        totalThemes,
        totalSize: `${totalSize.toFixed(0)}MB`,
        themeCounts,
        featuredCount: galleryImages.filter(img => img.featured).length,
        newestImage: galleryImages.reduce((a, b) =>
            new Date(b.date) > new Date(a.date) ? b : a),
    };
};

export const incrementViews = (id) => {
    const img = getImageById(id);
    if (img) img.views = (img.views || 0) + 1;
};

export const toggleLike = (id) => {
    const img = getImageById(id);
    if (img) img.likes = (img.likes || 0) + 1;
};

export default {
    galleryImages,
    getImageById,
    getImagesByTheme,
    getFeaturedImages,
    searchImages,
    sortImages,
    getUniqueThemes,
    getGalleryStats,
    incrementViews,
    toggleLike,
};