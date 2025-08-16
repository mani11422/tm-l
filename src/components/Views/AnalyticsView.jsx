import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Clock, Users, Zap, FileDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from 'chart.js';
import { toast } from '@/components/ui/use-toast';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement);

const barData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Tasks Completed',
      data: [65, 59, 80, 81, 56, 55],
      backgroundColor: 'rgba(168, 85, 247, 0.6)',
      borderColor: 'rgba(168, 85, 247, 1)',
      borderWidth: 1,
    },
  ],
};

const lineData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [
    {
      label: 'User Activity',
      data: [33, 53, 85, 41],
      fill: false,
      borderColor: 'rgba(59, 130, 246, 1)',
      tension: 0.1,
    },
  ],
};

const doughnutData = {
  labels: ['In Progress', 'Completed', 'To Do'],
  datasets: [
    {
      data: [300, 150, 100],
      backgroundColor: ['rgba(59, 130, 246, 0.6)', 'rgba(34, 197, 94, 0.6)', 'rgba(107, 114, 128, 0.6)'],
      borderColor: ['rgba(59, 130, 246, 1)', 'rgba(34, 197, 94, 1)', 'rgba(107, 114, 128, 1)'],
      borderWidth: 1,
    },
  ],
};

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: { color: '#fff' }
        }
    },
    scales: {
        y: {
            ticks: { color: '#9ca3af' },
            grid: { color: 'rgba(255,255,255,0.1)' }
        },
        x: {
            ticks: { color: '#9ca3af' },
            grid: { color: 'rgba(255,255,255,0.1)' }
        }
    }
};

const doughnutOptions = { ...chartOptions, scales: {} };


export function AnalyticsView() {
  const [timeRange, setTimeRange] = useState('30d');
  
  const handleExport = () => {
    toast({
      title: "📤 Export Data",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  }

  return (
    <motion.div
      key="analytics"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-red-500 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
        </div>
        <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700">
                    <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
            </Select>
            <Button onClick={handleExport} variant="outline" className="text-white border-white/20 hover:bg-white/10 hover:text-white">
                <FileDown className="w-4 h-4 mr-2" />
                Export
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <InfoCard title="Time Tracked" value="1,204h" icon={Clock} />
          <InfoCard title="Active Users" value="89" icon={Users} />
          <InfoCard title="Productivity" value="92%" icon={Zap} change="+5%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Task Completion Rate">
          <Bar options={chartOptions} data={barData} />
        </ChartCard>
        <ChartCard title="User Activity">
          <Line options={chartOptions} data={lineData} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChartCard title="Project Status" className="lg:col-span-1">
              <Doughnut options={doughnutOptions} data={doughnutData} />
          </ChartCard>
          <Card className="glass-card lg:col-span-2">
            <CardHeader>
                <CardTitle className="text-white">Insights Summary</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-3">
                <p>🚀 <span className="font-semibold text-white">Top Performer:</span> The 'Frontend Team' completed 25% more tasks this month.</p>
                <p>📈 <span className="font-semibold text-white">Trending Up:</span> User engagement has increased by 15% over the last 30 days.</p>
                <p>⚠️ <span className="font-semibold text-white">Bottleneck Alert:</span> 'QA Testing' phase is taking 20% longer than average. Consider reallocating resources.</p>
            </CardContent>
          </Card>
      </div>
    </motion.div>
  );
}

const InfoCard = ({ title, value, icon: Icon, change }) => (
    <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
            <Icon className="w-4 h-4 text-gray-400" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold text-white">{value}</div>
            {change && <p className="text-xs text-green-400">{change} from last month</p>}
        </CardContent>
    </Card>
)

const ChartCard = ({ title, children, className }) => (
    <Card className={`glass-card ${className}`}>
        <CardHeader>
            <CardTitle className="text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
            {children}
        </CardContent>
    </Card>
)