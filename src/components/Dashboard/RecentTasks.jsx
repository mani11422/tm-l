import React from 'react';
import { motion } from 'framer-motion';
import { Clock, User, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function RecentTasks({ tasks }) {
  const recentTasks = tasks
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return 'status-todo';
      case 'in-progress': return 'status-progress';
      case 'review': return 'status-review';
      case 'done': return 'status-done';
      case 'blocked': return 'status-blocked';
      default: return 'status-todo';
    }
  };

  return (
    <Card className="glass-card border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Tasks
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentTasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="task-card p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-medium text-white truncate flex-1">{task.title}</h4>
              <div className="flex gap-2 ml-4">
                <Badge className={`status-badge ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </Badge>
                <Badge className={`status-badge ${getStatusColor(task.status)}`}>
                  {task.status}
                </Badge>
              </div>
            </div>
            
            <p className="text-sm text-gray-400 mb-3 line-clamp-2">{task.description}</p>
            
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{task.assignee}</span>
                </div>
                {task.dueDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Avatar className="w-5 h-5">
                  <AvatarFallback className="bg-purple-500 text-white text-xs">
                    {task.assignee?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}