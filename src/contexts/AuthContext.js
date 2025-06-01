import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            checkAuth();
        } else {
            setLoading(false);
        }
    }, []);

    const checkAuth = async () => {
        try {
            const response = await axios.get('/api/auth/me', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setUser(response.data.user);
            setError(null);
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                setUser(null);
            }
            setError(error.response?.data?.message || 'Ndodhi një gabim gjatë verifikimit');
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post('/api/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            setUser(response.data.user);
            setError(null);
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Ndodhi një gabim gjatë hyrjes';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const register = async (userData) => {
        try {
            const response = await axios.post('/api/auth/register', userData);
            localStorage.setItem('token', response.data.token);
            setUser(response.data.user);
            setError(null);
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Ndodhi një gabim gjatë regjistrimit';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setError(null);
    };

    const updateProfile = async (profileData) => {
        try {
            const response = await axios.put('/api/auth/profile', profileData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setUser(response.data.user);
            setError(null);
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Ndodhi një gabim gjatë përditësimit të profilit';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const updatePassword = async (currentPassword, newPassword) => {
        try {
            await axios.put('/api/auth/password', { currentPassword, newPassword }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setError(null);
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Ndodhi një gabim gjatë ndryshimit të fjalëkalimit';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        updatePassword,
        checkAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext; 