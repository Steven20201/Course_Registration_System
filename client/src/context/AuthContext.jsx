import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { login as loginApi } from '../services/api';

const AuthContext = createContext();
const INACTIVE_LIMIT = 180 * 60 * 1000;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });

    const timerRef = useRef(null);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const resetTimer = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            logout();
        }, INACTIVE_LIMIT);
    };

    useEffect(() => {
        if (!user) return;
        const events = ['mousemove', 'keydown', 'click', 'scroll'];
        events.forEach((event) => window.addEventListener(event, resetTimer));

        resetTimer();

        return () => {
            events.forEach((event) => window.removeEventListener(event, resetTimer));
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [user]);

    const login = async (email, password) => {
        const data = await loginApi(email, password);
        console.log('Login response', data);
        console.log('User role:', data.user?.role);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        return data.user;
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => useContext(AuthContext);