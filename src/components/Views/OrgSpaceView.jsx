import React from 'react';
import { motion } from 'framer-motion';
import { Building, Users, ShieldCheck } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserManagement } from '@/components/OrgSpace/UserManagement';
import { RolePermissions } from '@/components/OrgSpace/RolePermissions';

export function OrgSpaceView() {
  return (
    <motion.div
      key="orgspace"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
          <Building className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white">OrgSpace</h1>
      </div>

      <Tabs defaultValue="user-management" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
          <TabsTrigger value="user-management">
            <Users className="w-4 h-4 mr-2" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="role-permissions">
            <ShieldCheck className="w-4 h-4 mr-2" />
            Role Permissions
          </TabsTrigger>
        </TabsList>
        <TabsContent value="user-management" className="mt-6">
          <UserManagement />
        </TabsContent>
        <TabsContent value="role-permissions" className="mt-6">
          <RolePermissions />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}