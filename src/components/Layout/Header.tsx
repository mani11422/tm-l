import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Plus, Menu, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import { useAuth } from '@/hooks/useAuth.tsx';
import { useTheme } from '@/hooks/useTheme.tsx';

interface HeaderProps {
    onToggleSidebar: () => void;
    onCreateTask: () => void;
    onShowNotifications: () => void;
}

export function Header({ onToggleSidebar, onCreateTask, onShowNotifications }: HeaderProps) {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="h-16 glass-card border-b border-white/20 px-6 flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="text-white hover:bg-white/10"
        >
          <Menu className="w-5 h-5" />
        </Button>
        
        <div className="hidden md:flex items-center gap-2">
          <h1 className="text-xl font-semibold text-white">Good morning, {user?.name}!</h1>
          <span className="text-gray-400">Let's get things done today.</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          onClick={onCreateTask}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-white hover:bg-white/10"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onShowNotifications}
          className="text-white hover:bg-white/10 relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </Button>

        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-purple-500 text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.role}</p>
          </div>
        </div>
      </div>
    </motion.header>
  );
}