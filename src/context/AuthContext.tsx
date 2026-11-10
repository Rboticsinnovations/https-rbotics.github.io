import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'user' | null;

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    mobile: string;
    role: UserRole;
    joinedAt: string;
}

interface AuthContextType {
    currentUser: AuthUser | null;
    isLoggedIn: boolean;
    isAdmin: boolean;
    login: (emailOrMobile: string, password: string) => Promise<{ success: boolean; message: string }>;
    register: (name: string, email: string, mobile: string, password: string) => Promise<{ success: boolean; message: string }>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
        const stored = localStorage.getItem('rbotics_current_user');
        return stored ? JSON.parse(stored) : null;
    });

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('rbotics_current_user', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('rbotics_current_user');
        }
    }, [currentUser]);

    // api.ts fires this when the session can't be refreshed (expired/invalid) — sign the user out.
    useEffect(() => {
        const handleForcedLogout = () => setCurrentUser(null);
        window.addEventListener('auth-logout', handleForcedLogout);
        return () => window.removeEventListener('auth-logout', handleForcedLogout);
    }, []);

    const login = async (emailOrMobile: string, password: string): Promise<{ success: boolean; message: string }> => {
        try {
            const { default: api, setAccessToken } = await import('../api');
            const res = await api.post('/auth/login', { loginId: emailOrMobile, password });
            if (res.data.success) {
                setAccessToken(res.data.accessToken);
                setCurrentUser(res.data.user);
                return { success: true, message: 'Login successful!' };
            }
            return { success: false, message: 'Invalid credentials' };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || 'Cannot reach the server. Is the backend running?' };
        }
    };

    const register = async (name: string, email: string, mobile: string, password: string): Promise<{ success: boolean; message: string }> => {
        try {
            const { default: api, setAccessToken } = await import('../api');
            const res = await api.post('/auth/register', { name, email, phone: mobile, password });
            if (res.data.success) {
                setAccessToken(res.data.accessToken);
                setCurrentUser(res.data.user);
                return { success: true, message: res.data.message || 'Account created successfully!' };
            }
            return { success: false, message: 'Registration failed' };
        } catch (error: any) {
             return { success: false, message: error.response?.data?.message || 'Cannot reach the server. Is the backend running?' };
        }
    };

    const logout = async () => {
        try {
            const { default: api, setAccessToken } = await import('../api');
            await api.post('/auth/logout');
            setAccessToken(null);
        } catch (e) {
            // ignore
        }
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{
            currentUser,
            isLoggedIn: !!currentUser,
            isAdmin: currentUser?.role === 'admin',
            login,
            register,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
