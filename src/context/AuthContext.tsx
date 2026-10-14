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
    register: (name: string, email: string, mobile: string, password?: string) => Promise<{ success: boolean; message: string }>;
    verifyOtp: (email: string, otp: string) => Promise<{ success: boolean; message: string }>;
    setPassword: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Default admin credentials
const ADMIN_CREDENTIALS = {
    email: 'admin@rbotics.in',
    mobile: '',
    password: 'Admin@123',
    name: 'Admin',
    id: 'admin-001',
    role: 'admin' as UserRole,
    joinedAt: new Date().toISOString(),
};

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

    const getUsers = (): AuthUser[] => {
        const stored = localStorage.getItem('rbotics_users');
        return stored ? JSON.parse(stored) : [];
    };

    const saveUser = (user: AuthUser & { password: string }) => {
        const users = getUsers();
        const existing = localStorage.getItem('rbotics_users_with_pw');
        const withPw: (AuthUser & { password: string })[] = existing ? JSON.parse(existing) : [];
        withPw.push(user);
        localStorage.setItem('rbotics_users_with_pw', JSON.stringify(withPw));

        const publicUsers = users.concat({
            id: user.id, name: user.name, email: user.email,
            mobile: user.mobile, role: user.role, joinedAt: user.joinedAt,
        });
        localStorage.setItem('rbotics_users', JSON.stringify(publicUsers));
    };

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
            return { success: false, message: error.response?.data?.message || 'Server error' };
        }
    };

    const register = async (name: string, email: string, mobile: string, password: string): Promise<{ success: boolean; message: string }> => {
        try {
            const { default: api } = await import('../api');
            const res = await api.post('/auth/register', { name, email, phone: mobile, password });
            if (res.data.success) {
                return { success: true, message: res.data.message };
            }
            return { success: false, message: 'Registration failed' };
        } catch (error: any) {
             return { success: false, message: error.response?.data?.message || 'Server error' };
        }
    };

    const verifyOtp = async (email: string, otp: string): Promise<{ success: boolean; message: string }> => {
        try {
            const { default: api } = await import('../api');
            const res = await api.post('/auth/verify-otp', { email, otp });
            if (res.data.success) {
                return { success: true, message: res.data.message };
            }
            return { success: false, message: 'Verification failed' };
        } catch (error: any) {
             return { success: false, message: error.response?.data?.message || 'Server error' };
        }
    };

    const setPassword = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
        try {
            const { default: api, setAccessToken } = await import('../api');
            const res = await api.post('/auth/set-password', { email, password });
            if (res.data.success) {
                setAccessToken(res.data.accessToken);
                setCurrentUser(res.data.user);
                return { success: true, message: res.data.message };
            }
            return { success: false, message: 'Failed to set password' };
        } catch (error: any) {
             return { success: false, message: error.response?.data?.message || 'Server error' };
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
            verifyOtp,
            setPassword,
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
