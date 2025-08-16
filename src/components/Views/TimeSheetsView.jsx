import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, BarChart2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DailyLog } from '@/components/TimeSheets/DailyLog';
import { WeeklySummary } from '@/components/TimeSheets/WeeklySummary';

export function TimeSheetsView() {
  return (
    <motion.div
      key="timesheets"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
          <Clock className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white">Time Sheets</h1>
      </div>

      <Tabs defaultValue="daily-log" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
          <TabsTrigger value="daily-log">
            <Calendar className="w-4 h-4 mr-2" />
            Daily Log
          </TabsTrigger>
          <TabsTrigger value="weekly-summary">
            <BarChart2 className="w-4 h-4 mr-2" />
            Weekly Summary
          </TabsTrigger>
        </TabsList>
        <TabsContent value="daily-log" className="mt-6">
          <DailyLog />
        </TabsContent>
        <TabsContent value="weekly-summary" className="mt-6">
          <WeeklySummary />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}