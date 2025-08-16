import React from 'react';
import { motion } from 'framer-motion';
import { FolderOpen, Users, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export function ProjectProgress({ projects, getProjectProgress }) {
  return (
    <Card className="glass-card border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <FolderOpen className="w-5 h-5" />
          Project Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {projects.map((project, index) => {
          const progress = getProjectProgress(project.id);
          
          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-white">{project.name}</h4>
                <Badge className="status-badge status-progress">
                  {project.status}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-400">{project.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Due: {new Date(project.endDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>Team: {project.teamId}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}