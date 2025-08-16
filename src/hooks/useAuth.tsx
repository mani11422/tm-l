import React, { useState, createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage.ts';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: (User & { password?: string })[] = [
  { id: '1', email: 'admin@taskmaster.com', password: 'password123', name: 'Admin User', role: 'Admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin' },
  { id: '2', email: 'manager@taskmaster.com', password: 'password123', name: 'Manager Mike', role: 'Manager', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=manager' },
  { id: '3', email: 'member@taskmaster.com', password: 'password123', name: 'Member Mary', role: 'Member', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=member' },
  { id: '4', email: 'guest@taskmaster.com', password: 'password123', name: 'Guest George', role: 'Guest', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest' },
  { id: '5', email: 'inactive@taskmaster.com', password: 'password123', name: 'Inactive Ian', role: 'Member', active: false, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=inactive' },
];

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useLocalStorage<User | null>('taskman_user', null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers.find(u => u.email === email);

      if (!foundUser) {
        return { success: false, error: "User not found." };
      }

      if (foundUser.password !== password) {
        return { success: false, error: "Invalid password." };
      }
      
      if (foundUser.active === false) {
        return { success: false, error: "This account is inactive." };
      }

      const { password: userPassword, ...userToStore } = foundUser;
      
      setUser(userToStore);
      return { success: true, user: userToStore };
    } catch (error) {
      return { success: false, error: "An unexpected error occurred." };
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