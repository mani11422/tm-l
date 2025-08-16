
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/hooks/useAuth.jsx';
import { ThemeProvider } from '@/hooks/useTheme.jsx';
import { TasksProvider, useTasks } from '@/hooks/useTasks.jsx';
import { OrgProvider } from '@/hooks/useOrg.jsx';
import { TimeSheetsProvider } from '@/hooks/useTimeSheets.jsx';
// ...existing code...
import { LoginForm } from '@/components/Auth/LoginForm.jsx';
import { EmployerSignupModal } from '@/components/Auth/EmployerSignupModal.jsx';
import { Sidebar } from '@/components/Layout/Sidebar.jsx';
import { Header } from '@/components/Layout/Header.jsx';
import { StatsCards } from '@/components/Dashboard/StatsCards.jsx';
import { RecentTasks } from '@/components/Dashboard/RecentTasks.jsx';
import { ProjectProgress } from '@/components/Dashboard/ProjectProgress.jsx';
import { TaskBoard } from '@/components/Tasks/TaskBoard.jsx';
import { CreateTaskModal } from '@/components/Tasks/CreateTaskModal.jsx';
import { ProjectsView } from '@/components/Views/ProjectsView.jsx';
import { TeamsView } from '@/components/Views/TeamsView.jsx';
import { SettingsView } from '@/components/Views/SettingsView.jsx';
import { AnalyticsView } from '@/components/Views/AnalyticsView.jsx';
import { CalendarView } from '@/components/Views/CalendarView.jsx';
import { NotificationsView } from '@/components/Views/NotificationsView.jsx';
// ...existing code...
import { OrgSpaceView } from '@/components/Views/OrgSpaceView.jsx';
import { TimeSheetsView } from '@/components/Views/TimeSheetsView.jsx';
// ...existing code...
import { AiChatbot } from '@/components/Layout/AiChatbot.jsx';

function Dashboard() {
  const { user } = useAuth();
  const {
    tasks,
    projects,
    teams,
    createTask,
    getProjectProgress,
    createProject,
    createTeam,
  } = useTasks();

  const [activeView, setActiveView] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);

  const handleCreateTask = (taskData) => {
    createTask(taskData);
    setIsCreateTaskModalOpen(false);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-gray-400">
                You are logged in as an <span className="font-bold text-purple-400">{user?.role}</span>.
              </p>
            </div>
            
            <StatsCards tasks={tasks} projects={projects} teams={teams} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentTasks tasks={tasks} />
              <ProjectProgress projects={projects} getProjectProgress={getProjectProgress} />
            </div>
          </motion.div>
        );
      
      case 'projects':
        return <ProjectsView projects={projects} getProjectProgress={getProjectProgress} createProject={createProject} />;
        
      case 'tasks':
        return (
          <motion.div
            key="tasks"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="h-full"
          >
            <TaskBoard
              onCreateTask={() => setIsCreateTaskModalOpen(true)}
            />
          </motion.div>
        );
      
      case 'teams':
        return <TeamsView teams={teams} createTeam={createTeam} />;
  // ...existing code...
      case 'timesheets':
        return <TimeSheetsView />;
      case 'calendar':
        return <CalendarView tasks={tasks} />;
      case 'analytics':
        return <AnalyticsView />;
      case 'orgspace':
        return <OrgSpaceView />;
  // ...existing code...
      case 'settings':
        return <SettingsView />;
      
      default:
         return <div />;
    }
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-foreground">
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onCreateTask={() => setIsCreateTaskModalOpen(true)}
          onShowNotifications={() => setActiveView('notifications')}
        />
        
        <main className="flex-1 p-6 overflow-auto relative">
          <AnimatePresence mode="wait">
            {activeView === 'notifications' ? <NotificationsView /> : renderContent()}
          </AnimatePresence>
          <AiChatbot />
        </main>
      </div>

      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        onCreateTask={handleCreateTask}
        projects={projects}
      />
    </div>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [showSignup, setShowSignup] = useState(false);

  if (!isAuthenticated) {
    return (
      <>
        <LoginForm />
        <div className="flex justify-center mt-4">
          <button
            className="px-6 py-2 rounded bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold shadow-lg hover:from-purple-600 hover:to-blue-600 transition"
            onClick={() => setShowSignup(true)}
          >
            Sign Up as Employer (Admin)
          </button>
        </div>
        <EmployerSignupModal open={showSignup} onClose={() => setShowSignup(false)} />
      </>
    );
  }

  return (
    <TasksProvider>
      <OrgProvider>
        <TimeSheetsProvider>
          <Dashboard />
        </TimeSheetsProvider>
      </OrgProvider>
    </TasksProvider>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <Helmet>
          <title>TaskMaster - Enterprise Task Management System</title>
          <meta name="description" content="Feature-rich, modern task management system designed for teams and organizations. Manage tasks, projects, and collaborate effectively." />
        </Helmet>
        <AppContent />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
