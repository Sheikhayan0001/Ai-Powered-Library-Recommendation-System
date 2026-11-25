import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest, getAuthToken, setAuthToken, removeAuthToken } from '../services/api';

export interface AuthUser {
  id: number;
  email: string;
  full_name: string;
  student_id?: string;
  role: 'ADMIN' | 'STUDENT';
  avatar_url?: string;
  department?: string;
  phone?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (token: string, userData: AuthUser) => void;
  logout: () => void;
  updateUser: (data: Partial<AuthUser>) => void;
  isAdmin: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
  isAdmin: false,
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }

    apiRequest<AuthUser>('/auth/me')
      .then(userData => {
        setUser(userData);
      })
      .catch(() => {
        removeAuthToken();
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = (token: string, userData: AuthUser) => {
    setAuthToken(token);
    setUser(userData);
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
  };

  const updateUser = (data: Partial<AuthUser>) => {
    setUser(prev => (prev ? { ...prev, ...data } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateUser,
        isAdmin: user?.role === 'ADMIN',
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
