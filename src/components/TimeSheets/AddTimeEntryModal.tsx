import React from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useTimeSheets } from '@/hooks/useTimeSheets.tsx';
import { useTasks } from '@/hooks/useTasks.tsx';
import { useAuth } from '@/hooks/useAuth.tsx';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { Calendar } from '@/components/ui/calendar.tsx';
import { toast } from '@/components/ui/use-toast.ts';
import { cn } from '@/lib/utils.ts';
import { TimeEntry } from '@/types';

interface AddTimeEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormValues = {
    taskId: string;
    date: Date;
    timeSpent: string;
    notes: string;
};

export function AddTimeEntryModal({ isOpen, onClose }: AddTimeEntryModalProps) {
  const { addTimeEntry } = useTimeSheets();
  const { tasks } = useTasks();
  const { user } = useAuth();
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
        date: new Date()
    }
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if(!user) return;
    const task = tasks.find(t => t.id === data.taskId);
    if (!task) return;

    const entryData: Omit<TimeEntry, 'id' | 'status'> = {
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