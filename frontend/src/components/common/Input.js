import React from 'react';

const Input = ({
    label,
    id,
    name,
    type = 'text',
    value,
    onChange,
    placeholder = '',
    error = '',
    disabled = false,
    className = '',
    ...rest
}) => {
    return (
        <div className="mb-4">
            {label && (
                <label htmlFor={id || name} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <input
                type={type}
                id={id || name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`w-full text-black px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}
                {...rest}
            />
            {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
        </div>
    );
};

export default Input; 