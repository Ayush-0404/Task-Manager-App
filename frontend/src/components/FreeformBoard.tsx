import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Draggable from 'react-draggable';
import { Board as BoardType, Task } from '../types';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';

interface FreeformBoardProps {
  board: BoardType;
  onDragEnd: (taskId: string, columnId: string, position: { x: number, y: number }) => Promise<void>;
  onAddTask: (columnId: string, task: Omit<Task, 'id' | 'createdAt' | 'columnId'>) => Promise<any>;
  onUpdateTask: (taskId: string, task: Partial<Task>) => Promise<any>;
  onDeleteTask: (taskId: string) => Promise<void>;
  animations: boolean;
  darkMode: boolean;
}

const FreeformBoard = ({
  board,
  onDragEnd,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  animations,
  darkMode
}: FreeformBoardProps) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  
  // Generate a list of all tasks across all columns
  const allTasks = board.columns.flatMap(column => 
    column.tasks.map(task => ({
      ...task,
      columnTitle: column.title,
      columnId: column.id
    }))
  );
  
  const handleAddClick = (columnId: string) => {
    setActiveColumnId(columnId);
    setIsAddingTask(true);
  };
  
  const handleCancelAdd = () => {
    setIsAddingTask(false);
    setActiveColumnId(null);
  };
  
  const handleSubmitAdd = async (newTask: Omit<Task, 'id' | 'createdAt' | 'columnId'>) => {
    if (!activeColumnId) return;
    
    try {
      await onAddTask(activeColumnId, newTask);
      setIsAddingTask(false);
      setActiveColumnId(null);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const getColumnColor = (columnTitle: string) => {
    switch (columnTitle) {
      case 'To Do':
        return darkMode 
          ? 'border-blue-600 text-blue-200' 
          : 'border-blue-300 text-blue-700';
      case 'In Progress':
        return darkMode 
          ? 'border-amber-600 text-amber-200' 
          : 'border-amber-300 text-amber-700';
      case 'Done':
        return darkMode 
          ? 'border-green-600 text-green-200' 
          : 'border-green-300 text-green-700';
      default:
        return darkMode 
          ? 'border-gray-600 text-gray-200' 
          : 'border-gray-300 text-gray-700';
    }
  };
  
  return (
    <div className="py-6">
      {/* Column header buttons */}
      <div className="flex justify-center space-x-4 mb-8">
        {board.columns.map((column) => (
          <motion.button
            key={column.id}
            className={`px-6 py-3 rounded-full border-2 font-medium ${getColumnColor(column.title)} ${
              darkMode ? 'hover:bg-gray-800' : 'hover:bg-white'
            } transition-colors`}
            whileHover={animations ? { scale: 1.05 } : {}}
            whileTap={animations ? { scale: 0.95 } : {}}
            onClick={() => handleAddClick(column.id)}
          >
            <div className="flex items-center">
              <span className="mr-2">{column.title}</span>
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs rounded-full bg-opacity-30 bg-white">
                {column.tasks.length}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
      
      {/* Task form modal */}
      {isAddingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div 
            className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-medium mb-4">
              Add Task to {board.columns.find(col => col.id === activeColumnId)?.title}
            </h3>
            <TaskForm
              onSubmit={handleSubmitAdd}
              onCancel={handleCancelAdd}
              darkMode={darkMode}
            />
          </div>
        </div>
      )}
      
      {/* Freeform board canvas */}
      <div 
        ref={boardRef}
        className={`${
          darkMode ? 'bg-gray-900' : 'bg-slate-100'
        } min-h-[600px] rounded-lg p-6 mx-auto relative overflow-hidden border ${
          darkMode ? 'border-gray-700' : 'border-slate-200'
        }`}
        style={{ maxWidth: '1200px' }}
      >
        {/* Background grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        
        {/* Decorative elements */}
        <div className="absolute bottom-4 right-4 text-gray-400 opacity-30 dark:opacity-20 text-sm">
          Drag tasks anywhere!
        </div>
        
        {/* Tasks */}
        {allTasks.map((task) => {
          // Calculate default position if not already positioned
          const defaultPosition = task.position || {
            x: Math.random() * (boardRef.current?.clientWidth || 800) * 0.7,
            y: Math.random() * (boardRef.current?.clientHeight || 600) * 0.7,
          };
          
          return (
            <Draggable
              key={task.id}
              defaultPosition={defaultPosition}
              bounds="parent"
              onStop={(e, data) => {
                onDragEnd(task.id, task.columnId, { x: data.x, y: data.y });
              }}
            >
              <div className="absolute" style={{ zIndex: 10 }}>
                <motion.div 
                  initial={animations ? { scale: 0.8, opacity: 0 } : false}
                  animate={animations ? { scale: 1, opacity: 1 } : false}
                  whileHover={animations ? { scale: 1.03, zIndex: 20 } : {}}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <div className={`px-2 py-1 text-xs rounded-t-md ${getColumnColor(task.columnTitle)} border-b-0`}>
                    {task.columnTitle}
                  </div>
                  <TaskCard
                    task={task}
                    index={0}
                    columnId={task.columnId}
                    onUpdate={onUpdateTask}
                    onDelete={onDeleteTask}
                    onDragEnd={onDragEnd}
                    animations={animations}
                    darkMode={darkMode}
                    compactView={true}
                    freeform={true}
                  />
                </motion.div>
              </div>
            </Draggable>
          );
        })}
      </div>
    </div>
  );
};

export default FreeformBoard; 