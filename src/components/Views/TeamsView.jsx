import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TeamCard } from '@/components/Views/TeamCard';
import { CreateTeamModal } from '@/components/Modals/CreateTeamModal';

export function TeamsView({ teams, createTeam }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div
        key="teams"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Teams</h1>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Team
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <TeamCard team={team} />
            </motion.div>
          ))}
        </div>
      </motion.div>
      <CreateTeamModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateTeam={createTeam}
      />
    </>
  );
}