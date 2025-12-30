'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import api, { setAuthToken } from '../utils/api';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                setAuthToken(token);
                try {
                    const { data } = await api.get('/users/profile');
                    setUser(data);
                } catch (error) {
                    console.error('Failed to load user', error);
                    localStorage.removeItem('token');
                    setAuthToken(null);
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/users/login', { email, password });
        localStorage.setItem('token', data.token);
        setAuthToken(data.token);
        setUser(data);
        router.push('/');
    };

    const register = async (name, email, password) => {
        const { data } = await api.post('/users', { name, email, password });
        localStorage.setItem('token', data.token);
        setAuthToken(data.token);
        setUser(data);
        router.push('/');
    };

    const logout = () => {
        localStorage.removeItem('token');
        setAuthToken(null);
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
