import React, { useState, createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage.ts';
import { v4 as uuidv4 } from 'uuid';
import { OrgUser, UserRole } from '@/types';

interface OrgContextType {
  users: OrgUser[];
  addUser: (userData: Omit<OrgUser, 'id' | 'status'>) => void;
  removeUser: (userId: string) => void;
  updateUserRole: (userId: string, newRole: UserRole) => void;
  resendInvitation: (userId: string) => void;
}

const OrgContext = createContext<OrgContextType | undefined>(undefined);

const initialOrgUsers: OrgUser[] = [
    { id: 'user-1', name: 'Admin User', email: 'admin@taskmaster.com', role: 'Manager', status: 'Active' },
    { id: 'user-2', name: 'Manager Mike', email: 'mike@taskmaster.com', role: 'Team Lead', status: 'Active' },
    { id: 'user-3', name: 'Member Mary', email: 'mary@taskmaster.com', role: 'Team Member', status: 'Active' },
    { id: 'user-4', name: 'Guest George', email: 'george@taskmaster.com', role: 'Team Member', status: 'Pending' },
];

export function useOrg() {
  const context = useContext(OrgContext);
  if (!context) {
    throw new Error('useOrg must be used within an OrgProvider');
  }
  return context;
}

interface OrgProviderProps {
    children: ReactNode;
}

export function OrgProvider({ children }: OrgProviderProps) {
  const [users, setUsers] = useLocalStorage<OrgUser[]>('taskman_org_users', initialOrgUsers);

  const addUser = (userData: Omit<OrgUser, 'id' | 'status'>) => {
    const newUser = { ...userData, id: uuidv4(), status: 'Pending' as const };
    setUsers(prev => [...prev, newUser]);
  };

  const removeUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    setUsers(prev => prev.map(user => user.id === userId ? { ...user, role: newRole } : user));
  };
  
  const resendInvitation = (userId: string) => {
    console.log(`Resending invitation for user ${userId}`);
  };

  const value = {
    users,
    addUser,
    removeUser,
    updateUserRole,
    resendInvitation,
  };

  return (
    <OrgContext.Provider value={value}>
      {children}
    </OrgContext.Provider>
  );
}