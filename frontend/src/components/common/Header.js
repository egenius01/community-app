// src/components/common/Header.js
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMobileMenuOpen(false);
    };

    const isActivePath = (path) => {
        return location.pathname === path;
    };

    const navItems = isAuthenticated
        ? [
            { name: 'Dashboard', path: '/dashboard' },
            { name: 'Groups', path: '/groups' },
        ]
        : [
            { name: 'Home', path: '/' },
            { name: 'Login', path: '/login' },
            { name: 'Register', path: '/register' },
        ];

    return (
        <header className="bg-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
                        Community
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`font-medium transition-colors ${isActivePath(item.path)
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-700 hover:text-blue-600'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}

                        {isAuthenticated && (
                            <div className="flex items-center space-x-4 ml-6">
                                <span className="text-gray-700">
                                    Welcome, <span className="font-medium">{user?.first_name || user?.username}</span>
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </nav>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden flex items-center px-3 py-2 border rounded text-gray-500 border-gray-600 hover:text-gray-700 hover:border-gray-700"
                    >
                        <svg
                            className="fill-current h-3 w-3"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <title>Menu</title>
                            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden pb-4">
                        <div className="flex flex-col space-y-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`block px-3 py-2 rounded-md font-medium transition-colors ${isActivePath(item.path)
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}

                            {isAuthenticated && (
                                <div className="border-t pt-2 mt-2">
                                    <div className="px-3 py-2 text-gray-700 text-sm">
                                        Welcome, <span className="font-medium">{user?.first_name || user?.username}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md font-medium"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;