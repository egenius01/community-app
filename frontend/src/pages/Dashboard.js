// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { groupsService } from '../services/groups.js';
import { postsService } from '../services/posts.js';
import GroupCard from '../components/groups/GroupCard';
import PostCard from '../components/posts/PostCard';
import PostForm from '../components/posts/PostForm';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';


const { getUserGroups } = groupsService;
const { getUserPosts, createPost } = postsService;
const Dashboard = () => {
    const { user } = useAuth();
    const [groups, setGroups] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showPostForm, setShowPostForm] = useState(false);
    const [editingPost, setEditingPost] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [groupsData, postsData] = await Promise.all([
                getUserGroups(),
                getUserPosts()
            ]);
            setGroups(groupsData);
            setPosts(postsData);
        } catch (err) {
            setError('Failed to load dashboard data');
            console.error('Dashboard error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePostCreate = async (postData) => {
        try {
            console.log('Creating post with data:', postData);
            const newPost = await createPost(postData);
            console.log('Post created successfully:', newPost);
            setPosts([newPost, ...posts]);
            setShowPostForm(false);
        } catch (err) {
            console.error('Create post error:', err);
            // You might want to show an error message to the user here
            throw err; // Re-throw so PostForm can handle it
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

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back, {user?.first_name || user?.username}!
                    </h1>
                    <p className="text-gray-600">
                        Here's what's happening in your community
                    </p>
                </div>

                {error && <ErrorMessage message={error} />}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Create Post Section */}
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Share Something
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
                                    groups={groups.filter(group => group.creator?.id === user?.id)}
                                />
                            )}
                        </div>

                        {/* Recent Posts */}
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Your Recent Posts
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
                                        You haven't created any posts yet.
                                        <button
                                            onClick={() => setShowPostForm(true)}
                                            className="block mx-auto mt-2 text-blue-500 hover:text-blue-600"
                                        >
                                            Create your first post
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* My Groups */}
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    My Groups
                                </h2>
                            </div>

                            <div className="p-6">
                                {groups.length > 0 ? (
                                    <div className="space-y-4">
                                        {groups.slice(0, 5).map(group => (
                                            <GroupCard key={group.id} group={group} compact />
                                        ))}
                                        {groups.length > 5 && (
                                            <a
                                                href="/groups"
                                                className="block text-center text-blue-500 hover:text-blue-600 text-sm"
                                            >
                                                View all groups ({groups.length})
                                            </a>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500">
                                        You haven't joined any groups yet.
                                        <a
                                            href="/groups"
                                            className="block mt-2 text-blue-500 hover:text-blue-600"
                                        >
                                            Explore groups
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Quick Stats
                            </h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Posts</span>
                                    <span className="font-semibold text-black">{posts.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Groups</span>
                                    <span className="font-semibold text-black">{groups.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Member since</span>
                                    <span className="font-semibold text-black">
                                        {user?.date_joined ?
                                            new Date(user.date_joined).toLocaleDateString() :
                                            'N/A'
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;