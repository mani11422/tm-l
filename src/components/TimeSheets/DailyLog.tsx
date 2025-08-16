import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, X } from 'lucide-react';
import { useTimeSheets } from '@/hooks/useTimeSheets.tsx';
import { useTasks } from '@/hooks/useTasks.tsx';
import { useAuth } from '@/hooks/useAuth.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { toast } from '@/components/ui/use-toast.ts';
import { AddTimeEntryModal } from './AddTimeEntryModal.tsx';
import { format, parseISO } from 'date-fns';
import { TimeEntry, TimeEntryStatus } from '@/types';

const statusColors: Record<TimeEntryStatus, string> = {
  Submitted: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  Approved: 'bg-green-500/20 text-green-300 border-green-500/30',
  Rejected: 'bg-red-500/20 text-red-300 border-red-500/30',
};

export function DailyLog() {
  const { user } = useAuth();
  const { timeEntries, updateEntryStatus } = useTimeSheets();
  const { tasks } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userTimeEntries = useMemo(() => {
    if (!user) return [];
    if (user.role === 'Manager') return timeEntries;
    if (user.role === 'Team Lead') {
      return timeEntries.filter(entry => entry.userId === user.id || entry.userId === 'user-3');
    }
    return timeEntries.filter(entry => entry.userId === user.id);
  }, [timeEntries, user]);

  const groupedEntries: Record<string, TimeEntry[]> = useMemo(() => {
    return userTimeEntries.reduce((acc: Record<string, TimeEntry[]>, entry) => {
      const date = entry.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(entry);
      return acc;
    }, {});
  }, [userTimeEntries]);

  const sortedDates = Object.keys(groupedEntries).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const getTaskName = (taskId: string) => tasks.find(t => t.id === taskId)?.title || 'Unknown Task';

  const handleStatusUpdate = (entryId: string, newStatus: TimeEntryStatus) => {
    updateEntryStatus(entryId, newStatus);
    toast({
      title: `Entry ${newStatus}`,
      description: `The time entry has been ${newStatus.toLowerCase()}.`,
    });
  };

  return (
    <>
      <Card className="glass-card">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-white">Your Time Entries</CardTitle>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Time Entry
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {sortedDates.map(date => (
              <div key={date}>
                <h3 className="text-lg font-semibold text-white mb-3">{format(parseISO(date), 'EEEE, MMMM d, yyyy')}</h3>
                <div className="space-y-3">
                  {groupedEntries[date].map(entry => (
                    <motion.div
                      key={entry.id}
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg"
                    >
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <p className="font-medium text-white">{getTaskName(entry.taskId)}</p>
                        <p className="text-gray-300">{entry.timeSpent}</p>
                        <p className="text-gray-400 italic truncate col-span-1">{entry.notes || 'No notes'}</p>
                        <div className="flex justify-start md:justify-end">
                          <Badge className={`status-badge ${statusColors[entry.status]}`}>{entry.status}</Badge>
                        </div>
                      </div>
                      {(user?.role === 'Manager' || user?.role === 'Team Lead') && entry.status === 'Submitted' && (
                        <div className="flex items-center gap-2 ml-4">
                          <Button variant="ghost" size="icon" onClick={() => handleStatusUpdate(entry.id, 'Approved')}>
                            <Check className="w-4 h-4 text-green-400" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleStatusUpdate(entry.id, 'Rejected')}>
                            <X className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <AddTimeEntryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}