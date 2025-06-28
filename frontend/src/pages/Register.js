import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RegisterForm from '../components/auth/RegisterForm';

const Register = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleRegisterSuccess = () => {
        navigate('/dashboard', { replace: true });
    };

    if (isAuthenticated) {
        return null; // Prevent flash of register form
    }

    return (
        <div className="min-h-96 flex items-center justify-center">
            <RegisterForm onSuccess={handleRegisterSuccess} />
        </div>
    );
};

export default Register;