import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Board as BoardType, Task } from '../types';
import Column from './Column';

interface BoardProps {
  board: BoardType;
  onDragEnd: (taskId: string, columnId: string) => Promise<void>;
  onAddTask: (columnId: string, task: Omit<Task, 'id' | 'createdAt' | 'columnId'>) => Promise<any>;
  onUpdateTask: (taskId: string, task: Partial<Task>) => Promise<any>;
  onDeleteTask: (taskId: string) => Promise<void>;
  animations: boolean;
  darkMode: boolean;
  compactView: boolean;
}

const Board = ({ 
  board, 
  onDragEnd, 
  onAddTask, 
  onUpdateTask, 
  onDeleteTask, 
  animations,
  darkMode,
  compactView
}: BoardProps) => {
  // State to track current dragging
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [draggedTaskSourceColumn, setDraggedTaskSourceColumn] = useState<string | null>(null);
  
  // Animations for the board container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  // Animations for individual columns
  const columnVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  // Handle drag start
  const handleDragStart = (taskId: string, columnId: string) => {
    setDraggedTask(taskId);
    setDraggedTaskSourceColumn(columnId);
    // Add a class to the body to indicate dragging state
    document.body.classList.add('dragging-task');
  };

  // Handle drag end
  const handleDragEnd = async (taskId: string, targetColumnId: string) => {
    if (taskId && targetColumnId) {
      setDraggedTask(null);
      setDraggedTaskSourceColumn(null);
      document.body.classList.remove('dragging-task');
      
      // Only call the API if the column changed
      if (draggedTaskSourceColumn !== targetColumnId) {
        await onDragEnd(taskId, targetColumnId);
      }
    }
  };
  
  // Handle drop on column
  const handleColumnDrop = (e: React.DragEvent<HTMLDivElement>, columnId: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('column-drag-over');
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json') || '{}');
      if (data && data.taskId) {
        handleDragEnd(data.taskId, columnId);
      }
    } catch (error) {
      console.error('Error parsing drag data:', error);
    }
  };
  
  // Handle dragover for highlighting drop zones
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('column-drag-over');
  };
  
  // Handle drag leave for removing highlight
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('column-drag-over');
  };
  
  return (
    <div className="board-container p-4">
      <motion.div 
        className="p-4 sm:p-6 max-w-7xl mx-auto"
        variants={animations ? containerVariants : {}}
        initial={animations ? "hidden" : false}
        animate={animations ? "visible" : false}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {board.columns.map((column) => (
            <motion.div
              key={column.id}
              variants={animations ? columnVariants : {}}
              className="column-drop-container"
              onDrop={(e) => handleColumnDrop(e, column.id)}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              data-column-id={column.id}
            >
              <Column
                column={column}
                onAddTask={onAddTask}
                onUpdateTask={onUpdateTask}
                onDeleteTask={onDeleteTask}
                onDragEnd={handleDragEnd}
                onDragStart={handleDragStart}
                draggedTaskId={draggedTask}
                animations={animations}
                darkMode={darkMode}
                compactView={compactView}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Board; 