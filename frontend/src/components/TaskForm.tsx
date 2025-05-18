import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Task } from '../types';

interface TaskFormProps {
  initialValues?: Task;
  onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'columnId'>) => void;
  onCancel: () => void;
  darkMode?: boolean;
}

const TaskForm = ({ initialValues, onSubmit, onCancel, darkMode = false }: TaskFormProps) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [priority, setPriority] = useState(initialValues?.priority || 'medium');
  const [titleError, setTitleError] = useState('');
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Validate title
    if (!title.trim()) {
      setTitleError('Title is required');
      return;
    }
    
    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      priority: priority as 'low' | 'medium' | 'high' || undefined,
    });
    
    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setTitleError('');
  };
  
  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className={`rounded-lg shadow-md p-4 ${
        darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-700'
      }`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mb-3">
        <label htmlFor="title" className={`block text-sm font-medium mb-1 ${
          darkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          Task Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (e.target.value.trim()) setTitleError('');
          }}
          className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 focus:ring-blue-500 text-white' 
              : 'border-gray-300 focus:ring-primary-500 text-gray-900'
          } ${
            titleError 
              ? darkMode ? 'border-red-500' : 'border-red-500' 
              : darkMode ? 'border-gray-600' : 'border-gray-300'
          }`}
          placeholder="Enter task title"
        />
        {titleError && <p className="mt-1 text-sm text-red-500">{titleError}</p>}
      </div>
      
      <div className="mb-4">
        <label htmlFor="description" className={`block text-sm font-medium mb-1 ${
          darkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 focus:ring-blue-500 text-white' 
              : 'border-gray-300 focus:ring-primary-500 text-gray-900'
          }`}
          rows={3}
          placeholder="Enter task description (optional)"
        ></textarea>
      </div>
      
      <div className="mb-4">
        <label className={`block text-sm font-medium mb-1 ${
          darkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          Priority
        </label>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setPriority('low')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              priority === 'low'
                ? darkMode ? 'bg-green-700 text-white' : 'bg-green-100 text-green-800 font-bold'
                : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Low
          </button>
          <button
            type="button"
            onClick={() => setPriority('medium')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              priority === 'medium'
                ? darkMode ? 'bg-yellow-700 text-white' : 'bg-yellow-100 text-yellow-800 font-bold'
                : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Medium
          </button>
          <button
            type="button"
            onClick={() => setPriority('high')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              priority === 'high'
                ? darkMode ? 'bg-red-700 text-white' : 'bg-red-100 text-red-800 font-bold'
                : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
            }`}
          >
            High
          </button>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <motion.button
          type="button"
          onClick={onCancel}
          className={`btn ${
            darkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
              : 'btn-outline'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Cancel
        </motion.button>
        <motion.button
          type="submit"
          className={`btn ${
            darkMode 
              ? 'bg-blue-600 hover:bg-blue-500 text-white' 
              : 'btn-primary'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {initialValues ? 'Save Changes' : 'Add Task'}
        </motion.button>
      </div>
    </motion.form>
  );
};

export default TaskForm;
 