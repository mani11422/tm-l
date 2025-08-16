import React, { useState, createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage.ts';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { TimeEntry, TimeEntryStatus } from '@/types';

interface TimeSheetsContextType {
  timeEntries: TimeEntry[];
  addTimeEntry: (entryData: Omit<TimeEntry, 'id' | 'status'>) => void;
  updateEntryStatus: (entryId: string, newStatus: TimeEntryStatus) => void;
}

const TimeSheetsContext = createContext<TimeSheetsContextType | undefined>(undefined);

const initialTimeEntries: TimeEntry[] = [
  { id: 'ts-1', userId: 'user-3', taskId: 'task-1', projectId: 'proj-1', date: format(new Date(), 'yyyy-MM-dd'), timeSpent: '02:30', notes: 'Initial design mockups.', status: 'Submitted' },
  { id: 'ts-2', userId: 'user-3', taskId: 'task-3', projectId: 'proj-2', date: format(new Date(), 'yyyy-MM-dd'), timeSpent: '04:00', notes: 'Investigated and fixed the payment bug.', status: 'Approved' },
  { id: 'ts-3', userId: 'user-2', taskId: 'task-2', projectId: 'proj-1', date: format(new Date(), 'yyyy-MM-dd'), timeSpent: '05:00', notes: 'API development in progress.', status: 'Submitted' },
  { id: 'ts-4', userId: 'user-3', taskId: 'task-1', projectId: 'proj-1', date: format(new Date(Date.now() - 86400000), 'yyyy-MM-dd'), timeSpent: '03:00', notes: 'Refined dashboard components.', status: 'Approved' },
];

export function useTimeSheets() {
  const context = useContext(TimeSheetsContext);
  if (!context) {
    throw new Error('useTimeSheets must be used within a TimeSheetsProvider');
  }
  return context;
}

interface TimeSheetsProviderProps {
    children: ReactNode;
}

export function TimeSheetsProvider({ children }: TimeSheetsProviderProps) {
  const [timeEntries, setTimeEntries] = useLocalStorage<TimeEntry[]>('taskman_timesheets', initialTimeEntries);

  const addTimeEntry = (entryData: Omit<TimeEntry, 'id' | 'status'>) => {
    const newEntry: TimeEntry = { ...entryData, id: uuidv4(), status: 'Submitted' };
    setTimeEntries(prev => [...prev, newEntry]);
  };

  const updateEntryStatus = (entryId: string, newStatus: TimeEntryStatus) => {
    setTimeEntries(prev => prev.map(entry => entry.id === entryId ? { ...entry, status: newStatus } : entry));
  };

  const value = {
    timeEntries,
    addTimeEntry,
    updateEntryStatus,
  };

  return (
    <TimeSheetsContext.Provider value={value}>
      {children}
    </TimeSheetsContext.Provider>
  );
}