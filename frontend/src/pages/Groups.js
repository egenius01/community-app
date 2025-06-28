// src/pages/Groups.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import GroupList from '../components/groups/GroupList';
import GroupForm from '../components/groups/GroupForm';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { groupsService } from '../services/groups.js'

const { getAllGroups, getUserGroups, createGroup } = groupsService;
// import { getAllGroups, getUserGroups, createGroup } from '../services/groups';

const Groups = () => {
    const { isAuthenticated } = useAuth();
    const [groups, setGroups] = useState([]);
    const [userGroups, setUserGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchGroups();
    }, [activeTab, isAuthenticated]);

    const fetchGroups = async () => {
        try {
            setLoading(true);
            setError('');

            if (activeTab === 'all') {
                const data = await getAllGroups();
                setGroups(data);
            } else if (activeTab === 'my-groups' && isAuthenticated) {
                const data = await getUserGroups();
                setUserGroups(data);
            }
        } catch (err) {
            setError('Failed to load groups');
            console.error('Groups fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateGroup = async (groupData) => {
        try {
            const newGroup = await createGroup(groupData);
            setGroups([newGroup, ...groups]);
            setUserGroups([newGroup, ...userGroups]);
            setShowCreateForm(false);
            // Switch to user's groups tab to show the new group
            setActiveTab('my-groups');
        } catch (err) {
            console.error('Create group error:', err);
            throw err;
        }
    };

    const filteredGroups = () => {
        const groupsToFilter = activeTab === 'my-groups' ? userGroups : groups;
        if (!searchQuery) return groupsToFilter;

        return groupsToFilter.filter(group =>
            group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            group.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const tabs = [
        { id: 'all', label: 'All Groups', count: groups.length },
        ...(isAuthenticated ? [{ id: 'my-groups', label: 'My Groups', count: userGroups.length }] : [])
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Groups
                            </h1>
                            <p className="text-gray-600">
                                Discover and join communities that interest you
                            </p>
                        </div>
                        {isAuthenticated && (
                            <button
                                onClick={() => setShowCreateForm(true)}
                                className="mt-4 sm:mt-0 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Create Group
                            </button>
                        )}
                    </div>
                </div>

                {error && <ErrorMessage message={error} />}

                {/* Create Group Form Modal */}
                {showCreateForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-md w-full max-h-90vh overflow-y-auto">
                            <div className="p-6">
                                <h2 className="text-xl font-semibold mb-4">Create New Group</h2>
                                <GroupForm
                                    onSubmit={handleCreateGroup}
                                    onCancel={() => setShowCreateForm(false)}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Search and Tabs */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="p-6 border-b border-gray-200">
                        {/* Search */}
                        <div className="mb-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search groups..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M18 10.5a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex space-x-1">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                        }`}
                                >
                                    {tab.label}
                                    <span className="ml-2 px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded-full">
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Groups Content */}
                    <div className="p-6">
                        {loading ? (
                            <Loading />
                        ) : (
                            <>
                                {filteredGroups().length > 0 ? (
                                    <>
                                        <div className="mb-4 text-sm text-gray-600">
                                            {searchQuery && `Found ${filteredGroups().length} groups matching "${searchQuery}"`}
                                        </div>
                                        <GroupList
                                            groups={filteredGroups()}
                                            showJoinButton={activeTab === 'all'}
                                        />
                                    </>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="text-gray-400 mb-4">
                                            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            {searchQuery ? 'No groups found' :
                                                activeTab === 'my-groups' ? 'No groups joined yet' : 'No groups available'}
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            {searchQuery ? 'Try adjusting your search terms' :
                                                activeTab === 'my-groups' ? "You haven't joined any groups yet." :
                                                    'Be the first to create a group!'}
                                        </p>
                                        {!searchQuery && (
                                            <>
                                                {activeTab === 'my-groups' ? (
                                                    <button
                                                        onClick={() => setActiveTab('all')}
                                                        className="text-blue-500 hover:text-blue-600"
                                                    >
                                                        Browse all groups
                                                    </button>
                                                ) : (
                                                    isAuthenticated && (
                                                        <button
                                                            onClick={() => setShowCreateForm(true)}
                                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                                        >
                                                            Create First Group
                                                        </button>
                                                    )
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Groups;