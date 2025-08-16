import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { Button } from '@/components/ui/button';
import { TaskColumn } from './TaskColumn';
import { toast } from '@/components/ui/use-toast';
import { useTasks } from '@/hooks/useTasks.jsx';

const columns = [
  { id: 'todo', title: 'To Do', color: 'from-gray-500 to-gray-600' },
  { id: 'in-progress', title: 'In Progress', color: 'from-blue-500 to-blue-600' },
  { id: 'review', title: 'Review', color: 'from-purple-500 to-purple-600' },
  { id: 'done', title: 'Done', color: 'from-green-500 to-green-600' },
  { id: 'blocked', title: 'Blocked', color: 'from-red-500 to-red-600' },
];

export function TaskBoard({ onCreateTask }) {
  const { tasks, updateTask } = useTasks();

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;
    
    const activeId = active.id;
    const overId = over.id;

    const task = tasks.find(t => t.id === activeId);
    const newStatus = over.data.current?.type === 'column' ? over.id : null;
    
    if (task && newStatus && task.status !== newStatus) {
      updateTask(activeId, newStatus);
      toast({
        title: "Task Moved",
        description: `Task moved to ${newStatus.replace('-', ' ')}`,
      });
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Task Board</h2>
          <Button
            onClick={onCreateTask}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 overflow-auto">
          {columns.map((column, index) => (
            <motion.div
              key={column.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col h-full"
            >
              <TaskColumn
                id={column.id}
                title={column.title}
                color={column.color}
                tasks={getTasksByStatus(column.id)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </DndContext>
  );
}