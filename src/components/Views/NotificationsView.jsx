import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, MessageSquare, AlertTriangle, CheckCheck, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow } from 'date-fns';
import { toast } from '@/components/ui/use-toast';

const mockNotifications = [
  { id: 1, type: 'mention', user: 'Alex Smith', content: 'mentioned you in a comment on "Develop new landing page"', time: new Date(Date.now() - 1000 * 60 * 5), read: false },
  { id: 2, type: 'update', user: 'Jane Doe', content: 'updated the status of "Q3 Marketing Campaign" to "In Review"', time: new Date(Date.now() - 1000 * 60 * 30), read: false },
  { id: 3, type: 'alert', content: 'Deadline for "Finalize Budget" is approaching tomorrow.', time: new Date(Date.now() - 1000 * 60 * 60 * 2), read: true },
  { id: 4, type: 'mention', user: 'Sam Wilson', content: 'assigned you to the task "Fix authentication bug"', time: new Date(Date.now() - 1000 * 60 * 60 * 5), read: false },
  { id: 5, type: 'update', user: 'Admin', content: 'A new member has joined the "Mobile App" project.', time: new Date(Date.now() - 1000 * 60 * 60 * 24), read: true },
  { id: 6, type: 'alert', content: 'Your API key is about to expire. Please renew it.', time: new Date(Date.now() - 1000 * 60 * 60 * 48), read: true },
];

const NotificationIcon = ({ type }) => {
  switch (type) {
    case 'mention':
      return <MessageSquare className="w-5 h-5 text-blue-400" />;
    case 'update':
      return <Bell className="w-5 h-5 text-purple-400" />;
    case 'alert':
      return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
    default:
      return <Bell className="w-5 h-5 text-gray-400" />;
  }
};

export function NotificationsView() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast({ title: 'All notifications marked as read.' });
  };
  
  const clearAll = () => {
    setNotifications([]);
    toast({ title: 'All notifications cleared.', variant: 'destructive' });
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const getFilteredNotifications = (filter) => {
    if (filter === 'all') return notifications;
    return notifications.filter(n => n.type === filter);
  }

  return (
    <motion.div
      key="notifications"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Notifications</h1>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" onClick={markAllAsRead} className="text-white border-white/20 hover:bg-white/10 hover:text-white">
                <CheckCheck className="w-4 h-4 mr-2"/>
                Mark all as read
            </Button>
            <Button variant="destructive" onClick={clearAll}>
                <Trash2 className="w-4 h-4 mr-2"/>
                Clear all
            </Button>
        </div>
      </div>

      <Card className="glass-card p-0">
        <CardContent className="p-0">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="p-2 bg-slate-900/50 m-2">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="mention">Mentions</TabsTrigger>
              <TabsTrigger value="alert">Alerts</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="p-4 space-y-4">
              {getFilteredNotifications('all').map(n => (
                 <NotificationItem key={n.id} notification={n} onRead={() => markAsRead(n.id)} />
              ))}
            </TabsContent>
            <TabsContent value="mention" className="p-4 space-y-4">
              {getFilteredNotifications('mention').map(n => (
                 <NotificationItem key={n.id} notification={n} onRead={() => markAsRead(n.id)} />
              ))}
            </TabsContent>
            <TabsContent value="alert" className="p-4 space-y-4">
              {getFilteredNotifications('alert').map(n => (
                 <NotificationItem key={n.id} notification={n} onRead={() => markAsRead(n.id)} />
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}

const NotificationItem = ({ notification, onRead }) => (
    <div 
        className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${notification.read ? 'bg-transparent' : 'bg-purple-500/10'} hover:bg-white/10`}
        onClick={onRead}
    >
        <div className="flex-shrink-0">
            <NotificationIcon type={notification.type} />
        </div>
        <div className="flex-grow">
            <p className="text-white">
                {notification.user && <span className="font-bold">{notification.user} </span>}
                {notification.content}
            </p>
            <span className="text-sm text-gray-400">{formatDistanceToNow(notification.time, { addSuffix: true })}</span>
        </div>
        {!notification.read && <div className="w-2 h-2 bg-blue-400 rounded-full self-center"></div>}
    </div>
);