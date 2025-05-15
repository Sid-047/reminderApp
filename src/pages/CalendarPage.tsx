import React, { useState, useMemo } from 'react';
import Calendar from 'react-calendar';
import { format, isSameDay, parseISO } from 'date-fns';
import { AppHeader } from '../components/layout/AppHeader';
import { TaskItem } from '../components/tasks/TaskItem';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useTasks } from '../contexts/TaskContext';
import { Task } from '../types';
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import 'react-calendar/dist/Calendar.css';

export const CalendarPage: React.FC = () => {
  const { tasks, isLoading } = useTasks();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const navigate = useNavigate();

  // Custom styling for the calendar in dark mode
  const calendarClass = useMemo(() => `
    .react-calendar {
      width: 100%;
      max-width: 100%;
      background-color: transparent;
      border: none;
      font-family: inherit;
    }
    .react-calendar__tile {
      padding: 1em 0.5em;
      position: relative;
    }
    .react-calendar__tile--active {
      background: rgba(79, 70, 229, 0.2);
      color: black;
    }
    .dark .react-calendar__tile--active {
      color: white;
    }
    .react-calendar__tile--now {
      background: rgba(79, 70, 229, 0.1);
    }
    .react-calendar__month-view__days__day {
      color: #374151;
    }
    .dark .react-calendar__month-view__days__day {
      color: #D1D5DB;
    }
    .react-calendar__month-view__weekdays__weekday {
      text-transform: uppercase;
      text-decoration: none;
      font-weight: bold;
      font-size: 0.8em;
      color: #6B7280;
    }
    .dark .react-calendar__month-view__weekdays__weekday {
      color: #9CA3AF;
    }
    .react-calendar__tile--hasTask::after {
      content: '';
      position: absolute;
      bottom: 5px;
      left: 50%;
      transform: translateX(-50%);
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #4F46E5;
    }
    .react-calendar__tile--hasHighPriorityTask::after {
      background-color: #EF4444;
    }
  `, []);

  // Tasks for the selected date
  const tasksForSelectedDate = useMemo(() => {
    return tasks.filter(task => 
      isSameDay(parseISO(task.deadline), selectedDate)
    );
  }, [tasks, selectedDate]);

  // Determine if a date has tasks and if any are high priority
  const tileContent = ({ date, view }: { date: Date, view: string }) => {
    if (view !== 'month') return null;
    
    const hasTaskOnDate = tasks.some(task => 
      isSameDay(parseISO(task.deadline), date)
    );
    
    const hasHighPriorityTask = tasks.some(task => 
      isSameDay(parseISO(task.deadline), date) && task.priority === 'high'
    );
    
    return (
      <div className={`
        ${hasTaskOnDate ? 'react-calendar__tile--hasTask' : ''}
        ${hasHighPriorityTask ? 'react-calendar__tile--hasHighPriorityTask' : ''}
      `} />
    );
  };

  const taskCountForDate = (date: Date) => {
    return tasks.filter(task => 
      isSameDay(parseISO(task.deadline), date)
    ).length;
  };

  // Group tasks by completion status
  const pendingTasks = useMemo(() => {
    return tasksForSelectedDate.filter(task => !task.completed);
  }, [tasksForSelectedDate]);
  
  const completedTasks = useMemo(() => {
    return tasksForSelectedDate.filter(task => task.completed);
  }, [tasksForSelectedDate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AppHeader />
      
      <style>{calendarClass}</style>
      
      <main className="container mx-auto px-4 py-6">
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Calendar View</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Tasks for {format(selectedDate, 'MMMM d, yyyy')}
              </h2>
              
              {tasksForSelectedDate.length === 0 ? (
                <div className="card p-8 text-center">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    No tasks scheduled for this date.
                  </p>
                  <Button 
                    onClick={() => navigate('/dashboard')}
                    variant="primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {pendingTasks.length > 0 && (
                    <div>
                      <div className="flex items-center mb-3">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Pending</h3>
                        <Badge variant="warning" className="ml-2">{pendingTasks.length}</Badge>
                      </div>
                      <div className="space-y-3">
                        {pendingTasks.map(task => (
                          <TaskItem key={task.id} task={task} />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {completedTasks.length > 0 && (
                    <div>
                      <div className="flex items-center mb-3">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Completed</h3>
                        <Badge variant="success" className="ml-2">{completedTasks.length}</Badge>
                      </div>
                      <div className="space-y-3">
                        {completedTasks.map(task => (
                          <TaskItem key={task.id} task={task} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="card p-5 order-1 lg:order-2">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileContent={tileContent}
              tileClassName={({ date, view }) => {
                if (view !== 'month') return '';
                
                const taskCount = taskCountForDate(date);
                if (taskCount === 0) return '';
                
                const hasHighPriority = tasks.some(task => 
                  isSameDay(parseISO(task.deadline), date) && task.priority === 'high'
                );
                
                return hasHighPriority 
                  ? 'font-bold text-error-500'
                  : 'font-bold text-primary-600 dark:text-primary-500';
              }}
            />
            
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center mb-1">
                <span className="w-3 h-3 rounded-full bg-primary-600 inline-block mr-2"></span>
                <span>Regular tasks</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-error-500 inline-block mr-2"></span>
                <span>High priority tasks</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                Monthly Summary
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="mb-1">
                  <span className="font-medium">{tasks.length}</span> total tasks this month
                </p>
                <p className="mb-1">
                  <span className="font-medium">
                    {tasks.filter(task => task.completed).length}
                  </span> completed
                </p>
                <p>
                  <span className="font-medium">
                    {tasks.filter(task => task.priority === 'high' && !task.completed).length}
                  </span> high priority pending
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};