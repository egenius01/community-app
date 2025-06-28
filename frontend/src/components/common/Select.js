import React from 'react';

const Select = ({
    label,
    id,
    name,
    value,
    onChange,
    options = [],
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
            <select
                id={id || name}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}
                {...rest}
            >
                <option value="">Select...</option>
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
        </div>
    );
};

export default Select; 