// src/components/groups/GroupForm.js
import React, { useState, useEffect } from 'react';
import ErrorMessage from '../common/ErrorMessage';
import Loading from '../common/Loading';
import Input from '../common/Input';
import Button from '../common/Button';

const GroupForm = ({
    onSubmit,
    onCancel,
    initialData = null,
    isLoading = false,
    error = null
}) => {
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                description: initialData.description || ''
            });
        }
    }, [initialData]);

    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = 'Group name is required';
        } else if (formData.name.trim().length < 3) {
            errors.name = 'Group name must be at least 3 characters long';
        } else if (formData.name.trim().length > 100) {
            errors.name = 'Group name must be less than 100 characters';
        }

        if (formData.description && formData.description.length > 500) {
            errors.description = 'Description must be less than 500 characters';
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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const submitData = {
            name: formData.name.trim(),
            description: formData.description.trim() || null
        };

        onSubmit(submitData);
    };

    const handleCancel = () => {
        setFormData({
            name: '',
            description: ''
        });
        setFormErrors({});
        if (onCancel) {
            onCancel();
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                    {initialData ? 'Edit Group' : 'Create New Group'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                    {initialData
                        ? 'Update your group information below.'
                        : 'Create a new community group to connect with others.'
                    }
                </p>
            </div>

            {error && <ErrorMessage message={error} className="mb-4" />}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Group Name */}
                <Input
                    label="Group Name"
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter group name..."
                    error={formErrors.name}
                    maxLength={100}
                    disabled={isLoading}
                />

                {/* Group Description */}
                <Input
                    label="Description (Optional)"
                    as="textarea"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe what this group is about..."
                    error={formErrors.description}
                    maxLength={500}
                    rows={4}
                    disabled={isLoading}
                />
                <div className="flex justify-end text-xs text-gray-500">
                    {formData.description.length}/500 characters
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                    <Button
                        type="button"
                        onClick={handleCancel}
                        disabled={isLoading}
                        variant="secondary"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading || !formData.name.trim()}
                        variant="primary"
                        loading={isLoading}
                    >
                        {initialData ? 'Update Group' : 'Create Group'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default GroupForm;