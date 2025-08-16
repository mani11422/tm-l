import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

export function CreateTeamModal({ isOpen, onClose, onCreateTeam }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !description) {
      toast({
        title: "Validation Error",
        description: "Please fill out all fields.",
        variant: "destructive",
      });
      return;
    }
    onCreateTeam({ name, description });
    toast({
      title: "🚀 Team Created!",
      description: `The team "${name}" has been successfully created.`,
    });
    onClose();
    setName('');
    setDescription('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card text-white">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
          <DialogDescription>
            Fill in the details below to assemble your new team.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label htmlFor="team-name" className="text-white">Team Name</Label>
            <Input id="team-name" value={name} onChange={(e) => setName(e.target.value)} className="bg-slate-800 border-slate-700" />
          </div>
          <div>
            <Label htmlFor="team-description" className="text-white">Description</Label>
            <Textarea id="team-description" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-slate-800 border-slate-700" />
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="text-white border-white/20 hover:bg-white/10">Cancel</Button>
          <Button onClick={handleSubmit} className="bg-gradient-to-r from-pink-500 to-orange-500 text-white">Create Team</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}