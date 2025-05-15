import React, { useState } from 'react';
import { format, parseISO, isPast, isToday } from 'date-fns';
import { CheckCircle, Clock, Edit, Trash } from 'lucide-react';
import { Task, PriorityLevel } from '../../types';
import { Badge } from '../ui/Badge';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../../contexts/TaskContext';
import { motion } from 'framer-motion';

interface TaskItemProps {
  task: Task;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { completeTask, deleteTask } = useTasks();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const priorityColor: Record<PriorityLevel, string> = {
    low: 'success',
    medium: 'warning',
    high: 'error',
  };

  const handleEdit = () => {
    navigate(`/tasks/${task.id}`);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteTask(task.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleComplete = async () => {
    if (!task.completed) {
      await completeTask(task.id);
    }
  };

  // Format deadline for display
  const deadlineDate = parseISO(task.deadline);
  const isOverdue = isPast(deadlineDate) && !isToday(deadlineDate) && !task.completed;
  const deadlineText = isToday(deadlineDate) 
    ? 'Today' 
    : format(deadlineDate, 'MMM d, yyyy');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={`card transition-all duration-200 task-priority-${task.priority} hover:shadow-task-card-hover ${
        task.completed ? 'opacity-75' : ''
      }`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <button
              onClick={handleComplete}
              className={`mt-0.5 transition-colors duration-200 ${
                task.completed
                  ? 'text-success-500'
                  : 'text-gray-400 hover:text-success-500'
              }`}
              disabled={task.completed}
            >
              <CheckCircle className="h-5 w-5" />
            </button>
            
            <div className="flex-1">
              <h3 
                className={`font-medium text-gray-900 dark:text-white ${
                  task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''
                }`}
              >
                {task.title}
              </h3>
              
              {task.description && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
              
              <div className="flex flex-wrap items-center mt-2 gap-2">
                <Badge variant={priorityColor[task.priority]}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </Badge>
                
                <span 
                  className={`flex items-center text-xs ${
                    isOverdue 
                      ? 'text-error-500' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {isOverdue ? 'Overdue: ' : ''}{deadlineText}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-1 ml-2">
            <button
              onClick={handleEdit}
              className="p-1 text-gray-500 hover:text-primary-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Edit task"
            >
              <Edit className="h-4 w-4" />
            </button>
            
            <button
              onClick={handleDelete}
              className="p-1 text-gray-500 hover:text-error-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Delete task"
              disabled={isDeleting}
            >
              <Trash className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};