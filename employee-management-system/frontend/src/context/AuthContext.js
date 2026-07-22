import React, { createContext, useContext, useState } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const [role, setRole] = useState(localStorage.getItem('role'));

  const login = async (usernameInput, password) => {
    const response = await api.post('/auth/login', { username: usernameInput, password });
    const { token, username: returnedUsername, role: returnedRole } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('username', returnedUsername);
    localStorage.setItem('role', returnedRole);

    setUsername(returnedUsername);
    setRole(returnedRole);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setUsername(null);
    setRole(null);
  };

  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <AuthContext.Provider value={{ username, role, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
