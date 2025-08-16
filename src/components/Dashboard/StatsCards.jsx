import React from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Clock, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function StatsCards({ tasks, projects, teams }) {
  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const pendingTasks = tasks.filter(task => task.status !== 'done').length;
  const totalTimeSpent = tasks.reduce((acc, task) => acc + (task.timeSpent || 0), 0);
  const activeProjects = projects.filter(project => project.status === 'active').length;

  const stats = [
    {
      title: 'Completed Tasks',
      value: completedTasks,
      icon: CheckSquare,
      color: 'from-green-500 to-emerald-500',
      change: '+12%',
    },
    {
      title: 'Pending Tasks',
      value: pendingTasks,
      icon: Clock,
      color: 'from-orange-500 to-yellow-500',
      change: '-5%',
    },
    {
      title: 'Active Projects',
      value: activeProjects,
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500',
      change: '+8%',
    },
    {
      title: 'Team Members',
      value: teams.reduce((acc, team) => acc + team.members.length, 0),
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      change: '+3%',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="glass-card border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-green-400 mt-1">{stat.change} from last week</p>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}