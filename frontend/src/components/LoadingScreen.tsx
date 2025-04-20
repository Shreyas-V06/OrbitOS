import React from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const handleGoogleLogin = () => {
    onLoadingComplete();
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-[#0B0B15] flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Saturn Background */}
      <motion.div 
        className="absolute right-0 w-[50%] aspect-square bg-gradient-to-br from-[#A97C50] to-[#6B4423] rounded-full translate-x-1/3"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.6 }}
        transition={{ duration: 1.5 }}
      >
        <motion.div 
          className="absolute inset-0 bg-[#0B0B15] opacity-40"
          style={{ 
            maskImage: 'radial-gradient(circle at 50% 50%, transparent 40%, black 60%)',
            WebkitMaskImage: 'radial-gradient(circle at 50% 50%, transparent 40%, black 60%)'
          }}
        />
        {/* Saturn's Ring */}
        <motion.div 
          className="absolute inset-0 border-t-[60px] border-[#D4A976] opacity-60 transform -rotate-12"
          style={{ 
            borderRadius: '100%',
            filter: 'blur(30px)'
          }}
        />
      </motion.div>

      {/* Dynamic Space Elements */}
      {Array.from({ length: 80 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Spaceship
      <motion.div
        className="absolute w-16 h-8 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full transform -rotate-45"
        style={{
          left: '20%',
          top: '30%',
        }}
        animate={{
          x: [0, 200, 0],
          y: [0, -100, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="absolute -right-2 w-4 h-4 bg-orange-500 rounded-full blur-sm" />
      </motion.div> */}

      {/* Login Form */}
      <motion.div 
        className="relative z-10 w-full max-w-md p-8 rounded-2xl backdrop-blur-xl bg-white/5"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="flex items-center justify-center mb-8">
          <h2 className="text-3xl font-bold space-title">OrbitOS</h2>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center space-x-2 transition-colors border border-white/20"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          <span>Sign in with Google</span>
        </button>
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;