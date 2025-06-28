import { apiService } from './api';

export const groupsService = {
    getAllGroups: async () => {
        const response = await apiService.get('/groups/');
        return response.data;
    },

    getUserGroups: async () => {
        // Since backend doesn't have a specific endpoint for user groups,
        // we'll get all groups and filter by the current user
        const response = await apiService.get('/groups/');
        const allGroups = response.data;

        // Get current user to filter groups
        const userResponse = await apiService.get('/users/');
        const currentUser = userResponse.data;

        // Filter groups created by the current user
        return allGroups.filter(group => group.creator?.id === currentUser?.id);
    },

    getGroupById: async (id) => {
        const response = await apiService.get(`/groups/${id}/`);
        return response.data;
    },

    createGroup: async (groupData) => {
        // groupData: { name, description }
        const response = await apiService.post('/groups/', groupData);
        return response.data;
    },

    updateGroup: async (id, groupData) => {
        const response = await apiService.put(`/groups/${id}/`, groupData);
        return response.data;
    },

    deleteGroup: async (id) => {
        const response = await apiService.delete(`/groups/${id}/`);
        return response.data;
    },
}; 