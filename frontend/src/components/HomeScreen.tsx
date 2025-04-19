import React from 'react';
import { motion } from 'framer-motion';
import FloatingElements from './FloatingElements';

interface HomeScreenProps {
  onLaunch: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onLaunch }) => {
  return (
    <motion.div 
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <FloatingElements density={80} />
      
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
        <motion.h1 
          className="space-title text-7xl md:text-9xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-300"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          OrbitOS
        </motion.h1>
        
        <motion.p 
          className="font-light text-2xl md:text-3xl text-text-secondary mb-16 tracking-wide"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Keep moving in the right path!
        </motion.p>
        
        <motion.button 
          className="orbit-btn"
          onClick={onLaunch}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0px 0px 15px rgba(255, 255, 255, 0.5)",
          }}
        >
          LAUNCH
        </motion.button>
      </div>
      
      <motion.div 
        className="absolute bottom-10 left-0 right-0 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <p className="text-sm text-text-secondary">Click launch to continue your space journey</p>
      </motion.div>
    </motion.div>
  );
};

export default HomeScreen;