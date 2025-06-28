import React from 'react';
import { useAuth } from '../../context/AuthContext';

const PostCard = ({ post, onEdit, onDelete }) => {
    const { user, isAuthenticated } = useAuth();
    const isOwner = isAuthenticated && user && post.creator && user.id === post.creator.id;

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Date unavailable';
        }
    };

    const handleEdit = () => {
        if (onEdit) {
            onEdit(post);
        }
    };

    const handleDelete = () => {
        if (onDelete && window.confirm('Are you sure you want to delete this post?')) {
            onDelete(post.id);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
            {/* Post Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                            {post.creator?.first_name?.charAt(0)?.toUpperCase() ||
                                post.creator?.username?.charAt(0)?.toUpperCase() ||
                                '?'}
                        </span>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900">
                            {post.creator?.first_name || post.creator?.username || 'Anonymous'}
                        </h4>
                        <div className="flex items-center text-sm text-gray-500 space-x-2">
                            <span>{formatDate(post.created_at)}</span>
                            {post.group && (
                                <>
                                    <span>•</span>
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                        {post.group.name}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Post Content */}
            <div className="mb-4">
                {post.title && (
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {post.title}
                    </h3>
                )}
                <div className="text-gray-700 whitespace-pre-wrap">
                    {post.content || post.body}
                </div>
            </div>

            {/* Post Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="text-sm">Like</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="text-sm">Comment</span>
                    </button>
                </div>
                <div className="text-xs text-gray-500">
                    {post.updated_at && post.updated_at !== post.created_at && (
                        <span>Edited {formatDate(post.updated_at)}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostCard;