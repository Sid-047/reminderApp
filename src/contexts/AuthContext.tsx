import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, AuthContextType } from '../types';

// Mock data for demo purposes
const MOCK_USER: User = {
  id: '1',
  email: 'user@example.com',
  name: 'Demo User'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user in localStorage (simulating persistence)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API request delay
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo: any email/password combination works
    const user = MOCK_USER;
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    setIsLoading(false);
  };

  const register = async (email: string, password: string, name: string) => {
    // Simulate API request delay
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo: create a new user
    const newUser = { ...MOCK_USER, email, name };
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const forgotPassword = async (email: string) => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In a real app, this would send a reset email
    console.log(`Password reset requested for ${email}`);
  };

  const resetPassword = async (token: string, newPassword: string) => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In a real app, this would verify the token and update the password
    console.log(`Password reset with token ${token}`);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};