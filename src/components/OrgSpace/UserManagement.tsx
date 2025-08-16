import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Plus, Trash2, Search, Mail } from 'lucide-react';
import { useOrg } from '@/hooks/useOrg.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Avatar, AvatarFallback } from '@/components/ui/avatar.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { toast } from '@/components/ui/use-toast.ts';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog.tsx';
import { Label } from '@/components/ui/label.tsx';
import { UserRole } from '@/types';

type FormValues = {
    name: string;
    email: string;
    role: UserRole;
};

const roleColors: Record<UserRole, string> = {
  Manager: 'bg-green-500/20 text-green-300 border-green-500/30',
  'Team Lead': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Team Member': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  Admin: 'bg-red-500/20 text-red-300 border-red-500/30',
  Guest: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
};

export function UserManagement() {
  const { users, addUser, removeUser, updateUserRole, resendInvitation } = useOrg();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      role: 'Team Member'
    }
  });

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onAddUserSubmit: SubmitHandler<FormValues> = (data) => {
    addUser(data);
    toast({
      title: '✅ User Invited',
      description: `${data.name} has been invited to the organization.`,
    });
    reset();
    setIsAddUserOpen(false);
  };

  const handleRemoveUser = (userId: string, userName: string) => {
    removeUser(userId);
    toast({
      title: '🗑️ User Removed',
      description: `${userName} has been removed from the organization.`,
      variant: 'destructive',
    });
  };
  
  const handleResend = (userId: string, userName: string) => {
    resendInvitation(userId);
    toast({
      title: '✉️ Invitation Resent',
      description: `Invitation email has been resent to ${userName}.`,
    });
  };

  return (
    <Card className="glass-card">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-white">Organization Members</CardTitle>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Filter users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-slate-800/50 border-slate-700"
            />
          </div>
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="text-white">
              <DialogHeader>
                <DialogTitle>Invite New User</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onAddUserSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" {...register('name', { required: 'Name is required' })} className="bg-slate-900 border-slate-700" />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })} className="bg-slate-900 border-slate-700" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select onValueChange={(value: UserRole) => setValue('role', value)} defaultValue="Team Member">
                    <SelectTrigger id="role" className="bg-slate-900 border-slate-700">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Team Lead">Team Lead</SelectItem>
                      <SelectItem value="Team Member">Team Member</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Send Invitation</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredUsers.map(user => (
            <motion.div
              key={user.id}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback className="bg-purple-500 text-white">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-white">{user.name}</p>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
                {user.status === 'Pending' && <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">Pending</Badge>}
              </div>
              <div className="flex items-center gap-4">
                <Select value={user.role} onValueChange={(newRole: UserRole) => updateUserRole(user.id, newRole)}>
                  <SelectTrigger className="w-[150px] bg-slate-900/70 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Team Lead">Team Lead</SelectItem>
                    <SelectItem value="Team Member">Team Member</SelectItem>
                  </SelectContent>
                </Select>
                <Badge className={`status-badge ${roleColors[user.role]}`}>{user.role}</Badge>
                {user.status === 'Pending' && (
                  <Button variant="ghost" size="icon" onClick={() => handleResend(user.id, user.name)}>
                    <Mail className="w-4 h-4 text-blue-400" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => handleRemoveUser(user.id, user.name)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}