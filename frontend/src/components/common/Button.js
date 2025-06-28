import React from 'react';

const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
};

const Button = ({
    children,
    onClick,
    type = 'button',
    disabled = false,
    loading = false,
    variant = 'primary',
    className = '',
    ...rest
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant] || ''} ${className}`}
            {...rest}
        >
            {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mr-2 align-middle"></span>
            ) : null}
            {children}
        </button>
    );
};

export default Button; 