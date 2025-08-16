import { useState, useEffect, createContext, useContext } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage('taskman_user', null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // Mock authentication - in real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        id: '1',
        email,
        name: email.split('@')[0],
        role: 'admin',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        department: 'Engineering',
        joinedAt: new Date().toISOString(),
      };
      
      setUser(mockUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}