import React from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  React.useEffect(() => {
    const timer = setTimeout(onLoadingComplete, 4000);
    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <motion.div 
      className="fixed inset-0 bg-[#0B0B15] flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="relative w-full max-w-2xl aspect-video"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="absolute right-[20%] top-[30%] w-32 h-32 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-400"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.2, 1], opacity: [0, 0.8, 1] }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
        
        <motion.div 
          className="absolute left-[30%] top-[20%] w-2 h-2 rounded-full bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
        />
        
        <motion.div 
          className="absolute left-[40%] top-[40%] w-1 h-1 rounded-full bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, delay: 0.2, repeat: Infinity, repeatDelay: 0.5 }}
        />
        
        <motion.div 
          className="absolute right-[35%] bottom-[35%] w-2 h-2 rounded-full bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, delay: 0.4, repeat: Infinity, repeatDelay: 0.5 }}
        />
        
        <motion.div 
          className="absolute left-[20%] top-[50%] w-64 h-32"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <motion.div 
            className="w-24 h-16 bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg transform -rotate-45"
            initial={{ rotate: -30 }}
            animate={{ rotate: -45 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          >
            <div className="absolute right-0 w-8 h-8 bg-gray-800 rounded-full" />
            <div className="absolute right-2 w-6 h-6 bg-gray-700 rounded-full" />
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-[#0B0B15] via-transparent to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
        />
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;