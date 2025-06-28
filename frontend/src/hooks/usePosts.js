// src/hooks/usePosts.js
import { useState, useEffect, useCallback } from 'react';
import { postsService } from '../services/posts.js';


const { getAllPosts,
    getUserPosts,
    getGroupPosts,
    createPost,
    updatePost,
    deletePost } = postsService
export const usePosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAllPosts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllPosts();
            setPosts(data);
            return data;
        } catch (err) {
            setError(err.message || 'Failed to fetch posts');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUserPosts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getUserPosts();
            setPosts(data);
            return data;
        } catch (err) {
            setError(err.message || 'Failed to fetch user posts');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchGroupPosts = useCallback(async (groupId) => {
        try {
            setLoading(true);
            setError(null);
            const data = await getGroupPosts(groupId);
            setPosts(data);
            return data;
        } catch (err) {
            setError(err.message || 'Failed to fetch group posts');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const createNewPost = useCallback(async (postData) => {
        try {
            setLoading(true);
            setError(null);
            const newPost = await createPost(postData);
            setPosts(prev => [newPost, ...prev]);
            return newPost;
        } catch (err) {
            setError(err.message || 'Failed to create post');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateExistingPost = useCallback(async (postId, postData) => {
        try {
            setLoading(true);
            setError(null);
            const updatedPost = await updatePost(postId, postData);

            setPosts(prev => prev.map(post =>
                post.id === postId ? updatedPost : post
            ));

            return updatedPost;
        } catch (err) {
            setError(err.message || 'Failed to update post');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteExistingPost = useCallback(async (postId) => {
        try {
            setLoading(true);
            setError(null);
            await deletePost(postId);

            setPosts(prev => prev.filter(post => post.id !== postId));

            return true;
        } catch (err) {
            setError(err.message || 'Failed to delete post');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const addPost = useCallback((newPost) => {
        setPosts(prev => [newPost, ...prev]);
    }, []);

    const removePost = useCallback((postId) => {
        setPosts(prev => prev.filter(post => post.id !== postId));
    }, []);

    const updatePostInList = useCallback((updatedPost) => {
        setPosts(prev => prev.map(post =>
            post.id === updatedPost.id ? updatedPost : post
        ));
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const clearPosts = useCallback(() => {
        setPosts([]);
    }, []);

    return {
        posts,
        loading,
        error,
        fetchAllPosts,
        fetchUserPosts,
        fetchGroupPosts,
        createPost: createNewPost,
        updatePost: updateExistingPost,
        deletePost: deleteExistingPost,
        addPost,
        removePost,
        updatePostInList,
        clearError,
        clearPosts
    };
};

export default usePosts;