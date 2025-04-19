import React, { useState } from 'react';
import { motion } from 'framer-motion';
import NavigationBar from './NavigationBar';
import AgentTab from './tabs/AgentTab';
import TodoTab from './tabs/TodoTab';
import ReminderTab from './tabs/ReminderTab';
import ProjectTab from './tabs/ProjectTab';
import FloatingElements from './FloatingElements';

const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState('agent');
  
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'agent':
        return <AgentTab />;
      case 'todo':
        return <TodoTab />;
      case 'reminder':
        return <ReminderTab />;
      case 'project':
        return <ProjectTab />;
      default:
        return <AgentTab />;
    }
  };
  
  return (
    <motion.div 
      className="fixed inset-0 flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <FloatingElements density={20} />
      
      <NavigationBar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute inset-0 z-0">
          <div className="h-full w-full bg-background opacity-95" />
        </div>
        
        <div className="relative z-10 flex-1 overflow-hidden">
          {renderActiveTab()}
        </div>
      </div>
    </motion.div>
  );
};

export default MainLayout;