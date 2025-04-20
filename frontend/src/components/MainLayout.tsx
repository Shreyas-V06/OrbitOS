import React, { useState } from 'react';
import { motion } from 'framer-motion';
import NavigationBar from './NavigationBar';
import AgentTab from './tabs/AgentTab';
import TodoTab from './tabs/TodoTab';
import ReminderTab from './tabs/ReminderTab';
import ProjectTab from './tabs/ProjectTab';
import FloatingElements from './FloatingElements';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState('agent');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Welcome to OrbitOS! I'm your space guide. How can I assist you today?",
      sender: 'agent',
      timestamp: new Date()
    }
  ]);

  const handleAddMessage = (newMessage: Message) => {
    setMessages(prev => [...prev, newMessage]);
  };
  
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'agent':
        return <AgentTab messages={messages} onAddMessage={handleAddMessage} />;
      case 'todo':
        return <TodoTab />;
      case 'reminder':
        return <ReminderTab />;
      case 'project':
        return <ProjectTab />;
      default:
        return <AgentTab messages={messages} onAddMessage={handleAddMessage} />;
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