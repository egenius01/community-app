// src/utils/constants.js

// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

// Authentication
export const TOKEN_STORAGE_KEY = 'auth_token';
export const USER_STORAGE_KEY = 'user_data';

// API Endpoints
export const API_ENDPOINTS = {
    // Authentication
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',

    // Users
    USERS: '/users',
    USER_PROFILE: (id) => `/users/${id}`,

    // Groups
    GROUPS: '/groups',
    GROUP_DETAIL: (id) => `/groups/${id}`,
    GROUP_JOIN: (id) => `/groups/${id}/join`,
    GROUP_LEAVE: (id) => `/groups/${id}/leave`,
    GROUP_MEMBERS: (id) => `/groups/${id}/members`,
    USER_GROUPS: '/groups/my-groups',

    // Posts
    POSTS: '/posts',
    POST_DETAIL: (id) => `/posts/${id}`,
    USER_POSTS: '/posts/my-posts',
    GROUP_POSTS: (groupId) => `/groups/${groupId}/posts`,
    PUBLIC_POSTS: '/posts/public',

    // Comments (if needed in future)
    COMMENTS: '/comments',
    POST_COMMENTS: (postId) => `/posts/${postId}/comments`,
};

// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
};

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your connection and try again.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    FORBIDDEN: 'Access denied.',
    NOT_FOUND: 'The requested resource was not found.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    SERVER_ERROR: 'Server error. Please try again later.',
    UNKNOWN_ERROR: 'An unknown error occurred. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: 'Successfully logged in!',
    REGISTER_SUCCESS: 'Account created successfully!',
    LOGOUT_SUCCESS: 'Successfully logged out!',
    POST_CREATED: 'Post created successfully!',
    POST_UPDATED: 'Post updated successfully!',
    POST_DELETED: 'Post deleted successfully!',
    GROUP_CREATED: 'Group created successfully!',
    GROUP_UPDATED: 'Group updated successfully!',
    GROUP_DELETED: 'Group deleted successfully!',
    GROUP_JOINED: 'Successfully joined the group!',
    GROUP_LEFT: 'Successfully left the group!',
};

// Form Validation
export const VALIDATION_RULES = {
    EMAIL: {
        REQUIRED: 'Email is required',
        INVALID: 'Please enter a valid email address',
    },
    PASSWORD: {
        REQUIRED: 'Password is required',
        MIN_LENGTH: 'Password must be at least 6 characters long',
        MAX_LENGTH: 'Password must not exceed 128 characters',
    },
    NAME: {
        REQUIRED: 'Name is required',
        MIN_LENGTH: 'Name must be at least 2 characters long',
        MAX_LENGTH: 'Name must not exceed 50 characters',
    },
    TITLE: {
        REQUIRED: 'Title is required',
        MIN_LENGTH: 'Title must be at least 3 characters long',
        MAX_LENGTH: 'Title must not exceed 100 characters',
    },
    CONTENT: {
        REQUIRED: 'Content is required',
        MIN_LENGTH: 'Content must be at least 10 characters long',
        MAX_LENGTH: 'Content must not exceed 5000 characters',
    },
    GROUP_NAME: {
        REQUIRED: 'Group name is required',
        MIN_LENGTH: 'Group name must be at least 3 characters long',
        MAX_LENGTH: 'Group name must not exceed 100 characters',
    },
    GROUP_DESCRIPTION: {
        REQUIRED: 'Group description is required',
        MIN_LENGTH: 'Description must be at least 10 characters long',
        MAX_LENGTH: 'Description must not exceed 500 characters',
    },
};

// UI Constants
export const LOADING_STATES = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error',
};

export const COLORS = {
    PRIMARY: '#2563eb',
    SUCCESS: '#059669',
    WARNING: '#d97706',
    ERROR: '#dc2626',
    GRAY: '#6b7280',
};

// Pagination
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
};

// Date Formats
export const DATE_FORMATS = {
    FULL: 'MMMM d, yyyy',
    SHORT: 'MMM d, yyyy',
    TIME: 'h:mm a',
    DATETIME: 'MMM d, yyyy h:mm a',
};

// Local Storage Keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: TOKEN_STORAGE_KEY,
    USER_DATA: USER_STORAGE_KEY,
    THEME: 'theme_preference',
    LANGUAGE: 'language_preference',
};

// Routes
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    GROUPS: '/groups',
    GROUP_DETAIL: '/groups/:id',
    PROFILE: '/profile',
    SETTINGS: '/settings',
};

// Component Sizes
export const SIZES = {
    AVATAR: {
        SMALL: 'w-8 h-8',
        MEDIUM: 'w-12 h-12',
        LARGE: 'w-16 h-16',
    },
    BUTTON: {
        SMALL: 'px-3 py-1.5 text-sm',
        MEDIUM: 'px-4 py-2',
        LARGE: 'px-6 py-3 text-lg',
    },
};

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px',
};

export default {
    API_BASE_URL,
    TOKEN_STORAGE_KEY,
    USER_STORAGE_KEY,
    API_ENDPOINTS,
    HTTP_STATUS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    VALIDATION_RULES,
    LOADING_STATES,
    COLORS,
    PAGINATION,
    DATE_FORMATS,
    STORAGE_KEYS,
    ROUTES,
    SIZES,
    BREAKPOINTS,
};