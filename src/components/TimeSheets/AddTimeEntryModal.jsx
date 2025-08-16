import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useTimeSheets } from '@/hooks/useTimeSheets.jsx';
import { useTasks } from '@/hooks/useTasks.jsx';
import { useAuth } from '@/hooks/useAuth.jsx';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

export function AddTimeEntryModal({ isOpen, onClose }) {
  const { addTimeEntry } = useTimeSheets();
  const { tasks } = useTasks();
  const { user } = useAuth();
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    const task = tasks.find(t => t.id === data.taskId);
    const entryData = {
      ...data,
      date: format(data.date, 'yyyy-MM-dd'),
      userId: user.id,
      projectId: task.projectId,
    };
    addTimeEntry(entryData);
    toast({
      title: '✅ Time Entry Added',
      description: 'Your time entry has been successfully submitted.',
    });
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="text-white">
        <DialogHeader>
          <DialogTitle>Add New Time Entry</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="taskId">Task</Label>
            <Controller
              name="taskId"
              control={control}
              rules={{ required: 'Please select a task' }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger id="taskId" className="bg-slate-900 border-slate-700">
                    <SelectValue placeholder="Select a task" />
                  </SelectTrigger>
                  <SelectContent>
                    {tasks.map(task => (
                      <SelectItem key={task.id} value={task.id}>{task.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.taskId && <p className="text-red-500 text-xs mt-1">{errors.taskId.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Controller
                name="date"
                control={control}
                defaultValue={new Date()}
                rules={{ required: 'Date is required' }}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal bg-slate-900 border-slate-700 hover:bg-slate-800",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
            </div>
            <div>
              <Label htmlFor="timeSpent">Time Spent (hh:mm)</Label>
              <Input
                id="timeSpent"
                {...register('timeSpent', {
                  required: 'Time is required',
                  pattern: { value: /^\d{2}:\d{2}$/, message: 'Invalid format. Use hh:mm' }
                })}
                placeholder="02:30"
                className="bg-slate-900 border-slate-700"
              />
              {errors.timeSpent && <p className="text-red-500 text-xs mt-1">{errors.timeSpent.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Describe the work you did..."
              className="bg-slate-900 border-slate-700"
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Submit Entry</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}