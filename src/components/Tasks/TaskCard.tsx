import React, { CSSProperties } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Calendar, MessageSquare, Paperclip } from 'lucide-react';
import { Badge } from '@/components/ui/badge.tsx';
import { Avatar, AvatarFallback } from '@/components/ui/avatar.tsx';
import { toast } from '@/components/ui/use-toast.ts';
import { cn } from '@/lib/utils.ts';
import { Task, TaskPriority } from '@/types';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: {
      type: 'task',
      task
    }
  });

  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  const handleCardClick = () => {
    toast({
      title: "📋 Task Details",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleCardClick}
      className={cn("task-card cursor-grab", { 'dragging': isDragging })}
    >
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-medium text-white text-sm line-clamp-2 flex-1">
            {task.title}
          </h4>
          <Badge className={`status-badge ${getPriorityColor(task.priority)} ml-2`}>
            {task.priority}
          </Badge>
        </div>

        <p className="text-xs text-gray-400 mb-3 line-clamp-2">
          {task.description}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            {task.dueDate && (
              <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-400' : ''}`}>
                <Calendar className="w-3 h-3" />
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              <span>0</span>
            </div>
            <div className="flex items-center gap-1">
              <Paperclip className="w-3 h-3" />
              <span>0</span>
            </div>
            <Avatar className="w-5 h-5">
              <AvatarFallback className="bg-purple-500 text-white text-xs">
                {task.assignee?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </motion.div>
    </div>
  );
}