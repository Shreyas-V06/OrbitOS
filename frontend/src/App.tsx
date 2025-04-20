import { useState} from 'react';
import { AnimatePresence } from 'framer-motion';
import LoadingScreen from './components/LoadingScreen';
import HomeScreen from './components/HomeScreen';
import MainLayout from './components/MainLayout';

function App() {
  const [appState, setAppState] = useState<'loading' | 'home' | 'main'>('loading');
  
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