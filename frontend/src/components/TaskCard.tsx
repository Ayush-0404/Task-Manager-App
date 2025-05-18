import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Task } from '../types';
import TaskForm from './TaskForm';

interface TaskCardProps {
  task: Task;
  index: number;
  columnId: string;
  onUpdate: (taskId: string, task: Partial<Task>) => Promise<any>;
  onDelete: (taskId: string) => Promise<void>;
  onDragEnd: (taskId: string) => Promise<void>;
  onDragStart: (taskId: string) => void;
  animations: boolean;
  darkMode: boolean;
  compactView: boolean;
  freeform?: boolean;
}

const TaskCard = ({ 
  task, 
  index, 
  columnId,
  onUpdate, 
  onDelete,
  onDragEnd,
  onDragStart,
  animations,
  darkMode,
  compactView,
  freeform = false
}: TaskCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Close menu when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
    setIsMenuOpen(false);
  };

  const handleDeleteClick = async () => {
    try {
      await onDelete(task.id);
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSubmitEdit = async (updatedTask: Omit<Task, 'id' | 'createdAt' | 'columnId'>) => {
    try {
      await onUpdate(task.id, updatedTask);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Handle priority colors with our new color scheme
  const getPriorityColor = () => {
    if (!task.priority) return '';
    
    if (darkMode) {
      switch (task.priority) {
        case 'high': return 'border-l-4 border-rose-600 pl-3 border-r-2 border-t-2 border-b-2 border-rose-600';
        case 'medium': return 'border-l-4 border-orange-600 pl-3 border-r-2 border-t-2 border-b-2 border-orange-600';
        case 'low': return 'border-l-4 border-cyan-600 pl-3 border-r-2 border-t-2 border-b-2 border-cyan-600';
        default: return '';
      }
    } else {
      switch (task.priority) {
        case 'high': return 'border-l-4 border-rose-500 pl-3 border-r-2 border-t-2 border-b-2 border-rose-500';
        case 'medium': return 'border-l-4 border-orange-500 pl-3 border-r-2 border-t-2 border-b-2 border-orange-500';
        case 'low': return 'border-l-4 border-cyan-500 pl-3 border-r-2 border-t-2 border-b-2 border-cyan-500';
        default: return '';
      }
    }
  };
  
  const getPriorityTag = () => {
    if (!task.priority) return null;
    
    const bgColorClass = darkMode ? {
      high: 'bg-rose-900 text-rose-100',
      medium: 'bg-orange-900 text-orange-100',
      low: 'bg-cyan-900 text-cyan-100'
    } : {
      high: 'bg-rose-100 text-rose-800',
      medium: 'bg-orange-100 text-orange-800',
      low: 'bg-cyan-100 text-cyan-800'
    };
    
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${bgColorClass[task.priority]}`}>
        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
      </span>
    );
  };
  
  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Create a ghost element that follows the cursor
  const createGhostElement = (e: React.DragEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    // Remove any existing ghost element
    removeGhostElement();
    
    // Create a clone of the card
    const clone = cardRef.current.cloneNode(true) as HTMLDivElement;
    clone.id = 'drag-ghost';
    clone.style.position = 'fixed';
    clone.style.top = '-1000px';
    clone.style.left = '-1000px';
    clone.style.opacity = '0.8';
    clone.style.pointerEvents = 'none';
    clone.style.width = `${cardRef.current.offsetWidth}px`;
    clone.style.zIndex = '9999';
    clone.style.transform = 'rotate(1deg)';
    clone.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
    
    document.body.appendChild(clone);
    ghostRef.current = clone;
    
    // Position ghost initially
    updateGhostPosition(e.clientX, e.clientY);
    
    // Set up mouse move listener for positioning ghost
    document.addEventListener('dragover', handleDragOver);
  };
  
  // Update ghost element position
  const updateGhostPosition = (x: number, y: number) => {
    if (!ghostRef.current) return;
    
    // Use simple positioning for less cluttered movement
    requestAnimationFrame(() => {
      if (!ghostRef.current) return;
      ghostRef.current.style.left = `${x - 20}px`;
      ghostRef.current.style.top = `${y - 20}px`;
    });
  };
  
  // Remove ghost element
  const removeGhostElement = () => {
    if (ghostRef.current) {
      document.body.removeChild(ghostRef.current);
      ghostRef.current = null;
    }
    document.removeEventListener('dragover', handleDragOver);
  };
  
  // Handle drag over for ghost element position
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    updateGhostPosition(e.clientX, e.clientY);
  };

  // Play a sound when dragging starts
  const playDragSound = () => {
    try {
      // Sahi sound effects ke liye koshish karte hain 🔊
      const audio = new Audio('/sounds/move.mp3');
      audio.volume = 0.3;
      audio.play();
    } catch (error) {
      console.error('Sound bajane mein problem aa gaya:', error);
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      // Drag effect set karo
      e.dataTransfer.effectAllowed = 'move';
      
      // Chhota sa sound bajao jab user drag kare
      playDragSound();
      
      // Ekdum mast ghost element banao jo mouse ke saath chale
      createGhostElement(e);
      
      // Task ke baare mein jaankari store karo
      e.dataTransfer.setData('application/json', JSON.stringify({
        taskId: task.id,
        sourceColumnId: columnId
      }));
      
      // Drag image ko customize karo
      const emptyImage = new Image();
      emptyImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      e.dataTransfer.setDragImage(emptyImage, 0, 0);
      
      // Thoda delay ke baad dragging state set karo
      setTimeout(() => {
        setIsDragging(true);
        onDragStart(task.id);
        
        // Body par ek class add karo global styling ke liye
        document.body.classList.add('is-dragging');
      }, 0);
    }
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    removeGhostElement();
    onDragEnd(task.id);
    document.body.classList.remove('is-dragging');
    
    // Add drop effect for better user feedback
    if (ghostRef.current) {
      ghostRef.current.style.transform = 'rotate(0) scale(0.95)';
      ghostRef.current.style.opacity = '0';
      ghostRef.current.style.transition = 'all 0.2s ease-out';
    }
  };

  const cardVariants = {
    hover: { 
      scale: 1.02,
      boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 20 
      }
    },
    tap: { 
      scale: 0.98,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 20 
      }
    }
  };

  if (isEditing) {
    return (
      <TaskForm
        initialValues={task}
        onSubmit={handleSubmitEdit}
        onCancel={handleCancelEdit}
        darkMode={darkMode}
      />
    );
  }
  
  return (
    <motion.div
      ref={cardRef}
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`card p-4 mb-3 rounded-lg shadow-md transition-all cursor-grab active:cursor-grabbing ${getPriorityColor()} ${
        darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'
      } ${task.color ? `border-t-4 border-t-[${task.color}]` : ''} ${
        isDragging ? 'opacity-50 pointer-events-none' : ''
      }`}
      style={{ backgroundColor: darkMode ? undefined : task.color ? `${task.color}10` : undefined }}
      whileHover={animations && !isDragging ? cardVariants.hover : undefined}
      whileTap={animations ? cardVariants.tap : undefined}
      animate={animations && isDragging ? cardVariants.dragging : undefined}
    >
      <div className="flex justify-between items-start">
        <h4 
          className={`text-lg font-medium ${isExpanded ? '' : 'cursor-pointer'}`}
          onClick={compactView ? handleToggleExpand : undefined}
        >
          {task.title}
        </h4>
        <div className="relative">
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            aria-label="Task options"
            whileHover={animations ? { rotate: 45, scale: 1.1 } : undefined}
            whileTap={animations ? { scale: 0.9 } : undefined}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
            >
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="12" cy="5" r="1"></circle>
              <circle cx="12" cy="19" r="1"></circle>
            </svg>
          </motion.button>
          
          {isMenuOpen && (
            <motion.div 
              ref={menuRef}
              className={`absolute right-0 mt-1 w-36 rounded-md shadow-lg z-10 border ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="py-1">
                <motion.button
                  onClick={handleEditClick}
                  className={`flex items-center w-full px-4 py-2 text-sm ${
                    darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  whileHover={{ x: 2 }}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="w-4 h-4 mr-2"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Edit
                </motion.button>
                <motion.button
                  onClick={handleDeleteClick}
                  className={`flex items-center w-full px-4 py-2 text-sm ${
                    darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'
                  }`}
                  whileHover={{ x: 2 }}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="w-4 h-4 mr-2"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                  Delete
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      {(!compactView || isExpanded) && task.description && (
        <motion.p 
          className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
          initial={compactView && isExpanded ? { opacity: 0, height: 0 } : false}
          animate={compactView && isExpanded ? { opacity: 1, height: 'auto' } : false}
        >
          {task.description}
        </motion.p>
      )}
      
      <div className="mt-3 flex items-center gap-2">
        {getPriorityTag()}
        
        {/* Display tags if available */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.map(tag => (
              <span 
                key={tag} 
                className={`px-2 py-0.5 text-xs rounded-full ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-3 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <span className="font-medium">
          {formatDate(task.createdAt)}
        </span>
        <div className="flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-3 h-3 mr-1"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>You</span>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard; 