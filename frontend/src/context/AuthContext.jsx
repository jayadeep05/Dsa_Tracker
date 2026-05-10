import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('jwt_token');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        localStorage.setItem('jwt_token', userData.token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        navigate('/');
    };

    const logout = () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    if (loading) return <div className="loading-screen">Loading...</div>;

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
