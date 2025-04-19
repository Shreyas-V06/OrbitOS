import React from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  CheckSquare, 
  Clock, 
  FolderKanban, 
  Settings, 
  HelpCircle, 
  LogOut 
} from 'lucide-react';

interface NavigationBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'agent', label: 'Agent', icon: <MessageSquare size={20} /> },
    { id: 'todo', label: 'Todo', icon: <CheckSquare size={20} /> },
    { id: 'reminder', label: 'Reminder', icon: <Clock size={20} /> },
    { id: 'project', label: 'Project', icon: <FolderKanban size={20} /> },
  ];
  
  const bottomTabs = [
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
    { id: 'help', label: 'Help', icon: <HelpCircle size={20} /> },
    { id: 'logout', label: 'Logout', icon: <LogOut size={20} /> },
  ];
  
  return (
    <motion.div 
      className="h-full w-64 bg-secondary border-r border-gray-800 flex flex-col"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6 mb-4 flex items-center">
        <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
          <img 
            src="/logo.png" 
            alt="OrbitOS" 
            className="h-full w-full object-cover"
          />
        </div>
        <h2 className="space-title text-lg">OrbitOS</h2>
      </div>
      
      <div className="px-3 mb-2">
        <div className="text-xs uppercase text-gray-500 font-semibold px-3 mb-2">Main</div>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`flex items-center w-full py-3 px-3 mb-1 rounded-lg transition-colors ${
              activeTab === tab.id ? 'tab-active' : 'hover:bg-white/5'
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="mr-3 text-gray-400">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
      
      <div className="mt-auto px-3 mb-6">
        <div className="text-xs uppercase text-gray-500 font-semibold px-3 mb-2">System</div>
        {bottomTabs.map(tab => (
          <button
            key={tab.id}
            className="flex items-center w-full py-3 px-3 mb-1 rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => onTabChange(tab.id)}
          >
            <span className="mr-3 text-gray-400">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default NavigationBar;