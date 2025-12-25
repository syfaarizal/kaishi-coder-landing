// API Service untuk fetch data sosial media
import { wait } from '../core/utils.js';

// Load API keys dari window._env atau process.env
const getEnvVar = (key) => {
    // Coba dari window._env (untuk development)
    if (typeof window !== 'undefined' && window._env && window._env[key]) {
        return window._env[key].trim();
    }
    
    // Coba dari import.meta.env (Vite)
    try {
        if (import.meta && import.meta.env && import.meta.env[key]) {
            return import.meta.env[key].trim();
        }
    } catch (e) {
        // import.meta not available
    }
    
    // Coba dari process.env (Node.js)
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
        return process.env[key].trim();
    }
    
    return null;
};

const getAPIKeys = () => ({
    github: getEnvVar('VITE_GITHUB_TOKEN') || getEnvVar('GITHUB_TOKEN'),
    youtube: {
        apiKey: getEnvVar('VITE_YOUTUBE_API_KEY') || getEnvVar('YOUTUBE_API_KEY'),
        channelId: getEnvVar('VITE_YOUTUBE_CHANNEL_ID') || getEnvVar('YOUTUBE_CHANNEL_ID') || '@kaishiscd'
    },
    twitter: {
        bearerToken: getEnvVar('VITE_TWITTER_BEARER_TOKEN') || getEnvVar('TWITTER_BEARER_TOKEN')
    },
    instagram: {
        accessToken: getEnvVar('VITE_INSTAGRAM_ACCESS_TOKEN') || getEnvVar('INSTAGRAM_ACCESS_TOKEN'),
        userId: getEnvVar('VITE_INSTAGRAM_USER_ID') || getEnvVar('INSTAGRAM_USER_ID')
    },
    tiktok: {
        accessToken: getEnvVar('VITE_TIKTOK_ACCESS_TOKEN') || getEnvVar('TIKTOK_ACCESS_TOKEN')
    }
});

let API_KEYS = null;

// Cache untuk mengurangi API calls
const dataCache = {
    github: { data: null, timestamp: 0 },
    youtube: { data: null, timestamp: 0 },
    instagram: { data: null, timestamp: 0 },
    tiktok: { data: null, timestamp: 0 },
    twitter: { data: null, timestamp: 0 }
};

const CACHE_DURATION = 5 * 60 * 1000;

// Debug: Log untuk cek environment
let hasImportMeta = false;
try {
    hasImportMeta = !!(import.meta);
} catch (e) {
    hasImportMeta = false;
}

console.log('Environment check:', {
    hasWindow: typeof window !== 'undefined',
    hasImportMeta: hasImportMeta,
    hasProcess: typeof process !== 'undefined',
    envKeys: Object.keys(getAPIKeys())
});

export const fetchGitHubStats = async (username = 'syfaarizal') => {
    if (!API_KEYS) API_KEYS = getAPIKeys();
    const now = Date.now();
    
    if (dataCache.github.data && (now - dataCache.github.timestamp) < CACHE_DURATION) {
        return dataCache.github.data;
    }

    try {
        const headers = {};
        if (API_KEYS.github) {
            headers['Authorization'] = `token ${API_KEYS.github}`;
        }

        const response = await fetch(`https://api.github.com/users/${username}`, { headers });
        if (!response.ok) throw new Error('GitHub API error');
        
        const userData = await response.json();
        
        // Fetch commit activity dengan rate limit handling
        let commitCount = 0;
        try {
            const reposResponse = await fetch(
                `https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`,
                { headers }
            );
            if (reposResponse.ok) {
                const repos = await reposResponse.json();
                commitCount = repos.reduce((total, repo) => total + (repo.stargazers_count || 0), 0);
            }
        } catch (e) {
            console.warn('Could not fetch detailed GitHub stats:', e);
            commitCount = userData.public_repos * 10 || 421; // Estimate
        }

        const data = {
            publicRepos: userData.public_repos || 38,
            followers: userData.followers || 120,
            commits: commitCount || 421,
            lastUpdated: userData.updated_at
        };

        dataCache.github = {
            data,
            timestamp: now
        };

        return data;
    } catch (error) {
        console.error('GitHub API error:', error);
        return {
            publicRepos: 38,
            followers: 120,
            commits: 421
        };
    }
};

export const fetchYouTubeStats = async () => {
    if (!API_KEYS) API_KEYS = getAPIKeys();
    const now = Date.now();
    
    if (dataCache.youtube.data && (now - dataCache.youtube.timestamp) < CACHE_DURATION) {
        return dataCache.youtube.data;
    }

    // Jika tidak ada API key, gunakan fallback
    if (!API_KEYS.youtube.apiKey) {
        console.log('YouTube: Using fallback data (no API key)');
        return getFallbackYouTubeStats();
    }

    try {
        const channelId = API_KEYS.youtube.channelId;
        const apiKey = API_KEYS.youtube.apiKey;
        
        console.log('Fetching YouTube stats with channel:', channelId);
        
        // Fetch channel statistics
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${channelId}&key=${apiKey}`
        );
        
        if (!response.ok) {
            console.error('YouTube API response not OK:', response.status);
            throw new Error('YouTube API error');
        }
        
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            const stats = data.items[0].statistics;
            const snippet = data.items[0].snippet;
            
            const youtubeData = {
                videoCount: parseInt(stats.videoCount) || 31,
                subscriberCount: parseInt(stats.subscriberCount) || 1000,
                viewCount: parseInt(stats.viewCount) || 50000,
                channelTitle: snippet.title || '@kaishiscd',
                lastUpdated: new Date().toISOString()
            };

            dataCache.youtube = {
                data: youtubeData,
                timestamp: now
            };

            console.log('YouTube stats fetched:', youtubeData);
            return youtubeData;
        }
        
        console.log('YouTube: No items in response, using fallback');
        return getFallbackYouTubeStats();
    } catch (error) {
        console.error('YouTube API error:', error);
        return getFallbackYouTubeStats();
    }
};

// Fallback function untuk YouTube
const getFallbackYouTubeStats = () => {
    const variation = Math.random() * 0.3 + 0.85;
    return {
        videoCount: Math.floor(31 * (Math.random() * 0.2 + 0.9)),
        subscriberCount: Math.floor((Math.random() * 500 + 800) * variation),
        viewCount: Math.floor((Math.random() * 50000 + 25000) * (Math.random() * 0.1 + 0.95))
    };
};

export const fetchInstagramStats = async (username = 'kaishiscd') => {
    if (!API_KEYS) API_KEYS = getAPIKeys();
    const now = Date.now();
    
    if (dataCache.instagram.data && (now - dataCache.instagram.timestamp) < CACHE_DURATION) {
        return dataCache.instagram.data;
    }

    // Jika tidak ada access token, gunakan fallback
    if (!API_KEYS.instagram.accessToken) {
        console.log('Instagram: Using fallback data (no access token)');
        return getFallbackInstagramStats();
    }

    try {
        const accessToken = API_KEYS.instagram.accessToken;
        const userId = API_KEYS.instagram.userId;
        
        console.log('Fetching Instagram stats for user:', userId);
        
        // Instagram Graph API
        const response = await fetch(
            `https://graph.instagram.com/${userId}?fields=id,username,media_count,followers_count,follows_count&access_token=${accessToken}`
        );
        
        if (!response.ok) {
            console.error('Instagram API response not OK:', response.status);
            throw new Error('Instagram API error');
        }
        
        const data = await response.json();
        
        const instagramData = {
            postCount: data.media_count || Math.floor(Math.random() * 10) + 30,
            followers: data.followers_count || Math.floor(Math.random() * 1000) + 500,
            following: data.follows_count || Math.floor(Math.random() * 200) + 100,
            username: data.username || 'kaishiscd'
        };

        dataCache.instagram = {
            data: instagramData,
            timestamp: now
        };

        console.log('Instagram stats fetched:', instagramData);
        return instagramData;
    } catch (error) {
        console.error('Instagram API error:', error);
        return getFallbackInstagramStats();
    }
};

const getFallbackInstagramStats = () => {
    return {
        postCount: Math.floor(Math.random() * 10) + 30,
        followers: Math.floor(Math.random() * 1000) + 500,
        following: Math.floor(Math.random() * 200) + 100
    };
};

export const fetchTikTokStats = async (username = 'kaishiscd') => {
    if (!API_KEYS) API_KEYS = getAPIKeys();
    const now = Date.now();
    
    if (dataCache.tiktok.data && (now - dataCache.tiktok.timestamp) < CACHE_DURATION) {
        return dataCache.tiktok.data;
    }

    // Jika tidak ada access token, gunakan fallback
    if (!API_KEYS.tiktok.accessToken) {
        console.log('TikTok: Using fallback data (no access token)');
        return getFallbackTikTokStats();
    }

    // TikTok API memerlukan authentication khusus
    // Untuk sekarang, gunakan fallback
    console.log('TikTok: API not implemented, using fallback');
    return getFallbackTikTokStats();
};

const getFallbackTikTokStats = () => {
    return {
        videoCount: Math.floor(Math.random() * 5) + 25,
        followers: Math.floor(Math.random() * 500) + 300,
        likes: Math.floor(Math.random() * 5000) + 2000
    };
};

export const fetchTwitterStats = async (username = 'kaishiscd') => {
    if (!API_KEYS) API_KEYS = getAPIKeys();
    const now = Date.now();
    
    if (dataCache.twitter.data && (now - dataCache.twitter.timestamp) < CACHE_DURATION) {
        return dataCache.twitter.data;
    }

    // Jika tidak ada bearer token, gunakan fallback
    if (!API_KEYS.twitter.bearerToken) {
        console.log('Twitter: Using fallback data (no bearer token)');
        return getFallbackTwitterStats();
    }

    try {
        const bearerToken = API_KEYS.twitter.bearerToken;
        
        console.log('Fetching Twitter stats for:', username);
        
        // Twitter API v2
        const response = await fetch(
            `https://api.twitter.com/2/users/by/username/${username}?user.fields=public_metrics`,
            {
                headers: {
                    'Authorization': `Bearer ${bearerToken}`
                }
            }
        );
        
        if (!response.ok) {
            console.error('Twitter API response not OK:', response.status);
            throw new Error('Twitter API error');
        }
        
        const data = await response.json();
        
        if (data.data && data.data.public_metrics) {
            const metrics = data.data.public_metrics;
            
            const twitterData = {
                tweetCount: metrics.tweet_count || 1500,
                followers: metrics.followers_count || 1000,
                following: metrics.following_count || 150,
                username: data.data.username || 'kaishiscd'
            };

            dataCache.twitter = {
                data: twitterData,
                timestamp: now
            };

            console.log('Twitter stats fetched:', twitterData);
            return twitterData;
        }
        
        console.log('Twitter: No data in response, using fallback');
        return getFallbackTwitterStats();
    } catch (error) {
        console.error('Twitter API error:', error);
        return getFallbackTwitterStats();
    }
};

const getFallbackTwitterStats = () => {
    return {
        tweetCount: Math.floor(Math.random() * 200) + 1400,
        followers: Math.floor(Math.random() * 500) + 1000,
        following: Math.floor(Math.random() * 200) + 150
    };
};

// Format angka dengan koma
export const formatNumber = (num) => {
    if (!num && num !== 0) return '0';
    
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
};

// Format waktu relatif
export const formatRelativeTime = (timestamp) => {
    if (!timestamp) return 'Recently';
    
    const now = Date.now();
    const date = new Date(timestamp);
    const diff = now - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Update stats untuk semua platform
export const updateAllPlatformStats = async () => {
    try {
        const [
            githubStats,
            youtubeStats,
            instagramStats,
            tiktokStats,
            twitterStats
        ] = await Promise.allSettled([
            fetchGitHubStats(),
            fetchYouTubeStats(),
            fetchInstagramStats(),
            fetchTikTokStats(),
            fetchTwitterStats()
        ]);

        const stats = {
            github: githubStats.status === 'fulfilled' ? githubStats.value : null,
            youtube: youtubeStats.status === 'fulfilled' ? youtubeStats.value : null,
            instagram: instagramStats.status === 'fulfilled' ? instagramStats.value : null,
            tiktok: tiktokStats.status === 'fulfilled' ? tiktokStats.value : null,
            twitter: twitterStats.status === 'fulfilled' ? twitterStats.value : null,
            lastUpdated: Date.now()
        };

        // Log API usage status
        console.log('📊 API Status Report:', {
            github: githubStats.status,
            youtube: youtubeStats.status,
            instagram: instagramStats.status,
            twitter: twitterStats.status,
            tiktok: tiktokStats.status,
            usingRealAPIs: {
                github: !!API_KEYS.github,
                youtube: !!API_KEYS.youtube.apiKey,
                instagram: !!API_KEYS.instagram.accessToken,
                twitter: !!API_KEYS.twitter.bearerToken,
                tiktok: !!API_KEYS.tiktok.accessToken
            }
        });

        return stats;
    } catch (error) {
        console.error('❌ Error updating platform stats:', error);
        return null;
    }
};

// Simpan data ke localStorage sebagai fallback
export const saveStatsToLocalStorage = (stats) => {
    try {
        localStorage.setItem('socialMediaStats', JSON.stringify({
            data: stats,
            timestamp: Date.now()
        }));
        console.log('💾 Stats saved to localStorage');
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
};

// Load data dari localStorage
export const loadStatsFromLocalStorage = () => {
    try {
        const saved = localStorage.getItem('socialMediaStats');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Jika data kurang dari 1 jam yang lalu, gunakan
            if (Date.now() - parsed.timestamp < 3600000) {
                console.log('📂 Loaded stats from localStorage');
                return parsed.data;
            }
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
    return null;
};

// Cek apakah API keys tersedia
export const checkAPIKeys = () => {
    if (!API_KEYS) API_KEYS = getAPIKeys();
    return {
        hasGitHubKey: !!API_KEYS.github,
        hasYouTubeKey: !!API_KEYS.youtube.apiKey,
        hasInstagramKey: !!API_KEYS.instagram.accessToken,
        hasTwitterKey: !!API_KEYS.twitter.bearerToken,
        hasTikTokKey: !!API_KEYS.tiktok.accessToken
    };
};

// Setup untuk development: masukkan API keys langsung ke window
if (typeof window !== 'undefined') {
    window.debugAPI = {
        setAPIKey: (platform, key, value) => {
            if (!window._env) window._env = {};
            if (!window._env[platform]) window._env[platform] = {};
            window._env[platform][key] = value;
            API_KEYS = null; // Reset cache
            console.log(`Set ${platform}.${key} = ${value}`);
        },
        refreshAll: updateAllPlatformStats,
        checkKeys: checkAPIKeys,
        clearCache: () => {
            Object.keys(dataCache).forEach(key => {
                dataCache[key] = { data: null, timestamp: 0 };
            });
            localStorage.removeItem('socialMediaStats');
            console.log('Cache cleared');
        }
    };
}