import React, { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { EventClickArg, EventDropArg } from '@fullcalendar/core';
import { Calendar, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { toast } from '@/components/ui/use-toast.ts';
import { Task } from '@/types';

interface EventFormProps {
  onAddEvent: (event: { title: string; date: string | null }) => void;
  date: string | null;
}

const EventForm = ({ onAddEvent, date }: EventFormProps) => {
  const [title, setTitle] = useState('');
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddEvent({ title, date });
      setTitle('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="event-title" className="text-white">Event Title</Label>
        <Input 
          id="event-title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          className="bg-slate-800 border-slate-700 text-white"
        />
      </div>
      <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">Add Event</Button>
    </form>
  );
};

interface CalendarViewProps {
  tasks: Task[];
}

export function CalendarView({ tasks }: CalendarViewProps) {
  const [events, setEvents] = useState(
    tasks.map(task => ({
      id: task.id,
      title: task.title,
      start: task.dueDate,
      end: task.dueDate,
      allDay: true,
      backgroundColor: '#a855f7',
      borderColor: '#a855f7',
      extendedProps: {
        status: task.status
      }
    }))
  );
  
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDateClick = (arg: DateClickArg) => {
    setSelectedDate(arg.dateStr);
    setIsModalOpen(true);
  };
  
  const handleEventClick = (clickInfo: EventClickArg) => {
    toast({
        title: `Task: ${clickInfo.event.title}`,
        description: `Status: ${clickInfo.event.extendedProps.status}`,
    });
  };

  const addEvent = ({title, date}: {title: string, date: string | null}) => {
    if (!date) return;
    const newEvent = {
        id: String(events.length + 1),
        title,
        start: date,
        allDay: true,
        backgroundColor: '#f43f5e',
        borderColor: '#f43f5e',
    };
    setEvents([...events, newEvent]);
    setIsModalOpen(false);
    toast({
      title: "🎉 Event Added!",
      description: `Successfully added "${title}" to the calendar.`,
    });
  };

  return (
    <motion.div
      key="calendar"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-green-500 rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Calendar</h1>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-teal-500 to-green-500 text-white">
                    <Plus className="w-4 h-4 mr-2" /> Add Event
                </Button>
            </DialogTrigger>
            <DialogContent className="glass-card text-white">
                <DialogHeader>
                    <DialogTitle>Add New Event</DialogTitle>
                </DialogHeader>
                <EventForm onAddEvent={addEvent} date={selectedDate} />
            </DialogContent>
        </Dialog>
      </div>

      <Card className="glass-card p-4">
        <CardContent className="p-0 calendar-container">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            initialView="dayGridMonth"
            weekends={true}
            events={events}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            editable={true}
            droppable={true}
            eventDrop={(info: EventDropArg) => {
                toast({
                    title: 'Task Rescheduled',
                    description: `${info.event.title} moved to ${info.event.start?.toLocaleDateString()}`
                })
            }}
            height="auto"
            aspectRatio={2}
          />
        </CardContent>
      </Card>
      <style>{`
        .fc-button-primary { 
          background-color: #581c87 !important; 
          border-color: #581c87 !important;
        }
        .fc-button-primary:hover {
          background-color: #6b21a8 !important;
        }
        .fc-daygrid-day.fc-day-today {
            background-color: rgba(168, 85, 247, 0.1) !important;
        }
        .fc-toolbar-title, .fc-daygrid-day-number, .fc-col-header-cell-cushion {
            color: white;
        }
        .fc-event{
            cursor: pointer;
        }
        .fc .fc-border-none {
            border-color: transparent;
        }
        .calendar-container {
            --fc-border-color: rgba(255, 255, 255, 0.2);
            --fc-today-bg-color: rgba(168, 85, 247, 0.1);
        }
      `}</style>
    </motion.div>
  );
}