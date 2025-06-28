// src/components/groups/GroupDetail.js
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import PostCard from '../posts/PostCard';
import PostForm from '../posts/PostForm';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

const GroupDetail = ({
    group,
    posts = [],
    isLoading = false,
    error = null,
    onJoinGroup,
    onLeaveGroup,
    onEditGroup,
    onDeleteGroup,
    onCreatePost,
    onEditPost,
    onDeletePost,
    postsLoading = false,
    postsError = null
}) => {
    const { user, isAuthenticated } = useAuth();
    const [showPostForm, setShowPostForm] = useState(false);
    const [editingPost, setEditingPost] = useState(null);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loading size="lg" text="Loading group details..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <ErrorMessage message={error} />
            </div>
        );
    }

    if (!group) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Group not found</h2>
                    <p className="text-gray-600 mt-2">The group you're looking for doesn't exist or has been removed.</p>
                </div>
            </div>
        );
    }

    const isMember = isAuthenticated && group.members?.some(member => member.id === user?.id);
    const isOwner = isAuthenticated && group.owner?.id === user?.id;
    const canJoin = isAuthenticated && !isMember;

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return 'Date unavailable';
        }
    };

    const handleJoin = () => {
        if (onJoinGroup && canJoin) {
            onJoinGroup(group.id);
        }
    };

    const handleLeave = () => {
        if (onLeaveGroup && isMember && !isOwner) {
            if (window.confirm('Are you sure you want to leave this group?')) {
                onLeaveGroup(group.id);
            }
        }
    };

    const handleEdit = () => {
        if (onEditGroup && isOwner) {
            onEditGroup(group);
        }
    };

    const handleDelete = () => {
        if (onDeleteGroup && isOwner) {
            if (window.confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
                onDeleteGroup(group.id);
            }
        }
    };

    const handleCreatePost = (postData) => {
        if (onCreatePost) {
            onCreatePost({ ...postData, group: group.id });
            setShowPostForm(false);
        }
    };

    const handleEditPost = (post) => {
        setEditingPost(post);
    };

    const handleUpdatePost = (postData) => {
        if (onEditPost && editingPost) {
            onEditPost(editingPost.id, postData);
            setEditingPost(null);
        }
    };

    const handleCancelEdit = () => {
        setEditingPost(null);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
            {/* Group Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{group.name}</h1>
                        {group.description && (
                            <p className="text-gray-600 mb-4">{group.description}</p>
                        )}

                        {/* Group Stats */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                            <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                                </svg>
                                {group.member_count || group.members?.length || 0} members
                            </span>
                            <span>Created {formatDate(group.created_at)}</span>
                            {isMember && (
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                    Member
                                </span>
                            )}
                        </div>

                        {/* Owner Info */}
                        {group.owner && (
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-white font-semibold text-sm">
                                        {group.owner.name?.charAt(0)?.toUpperCase() ||
                                            group.owner.email?.charAt(0)?.toUpperCase() ||
                                            '?'}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {group.owner.name || group.owner.email}
                                    </p>
                                    <p className="text-xs text-gray-500">Group Owner</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                        {canJoin && onJoinGroup && (
                            <button
                                onClick={handleJoin}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                Join Group
                            </button>
                        )}

                        {isMember && !isOwner && onLeaveGroup && (
                            <button
                                onClick={handleLeave}
                                className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                            >
                                Leave Group
                            </button>
                        )}

                        {isOwner && (
                            <div className="flex gap-2">
                                {onEditGroup && (
                                    <button
                                        onClick={handleEdit}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                    >
                                        Edit Group
                                    </button>
                                )}
                                {onDeleteGroup && (
                                    <button
                                        onClick={handleDelete}
                                        className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                    >
                                        Delete Group
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Posts Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Group Posts</h2>
                    {isMember && onCreatePost && (
                        <button
                            onClick={() => setShowPostForm(!showPostForm)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center space-x-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>{showPostForm ? 'Cancel' : 'New Post'}</span>
                        </button>
                    )}
                </div>

                {/* Post Form */}
                {showPostForm && isMember && (
                    <PostForm
                        onSubmit={handleCreatePost}
                        onCancel={() => setShowPostForm(false)}
                        selectedGroup={group.id}
                    />
                )}

                {/* Edit Post Form */}
                {editingPost && (
                    <PostForm
                        onSubmit={handleUpdatePost}
                        onCancel={handleCancelEdit}
                        initialData={editingPost}
                        selectedGroup={group.id}
                    />
                )}

                {/* Posts Error */}
                {postsError && <ErrorMessage message={postsError} />}

                {/* Posts Loading */}
                {postsLoading ? (
                    <div className="flex justify-center py-8">
                        <Loading size="md" text="Loading posts..." />
                    </div>
                ) : posts.length > 0 ? (
                    <div className="space-y-4">
                        {posts.map(post => (
                            <PostCard
                                key={post.id}
                                post={post}
                                onEdit={handleEditPost}
                                onDelete={onDeletePost}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0v10a2 2 0 01-2 2H9a2 2 0 01-2-2V8m0 0V6a2 2 0 012-2h10a2 2 0 012 2v2" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No posts yet</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {isMember
                                ? "Be the first to share something with this group!"
                                : "Join this group to see and create posts."
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GroupDetail;