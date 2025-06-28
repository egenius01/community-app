// src/context/AuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/auth.js';

const AuthContext = createContext();

const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
};

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_START':
        case 'REGISTER_START':
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case 'LOGIN_SUCCESS':
        case 'REGISTER_SUCCESS':
            return {
                ...state,
                user: action.payload.user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            };
        case 'LOGIN_FAILURE':
        case 'REGISTER_FAILURE':
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: action.payload,
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            };
        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null,
            };
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload,
            };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Check if user is logged in on app start
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const token = localStorage.getItem('access_token');

                if (token) {
                    // Verify token and get fresh user data
                    const userData = await authService.verifyToken();
                    const user = Array.isArray(userData) ? userData[0] : userData;

                    if (user) {
                        localStorage.setItem('user', JSON.stringify(user));
                        dispatch({
                            type: 'LOGIN_SUCCESS',
                            payload: { user },
                        });
                    } else {
                        // Token is invalid, clear storage
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                        localStorage.removeItem('user');
                        dispatch({ type: 'SET_LOADING', payload: false });
                    }
                } else {
                    dispatch({ type: 'SET_LOADING', payload: false });
                }
            } catch (error) {
                // Token is invalid, clear storage
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };

        checkAuthStatus();
    }, []);

    const login = async (credentials) => {
        try {
            dispatch({ type: 'LOGIN_START' });
            const response = await authService.login(credentials);

            localStorage.setItem('access_token', response.access);
            localStorage.setItem('refresh_token', response.refresh);

            // Extract user from array if it's an array
            const user = Array.isArray(response.user) ? response.user[0] : response.user;
            localStorage.setItem('user', JSON.stringify(user));

            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { user },
            });

            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.detail ||
                error.response?.data?.message ||
                'Login failed';
            dispatch({
                type: 'LOGIN_FAILURE',
                payload: errorMessage,
            });
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            dispatch({ type: 'REGISTER_START' });
            const response = await authService.register(userData);

            localStorage.setItem('access_token', response.access);
            localStorage.setItem('refresh_token', response.refresh);

            // Extract user from array if it's an array
            const user = Array.isArray(response.user) ? response.user[0] : response.user;
            localStorage.setItem('user', JSON.stringify(user));

            dispatch({
                type: 'REGISTER_SUCCESS',
                payload: { user },
            });

            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.detail ||
                error.response?.data?.message ||
                'Registration failed';
            dispatch({
                type: 'REGISTER_FAILURE',
                payload: errorMessage,
            });
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        dispatch({ type: 'LOGOUT' });
    };

    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    const value = {
        ...state,
        login,
        register,
        logout,
        clearError,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};