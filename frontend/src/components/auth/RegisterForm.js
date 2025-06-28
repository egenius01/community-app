// src/components/auth/RegisterForm.js
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import ErrorMessage from '../common/ErrorMessage';
import Loading from '../common/Loading';
import Input from '../common/Input';

const RegisterForm = ({ onSuccess }) => {
    const { register, isLoading, error, clearError } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password2: '',
    });
    const [formErrors, setFormErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear specific field error
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // Clear general error
        if (error) {
            clearError();
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.username.trim()) {
            errors.username = 'Username is required';
        }
        if (!formData.first_name.trim()) {
            errors.first_name = 'First name is required';
        }
        if (!formData.last_name.trim()) {
            errors.last_name = 'Last name is required';
        }
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }
        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }
        if (!formData.password2) {
            errors.password2 = 'Please confirm your password';
        } else if (formData.password !== formData.password2) {
            errors.password2 = 'Passwords do not match';
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            const { ...registerData } = formData;
            await register(registerData);
            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            // Error is handled by the auth context
            console.error('Registration failed:', err);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                Create Account
            </h2>

            {error && <ErrorMessage message={error} className="mb-4" />}

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Username"
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    error={formErrors.username}
                    disabled={isLoading}
                />
                <Input
                    label="First Name"
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    error={formErrors.first_name}
                    disabled={isLoading}
                />
                <Input
                    label="Last Name"
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    error={formErrors.last_name}
                    disabled={isLoading}
                />
                <Input
                    label="Email Address"
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    error={formErrors.email}
                    disabled={isLoading}
                />
                <Input
                    label="Password"
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    error={formErrors.password}
                    disabled={isLoading}
                />
                <Input
                    label="Confirm Password"
                    type="password"
                    id="password2"
                    name="password2"
                    value={formData.password2}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    error={formErrors.password2}
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? <Loading size="small" /> : 'Create Account'}
                </button>
            </form>
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                        Sign in here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterForm;