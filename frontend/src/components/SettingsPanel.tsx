import { motion } from 'framer-motion';
import { AppSettings } from '../types';

interface SettingsPanelProps {
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onClose: () => void;
}

const SettingsPanel = ({ settings, onUpdateSettings, onClose }: SettingsPanelProps) => {
  const handleToggleSetting = (key: keyof AppSettings) => {
    onUpdateSettings({ [key]: !settings[key] });
  };
  
  return (
    <div className={`settings-panel ${settings.darkMode ? 'text-white bg-gray-800' : 'text-gray-800 bg-white'}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${settings.darkMode ? 'text-white' : 'text-gray-800'}`}>Settings</h2>
        <motion.button
          onClick={onClose}
          className={`p-2 rounded-full ${settings.darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke={settings.darkMode ? "white" : "currentColor"}
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </motion.button>
      </div>
      
      <div className="space-y-4">
        <div className={`setting-item ${settings.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className={`text-lg font-medium ${settings.darkMode ? 'text-white' : 'text-gray-800'}`}>Dark Mode</h3>
              <p className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Switch to dark theme</p>
            </div>
            <motion.button
              onClick={() => handleToggleSetting('darkMode')}
              className={`w-14 h-7 rounded-full p-1 ${
                settings.darkMode 
                  ? 'bg-blue-500' 
                  : 'bg-gray-300'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                className="w-5 h-5 bg-white rounded-full shadow-md"
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                initial={false}
                animate={{ x: settings.darkMode ? '100%' : '0%' }}
              />
            </motion.button>
          </div>
        </div>
        
        <div className={`setting-item ${settings.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className={`text-lg font-medium ${settings.darkMode ? 'text-white' : 'text-gray-800'}`}>Animations</h3>
              <p className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Enable motion animations</p>
            </div>
            <motion.button
              onClick={() => handleToggleSetting('animations')}
              className={`w-14 h-7 rounded-full p-1 ${
                settings.animations 
                  ? 'bg-blue-500' 
                  : 'bg-gray-300'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                className="w-5 h-5 bg-white rounded-full shadow-md"
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                initial={false}
                animate={{ x: settings.animations ? '100%' : '0%' }}
              />
            </motion.button>
          </div>
        </div>
        
        <div className={`setting-item ${settings.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className={`text-lg font-medium ${settings.darkMode ? 'text-white' : 'text-gray-800'}`}>Sound Effects</h3>
              <p className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Enable sound feedback</p>
            </div>
            <motion.button
              onClick={() => handleToggleSetting('soundEffects')}
              className={`w-14 h-7 rounded-full p-1 ${
                settings.soundEffects 
                  ? 'bg-blue-500' 
                  : 'bg-gray-300'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                className="w-5 h-5 bg-white rounded-full shadow-md"
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                initial={false}
                animate={{ x: settings.soundEffects ? '100%' : '0%' }}
              />
            </motion.button>
          </div>
        </div>
        
        <div className={`setting-item ${settings.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className={`text-lg font-medium ${settings.darkMode ? 'text-white' : 'text-gray-800'}`}>Compact View</h3>
              <p className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Use compact task cards</p>
            </div>
            <motion.button
              onClick={() => handleToggleSetting('compactView')}
              className={`w-14 h-7 rounded-full p-1 ${
                settings.compactView 
                  ? 'bg-blue-500' 
                  : 'bg-gray-300'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                className="w-5 h-5 bg-white rounded-full shadow-md"
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                initial={false}
                animate={{ x: settings.compactView ? '100%' : '0%' }}
              />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel; 