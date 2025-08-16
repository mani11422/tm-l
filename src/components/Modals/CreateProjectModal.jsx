import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

export function CreateProjectModal({ isOpen, onClose, onCreateProject }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !description || !deadline) {
      toast({
        title: "Validation Error",
        description: "Please fill out all fields.",
        variant: "destructive",
      });
      return;
    }
    onCreateProject({ name, description, deadline });
    toast({
      title: "🚀 Project Created!",
      description: `The project "${name}" has been successfully created.`,
    });
    onClose();
    setName('');
    setDescription('');
    setDeadline('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card text-white">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Fill in the details below to start a new project.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label htmlFor="project-name" className="text-white">Project Name</Label>
            <Input id="project-name" value={name} onChange={(e) => setName(e.target.value)} className="bg-slate-800 border-slate-700" />
          </div>
          <div>
            <Label htmlFor="project-description" className="text-white">Description</Label>
            <Textarea id="project-description" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-slate-800 border-slate-700" />
          </div>
          <div>
            <Label htmlFor="project-deadline" className="text-white">Deadline</Label>
            <Input id="project-deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="bg-slate-800 border-slate-700" />
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="text-white border-white/20 hover:bg-white/10">Cancel</Button>
          <Button onClick={handleSubmit} className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">Create Project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}