import { apiService } from './api';

export const postsService = {
    getAllPosts: async () => {
        const response = await apiService.get('/post/');
        return response.data;
    },

    getPostById: async (id) => {
        const response = await apiService.get(`/post/${id}/`);
        return response.data;
    },

    getGroupPosts: async (groupId) => {
        const response = await apiService.get(`/post/?group=${groupId}`);
        return response.data;
    },

    createPost: async (postData) => {
        // postData: { group, content }
        const response = await apiService.post('/post/', postData);
        return response.data;
    },

    updatePost: async (id, postData) => {
        const response = await apiService.put(`/post/${id}/`, postData);
        return response.data;
    },

    deletePost: async (id) => {
        const response = await apiService.delete(`/post/${id}/`);
        return response.data;
    },

    getUserPosts: async () => {
        // Since backend doesn't have a specific endpoint for user posts,
        // we'll get all posts and filter by the current user
        const response = await apiService.get('/post/');
        const allPosts = response.data;

        // Get current user to filter posts
        const userResponse = await apiService.get('/users/');
        const currentUser = userResponse.data;

        // Filter posts created by the current user
        return allPosts.filter(post => post.creator?.id === currentUser?.id);
    },
}; 