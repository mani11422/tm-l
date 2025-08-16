import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

export function TeamCard({ team }) {
  const handleManageTeam = () => {
    toast({
      title: `⚙️ Manage ${team.name}`,
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const getRoleBadgeVariant = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'manager':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'member':
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.03 }}
      className="h-full"
    >
      <Card
        onClick={handleManageTeam}
        className="glass-card h-full flex flex-col justify-between cursor-pointer transition-all duration-300 hover:border-pink-400 hover:shadow-2xl hover:shadow-pink-500/10"
      >
        <CardHeader>
          <CardTitle className="text-lg font-bold text-white">{team.name}</CardTitle>
          <p className="text-sm text-gray-400">{team.description}</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center -space-x-2">
            {team.members.slice(0, 5).map((member, index) => (
              <Avatar key={index} className="w-10 h-10 border-2 border-slate-800">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} />
                <AvatarFallback>{member && member.name ? member.name.charAt(0) : '?'}</AvatarFallback>
              </Avatar>
            ))}
            {team.members.length > 5 && (
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white border-2 border-slate-800">
                +{team.members.length - 5}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          {team.members.map((member, index) => (
            <Badge key={index} className={`status-badge ${getRoleBadgeVariant(member.role)}`}>
              {member.role || 'Member'}
            </Badge>
          ))}
        </CardFooter>
      </Card>
    </motion.div>
  );
}