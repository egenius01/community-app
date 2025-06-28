import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postsService } from '../services/posts.js';
import PostCard from '../components/posts/PostCard';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';

const Home = () => {
    const { isAuthenticated } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const response = await postsService.getAllPosts();
                setPosts(response.results || response);
            } catch (err) {
                setError('Failed to load posts');
                console.error('Error fetching posts:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <Loading />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
                    Welcome to Community
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                    Connect with like-minded people, share ideas, and build amazing communities
                </p>

                {!isAuthenticated && (
                    <div className="space-x-4">
                        <Link
                            to="/register"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Get Started
                        </Link>
                        <Link
                            to="/login"
                            className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                        >
                            Sign In
                        </Link>
                    </div>
                )}
            </div>

            {/* Features Section */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="text-center p-6 bg-white rounded-lg shadow-md">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Create Groups</h3>
                    <p className="text-gray-600">Start your own community and bring people together around shared interests.</p>
                </div>

                <div className="text-center p-6 bg-white rounded-lg shadow-md">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Share & Discuss</h3>
                    <p className="text-gray-600">Post content, share ideas, and engage in meaningful conversations.</p>
                </div>

                <div className="text-center p-6 bg-white rounded-lg shadow-md">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Stay Connected</h3>
                    <p className="text-gray-600">Keep up with the latest posts and never miss important updates.</p>
                </div>
            </div>

            {/* Public Feed */}
            <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Latest Posts</h2>

                {error && <ErrorMessage message={error} className="mb-6" />}

                {posts.length === 0 && !error ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">No posts yet. Be the first to share something!</p>
                        {!isAuthenticated && (
                            <Link
                                to="/register"
                                className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Join Community
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {posts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
