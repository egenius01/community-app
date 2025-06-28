import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/dashboard';

    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    const handleLoginSuccess = () => {
        navigate(from, { replace: true });
    };

    if (isAuthenticated) {
        return null; // Prevent flash of login form
    }

    return (
        <div className="min-h-96 flex items-center justify-center">
            <LoginForm onSuccess={handleLoginSuccess} />
        </div>
    );
};

export default Login;