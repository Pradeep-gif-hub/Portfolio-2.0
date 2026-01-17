import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const token = sessionStorage.getItem('admin_token');
    const expiry = sessionStorage.getItem('admin_expiry');
    const adminAccess = sessionStorage.getItem('admin_access_granted');
    
    // Only authenticate if they have the special access flag
    if (token && expiry && adminAccess === 'true') {
      const expiryTime = parseInt(expiry);
      if (Date.now() < expiryTime) {
        setIsAuthenticated(true);
      } else {
        // Session expired
        sessionStorage.removeItem('admin_token');
        sessionStorage.removeItem('admin_expiry');
        sessionStorage.removeItem('admin_access_granted');
      }
    }
    setLoading(false);
  }, []);

  const login = async (password: string): Promise<boolean> => {
    try {
      // Always use the real API endpoint (works in both dev and production now)
      const API_URL = import.meta.env.VITE_API_URL || '/api';
      
      const response = await fetch(`${API_URL}/admin/auth?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password })
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();

      if (data.success && data.token) {
        const expiry = Date.now() + (data.expiresIn * 1000);
        
        sessionStorage.setItem('admin_token', data.token);
        sessionStorage.setItem('admin_expiry', expiry.toString());
        sessionStorage.setItem('admin_access_granted', 'true');
        setIsAuthenticated(true);
        return true;
      }
      
      return false;
    } catch (error) {
      // Login error occurred
      return false;
    }
  };

  const logout = () => {
    sessionStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_access_granted');
    sessionStorage.removeItem('admin_expiry');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
