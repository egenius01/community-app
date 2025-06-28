// src/hooks/useGroups.js
import { useState, useEffect, useCallback } from 'react';
import { groupsService } from '../services/groups.js';


const { getAllGroups,
    getUserGroups,
    getGroupById,
    createGroup,
    updateGroup,
    deleteGroup,
    joinGroup,
    leaveGroup } = groupsService
export const useGroups = () => {
    const [groups, setGroups] = useState([]);
    const [userGroups, setUserGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAllGroups = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllGroups();
            setGroups(data);
            return data;
        } catch (err) {
            setError(err.message || 'Failed to fetch groups');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUserGroups = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getUserGroups();
            setUserGroups(data);
            return data;
        } catch (err) {
            setError(err.message || 'Failed to fetch user groups');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const createNewGroup = useCallback(async (groupData) => {
        try {
            setLoading(true);
            setError(null);
            const newGroup = await createGroup(groupData);
            setGroups(prev => [newGroup, ...prev]);
            setUserGroups(prev => [newGroup, ...prev]);
            return newGroup;
        } catch (err) {
            setError(err.message || 'Failed to create group');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateExistingGroup = useCallback(async (groupId, groupData) => {
        try {
            setLoading(true);
            setError(null);
            const updatedGroup = await updateGroup(groupId, groupData);

            setGroups(prev => prev.map(group =>
                group.id === groupId ? updatedGroup : group
            ));
            setUserGroups(prev => prev.map(group =>
                group.id === groupId ? updatedGroup : group
            ));

            return updatedGroup;
        } catch (err) {
            setError(err.message || 'Failed to update group');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteExistingGroup = useCallback(async (groupId) => {
        try {
            setLoading(true);
            setError(null);
            await deleteGroup(groupId);

            setGroups(prev => prev.filter(group => group.id !== groupId));
            setUserGroups(prev => prev.filter(group => group.id !== groupId));

            return true;
        } catch (err) {
            setError(err.message || 'Failed to delete group');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const joinExistingGroup = useCallback(async (groupId) => {
        try {
            setLoading(true);
            setError(null);
            await joinGroup(groupId);

            // Refresh groups to get updated member count
            const updatedGroup = await getGroupById(groupId);
            setGroups(prev => prev.map(group =>
                group.id === groupId ? updatedGroup : group
            ));
            setUserGroups(prev => [...prev, updatedGroup]);

            return updatedGroup;
        } catch (err) {
            setError(err.message || 'Failed to join group');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const leaveExistingGroup = useCallback(async (groupId) => {
        try {
            setLoading(true);
            setError(null);
            await leaveGroup(groupId);

            // Refresh groups to get updated member count
            const updatedGroup = await getGroupById(groupId);
            setGroups(prev => prev.map(group =>
                group.id === groupId ? updatedGroup : group
            ));
            setUserGroups(prev => prev.filter(group => group.id !== groupId));

            return updatedGroup;
        } catch (err) {
            setError(err.message || 'Failed to leave group');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        groups,
        userGroups,
        loading,
        error,
        fetchAllGroups,
        fetchUserGroups,
        createGroup: createNewGroup,
        updateGroup: updateExistingGroup,
        deleteGroup: deleteExistingGroup,
        joinGroup: joinExistingGroup,
        leaveGroup: leaveExistingGroup,
        clearError
    };
};

export default useGroups;