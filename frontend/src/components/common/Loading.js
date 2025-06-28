import React from 'react';

const Loading = ({ size = 'medium', text = 'Loading...' }) => {
    const sizeClasses = {
        small: 'w-4 h-4',
        medium: 'w-8 h-8',
        large: 'w-12 h-12'
    };

    return (
        <div className="flex items-center justify-center space-x-2">
            <div className={`${sizeClasses[size]} border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin`}></div>
            {size !== 'small' && <span className="text-gray-600">{text}</span>}
        </div>
    );
};

export default Loading;