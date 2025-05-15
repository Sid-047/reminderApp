import React, { createContext, useState, useContext, useEffect } from 'react';
import { Task, TaskContextType } from '../types';
import { useAuth } from './AuthContext';
import { addDays, formatISO } from 'date-fns';

// Mock tasks for demo purposes
const generateMockTasks = (userId: string): Task[] => {
  const now = new Date();
  return [
    {
      id: '1',
      title: 'Complete project proposal',
      description: 'Finish the proposal for the new client project',
      completed: false,
      deadline: formatISO(addDays(now, 2)),
      priority: 'high',
      createdAt: formatISO(now),
      userId
    },
    {
      id: '2',
      title: 'Weekly team meeting',
      description: 'Discuss project progress and next steps',
      completed: false,
      deadline: formatISO(addDays(now, 1)),
      priority: 'medium',
      createdAt: formatISO(now),
      userId
    },
    {
      id: '3',
      title: 'Update documentation',
      description: 'Review and update the project documentation',
      completed: true,
      deadline: formatISO(addDays(now, -1)),
      priority: 'low',
      createdAt: formatISO(addDays(now, -3)),
      userId
    },
    {
      id: '4',
      title: 'Code review',
      description: 'Review pull requests from the development team',
      completed: false,
      deadline: formatISO(addDays(now, 3)),
      priority: 'medium',
      createdAt: formatISO(addDays(now, -1)),
      userId
    },
    {
      id: '5',
      title: 'Prepare for presentation',
      description: 'Create slides and rehearse for client presentation',
      completed: false,
      deadline: formatISO(addDays(now, 5)),
      priority: 'high',
      createdAt: formatISO(now),
      userId
    }
  ];
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load tasks when user changes
  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      try {
        if (user) {
          // Simulate API request delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Load from localStorage or generate mock data
          const storedTasks = localStorage.getItem(`tasks-${user.id}`);
          if (storedTasks) {
            setTasks(JSON.parse(storedTasks));
          } else {
            const newTasks = generateMockTasks(user.id);
            localStorage.setItem(`tasks-${user.id}`, JSON.stringify(newTasks));
            setTasks(newTasks);
          }
        } else {
          setTasks([]);
        }
        setError(null);
      } catch (err) {
        setError('Failed to load tasks');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [user]);

  // Save tasks to localStorage when they change
  useEffect(() => {
    if (user && tasks.length > 0) {
      localStorage.setItem(`tasks-${user.id}`, JSON.stringify(tasks));
    }
  }, [tasks, user]);

  const addTask = async (task: Omit<Task, 'id' | 'createdAt' | 'userId'>) => {
    if (!user) return;
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newTask: Task = {
        ...task,
        id: `task-${Date.now()}`,
        createdAt: new Date().toISOString(),
        userId: user.id
      };
      
      setTasks(prevTasks => [...prevTasks, newTask]);
    } catch (err) {
      setError('Failed to add task');
      console.error(err);
    }
  };

  const updateTask = async (id: string, task: Partial<Omit<Task, 'id' | 'createdAt' | 'userId'>>) => {
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTasks(prevTasks => 
        prevTasks.map(t => 
          t.id === id ? { ...t, ...task } : t
        )
      );
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTasks(prevTasks => prevTasks.filter(t => t.id !== id));
    } catch (err) {
      setError('Failed to delete task');
      console.error(err);
    }
  };

  const completeTask = async (id: string) => {
    try {
      await updateTask(id, { completed: true });
    } catch (err) {
      setError('Failed to complete task');
      console.error(err);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isLoading,
        error,
        addTask,
        updateTask,
        deleteTask,
        completeTask
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};