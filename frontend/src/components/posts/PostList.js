import React from 'react';
import PostCard from './PostCard';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

const PostList = ({
    posts = [],
    loading = false,
    error = null,
    onLike,
    onDelete,
    onEdit,
    showGroupName = false,
    emptyMessage = "No posts found",
    className = ""
}) => {
    // Show loading state
    if (loading) {
        return (
            <div className="space-y-4">
                <Loading message="Loading posts..." />
            </div>
        );
    }

    // Show error state
    if (error) {
        return <ErrorMessage message={error} />;
    }

    // Show empty state
    if (!posts || posts.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2v-7m2 0V9a2 2 0 00-2-2h-2m2 13a2 2 0 002-2v-7a2 2 0 00-2-2h-2m2 0h2v2a1 1 0 001 1h3m-6 7a2 2 0 002-2v-7a2 2 0 00-2-2h-6a2 2 0 00-2 2v7a2 2 0 002 2h6z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Posts Yet</h3>
                    <p className="text-gray-500">{emptyMessage}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`space-y-6 ${className}`}>
            {posts.map((post) => (
                <PostCard
                    key={post.id}
                    post={post}
                    onLike={onLike}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    showGroupName={showGroupName}
                />
            ))}
        </div>
    );
};

export default PostList;