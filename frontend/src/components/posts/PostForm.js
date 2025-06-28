// src/components/posts/PostForm.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ErrorMessage from '../common/ErrorMessage';
import Loading from '../common/Loading';
import Input from '../common/Input';

const PostForm = ({
    onSubmit,
    onCancel,
    initialData = null,
    groups = [],
    selectedGroup = null,
    isLoading = false,
    error = null
}) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        group: selectedGroup || ''
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                content: initialData.content || initialData.body || '',
                group: initialData.group?.id || selectedGroup || ''
            });
        }
    }, [initialData, selectedGroup]);

    const validateForm = () => {
        const errors = {};

        if (!formData.content.trim()) {
            errors.content = 'Post content is required';
        }

        if (formData.content.trim().length > 1000) {
            errors.content = 'Post content must be less than 1000 characters';
        }

        if (formData.title && formData.title.length > 200) {
            errors.title = 'Title must be less than 200 characters';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear specific field error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const submitData = {
            ...formData,
            group: formData.group || null
        };

        try {
            await onSubmit(submitData);
        } catch (err) {
            // Error is handled by the parent component
            console.error('Post submission error:', err);
        }
    };

    const handleCancel = () => {
        setFormData({
            title: '',
            content: '',
            group: selectedGroup || ''
        });
        setFormErrors({});
        if (onCancel) {
            onCancel();
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    {initialData ? 'Edit Post' : 'Create New Post'}
                </h3>
                {user && (
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-xs">
                                {user.first_name?.charAt(0)?.toUpperCase() ||
                                    user.username?.charAt(0)?.toUpperCase() ||
                                    '?'}
                            </span>
                        </div>
                        <span className="text-sm text-gray-600">
                            {user.first_name || user.username}
                        </span>
                    </div>
                )}
            </div>

            {error && <ErrorMessage message={error} className="mb-4" />}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Group Selection */}
                {groups.length > 0 && !selectedGroup && (
                    <div>
                        <label htmlFor="group" className="block text-sm font-medium text-gray-700 mb-1">
                            Post to Group (Optional)
                        </label>
                        <select
                            id="group"
                            name="group"
                            value={formData.group}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select a group...</option>
                            {groups.map(group => (
                                <option key={group.id} value={group.id}>
                                    {group.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {groups.length === 0 && !selectedGroup && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-700">
                            You haven't created any groups yet. You can only post in groups you created.
                            <a href="/groups" className="text-blue-600 hover:text-blue-800 font-medium ml-1">
                                Create a group
                            </a>
                        </p>
                    </div>
                )}

                {/* Title Field */}
                <Input
                    label="Title (Optional)"
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter a title for your post..."
                    error={formErrors.title}
                    maxLength={200}
                />

                {/* Content Field */}
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                        Content <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        placeholder="What's on your mind?"
                        rows={4}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-vertical ${formErrors.content ? 'border-red-300' : 'border-gray-300'}`}
                        maxLength={1000}
                    />
                    <div className="flex justify-between items-center mt-1">
                        {formErrors.content ? (
                            <p className="text-sm text-red-600">{formErrors.content}</p>
                        ) : (
                            <div></div>
                        )}
                        <p className="text-xs text-gray-500">
                            {formData.content.length}/1000 characters
                        </p>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading || !formData.content.trim()}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                    >
                        {isLoading && <Loading size="sm" />}
                        <span>{initialData ? 'Update Post' : 'Create Post'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostForm;