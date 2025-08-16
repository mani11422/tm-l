import React, { useState } from 'react';
    import { motion } from 'framer-motion';
    import { X, Calendar, Clock, User, Tag } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Textarea } from '@/components/ui/textarea';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    
    export function CreateTaskModal({ isOpen, onClose, onCreateTask, projects }) {
      const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        assignee: '',
        projectId: '',
        dueDate: '',
        timeEstimate: '',
        tags: '',
      });
    
      const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title.trim()) return;
    
        const taskData = {
          ...formData,
          timeEstimate: formData.timeEstimate ? parseInt(formData.timeEstimate) : 0,
          tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        };
    
        onCreateTask(taskData);
        setFormData({
          title: '',
          description: '',
          priority: 'medium',
          status: 'todo',
          assignee: '',
          projectId: '',
          dueDate: '',
          timeEstimate: '',
          tags: '',
        });
        onClose();
      };
    
      const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
      };
    
      if (!isOpen) return null;
    
      return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-2xl"
          >
            <Card className="glass-card border-white/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Create New Task</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </Button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Task Title</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      placeholder="Enter task title..."
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                      required
                    />
                  </div>
    
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      placeholder="Describe the task..."
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                      rows={3}
                    />
                  </div>
    
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Priority</label>
                      <Select value={formData.priority} onValueChange={(value) => handleChange('priority', value)}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Status</label>
                      <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todo">To Do</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="review">Review</SelectItem>
                          <SelectItem value="done">Done</SelectItem>
                          <SelectItem value="blocked">Blocked</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
    
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Assignee
                      </label>
                      <Input
                        value={formData.assignee}
                        onChange={(e) => handleChange('assignee', e.target.value)}
                        placeholder="user@example.com"
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                      />
                    </div>
    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Project</label>
                      <Select value={formData.projectId} onValueChange={(value) => handleChange('projectId', value)}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
    
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Due Date
                      </label>
                      <Input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => handleChange('dueDate', e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Time Estimate (hours)
                      </label>
                      <Input
                        type="number"
                        value={formData.timeEstimate}
                        onChange={(e) => handleChange('timeEstimate', e.target.value)}
                        placeholder="8"
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                      />
                    </div>
                  </div>
    
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Tags (comma separated)
                    </label>
                    <Input
                      value={formData.tags}
                      onChange={(e) => handleChange('tags', e.target.value)}
                      placeholder="frontend, urgent, bug"
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    />
                  </div>
    
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    >
                      Create Task
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      );
    }