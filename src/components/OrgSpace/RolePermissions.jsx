import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';

const permissionsConfig = {
  'Team Member': {
    tasks: ['view', 'update_status'],
    projects: ['view'],
    teams: ['view'],
    org: [],
  },
  'Team Lead': {
    tasks: ['create', 'view', 'update_status', 'assign'],
    projects: ['view', 'update'],
    teams: ['view', 'update'],
    org: [],
  },
  Manager: {
    tasks: ['create', 'view', 'update_status', 'assign', 'delete'],
    projects: ['create', 'view', 'update', 'delete'],
    teams: ['create', 'view', 'update', 'delete'],
    org: ['manage_users', 'manage_roles'],
  },
};

const allPermissions = {
    tasks: ['create', 'view', 'update_status', 'assign', 'delete'],
    projects: ['create', 'view', 'update', 'delete'],
    teams: ['create', 'view', 'update', 'delete'],
    org: ['manage_users', 'manage_roles'],
};

const PermissionIcon = ({ granted }) => {
  return granted ? (
    <CheckCircle2 className="w-5 h-5 text-green-400" />
  ) : (
    <XCircle className="w-5 h-5 text-red-500" />
  );
};

export function RolePermissions() {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-white">Permission Matrix</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-slate-800/50 text-xs text-gray-400 uppercase">
              <tr>
                <th scope="col" className="px-6 py-3 rounded-tl-lg">Feature</th>
                <th scope="col" className="px-6 py-3">Permission</th>
                <th scope="col" className="px-6 py-3 text-center">Team Member</th>
                <th scope="col" className="px-6 py-3 text-center">Team Lead</th>
                <th scope="col" className="px-6 py-3 text-center rounded-tr-lg">Manager</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(allPermissions).map(([feature, perms], featureIndex) => (
                <React.Fragment key={feature}>
                  {perms.map((perm, permIndex) => (
                    <tr key={`${feature}-${perm}`} className="border-b border-slate-800">
                      {permIndex === 0 && (
                        <td rowSpan={perms.length} className="px-6 py-4 font-medium text-white capitalize align-top border-r border-slate-800">
                          {feature}
                        </td>
                      )}
                      <td className="px-6 py-4 capitalize">{perm.replace('_', ' ')}</td>
                      <td className="px-6 py-4 text-center">
                        <PermissionIcon granted={permissionsConfig['Team Member'][feature]?.includes(perm)} />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <PermissionIcon granted={permissionsConfig['Team Lead'][feature]?.includes(perm)} />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <PermissionIcon granted={permissionsConfig['Manager'][feature]?.includes(perm)} />
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}