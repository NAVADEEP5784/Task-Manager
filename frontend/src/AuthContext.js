import React, { createContext, useState, useEffect } from 'react';
import { authAPI, usersAPI } from './api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      clearSession();
      const response = await authAPI.login(username.trim(), password);
      const { access_token } = response.data;

      localStorage.setItem('accessToken', access_token);
      const profileResponse = await usersAPI.getProfile();
      const user = profileResponse.data;

      setToken(access_token);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  };

  const register = async (username, email, password) => {
    try {
      clearSession();
      const response = await authAPI.register(username.trim(), email.trim(), password);
      const { access_token, user } = response.data;

      setToken(access_token);
      setUser(user);
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      return user;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  };

  const clearSession = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  };

  const logout = () => {
    clearSession();
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAuthenticated,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
