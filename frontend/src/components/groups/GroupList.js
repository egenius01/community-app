// src/components/groups/GroupList.js
import React, { useState } from 'react';
import GroupCard from './GroupCard';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

const GroupList = ({
    groups = [],
    isLoading = false,
    error = null,
    onJoinGroup,
    onLeaveGroup,
    onEditGroup,
    onDeleteGroup,
    showCreateButton = true,
    onCreateGroup,
    title = "Groups",
    emptyMessage = "No groups found."
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name'); // name, created_at, member_count

    // Filter groups based on search term
    const filteredGroups = groups.filter(group =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (group.description && group.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Sort groups
    const sortedGroups = [...filteredGroups].sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'created_at':
                return new Date(b.created_at) - new Date(a.created_at);
            case 'member_count':
                const aMemberCount = a.member_count || a.members?.length || 0;
                const bMemberCount = b.member_count || b.members?.length || 0;
                return bMemberCount - aMemberCount;
            default:
                return 0;
        }
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loading size="lg" text="Loading groups..." />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        {groups.length} {groups.length === 1 ? 'group' : 'groups'} available
                    </p>
                </div>

                {showCreateButton && onCreateGroup && (
                    <button
                        onClick={onCreateGroup}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center space-x-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Create Group</span>
                    </button>
                )}
            </div>

            {/* Error Message */}
            {error && <ErrorMessage message={error} />}

            {/* Search and Filter Controls */}
            {groups.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search groups..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* Sort */}
                        <div className="sm:w-48">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="name">Sort by Name</option>
                                <option value="created_at">Sort by Date Created</option>
                                <option value="member_count">Sort by Members</option>
                            </select>
                        </div>
                    </div>

                    {/* Results Info */}
                    {searchTerm && (
                        <div className="mt-3 text-sm text-gray-600">
                            Showing {filteredGroups.length} of {groups.length} groups
                            {searchTerm && ` for "${searchTerm}"`}
                        </div>
                    )}
                </div>
            )}

            {/* Groups Grid */}
            {sortedGroups.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedGroups.map(group => (
                        <GroupCard
                            key={group.id}
                            group={group}
                            onJoin={onJoinGroup}
                            onLeave={onLeaveGroup}
                            onEdit={onEditGroup}
                            onDelete={onDeleteGroup}
                        />
                    ))}
                </div>
            ) : groups.length > 0 ? (
                <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No groups found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        No groups match your search criteria. Try adjusting your search terms.
                    </p>
                </div>
            ) : (
                <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No groups yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {emptyMessage}
                    </p>
                    {showCreateButton && onCreateGroup && (
                        <div className="mt-6">
                            <button
                                onClick={onCreateGroup}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                Create Your First Group
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GroupList;