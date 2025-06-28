import { apiService } from './api';

export const authService = {
    login: async (credentials) => {
        // credentials: { username, password }
        const response = await apiService.post('/login/', credentials);

        // Store tokens first
        const { access, refresh } = response.data;
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);

        // Now fetch user data with the token set
        try {
            const userResponse = await apiService.get('/users/');
            const user = userResponse.data;

            return {
                ...response.data,
                user
            };
        } catch (userError) {
            // If we can't fetch user data, still return the tokens
            console.warn('Could not fetch user data:', userError);
            return response.data;
        }
    },

    register: async (userData) => {
        // userData: { username, first_name, last_name, email, password, password2 }
        const response = await apiService.post('/users/', userData);

        // Store tokens first
        const { access, refresh } = response.data;
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);

        // Now fetch user data with the token set
        try {
            const userResponse = await apiService.get('/users/');
            const user = userResponse.data;

            return {
                ...response.data,
                user
            };
        } catch (userError) {
            // If we can't fetch user data, still return the tokens
            console.warn('Could not fetch user data:', userError);
            return response.data;
        }
    },

    logout: async () => {
        // No backend endpoint for logout, just clear tokens
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    },

    verifyToken: async () => {
        // Check if token exists first
        const token = localStorage.getItem('access_token');
        if (!token) {
            throw new Error('No token found');
        }

        // Try to fetch user data to verify token
        try {
            const response = await apiService.get('/users/');
            return response.data;
        } catch (error) {
            // If we get a 401, the token is invalid
            if (error.response?.status === 401) {
                throw new Error('Token verification failed');
            }
            throw error;
        }
    },

    getCurrentUser: async () => {
        // Fetch current user from backend
        try {
            const response = await apiService.get('/users/');
            return response.data;
        } catch (error) {
            return null;
        }
    },

    updateProfile: async (userData) => {
        // Not specified in backend, so just update local user
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
    },
}; 