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
    login: (emailOrMobile: string, password: string) => { success: boolean; message: string };
    register: (name: string, email: string, mobile: string, password: string) => { success: boolean; message: string };
    logout: () => void;
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

    const login = (emailOrMobile: string, password: string): { success: boolean; message: string } => {
        // Check admin by email
        if (emailOrMobile === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
            const adminUser: AuthUser = {
                id: ADMIN_CREDENTIALS.id,
                name: ADMIN_CREDENTIALS.name,
                email: ADMIN_CREDENTIALS.email,
                mobile: '',
                role: 'admin',
                joinedAt: ADMIN_CREDENTIALS.joinedAt,
            };
            setCurrentUser(adminUser);
            return { success: true, message: 'Admin login successful!' };
        }

        // Check registered users by email OR mobile
        const stored = localStorage.getItem('rbotics_users_with_pw');
        const users: (AuthUser & { password: string })[] = stored ? JSON.parse(stored) : [];
        const found = users.find(
            u => (u.email === emailOrMobile || u.mobile === emailOrMobile) && u.password === password
        );
        if (found) {
            const { password: _pw, ...userWithoutPw } = found;
            void _pw;
            setCurrentUser(userWithoutPw);
            return { success: true, message: 'Login successful!' };
        }

        return { success: false, message: 'Invalid email / mobile or password.' };
    };

    const register = (name: string, email: string, mobile: string, password: string): { success: boolean; message: string } => {
        if (!email && !mobile) {
            return { success: false, message: 'Please provide at least an email or mobile number.' };
        }
        if (email && email === ADMIN_CREDENTIALS.email) {
            return { success: false, message: 'This email is reserved.' };
        }
        const stored = localStorage.getItem('rbotics_users_with_pw');
        const users: (AuthUser & { password: string })[] = stored ? JSON.parse(stored) : [];

        if (email && users.find(u => u.email === email)) {
            return { success: false, message: 'Email already registered.' };
        }
        if (mobile && users.find(u => u.mobile === mobile)) {
            return { success: false, message: 'Mobile number already registered.' };
        }

        const newUser: AuthUser & { password: string } = {
            id: `user-${Date.now()}`,
            name,
            email,
            mobile,
            password,
            role: 'user',
            joinedAt: new Date().toISOString(),
        };
        saveUser(newUser);
        const { password: _pw, ...userWithoutPw } = newUser;
        void _pw;
        setCurrentUser(userWithoutPw);
        return { success: true, message: 'Account created successfully!' };
    };

    const logout = () => {
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
