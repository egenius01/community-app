// src/components/groups/GroupCard.js
import React from 'react';
import { useAuth } from '../../context/AuthContext';

const GroupCard = ({ group, onJoin, onLeave, onEdit, onDelete, isLoading = false }) => {
    const { user, isAuthenticated } = useAuth();

    const isMember = isAuthenticated && group.members?.some(member => member.id === user?.id);
    const isOwner = isAuthenticated && group.creator?.id === user?.id;
    const canJoin = isAuthenticated && !isMember;

    const handleJoin = () => {
        if (onJoin && canJoin) {
            onJoin(group.id);
        }
    };

    const handleLeave = () => {
        if (onLeave && isMember && !isOwner) {
            if (window.confirm('Are you sure you want to leave this group?')) {
                onLeave(group.id);
            }
        }
    };

    const handleEdit = () => {
        if (onEdit && isOwner) {
            onEdit(group);
        }
    };

    const handleDelete = () => {
        if (onDelete && isOwner) {
            if (window.confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
                onDelete(group.id);
            }
        }
    };

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return 'Date unavailable';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            {/* Group Header */}
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {group.name}
                        </h3>
                        {group.description && (
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {group.description}
                            </p>
                        )}
                    </div>

                    {/* Action Menu for Owner */}
                    {isOwner && (
                        <div className="flex items-center space-x-1 ml-4">
                            {onEdit && (
                                <button
                                    onClick={handleEdit}
                                    disabled={isLoading}
                                    className="text-gray-400 hover:text-blue-600 p-1 rounded transition-colors disabled:opacity-50"
                                    title="Edit group"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    onClick={handleDelete}
                                    disabled={isLoading}
                                    className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors disabled:opacity-50"
                                    title="Delete group"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 102 0v-1a1 1 0 10-2 0v1zm4 0a1 1 0 102 0v-1a1 1 0 10-2 0v1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Group Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                            </svg>
                            {group.member_count || group.members?.length || 0} members
                        </span>
                        <span>Created {formatDate(group.created_at)}</span>
                    </div>

                    {isMember && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            Member
                        </span>
                    )}
                </div>

                {/* Owner Info */}
                {group.creator && (
                    <div className="flex items-center mb-4">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                            <span className="text-white font-semibold text-xs">
                                {group.creator.first_name?.charAt(0)?.toUpperCase() ||
                                    group.creator.username?.charAt(0)?.toUpperCase() ||
                                    '?'}
                            </span>
                        </div>
                        <span className="text-sm text-gray-600">
                            Created by {group.creator.first_name || group.creator.username}
                        </span>
                    </div>
                )}
            </div>

            {/* Group Actions */}
            {isAuthenticated && (
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 rounded-b-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            {canJoin && onJoin && (
                                <button
                                    onClick={handleJoin}
                                    disabled={isLoading}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isLoading ? 'Joining...' : 'Join Group'}
                                </button>
                            )}

                            {isMember && !isOwner && onLeave && (
                                <button
                                    onClick={handleLeave}
                                    disabled={isLoading}
                                    className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isLoading ? 'Leaving...' : 'Leave Group'}
                                </button>
                            )}

                            {isOwner && (
                                <span className="text-sm text-gray-600 font-medium">
                                    You own this group
                                </span>
                            )}
                        </div>

                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                            View Details →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupCard;