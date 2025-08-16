import React, { useState, createContext, useContext } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';

const OrgContext = createContext();

const initialOrgUsers = [
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

export function OrgProvider({ children }) {
  const [users, setUsers] = useLocalStorage('taskman_org_users', initialOrgUsers);

  const addUser = (userData) => {
    const newUser = { ...userData, id: uuidv4(), status: 'Pending' };
    setUsers(prev => [...prev, newUser]);
  };

  const removeUser = (userId) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  const updateUserRole = (userId, newRole) => {
    setUsers(prev => prev.map(user => user.id === userId ? { ...user, role: newRole } : user));
  };
  
  const resendInvitation = (userId) => {
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