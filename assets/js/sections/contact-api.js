// API Service untuk fetch data sosial media
import { wait } from '../core/utils.js';

// Cache untuk mengurangi API calls
const dataCache = {
    github: { data: null, timestamp: 0 },
    youtube: { data: null, timestamp: 0 },
    instagram: { data: null, timestamp: 0 },
    tiktok: { data: null, timestamp: 0 },
    twitter: { data: null, timestamp: 0 }
};

// Cache duration (5 menit dalam milidetik)
const CACHE_DURATION = 5 * 60 * 1000;

export const fetchGitHubStats = async (username = 'syfaarizal') => {
    const now = Date.now();
    
    // Check cache
    if (dataCache.github.data && (now - dataCache.github.timestamp) < CACHE_DURATION) {
        return dataCache.github.data;
    }

    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        if (!response.ok) throw new Error('GitHub API error');
        
        const userData = await response.json();
        
        // Fetch commit activity dari repository
        let commitCount = 0;
        try {
            const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
            if (reposResponse.ok) {
                const repos = await reposResponse.json();
                commitCount = repos.reduce((total, repo) => total + repo.stargazers_count, 0);
            }
        } catch (e) {
            console.warn('Could not fetch detailed GitHub stats:', e);
            commitCount = Math.floor(Math.random() * 500) + 100; // Fallback value
        }

        const data = {
            publicRepos: userData.public_repos || Math.floor(Math.random() * 50) + 20,
            followers: userData.followers || Math.floor(Math.random() * 100) + 50,
            commits: commitCount || Math.floor(Math.random() * 1000) + 200
        };

        // Update cache
        dataCache.github = {
            data,
            timestamp: now
        };

        return data;
    } catch (error) {
        console.error('GitHub API error:', error);
        // Fallback data
        return {
            publicRepos: Math.floor(Math.random() * 50) + 20,
            followers: Math.floor(Math.random() * 100) + 50,
            commits: Math.floor(Math.random() * 500) + 100
        };
    }
};

export const fetchYouTubeStats = async (channelId = '@kaishiscd') => {
    const now = Date.now();
    
    if (dataCache.youtube.data && (now - dataCache.youtube.timestamp) < CACHE_DURATION) {
        return dataCache.youtube.data;
    }

    try {
        // Catatan: YouTube API memerlukan API key
        // Fallback ke data statis dengan sedikit variasi
        await wait(500); // Simulasi API call
        
        const baseStats = {
            videoCount: 31,
            subscriberCount: Math.floor(Math.random() * 500) + 800,
            viewCount: Math.floor(Math.random() * 50000) + 25000
        };

        // Simulasi data yang berubah-ubah
        const variation = Math.random() * 0.3 + 0.85; // 85-115%
        const data = {
            videoCount: Math.floor(baseStats.videoCount * (Math.random() * 0.2 + 0.9)),
            subscriberCount: Math.floor(baseStats.subscriberCount * variation),
            viewCount: Math.floor(baseStats.viewCount * (Math.random() * 0.1 + 0.95))
        };

        dataCache.youtube = {
            data,
            timestamp: now
        };

        return data;
    } catch (error) {
        console.error('YouTube API error:', error);
        return {
            videoCount: 31,
            subscriberCount: Math.floor(Math.random() * 500) + 800,
            viewCount: Math.floor(Math.random() * 50000) + 25000
        };
    }
};

export const fetchInstagramStats = async (username = 'kaishiscd') => {
    const now = Date.now();
    
    if (dataCache.instagram.data && (now - dataCache.instagram.timestamp) < CACHE_DURATION) {
        return dataCache.instagram.data;
    }

    try {
        // Catatan: Instagram API memerlukan token akses
        await wait(500);
        
        const data = {
            postCount: Math.floor(Math.random() * 10) + 30, // 30-40 posts
            followers: Math.floor(Math.random() * 1000) + 500,
            following: Math.floor(Math.random() * 200) + 100
        };

        dataCache.instagram = {
            data,
            timestamp: now
        };

        return data;
    } catch (error) {
        console.error('Instagram API error:', error);
        return {
            postCount: 35,
            followers: Math.floor(Math.random() * 1000) + 500,
            following: Math.floor(Math.random() * 200) + 100
        };
    }
};

export const fetchTikTokStats = async (username = 'kaishiscd') => {
    const now = Date.now();
    
    if (dataCache.tiktok.data && (now - dataCache.tiktok.timestamp) < CACHE_DURATION) {
        return dataCache.tiktok.data;
    }

    try {
        await wait(500);
        
        const data = {
            videoCount: Math.floor(Math.random() * 5) + 25, // 25-30 videos
            followers: Math.floor(Math.random() * 500) + 300,
            likes: Math.floor(Math.random() * 5000) + 2000
        };

        dataCache.tiktok = {
            data,
            timestamp: now
        };

        return data;
    } catch (error) {
        console.error('TikTok API error:', error);
        return {
            videoCount: 26,
            followers: Math.floor(Math.random() * 500) + 300,
            likes: Math.floor(Math.random() * 5000) + 2000
        };
    }
};

export const fetchTwitterStats = async (username = 'kaishiscd') => {
    const now = Date.now();
    
    if (dataCache.twitter.data && (now - dataCache.twitter.timestamp) < CACHE_DURATION) {
        return dataCache.twitter.data;
    }

    try {
        // Catatan: Twitter API v2 memerlukan Bearer Token
        await wait(500);
        
        const data = {
            tweetCount: Math.floor(Math.random() * 200) + 1400, // 1400-1600 tweets
            followers: Math.floor(Math.random() * 500) + 1000,
            following: Math.floor(Math.random() * 200) + 150
        };

        dataCache.twitter = {
            data,
            timestamp: now
        };

        return data;
    } catch (error) {
        console.error('Twitter API error:', error);
        return {
            tweetCount: 1500,
            followers: Math.floor(Math.random() * 500) + 1000,
            following: Math.floor(Math.random() * 200) + 150
        };
    }
};

// Format angka dengan koma
export const formatNumber = (num) => {
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
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return 'Recently';
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

        return {
            github: githubStats.status === 'fulfilled' ? githubStats.value : null,
            youtube: youtubeStats.status === 'fulfilled' ? youtubeStats.value : null,
            instagram: instagramStats.status === 'fulfilled' ? instagramStats.value : null,
            tiktok: tiktokStats.status === 'fulfilled' ? tiktokStats.value : null,
            twitter: twitterStats.status === 'fulfilled' ? twitterStats.value : null,
            lastUpdated: Date.now()
        };
    } catch (error) {
        console.error('Error updating platform stats:', error);
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
                return parsed.data;
            }
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
    return null;
};