import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export function ProjectCard({ project, progress }) {
  const getStatusStyles = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'In Progress':
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  const members = project?.members || [];

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.03 }}
      className="h-full"
    >
      <Card className="glass-card h-full flex flex-col justify-between transition-all duration-300 hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-500/10">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-bold text-white">{project.name}</CardTitle>
            <Badge className={`status-badge ${getStatusStyles(project.status)}`}>{project.status}</Badge>
          </div>
          <p className="text-sm text-gray-400 pt-2">{project.description}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-300">Progress</span>
              <span className="text-xs font-bold text-white">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-blue-500" />
          </div>
          <div className="flex items-center text-sm text-gray-400">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div className="flex items-center -space-x-2">
            {members.map((member, index) => (
              <Avatar key={index} className="w-8 h-8 border-2 border-slate-800">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member}`} />
                <AvatarFallback>{member.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <div className="flex items-center text-sm text-gray-300">
            <Users className="w-4 h-4 mr-1" />
            <span>{members.length} Members</span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}