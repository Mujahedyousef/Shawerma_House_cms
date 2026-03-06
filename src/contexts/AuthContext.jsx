import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../services/API';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user from /auth/me on mount (cookie sent automatically)
  const fetchUser = useCallback(async () => {
    try {
      const response = await API.get('/auth/me');
      if (response.data.success && response.data.data?.user) {
        setUser(response.data.data.user);
        return true;
      }
      return false;
    } catch {
      setUser(null);
      return false;
    }
  }, []);

  useEffect(() => {
    fetchUser().finally(() => setLoading(false));
  }, [fetchUser]);

  const login = async (emailOrUsername, password) => {
    try {
      const response = await API.post('/auth/login', {
        emailOrUsername,
        password,
      });

      if (response.data.success && response.data.data?.user) {
        setUser(response.data.data.user);
        return { success: true };
      }

      return { success: false, message: response.data.message || 'Login failed' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check your credentials.',
      };
    }
  };

  const logout = async () => {
    try {
      await API.post('/auth/logout');
    } finally {
      setUser(null);
    }
  };

  const checkAuth = async () => {
    return fetchUser();
  };

  const value = {
    user,
    loading,
    login,
    logout,
    checkAuth,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
