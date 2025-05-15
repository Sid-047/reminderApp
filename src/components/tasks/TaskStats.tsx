import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Task } from '../../types';

interface TaskStatsProps {
  tasks: Task[];
}

export const TaskStats: React.FC<TaskStatsProps> = ({ tasks }) => {
  // Calculate statistics
  const stats = useMemo(() => {
    const completed = tasks.filter(task => task.completed).length;
    const pending = tasks.length - completed;
    const completionRate = tasks.length > 0 ? (completed / tasks.length) * 100 : 0;
    
    const byPriority = {
      high: tasks.filter(task => task.priority === 'high').length,
      medium: tasks.filter(task => task.priority === 'medium').length,
      low: tasks.filter(task => task.priority === 'low').length,
    };
    
    return {
      total: tasks.length,
      completed,
      pending,
      completionRate: completionRate.toFixed(0),
      byPriority,
    };
  }, [tasks]);

  // Data for pie chart
  const pieData = [
    { name: 'Completed', value: stats.completed, color: '#10B981' },
    { name: 'Pending', value: stats.pending, color: '#F59E0B' },
  ];

  // Data for priority pie chart
  const priorityData = [
    { name: 'High', value: stats.byPriority.high, color: '#EF4444' },
    { name: 'Medium', value: stats.byPriority.medium, color: '#F59E0B' },
    { name: 'Low', value: stats.byPriority.low, color: '#10B981' },
  ];

  return (
    <div className="card p-5">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-5">Task Statistics</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Tasks</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.total}</p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
          <p className="text-2xl font-semibold text-success-500">{stats.completed}</p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
          <p className="text-2xl font-semibold text-warning-500">{stats.pending}</p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Completion Rate</p>
          <p className="text-2xl font-semibold text-primary-600 dark:text-primary-500">{stats.completionRate}%</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-60">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Task Status</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} tasks`, 'Count']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="h-60">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Task Priority</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} tasks`, 'Count']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};