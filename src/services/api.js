import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, STORAGE_KEY_USER_TOKEN } from '../constants/config';

/**
 * Get the auth token from AsyncStorage
 * @returns {Promise<string|null>} - Auth token or null
 */
export const getAuthToken = async () => {
    try {
        const token = await AsyncStorage.getItem(STORAGE_KEY_USER_TOKEN);
        return token;
    } catch (error) {
        console.error('Error getting auth token:', error);
        return null;
    }
};

/**
 * Create a new post via API
 * @param {Object} postData - {title, textContent}
 * @returns {Promise<Object>} - {success, post, error}
 */
export const createPost = async (postData) => {
    try {
        const token = await getAuthToken();
        if (!token) {
            return { success: false, error: 'No authentication token found' };
        }

        console.log('Creating post with token:', token ? 'Token exists' : 'No token');
        console.log('Post data:', postData);

        // Create URL-encoded form data
        const formBody = new URLSearchParams();
        formBody.append('content_type', 'note');
        formBody.append('title', postData.title);
        formBody.append('text_content', postData.textContent);

        console.log('Sending URL-encoded form data:', formBody.toString());

        const response = await fetch(`${API_BASE_URL}/posts/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${token}`
            },
            body: formBody.toString()
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', JSON.stringify(data, null, 2));

        if (!response.ok) {
            return {
                success: false,
                error: data.message || data.error || `Server error: ${response.status}`
            };
        }

        return data;
    } catch (error) {
        console.error('Error creating post:', error);
        return {
            success: false,
            error: error.message || 'Network error occurred'
        };
    }
};

/**
 * Fetch all posts from API
 * @param {number} skip - Number of posts to skip (for pagination)
 * @param {number} limit - Maximum number of posts to fetch
 * @returns {Promise<Array>} - Array of posts
 */
export const fetchPosts = async (skip = 0, limit = 20) => {
    try {
        const token = await getAuthToken();
        if (!token) {
            console.error('No authentication token found');
            return [];
        }

        const response = await fetch(`${API_BASE_URL}/posts/?skip=${skip}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.error('Failed to fetch posts:', response.status);
            return [];
        }

        const responseData = await response.json();
        console.log('Fetched posts:', responseData);

        // Extract posts from response.data.posts
        return responseData.data?.posts || [];
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
};

/**
 * Fetch current user's profile with stats
 * @returns {Promise<Object>} - {success, data: {user: {...}}}
 */
export const fetchUserProfile = async () => {
    try {
        const token = await getAuthToken();
        if (!token) {
            return { success: false, error: 'No authentication token found' };
        }

        const response = await fetch(`${API_BASE_URL}/users/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        console.log('Fetched user profile:', data);

        if (!response.ok) {
            return {
                success: false,
                error: data.error || `Server error: ${response.status}`
            };
        }

        return data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return {
            success: false,
            error: error.message || 'Network error occurred'
        };
    }
};

/**
 * Fetch user's own posts
 * @param {number} skip - Number of posts to skip (for pagination)
 * @param {number} limit - Maximum number of posts to fetch
 * @returns {Promise<Object>} - {success, results, data: {posts: [...]}}
 */
export const fetchMyPosts = async (skip = 0, limit = 20) => {
    try {
        const token = await getAuthToken();
        if (!token) {
            return { success: false, error: 'No authentication token found' };
        }

        const response = await fetch(
            `${API_BASE_URL}/posts/me?skip=${skip}&limit=${limit}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        const data = await response.json();
        console.log('Fetched my posts:', data);

        if (!response.ok) {
            return {
                success: false,
                error: data.error || `Server error: ${response.status}`
            };
        }

        return data;
    } catch (error) {
        console.error('Error fetching my posts:', error);
        return {
            success: false,
            error: error.message || 'Network error occurred'
        };
    }
};

/**
 * Delete a post (ownership validated by backend)
 * @param {string} postId - Post ID to delete
 * @returns {Promise<Object>} - {success, message}
 */
export const deletePost = async (postId) => {
    try {
        const token = await getAuthToken();
        if (!token) {
            return { success: false, error: 'No authentication token found' };
        }

        const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        console.log('Delete post response:', data);

        if (!response.ok) {
            return {
                success: false,
                error: data.error || `Server error: ${response.status}`
            };
        }

        return data;
    } catch (error) {
        console.error('Error deleting post:', error);
        return {
            success: false,
            error: error.message || 'Network error occurred'
        };
    }
};
