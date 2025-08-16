import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, FolderKanban } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { ProjectCard } from '@/components/Views/ProjectCard.tsx';
import { CreateProjectModal } from '@/components/Modals/CreateProjectModal.tsx';
import { Project } from '@/types';

interface ProjectsViewProps {
  projects: Project[];
  getProjectProgress: (projectId: string) => number;
  createProject: (projectData: Omit<Project, 'id' | 'status' | 'members'> & { deadline: string }) => void;
}

export function ProjectsView({ projects, getProjectProgress, createProject }: ProjectsViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div
        key="projects"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <FolderKanban className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Projects</h1>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Project
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProjectCard project={project} progress={getProjectProgress(project.id)} />
            </motion.div>
          ))}
        </div>
      </motion.div>
      <CreateProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateProject={createProject}
      />
    </>
  );
}