import React from 'react';

const Textarea = ({
    label,
    id,
    name,
    value,
    onChange,
    placeholder = '',
    error = '',
    rows = 4,
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
            <textarea
                id={id || name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                disabled={disabled}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-vertical ${error ? 'border-red-300' : 'border-gray-300'} ${className}`}
                {...rest}
            />
            {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
        </div>
    );
};

export default Textarea; 