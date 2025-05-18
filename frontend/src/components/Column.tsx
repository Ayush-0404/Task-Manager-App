import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Column as ColumnType, Task } from '../types';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';

interface ColumnProps {
  column: ColumnType;
  onAddTask: (columnId: string, task: Omit<Task, 'id' | 'createdAt' | 'columnId'>) => Promise<any>;
  onUpdateTask: (taskId: string, task: Partial<Task>) => Promise<any>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onDragEnd: (taskId: string, columnId: string) => Promise<void>;
  onDragStart: (taskId: string, columnId: string) => void;
  draggedTaskId: string | null;
  animations: boolean;
  darkMode: boolean;
  compactView: boolean;
}

const Column = ({ 
  column, 
  onAddTask, 
  onUpdateTask, 
  onDeleteTask, 
  onDragEnd,
  onDragStart,
  draggedTaskId,
  animations,
  darkMode,
  compactView
}: ColumnProps) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const handleAddClick = () => {
    setIsAddingTask(true);
  };

  const handleCancelAdd = () => {
    setIsAddingTask(false);
  };

  const handleSubmitAdd = async (newTask: Omit<Task, 'id' | 'createdAt' | 'columnId'>) => {
    try {
      await onAddTask(column.id, newTask);
      setIsAddingTask(false);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };
  
  // Fix and improve the sortTasksByDate method
  const sortTasksByDate = async () => {
    try {
      // Sabse purane tasks ko pehle dikhaenge 😊
      const sortedTasks = [...column.tasks].sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      
      if (sortedTasks.length <= 1) {
        console.log(`Koi task nahi hai ${column.title} mein sort karne ke liye!`);
        setShowSortMenu(false);
        return;
      }

      // Ek ek karke tasks ko update karo, taaki sequence sahi rahe
      for (let i = 0; i < sortedTasks.length; i++) {
        await onUpdateTask(sortedTasks[i].id, { 
          columnId: column.id,
          sortOrder: i
        });
      }
      
      console.log(`${sortedTasks.length} tasks ko date ke hisaab se sort kar diya!`);
      
      // Thoda refresh kar dete hain taaki changes dikhe
      setTimeout(() => {
        window.location.reload();
      }, 500);
      
      setShowSortMenu(false);
    } catch (error) {
      console.error('Oops! Date se sort karte time kuch gadbad ho gayi:', error);
      setShowSortMenu(false);
    }
  };
  
  // Fix and improve the sortTasksByPriority method
  const sortTasksByPriority = async () => {
    try {
      // High priority tasks ko pehle dikhaenge ✓✓✓
      const priorityOrder = { high: 3, medium: 2, low: 1, undefined: 0 };
      const sortedTasks = [...column.tasks].sort((a, b) => 
        (priorityOrder[b.priority || 'undefined'] || 0) - (priorityOrder[a.priority || 'undefined'] || 0)
      );
      
      if (sortedTasks.length <= 1) {
        console.log(`${column.title} mein sort karne layak task nahi hai!`);
        setShowSortMenu(false);
        return;
      }

      // Sabhi tasks ko sequence mein update karo
      for (let i = 0; i < sortedTasks.length; i++) {
        await onUpdateTask(sortedTasks[i].id, { 
          columnId: column.id,
          sortOrder: i
        });
      }
      
      console.log(`${sortedTasks.length} tasks ko priority se sort kar diya ${column.title} mein!`);
      
      // Jaldi se refresh kar lete hain
      setTimeout(() => {
        window.location.reload();
      }, 500);
      
      setShowSortMenu(false);
    } catch (error) {
      console.error('Arey yaar! Priority sort mein problem ho gaya:', error);
      setShowSortMenu(false);
    }
  };
  
  // Fix and improve the sortTasksByTitle method
  const sortTasksByTitle = async () => {
    try {
      // A se Z tak alphabetically sort karte hain 🔤
      const sortedTasks = [...column.tasks].sort((a, b) => 
        a.title.localeCompare(b.title)
      );
      
      if (sortedTasks.length <= 1) {
        console.log(`${column.title} mein sirf ${sortedTasks.length} task hai, sort karne ki zaroorat nahi!`);
        setShowSortMenu(false);
        return;
      }

      // Tasks ko naye order mein update karo
      for (let i = 0; i < sortedTasks.length; i++) {
        await onUpdateTask(sortedTasks[i].id, { 
          columnId: column.id,
          sortOrder: i
        });
      }
      
      console.log(`Title ke hisaab se ${sortedTasks.length} tasks sort ho gaye!`);
      
      // Page refresh karo taaki changes dikhe
      setTimeout(() => {
        window.location.reload();
      }, 500);
      
      setShowSortMenu(false);
    } catch (error) {
      console.error('Title sort karte time error ho gaya 😢:', error);
      setShowSortMenu(false);
    }
  };

  const getColumnColor = (columnTitle: string) => {
    switch (columnTitle) {
      case 'To Do':
        return darkMode 
          ? 'from-purple-900 to-purple-800 border-purple-700' 
          : 'from-purple-50 to-purple-100 border-purple-200';
      case 'In Progress':
        return darkMode 
          ? 'from-teal-900 to-teal-800 border-teal-700' 
          : 'from-teal-50 to-teal-100 border-teal-200';
      case 'Done':
        return darkMode 
          ? 'from-pink-900 to-pink-800 border-pink-700' 
          : 'from-pink-50 to-pink-100 border-pink-200';
      default:
        return darkMode 
          ? 'from-gray-800 to-gray-700 border-gray-600' 
          : 'from-gray-50 to-gray-100 border-gray-200';
    }
  };

  const getColumnHeaderColor = (columnTitle: string) => {
    switch (columnTitle) {
      case 'To Do':
        return darkMode 
          ? 'text-purple-200 bg-purple-800' 
          : 'text-purple-800 bg-purple-100';
      case 'In Progress':
        return darkMode 
          ? 'text-teal-200 bg-teal-800' 
          : 'text-teal-800 bg-teal-100';
      case 'Done':
        return darkMode 
          ? 'text-pink-200 bg-pink-800' 
          : 'text-pink-800 bg-pink-100';
      default:
        return darkMode 
          ? 'text-gray-200 bg-gray-800' 
          : 'text-gray-800 bg-gray-100';
    }
  };
  
  const getColumnIcon = (columnTitle: string) => {
    switch (columnTitle) {
      case 'To Do':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      case 'In Progress':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'Done':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getTaskCount = () => {
    return column.tasks.length;
  };
  
  // Animation variants
  const taskListVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.07
      }
    }
  };
  
  const taskVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    exit: { 
      scale: 0.8, 
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };
  
  // Handle drag events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggedOver(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggedOver(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggedOver(false);
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json') || '{}');
      if (data && data.taskId) {
        onDragEnd(data.taskId, column.id);
      }
    } catch (error) {
      console.error('Error parsing drag data:', error);
    }
  };

  // Add this new function to get column-specific drag-over classes
  const getDragOverClass = (columnTitle: string) => {
    if (!isDraggedOver) return '';
    
    switch (columnTitle) {
      case 'To Do':
        return darkMode 
          ? 'bg-purple-800/20 ring-1 ring-purple-400' 
          : 'bg-purple-50/50 ring-1 ring-purple-300';
      case 'In Progress':
        return darkMode 
          ? 'bg-teal-800/20 ring-1 ring-teal-400' 
          : 'bg-teal-50/50 ring-1 ring-teal-300';
      case 'Done':
        return darkMode 
          ? 'bg-pink-800/20 ring-1 ring-pink-400' 
          : 'bg-pink-50/50 ring-1 ring-pink-300';
      default:
        return darkMode 
          ? 'bg-gray-700/20 ring-1 ring-gray-400' 
          : 'bg-gray-50/50 ring-1 ring-gray-300';
    }
  };

  return (
    <motion.div 
      className={`rounded-lg shadow-md overflow-hidden border ${getColumnColor(column.title)}`}
      whileHover={animations ? { scale: 1.01 } : {}}
      animate={animations && isDraggedOver ? { scale: 1.01 } : { scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={`p-4 font-medium flex justify-between items-center ${getColumnHeaderColor(column.title)}`}>
        <div className="flex items-center">
          {getColumnIcon(column.title)}
          <h3 className="text-lg font-semibold">{column.title}</h3>
          <motion.span 
            className={`ml-2 px-2 py-1 text-xs rounded-full ${
              darkMode 
                ? 'bg-gray-700 text-gray-200' 
                : 'bg-white text-gray-700'
            }`}
            whileHover={animations ? { scale: 1.1 } : {}}
            whileTap={animations ? { scale: 0.95 } : {}}
          >
            {getTaskCount()}
          </motion.span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <motion.button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="p-1 rounded-full hover:bg-white/30 transition-colors"
              aria-label="Sort tasks"
              whileHover={animations ? { scale: 1.2 } : {}}
              whileTap={animations ? { scale: 0.9 } : {}}
              title="Quick organize tasks"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
                />
              </svg>
            </motion.button>
            
            {showSortMenu && (
              <motion.div 
                className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg z-20 ${
                  darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="py-1">
                  <button 
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={sortTasksByDate}
                  >
                    Sort by Date Created
                  </button>
                  <button 
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={sortTasksByPriority}
                  >
                    Sort by Priority
                  </button>
                  <button 
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={sortTasksByTitle}
                  >
                    Sort by Title (A-Z)
                  </button>
                </div>
              </motion.div>
            )}
          </div>
          
          <motion.button
            onClick={handleAddClick}
            className="p-1 rounded-full hover:bg-white/30 transition-colors"
            aria-label="Add task"
            whileHover={animations ? { scale: 1.2, rotate: 90 } : {}}
            whileTap={animations ? { scale: 0.9 } : {}}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </motion.button>
        </div>
      </div>

      <div
        className={`p-3 bg-gradient-to-b ${getColumnColor(column.title)} min-h-[500px] transition-colors column-drop-zone ${
          draggedTaskId ? 'column-droppable' : ''
        } ${getDragOverClass(column.title)}`}
        data-column-id={column.id}
      >
        <AnimatePresence>
          {isAddingTask && (
            <motion.div 
              className="mb-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <TaskForm
                onSubmit={handleSubmitAdd}
                onCancel={handleCancelAdd}
                darkMode={darkMode}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          variants={animations ? taskListVariants : {}}
          initial={animations ? "hidden" : false}
          animate={animations ? "visible" : false}
          className="task-list"
        >
          <AnimatePresence>
            {column.tasks.map((task, index) => (
              <motion.div
                key={task.id}
                variants={animations ? taskVariants : {}}
                exit="exit"
                layout
                className={draggedTaskId === task.id ? 'dragging' : ''}
              >
                <TaskCard
                  task={task}
                  index={index}
                  columnId={column.id}
                  onUpdate={onUpdateTask}
                  onDelete={onDeleteTask}
                  onDragEnd={(taskId) => onDragEnd(taskId, column.id)}
                  onDragStart={(taskId) => onDragStart(taskId, column.id)}
                  animations={animations}
                  darkMode={darkMode}
                  compactView={compactView}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {column.tasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 mb-2 ${
                darkMode 
                  ? column.title === 'To Do' ? 'text-indigo-600' : column.title === 'In Progress' ? 'text-amber-600' : column.title === 'Done' ? 'text-emerald-600' : 'text-gray-400' 
                  : column.title === 'To Do' ? 'text-indigo-500' : column.title === 'In Progress' ? 'text-amber-500' : column.title === 'Done' ? 'text-emerald-500' : 'text-gray-400'
              }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No tasks yet
              </p>
              <button
                onClick={handleAddClick}
                className={`mt-2 text-sm font-medium ${
                  darkMode 
                    ? column.title === 'To Do' ? 'text-indigo-400 hover:text-indigo-300' : column.title === 'In Progress' ? 'text-amber-400 hover:text-amber-300' : column.title === 'Done' ? 'text-emerald-400 hover:text-emerald-300' : 'text-gray-400 hover:text-gray-300' 
                    : column.title === 'To Do' ? 'text-indigo-600 hover:text-indigo-500' : column.title === 'In Progress' ? 'text-amber-600 hover:text-amber-500' : column.title === 'Done' ? 'text-emerald-600 hover:text-emerald-500' : 'text-gray-600 hover:text-gray-500'
                }`}
              >
                Add your first task
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Column; 