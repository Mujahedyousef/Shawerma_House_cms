import React, { createContext, useContext, useState, useEffect } from 'react';
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
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      // Set token in API defaults
      API.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  const login = async (emailOrUsername, password) => {
    try {
      const response = await API.post('/auth/login', {
        emailOrUsername,
        password,
      });

      if (response.data.success) {
        const { user: userData, token: authToken } = response.data.data;
        
        // Store token and user
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Set token in API defaults
        API.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        
        setToken(authToken);
        setUser(userData);
        
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

  const logout = () => {
    // Remove token and user from storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Remove token from API defaults
    delete API.defaults.headers.common['Authorization'];
    
    setToken(null);
    setUser(null);
  };

  const checkAuth = async () => {
    try {
      if (!token) {
        return false;
      }

      const response = await API.get('/auth/me');
      
      if (response.data.success) {
        return true;
      }
      
      return false;
    } catch (error) {
      // Token is invalid or expired
      logout();
      return false;
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    checkAuth,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
