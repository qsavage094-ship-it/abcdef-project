import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('agro_token') || null);
  const [loading, setLoading] = useState(true);

  // Load user profile on mount if token exists
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (token) {
        try {
          const response = await authService.getCurrentUser();
          if (response.data && response.data.success) {
            setUser(response.data.data);
          } else {
            logout();
          }
        } catch (error) {
          console.error('Failed to load user profile:', error);
          logout();
        }
      }
      setLoading(false);
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      if (response.data && response.data.success) {
        const { token: receivedToken, ...userData } = response.data.data;
        localStorage.setItem('agro_token', receivedToken);
        setToken(receivedToken);
        setUser(userData);
        return { success: true };
      }
      return {
        success: false,
        message: response.data.message || 'Login failed'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Login failed'
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      if (response.data && response.data.success) {
        const { token: receivedToken, ...createdUser } = response.data.data;
        localStorage.setItem('agro_token', receivedToken);
        setToken(receivedToken);
        setUser(createdUser);
        return { success: true };
      }
      return {
        success: false,
        message: response.data.message || 'Registration failed'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Registration failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('agro_token');
    setToken(null);
    setUser(null);
  };

  const updateUserData = (newUserData) => {
    setUser((prev) => ({ ...prev, ...newUserData }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateUserData
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
