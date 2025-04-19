import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const ReminderTab: React.FC = () => {
  return (
    <motion.div 
      className="h-full flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="px-6 py-4 border-b border-gray-800">
        <h2 className="text-xl font-semibold">Reminders</h2>
        <p className="text-text-secondary text-sm">Never miss important space events</p>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <Clock size={64} className="mx-auto mb-6 text-gray-500" />
          <h3 className="text-2xl font-semibold mb-3">Reminder System</h3>
          <p className="text-text-secondary mb-6">
            This feature is preparing for launch. Soon you'll be able to set reminders for important cosmic events.
          </p>
          <button className="orbit-btn">
            Coming Soon
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ReminderTab;