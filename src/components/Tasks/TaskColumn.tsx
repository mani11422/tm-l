import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskCard } from './TaskCard.tsx';
import { Task } from '@/types';

interface TaskColumnProps {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
}

export function TaskColumn({ id, title, color, tasks }: TaskColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
    data: {
      type: 'column'
    }
  });

  return (
    <div className="flex flex-col h-full">
      <div className={`bg-gradient-to-r ${color} p-3 rounded-t-lg`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white">{title}</h3>
          <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>
      
      <SortableContext id={id} items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className="flex-1 glass-card border-white/20 rounded-t-none p-4 space-y-3 min-h-[400px] overflow-y-auto scrollbar-hide"
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}