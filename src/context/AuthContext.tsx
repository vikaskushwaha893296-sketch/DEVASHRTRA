import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, AuthResponse } from '../types/index.ts';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: 'student' | 'parent' | 'mentor' | 'admin') => Promise<void>;
  logout: () => void;
  loginAsDemoRole: (role: 'student' | 'parent' | 'mentor' | 'admin') => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('devashtra_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchMe = async (authToken: string) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          return;
        }
      }
      // If token expired or invalid
      logout();
    } catch {
      // Offline or network error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMe(token);
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data: AuthResponse = await res.json();

      if (!res.ok || !data.success || !data.token) {
        throw new Error(data.error || 'Authentication failed');
      }

      localStorage.setItem('devashtra_token', data.token);
      setToken(data.token);
      if (data.user) {
        setUser(data.user);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: 'student' | 'parent' | 'mentor' | 'admin'
  ) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data: AuthResponse = await res.json();

      if (!res.ok || !data.success || !data.token) {
        throw new Error(data.error || 'Registration failed');
      }

      localStorage.setItem('devashtra_token', data.token);
      setToken(data.token);
      if (data.user) {
        setUser(data.user);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemoRole = async (role: 'student' | 'parent' | 'mentor' | 'admin') => {
    const email = `${role}@devashtra.com`;
    const password = 'password123';
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('devashtra_token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (token) {
      await fetchMe(token);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        loginAsDemoRole,
        refreshUser,
      }}
    >
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
