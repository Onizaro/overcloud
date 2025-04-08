import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { logoutUser } from './services/user.service';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const login = (token: string, email: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('email', email); 
    setIsAuthenticated(true);
  };

  const logout = async () => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    if (token && email) {
      try {
        await logoutUser({ token: token, email: email }); 
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        setIsAuthenticated(false);
      } catch (error) {
        console.error('Erreur lors de la déconnexion via l\'API :', error);
      }
    }
  
    
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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
