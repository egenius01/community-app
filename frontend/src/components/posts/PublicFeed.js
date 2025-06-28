import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PostList from '../components/posts/PostList';
import { getPublicPosts } from '../services/posts.js';
import { useAuth } from '../hooks/useAuth';

const PublicFeed = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const { user } = useAuth();
    const postsPerPage = 10;

    const fetchPosts = async (pageNum = 1, reset = false) => {
        try {
            if (pageNum === 1) {
                setLoading(true);
                setError(null);
            } else {
                setLoadingMore(true);
            }

            const response = await getPublicPosts({
                page: pageNum,
                limit: postsPerPage
            });

            const newPosts = response.data || [];

            if (reset || pageNum === 1) {
                setPosts(newPosts);
            } else {
                setPosts(prev => [...prev, ...newPosts]);
            }

            // Check if there are more posts to load
            setHasMore(newPosts.length === postsPerPage);

        } catch (err) {
            console.error('Error fetching public posts:', err);
            setError(err.response?.data?.message || 'Failed to load posts');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchPosts(1, true);
    }, []);

    const handleLoadMore = () => {
        if (!loadingMore && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchPosts(nextPage, false);
        }
    };

    const handleRefresh = () => {
        setPage(1);
        fetchPosts(1, true);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Public Feed</h1>
                                <p className="mt-2 text-gray-600">
                                    Discover posts from the community
                                </p>
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={handleRefresh}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    disabled={loading}
                                >
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                        />
                                    </svg>
                                    Refresh
                                </button>

                                {user ? (
                                    <Link
                                        to="/dashboard"
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Go to Dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        to="/login"
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Sign In
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome message for non-authenticated users */}
                {!user && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                        <div className="flex items-center">
                            <svg
                                className="w-6 h-6 text-blue-600 mr-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <div>
                                <h3 className="text-lg font-medium text-blue-900">
                                    Welcome to our Community!
                                </h3>
                                <p className="mt-1 text-blue-700">
                                    <Link to="/register" className="font-medium hover:underline">
                                        Create an account
                                    </Link>
                                    {' '}or{' '}
                                    <Link to="/login" className="font-medium hover:underline">
                                        sign in
                                    </Link>
                                    {' '}to join groups and create your own posts.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Posts List */}
                <PostList
                    posts={posts}
                    loading={loading}
                    error={error}
                    showGroupName={true}
                    emptyMessage="No public posts available at the moment. Check back later!"
                />

                {/* Load More Button */}
                {!loading && !error && hasMore && posts.length > 0 && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                            className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loadingMore ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-700"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Loading...
                                </>
                            ) : (
                                <>
                                    Load More Posts
                                    <svg
                                        className="ml-2 w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                )}

                {/* End of posts message */}
                {!loading && !hasMore && posts.length > 0 && (
                    <div className="mt-8 text-center">
                        <p className="text-gray-500">You've reached the end of the feed!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicFeed;