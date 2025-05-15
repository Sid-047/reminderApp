import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { TextArea } from '../ui/TextArea';
import { Select } from '../ui/Select';
import { Task, PriorityLevel } from '../../types';
import { useTasks } from '../../contexts/TaskContext';
import { formatISO } from 'date-fns';

interface TaskFormProps {
  task?: Task;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ 
  task, 
  onSuccess,
  onCancel
}) => {
  const { addTask, updateTask } = useTasks();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<PriorityLevel>(task?.priority || 'medium');
  const [deadline, setDeadline] = useState(
    task?.deadline 
      ? new Date(task.deadline).toISOString().substring(0, 10) 
      : new Date().toISOString().substring(0, 10)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!deadline) {
      newErrors.deadline = 'Deadline is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      if (task) {
        // Update existing task
        await updateTask(task.id, {
          title,
          description,
          priority,
          deadline: formatISO(new Date(deadline)),
        });
      } else {
        // Create new task
        await addTask({
          title,
          description,
          priority,
          deadline: formatISO(new Date(deadline)),
          completed: false,
        });
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="task-title"
        label="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter task title"
        error={errors.title}
        required
      />
      
      <TextArea
        id="task-description"
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter task description"
        error={errors.description}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="task-deadline"
          label="Deadline"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          error={errors.deadline}
          required
        />
        
        <Select
          id="task-priority"
          label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as PriorityLevel)}
          options={priorityOptions}
          error={errors.priority}
        />
      </div>
      
      <div className="flex justify-end space-x-3 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        
        <Button
          type="submit"
          isLoading={isSubmitting}
        >
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};