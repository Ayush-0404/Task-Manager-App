import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import Confetti from 'react-confetti';
import useSound from 'use-sound';
import { Board as BoardType, Task, AppSettings } from './types';
import Header from './components/Header';
import Board from './components/Board';
import FreeformBoard from './components/FreeformBoard';
import LoadingSpinner from './components/LoadingSpinner';
import SettingsPanel from './components/SettingsPanel';
import { useWindowSize } from './hooks/useWindowSize';

// Import sound effects
// Yahan sound effects hai jo humne add kiye hain! 🎵
const SOUNDS = {
  taskComplete: '/sounds/complete.mp3',
  taskCreate: '/sounds/create.mp3',
  taskMove: '/sounds/move.mp3',
};

const DEFAULT_SETTINGS: AppSettings = {
  animations: true,
  soundEffects: true,
  darkMode: false,
  compactView: false,
  freeformMode: false, // Hum isko disable kar denge, zaroorat nahi hai
};

const App = () => {
  const [board, setBoard] = useState<BoardType | null>(null);
  const [filteredBoard, setFilteredBoard] = useState<BoardType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState({type: '', value: ''});
  const { width, height } = useWindowSize();
  
  // Sound effects
  const [playComplete] = useSound(SOUNDS.taskComplete, { volume: 0.5 });
  const [playCreate] = useSound(SOUNDS.taskCreate, { volume: 0.5 });
  const [playMove] = useSound(SOUNDS.taskMove, { volume: 0.3 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/board');
        
        // Initialize board with default settings if not present
        const boardData = {
          ...response.data,
          theme: response.data.theme || 'light',
          view: response.data.view || 'kanban',
          confetti: false,
          sound: settings.soundEffects,
        };
        
        setBoard(boardData);
        setError(null);
      } catch (err) {
        console.error('Error fetching board data:', err);
        setError('Failed to load board data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('taskBoardSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);
  
  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('taskBoardSettings', JSON.stringify(settings));
  }, [settings]);
  
  // Filter board based on search term and active filter
  useEffect(() => {
    if (!board) return;
    
    let tempBoard = { ...board };
    
    // Pehle search filter lagao agar user ne kuch type kiya hai
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      
      tempBoard = {
        ...tempBoard,
        columns: tempBoard.columns.map(column => {
          const filteredTasks = column.tasks.filter(task => 
            task.title.toLowerCase().includes(lowerCaseSearchTerm) || 
            (task.description && task.description.toLowerCase().includes(lowerCaseSearchTerm)) ||
            (task.tags && task.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm)))
          );
          return { ...column, tasks: filteredTasks };
        })
      };
    }
    
    // Fir additional filters ya sorting apply karo
    if (activeFilter.type && activeFilter.value) {
      // Handle filtering
      if (activeFilter.type === 'filter') {
        if (activeFilter.value === 'high-priority') {
          tempBoard = {
            ...tempBoard,
            columns: tempBoard.columns.map(column => {
              const filteredTasks = column.tasks.filter(task => 
                task.priority === 'high'
              );
              return { ...column, tasks: filteredTasks };
            })
          };
        }
        // 'all' filter toh sab dikha dega, kuch karne ki zaroorat nahi
      }
      
      // Handle sorting
      else if (activeFilter.type === 'sort') {
        tempBoard = {
          ...tempBoard,
          columns: tempBoard.columns.map(column => {
            let sortedTasks = [...column.tasks];
            
            // Pehle sortOrder se sort karo agar available hai
            sortedTasks.sort((a, b) => {
              // Agar dono ke pass sortOrder hai, toh use karo
              if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
                return a.sortOrder - b.sortOrder;
              }
              // Warna baaki sorting methods pe fall back karo
              return 0;
            });
            
            // Fir global sort apply karo agar request ki gayi hai
            if (activeFilter.value === 'date') {
              sortedTasks.sort((a, b) => 
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
              );
            } 
            else if (activeFilter.value === 'priority-high') {
              const priorityOrder = { high: 3, medium: 2, low: 1, undefined: 0 };
              sortedTasks.sort((a, b) => 
                (priorityOrder[b.priority || 'undefined'] || 0) - (priorityOrder[a.priority || 'undefined'] || 0)
              );
            }
            else if (activeFilter.value === 'priority-low') {
              const priorityOrder = { high: 3, medium: 2, low: 1, undefined: 0 };
              sortedTasks.sort((a, b) => 
                (priorityOrder[a.priority || 'undefined'] || 0) - (priorityOrder[b.priority || 'undefined'] || 0)
              );
            }
            else if (activeFilter.value === 'title') {
              sortedTasks.sort((a, b) => a.title.localeCompare(b.title));
            }
            
            return { ...column, tasks: sortedTasks };
          })
        };
      }
    }
    
    setFilteredBoard(tempBoard);
  }, [board, searchTerm, activeFilter]);

  const handleToggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handleDragEnd = async (taskId: string, columnId: string, position?: { x: number, y: number }) => {
    if (!board) return;

    // Find the task and its source column
    let sourceColumnId = '';
    let taskToMove: Task | undefined;
    
    const newBoard = { ...board };
    
    for (const column of newBoard.columns) {
      const taskIndex = column.tasks.findIndex(task => task.id === taskId);
      if (taskIndex !== -1) {
        sourceColumnId = column.id;
        taskToMove = { ...column.tasks[taskIndex] };
        column.tasks.splice(taskIndex, 1);
        break;
      }
    }
    
    if (!taskToMove) return;
    
    // If we're in freeform mode, update the task position
    if (settings.freeformMode && position) {
      taskToMove.position = position;
    }
    
    // If the task was moved to a new column
    if (sourceColumnId !== columnId) {
      taskToMove.columnId = columnId;
      
      // Play the move sound if enabled
      if (settings.soundEffects) {
        playMove();
      }
      
      // If the task was moved to the "Done" column, trigger confetti
      if (columnId === 'column-3' && sourceColumnId !== 'column-3') {
        // Trigger confetti effect
        if (settings.animations) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        }
        
        // Play completion sound
        if (settings.soundEffects) {
          playComplete();
        }
      }
    }
    
    // Add the task to the destination column
    const destColumn = newBoard.columns.find(col => col.id === columnId);
    if (destColumn) {
      destColumn.tasks.push(taskToMove);
    }
    
    // Update state
    setBoard(newBoard);
    
    // Update the backend
    try {
      const updateData: Partial<Task> = { 
        columnId: columnId 
      };
      
      if (settings.freeformMode && position) {
        updateData.position = position;
      }
      
      await axios.patch(`/api/tasks/${taskId}`, updateData);
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task. Please try again.');
      // Revert the change if the API call fails
      fetchBoardData();
    }
  };

  const fetchBoardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/board');
      setBoard(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching board data:', err);
      setError('Failed to load board data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (columnId: string, newTask: Omit<Task, 'id' | 'createdAt' | 'columnId'>) => {
    try {
      // Generate random properties for the task if we're in gamified mode
      const taskData = {
        ...newTask,
        columnId,
        id: uuidv4(), // Generate a temporary ID
        color: settings.freeformMode ? getRandomColor() : undefined,
        tags: settings.freeformMode ? getRandomTags() : undefined,
        priority: getRandomPriority()
      };
      
      // Play creation sound if enabled
      if (settings.soundEffects) {
        playCreate();
      }
      
      const response = await axios.post('/api/tasks', {
        ...newTask,
        columnId
      });
      
      fetchBoardData();
      return response.data;
    } catch (err) {
      console.error('Error adding task:', err);
      setError('Failed to add task. Please try again.');
      throw err;
    }
  };

  const handleUpdateTask = async (taskId: string, updatedTask: Partial<Task>) => {
    try {
      console.log(`Updating task ${taskId} with:`, updatedTask);
      const response = await axios.patch(`/api/tasks/${taskId}`, updatedTask);
      
      // Update the local board data immediately for better UX
      if (board) {
        const newBoard = { ...board };
        newBoard.columns = newBoard.columns.map(column => {
          const taskIndex = column.tasks.findIndex(task => task.id === taskId);
          if (taskIndex !== -1) {
            column.tasks[taskIndex] = { ...column.tasks[taskIndex], ...updatedTask };
          }
          return column;
        });
        setBoard(newBoard);
      }
      
      // When we have sortOrder updates, still do a full fetch to ensure proper order
      if (updatedTask.sortOrder !== undefined) {
        await fetchBoardData();
      }
      
      return response.data;
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task. Please try again.');
      throw err;
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      fetchBoardData();
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task. Please try again.');
      throw err;
    }
  };
  
  // Helper functions for generating random task properties
  const getRandomColor = () => {
    const colors = [
      '#9061f9', '#8b5cf6', '#f472b6', '#ec4899', 
      '#06b6d4', '#0ea5e9', '#22d3ee', '#f97316',
      '#14b8a6', '#f43f5e', '#8b5cf6', '#a855f7'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  const getRandomTags = () => {
    const allTags = ['frontend', 'backend', 'bug', 'feature', 'design', 'documentation', 'testing', 'research'];
    const numTags = Math.floor(Math.random() * 3) + 1; // 1-3 tags
    const shuffled = [...allTags].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numTags);
  };
  
  const getRandomPriority = (): 'low' | 'medium' | 'high' => {
    const priorities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
    return priorities[Math.floor(Math.random() * priorities.length)];
  };

  const handleFilter = (filterType: string, value: string) => {
    setActiveFilter({type: filterType, value});
  };

  if (loading && !board) {
    return <LoadingSpinner />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      settings.darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900'
    }`}>
      {showConfetti && <Confetti width={width} height={height} recycle={false} />}
      
      <Header 
        onToggleSettings={handleToggleSettings}
        darkMode={settings.darkMode}
        title="KaamKaaj - Task Manager"
        onSearch={setSearchTerm}
        onFilter={handleFilter}
      />
      
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={() => setIsSettingsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className={`${settings.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6 max-w-md w-full`}
              onClick={e => e.stopPropagation()}
            >
              <SettingsPanel 
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                onClose={() => setIsSettingsOpen(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {error && (
        <div className={`${settings.darkMode ? 'bg-red-900 border-red-700 text-red-100' : 'bg-red-100 border-red-400 text-red-700'} px-4 py-3 rounded mx-4 my-2 border`} role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {filteredBoard && (
        <Board 
          board={filteredBoard}
          onDragEnd={handleDragEnd}
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          animations={settings.animations}
          darkMode={settings.darkMode}
          compactView={settings.compactView}
        />
      )}
    </div>
  );
};

export default App; 