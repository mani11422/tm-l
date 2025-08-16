import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useTimeSheets } from '@/hooks/useTimeSheets.jsx';
import { useTasks } from '@/hooks/useTasks.jsx';
import { useAuth } from '@/hooks/useAuth.jsx';
import { toast } from '@/components/ui/use-toast';

export function WeeklySummary() {
  const { user } = useAuth();
  const { timeEntries } = useTimeSheets();
  const { projects } = useTasks();

  const summaryData = useMemo(() => {
    const summary = timeEntries.reduce((acc, entry) => {
      const project = projects.find(p => p.id === entry.projectId);
      if (!project) return acc;

      if (!acc[project.id]) {
        acc[project.id] = { name: project.name, totalHours: 0 };
      }

      const [hours, minutes] = entry.timeSpent.split(':').map(Number);
      acc[project.id].totalHours += hours + minutes / 60;

      return acc;
    }, {});

    return Object.values(summary);
  }, [timeEntries, projects]);

  const handleExport = (format) => {
    toast({
      title: `Exporting as ${format}`,
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <Card className="glass-card">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-white">Weekly Hours Summary</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport('CSV')}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport('PDF')}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {summaryData.map(item => (
            <div key={item.name} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
              <p className="font-semibold text-white">{item.name}</p>
              <p className="text-lg font-bold text-cyan-400">{item.totalHours.toFixed(2)} hours</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}