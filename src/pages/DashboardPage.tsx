import React, { useState, useMemo } from 'react';
import { Plus, Calendar, ArrowUp, ArrowDown, Filter, CheckCircle, Clock } from 'lucide-react';
import { format, isToday, isPast, isFuture } from 'date-fns';
import { AppHeader } from '../components/layout/AppHeader';
import { TaskItem } from '../components/tasks/TaskItem';
import { TaskForm } from '../components/tasks/TaskForm';
import { TaskStats } from '../components/tasks/TaskStats';
import { Button } from '../components/ui/Button';
import { useTasks } from '../contexts/TaskContext';
import { Task, PriorityLevel } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

export const DashboardPage: React.FC = () => {
  const { tasks, isLoading } = useTasks();
  const [showAddTask, setShowAddTask] = useState(false);
  const [filterPriority, setFilterPriority] = useState<PriorityLevel | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all');
  const [filterDate, setFilterDate] = useState<'all' | 'today' | 'upcoming' | 'overdue'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortBy, setSortBy] = useState<'deadline' | 'priority' | 'title'>('deadline');

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let result = [...tasks];
    
    // Apply filters
    if (filterPriority !== 'all') {
      result = result.filter(task => task.priority === filterPriority);
    }
    
    if (filterStatus !== 'all') {
      result = result.filter(task => 
        filterStatus === 'completed' ? task.completed : !task.completed
      );
    }
    
    if (filterDate !== 'all') {
      result = result.filter(task => {
        const deadline = new Date(task.deadline);
        
        switch(filterDate) {
          case 'today':
            return isToday(deadline);
          case 'upcoming':
            return isFuture(deadline) && !isToday(deadline);
          case 'overdue':
            return isPast(deadline) && !isToday(deadline) && !task.completed;
          default:
            return true;
        }
      });
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch(sortBy) {
        case 'deadline':
          comparison = new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
          break;
        case 'priority': 
          const priorityValues = { high: 3, medium: 2, low: 1 };
          comparison = priorityValues[b.priority] - priorityValues[a.priority];
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [tasks, filterPriority, filterStatus, filterDate, sortBy, sortOrder]);

  // Group tasks by date
  const today = useMemo(() => {
    return filteredTasks.filter(task => isToday(new Date(task.deadline)) && !task.completed);
  }, [filteredTasks]);
  
  const upcoming = useMemo(() => {
    return filteredTasks.filter(task => 
      isFuture(new Date(task.deadline)) && 
      !isToday(new Date(task.deadline)) && 
      !task.completed
    );
  }, [filteredTasks]);
  
  const overdue = useMemo(() => {
    return filteredTasks.filter(task => 
      isPast(new Date(task.deadline)) && 
      !isToday(new Date(task.deadline)) && 
      !task.completed
    );
  }, [filteredTasks]);
  
  const completed = useMemo(() => {
    return filteredTasks.filter(task => task.completed);
  }, [filteredTasks]);

  const handleAddTaskSuccess = () => {
    setShowAddTask(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <AppHeader />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading tasks...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {format(new Date(), 'EEEE, MMMM do, yyyy')}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            <Button
              onClick={() => setShowAddTask(!showAddTask)}
              className="shadow-sm"
            >
              {showAddTask ? 'Cancel' : 'Add Task'}
              {!showAddTask && <Plus className="ml-2 h-4 w-4" />}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="shadow-sm"
            >
              {sortOrder === 'asc' ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
              {sortBy === 'deadline' ? 'Date' : sortBy === 'priority' ? 'Priority' : 'Title'}
            </Button>
            
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => {}} // We'd add a dropdown menu here in a real app
                className="shadow-sm"
              >
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
            </div>
          </div>
        </div>
        
        <AnimatePresence>
          {showAddTask && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="card p-5">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Create New Task</h2>
                <TaskForm onSuccess={handleAddTaskSuccess} onCancel={() => setShowAddTask(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {overdue.length > 0 && (
              <div>
                <div className="flex items-center text-error-500 mb-3">
                  <Clock className="h-5 w-5 mr-2" />
                  <h2 className="text-lg font-medium">Overdue</h2>
                  <span className="ml-2 badge badge-error">{overdue.length}</span>
                </div>
                <div className="space-y-3">
                  <AnimatePresence>
                    {overdue.map(task => (
                      <TaskItem key={task.id} task={task} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
            
            {today.length > 0 && (
              <div>
                <div className="flex items-center text-primary-600 dark:text-primary-500 mb-3">
                  <Calendar className="h-5 w-5 mr-2" />
                  <h2 className="text-lg font-medium">Today</h2>
                  <span className="ml-2 badge badge-primary">{today.length}</span>
                </div>
                <div className="space-y-3">
                  <AnimatePresence>
                    {today.map(task => (
                      <TaskItem key={task.id} task={task} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
            
            {upcoming.length > 0 && (
              <div>
                <div className="flex items-center text-secondary-600 dark:text-secondary-500 mb-3">
                  <Calendar className="h-5 w-5 mr-2" />
                  <h2 className="text-lg font-medium">Upcoming</h2>
                  <span className="ml-2 badge badge-secondary">{upcoming.length}</span>
                </div>
                <div className="space-y-3">
                  <AnimatePresence>
                    {upcoming.map(task => (
                      <TaskItem key={task.id} task={task} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
            
            {completed.length > 0 && (
              <div>
                <div className="flex items-center text-success-500 mb-3">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <h2 className="text-lg font-medium">Completed</h2>
                  <span className="ml-2 badge badge-success">{completed.length}</span>
                </div>
                <div className="space-y-3">
                  <AnimatePresence>
                    {completed.slice(0, 3).map(task => (
                      <TaskItem key={task.id} task={task} />
                    ))}
                  </AnimatePresence>
                  
                  {completed.length > 3 && (
                    <button className="text-sm text-primary-600 dark:text-primary-500 hover:underline">
                      View all {completed.length} completed tasks
                    </button>
                  )}
                </div>
              </div>
            )}
            
            {filteredTasks.length === 0 && (
              <div className="card p-8 text-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tasks found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {tasks.length === 0 
                    ? "You don't have any tasks yet. Create your first task to get started!"
                    : "No tasks match your current filters. Try adjusting your filters or create a new task."}
                </p>
                <Button onClick={() => setShowAddTask(true)}>
                  Create Task <Plus className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <TaskStats tasks={tasks} />
            
            <div className="card p-5">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Filters</h2>
              <div className="space-y-2">
                <Button 
                  variant={filterDate === 'today' ? 'primary' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setFilterDate(filterDate === 'today' ? 'all' : 'today')}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Today's Tasks
                </Button>
                
                <Button 
                  variant={filterDate === 'upcoming' ? 'primary' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setFilterDate(filterDate === 'upcoming' ? 'all' : 'upcoming')}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Upcoming Tasks
                </Button>
                
                <Button 
                  variant={filterPriority === 'high' ? 'primary' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setFilterPriority(filterPriority === 'high' ? 'all' : 'high')}
                >
                  <span className="w-3 h-3 rounded-full bg-error-500 mr-2"></span>
                  High Priority
                </Button>
                
                <Button 
                  variant={filterStatus === 'completed' ? 'primary' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setFilterStatus(filterStatus === 'completed' ? 'all' : 'completed')}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Completed Tasks
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};