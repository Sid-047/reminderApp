import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash, Calendar, Clock, CheckCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { AppHeader } from '../components/layout/AppHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { TaskForm } from '../components/tasks/TaskForm';
import { useTasks } from '../contexts/TaskContext';
import { Task } from '../types';
import { motion } from 'framer-motion';

export const TaskDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { tasks, deleteTask, completeTask, isLoading } = useTasks();
  const [task, setTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id && tasks.length > 0) {
      const foundTask = tasks.find(t => t.id === id);
      setTask(foundTask || null);
    }
  }, [id, tasks]);

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      setIsDeleting(true);
      await deleteTask(id);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleComplete = async () => {
    if (!id || !task || task.completed) return;
    
    try {
      await completeTask(id);
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleEditSuccess = () => {
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <AppHeader />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading task...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <AppHeader />
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="card p-8 text-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Task Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The task you're looking for does not exist or has been deleted.
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const priorityColor = {
    low: 'success',
    medium: 'warning',
    high: 'error',
  }[task.priority];

  const deadlineDate = parseISO(task.deadline);
  const createdDate = parseISO(task.createdAt);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-6">
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <div className={`card overflow-hidden border-l-4 border-${priorityColor}-500`}>
          {isEditing ? (
            <div className="p-6">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Edit Task</h1>
              <TaskForm 
                task={task} 
                onSuccess={handleEditSuccess} 
                onCancel={() => setIsEditing(false)} 
              />
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              <div className="flex justify-between items-start mb-4 flex-wrap gap-4">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{task.title}</h1>
                
                <div className="flex space-x-2">
                  <Badge variant={priorityColor as any}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                  </Badge>
                  
                  {task.completed && (
                    <Badge variant="success">Completed</Badge>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <div className="text-gray-600 dark:text-gray-300 mb-4">
                  {task.description ? (
                    <p>{task.description}</p>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">No description provided</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-6">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Created on {format(createdDate, 'MMMM d, yyyy')}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Due {format(deadlineDate, 'MMMM d, yyyy')}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-8">
                {!task.completed && (
                  <>
                    <Button
                      onClick={handleComplete}
                      variant="primary"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Complete
                    </Button>
                    
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="secondary"
                    >
                      Edit Task
                    </Button>
                  </>
                )}
                
                <Button
                  onClick={handleDelete}
                  variant="outline"
                  className="text-error-500 hover:bg-error-50"
                  isLoading={isDeleting}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete Task
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};