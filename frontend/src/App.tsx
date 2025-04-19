import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import LoadingScreen from './components/LoadingScreen';
import HomeScreen from './components/HomeScreen';
import MainLayout from './components/MainLayout';

function App() {
  const [appState, setAppState] = useState<'loading' | 'home' | 'main'>('loading');
  
  useEffect(() => {
    // You could add actual initialization logic here
    const timer = setTimeout(() => {
      setAppState('home');
    }, 5000); // 5 seconds loading screen
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleLoadingComplete = () => {
    setAppState('home');
  };
  
  const handleLaunch = () => {
    setAppState('main');
  };
  
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <AnimatePresence mode="wait">
        {appState === 'loading' && (
          <LoadingScreen key="loading" onLoadingComplete={handleLoadingComplete} />
        )}
        
        {appState === 'home' && (
          <HomeScreen key="home" onLaunch={handleLaunch} />
        )}
        
        {appState === 'main' && (
          <MainLayout key="main" />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;