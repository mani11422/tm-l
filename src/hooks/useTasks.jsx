import React, { useState, createContext, useContext } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';

const TasksContext = createContext();

const initialData = {
  tasks: [
    { id: 'task-1', title: 'Design new dashboard layout', status: 'todo', priority: 'high', dueDate: '2025-08-15', projectId: 'proj-1', assignee: 'Admin User' },
    { id: 'task-2', title: 'Develop API for user authentication', status: 'in-progress', priority: 'high', dueDate: '2025-08-20', projectId: 'proj-1', assignee: 'Manager Mike' },
    { id: 'task-3', title: 'Fix bug in payment gateway', status: 'in-progress', priority: 'medium', dueDate: '2025-08-10', projectId: 'proj-2', assignee: 'Member Mary' },
    { id: 'task-4', title: 'Write documentation for API', status: 'done', priority: 'low', dueDate: '2025-08-05', projectId: 'proj-1', assignee: 'Admin User' },
    { id: 'task-5', title: 'Create marketing materials for launch', status: 'todo', priority: 'medium', dueDate: '2025-09-01', projectId: 'proj-3', assignee: 'Guest George' },
    { id: 'task-6', title: 'Deploy staging server', status: 'review', priority: 'high', dueDate: '2025-08-18', projectId: 'proj-2', assignee: 'Manager Mike' },
    { id: 'task-7', title: 'User testing for new feature', status: 'blocked', priority: 'medium', dueDate: '2025-08-22', projectId: 'proj-1', assignee: 'Member Mary' },
  ],
  projects: [
    { id: 'proj-1', name: 'Project Phoenix', description: 'A complete overhaul of the main application.', status: 'In Progress', deadline: '2025-09-30', members: ['Admin User', 'Manager Mike', 'Member Mary'] },
    { id: 'proj-2', name: 'Project Titan', description: 'Infrastructure migration to new cloud services.', status: 'In Progress', deadline: '2025-08-25', members: ['Manager Mike', 'Member Mary'] },
    { id: 'proj-3', name: 'Project Nova', description: 'Marketing and launch campaign for Q4.', status: 'Completed', deadline: '2025-07-30', members: ['Admin User', 'Guest George'] },
  ],
  teams: [
    { id: 'team-1', name: 'Frontend Wizards', description: 'Responsible for all UI/UX development.', members: [{ name: 'Admin User', role: 'Admin' }, { name: 'Member Mary', role: 'Member' }] },
    { id: 'team-2', name: 'Backend Guardians', description: 'Manages server-side logic and databases.', members: [{ name: 'Manager Mike', role: 'Manager' }, { name: 'Member Mary', role: 'Member' }] },
    { id: 'team-3', name: 'Marketing Mavericks', description: 'Drives user acquisition and branding.', members: [{ name: 'Guest George', role: 'Member' }] },
  ],
};

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
}

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useLocalStorage('taskman_tasks', initialData.tasks);
  const [projects, setProjects] = useLocalStorage('taskman_projects', initialData.projects);
  const [teams, setTeams] = useLocalStorage('taskman_teams', initialData.teams);

  const createTask = (taskData) => {
    const newTask = { ...taskData, id: uuidv4() };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (taskId, newStatus) => {
    setTasks(prev => prev.map(task => task.id === taskId ? { ...task, status: newStatus } : task));
  };

  const getProjectProgress = (projectId) => {
    const projectTasks = tasks.filter(task => task.projectId === projectId);
    if (projectTasks.length === 0) return 0;
    const completedTasks = projectTasks.filter(task => task.status === 'done').length;
    return (completedTasks / projectTasks.length) * 100;
  };

  const createProject = (projectData) => {
    const newProject = { ...projectData, id: uuidv4(), status: 'In Progress', members: ['Admin User'] };
    setProjects(prev => [...prev, newProject]);
  };

  const createTeam = (teamData) => {
    const newTeam = { ...teamData, id: uuidv4(), members: [{ name: 'Admin User', role: 'Admin' }] };
    setTeams(prev => [...prev, newTeam]);
  };

  const value = {
    tasks,
    setTasks,
    projects,
    teams,
    createTask,
    updateTask,
    getProjectProgress,
    createProject,
    createTeam,
  };

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  );
}