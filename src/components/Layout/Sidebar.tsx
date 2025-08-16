import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, FolderKanban, ListTodo, Users, Calendar, BarChart3, Settings, ChevronsLeft, ChevronsRight, LogOut, Building, Clock, Briefcase, CircleDotDashed as LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { useAuth } from '@/hooks/useAuth.tsx';

interface NavItemType {
    icon: LucideIcon;
    label: string;
    view: string;
}

const navItems: NavItemType[] = [
  { icon: LayoutDashboard, label: 'Dashboard', view: 'dashboard' },
  { icon: FolderKanban, label: 'Projects', view: 'projects' },
  { icon: ListTodo, label: 'Tasks', view: 'tasks' },
  { icon: Clock, label: 'Time Sheets', view: 'timesheets' },
  { icon: Users, label: 'Teams', view: 'teams' },
  // ...existing code...
  { icon: Calendar, label: 'Calendar', view: 'calendar' },
  { icon: BarChart3, label: 'Analytics', view: 'analytics' },
  { icon: Building, label: 'OrgSpace', view: 'orgspace' },
  // ...existing code...
  { icon: Settings, label: 'Settings', view: 'settings' },
];

interface NavItemProps {
    item: NavItemType;
    activeView: string;
    onViewChange: (view: string) => void;
    isCollapsed: boolean;
}

const NavItem = ({ item, activeView, onViewChange, isCollapsed }: NavItemProps) => (
  <Button
    variant={activeView === item.view ? 'secondary' : 'ghost'}
    className="w-full justify-start"
    onClick={() => onViewChange(item.view)}
  >
    <item.icon className={`w-5 h-5 ${!isCollapsed ? 'mr-3' : ''}`} />
    {!isCollapsed && <span>{item.label}</span>}
  </Button>
);

interface SidebarProps {
    activeView: string;
    onViewChange: (view: string) => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

export function Sidebar({ activeView, onViewChange, isCollapsed, onToggleCollapse }: SidebarProps) {
  const { logout } = useAuth();

  return (
    <motion.div
      animate={{ width: isCollapsed ? '5rem' : '16rem' }}
      className="relative h-screen bg-slate-900/50 border-r border-white/10 flex flex-col p-4"
    >
      <div className="flex items-center justify-between mb-8">
        {!isCollapsed && (
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-bold text-white"
          >
            TaskMaster
          </motion.h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="text-white hover:bg-white/10"
        >
          {isCollapsed ? <ChevronsRight /> : <ChevronsLeft />}
        </Button>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map(item => (
          <NavItem key={item.view} item={item} activeView={activeView} onViewChange={onViewChange} isCollapsed={isCollapsed} />
        ))}
      </nav>

      <div className="mt-auto">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={logout}
        >
          <LogOut className={`w-5 h-5 ${!isCollapsed ? 'mr-3' : ''}`} />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </motion.div>
  );
}