// src/pages/GroupDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/posts/PostCard';
import PostForm from '../components/posts/PostForm';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { groupsService } from '../services/groups.js';
import { postsService } from '../services/posts.js';

const { getGroupPosts, createPost } = postsService;

const { getGroupById, joinGroup, leaveGroup, updateGroup, deleteGroup } = groupsService;

const GroupDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const [group, setGroup] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showPostForm, setShowPostForm] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [isJoining, setIsJoining] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editFormData, setEditFormData] = useState({});

    useEffect(() => {
        fetchGroupData();
    }, [id]);

    const fetchGroupData = async () => {
        try {
            setLoading(true);
            setError('');

            const [groupData, postsData] = await Promise.all([
                getGroupById(id),
                getGroupPosts(id)
            ]);

            setGroup(groupData);
            setPosts(postsData);
        } catch (err) {
            setError('Failed to load group data');
            console.error('Group detail error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinLeave = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        try {
            setIsJoining(true);
            const isMember = group.members?.some(member => member.id === user.id);

            if (isMember) {
                await leaveGroup(id);
                setGroup(prev => ({
                    ...prev,
                    members: prev.members.filter(member => member.id !== user.id),
                    memberCount: (prev.memberCount || 0) - 1
                }));
            } else {
                await joinGroup(id);
                setGroup(prev => ({
                    ...prev,
                    members: [...(prev.members || []), user],
                    memberCount: (prev.memberCount || 0) + 1
                }));
            }
        } catch (err) {
            setError('Failed to update group membership');
            console.error('Join/Leave error:', err);
        } finally {
            setIsJoining(false);
        }
    };

    const handlePostCreate = async (postData) => {
        try {
            const newPost = await createPost({ ...postData, groupId: id });
            setPosts([newPost, ...posts]);
            setShowPostForm(false);
        } catch (err) {
            console.error('Create post error:', err);
            throw err;
        }
    };

    const handlePostUpdate = (updatedPost) => {
        setPosts(posts.map(post =>
            post.id === updatedPost.id ? updatedPost : post
        ));
        setEditingPost(null);
    };

    const handlePostDelete = (postId) => {
        setPosts(posts.filter(post => post.id !== postId));
    };

    const handleGroupUpdate = async (groupData) => {
        try {
            const updatedGroup = await updateGroup(id, groupData);
            setGroup(updatedGroup);
            setShowEditForm(false);
        } catch (err) {
            console.error('Update group error:', err);
            throw err;
        }
    };

    const handleGroupDelete = async () => {
        if (window.confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
            try {
                await deleteGroup(id);
                navigate('/groups');
            } catch (err) {
                setError('Failed to delete group');
                console.error('Delete group error:', err);
            }
        }
    };

    if (loading) return <Loading />;
    if (!group) return <ErrorMessage message="Group not found" />;

    const isMember = isAuthenticated && group.members?.some(member => member.id === user?.id);
    const isOwner = isAuthenticated && group.owner?.id === user?.id;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {error && <ErrorMessage message={error} />}

                {/* Group Header */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    {group.name}
                                </h1>
                                <p className="text-gray-600 mb-4">
                                    {group.description}
                                </p>

                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span>
                                        {group.memberCount || group.members?.length || 0} members
                                    </span>
                                    <span>•</span>
                                    <span>
                                        Created by {group.owner?.name || 'Unknown'}
                                    </span>
                                    <span>•</span>
                                    <span>
                                        {new Date(group.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 md:mt-0 flex space-x-3">
                                {isAuthenticated && !isOwner && (
                                    <button
                                        onClick={handleJoinLeave}
                                        disabled={isJoining}
                                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${isMember
                                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            : 'bg-blue-500 text-white hover:bg-blue-600'
                                            }`}
                                    >
                                        {isJoining ? 'Loading...' : isMember ? 'Leave Group' : 'Join Group'}
                                    </button>
                                )}

                                {isOwner && (
                                    <>
                                        <button
                                            onClick={() => {
                                                setEditFormData({
                                                    name: group.name,
                                                    description: group.description
                                                });
                                                setShowEditForm(true);
                                            }}
                                            className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={handleGroupDelete}
                                            className="px-4 py-2 text-red-600 hover:text-red-700 border border-red-300 rounded-lg hover:bg-red-50"
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Group Form Modal */}
                {showEditForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-md w-full">
                            <div className="p-6">
                                <h2 className="text-xl font-semibold mb-4">Edit Group</h2>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleGroupUpdate(editFormData);
                                    }}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Group Name
                                        </label>
                                        <input
                                            type="text"
                                            value={editFormData.name}
                                            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Description
                                        </label>
                                        <textarea
                                            value={editFormData.description}
                                            onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div className="flex space-x-3 pt-4">
                                        <button
                                            type="submit"
                                            className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowEditForm(false)}
                                            className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Create Post Section */}
                        {isMember && (
                            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Share with the group
                                    </h2>
                                    <button
                                        onClick={() => setShowPostForm(!showPostForm)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        {showPostForm ? 'Cancel' : 'Create Post'}
                                    </button>
                                </div>

                                {showPostForm && (
                                    <PostForm
                                        onSubmit={handlePostCreate}
                                        onCancel={() => setShowPostForm(false)}
                                    />
                                )}
                            </div>
                        )}

                        {/* Posts */}
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Group Posts
                                </h2>
                            </div>

                            <div className="divide-y divide-gray-200">
                                {posts.length > 0 ? (
                                    posts.map(post => (
                                        <div key={post.id} className="p-6">
                                            {editingPost === post.id ? (
                                                <PostForm
                                                    post={post}
                                                    onSubmit={handlePostUpdate}
                                                    onCancel={() => setEditingPost(null)}
                                                />
                                            ) : (
                                                <PostCard
                                                    post={post}
                                                    onEdit={() => setEditingPost(post.id)}
                                                    onDelete={handlePostDelete}
                                                />
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-6 text-center text-gray-500">
                                        No posts yet in this group.
                                        {isMember && (
                                            <button
                                                onClick={() => setShowPostForm(true)}
                                                className="block mx-auto mt-2 text-blue-500 hover:text-blue-600"
                                            >
                                                Be the first to post
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Group Members */}
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Members ({group.memberCount || group.members?.length || 0})
                                </h2>
                            </div>

                            <div className="p-6">
                                {group.members && group.members.length > 0 ? (
                                    <div className="space-y-3">
                                        {group.members.slice(0, 10).map(member => (
                                            <div key={member.id} className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                                    <span className="text-sm font-medium text-gray-600">
                                                        {member.name?.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {member.name}
                                                        {member.id === group.owner?.id && (
                                                            <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                                                                Owner
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                        {group.members.length > 10 && (
                                            <p className="text-sm text-gray-500 pt-2">
                                                and {group.members.length - 10} more members
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm">No members yet</p>
                                )}
                            </div>
                        </div>

                        {/* Group Info */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Group Info
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-gray-600">Created</span>
                                    <p className="font-medium">
                                        {new Date(group.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-600">Owner</span>
                                    <p className="font-medium">{group.owner?.name || 'Unknown'}</p>
                                </div>
                                <div>
                                    <span className="text-gray-600">Posts</span>
                                    <p className="font-medium">{posts.length}</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        {!isAuthenticated && (
                            <div className="bg-blue-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                                    Join the Conversation
                                </h3>
                                <p className="text-blue-700 text-sm mb-4">
                                    Sign up or log in to join this group and participate in discussions.
                                </p>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => navigate('/register')}
                                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                                    >
                                        Sign Up
                                    </button>
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="w-full bg-white text-blue-500 py-2 rounded-lg border border-blue-500 hover:bg-blue-50"
                                    >
                                        Log In
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupDetail;