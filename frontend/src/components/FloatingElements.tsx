import React, { useEffect, useState } from 'react';

interface FloatingElementsProps {
  density?: number;
}

const FloatingElements: React.FC<FloatingElementsProps> = ({ density = 50 }) => {
  const [elements, setElements] = useState<React.ReactNode[]>([]);
  
  useEffect(() => {
    const generateElements = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const newElements: React.ReactNode[] = [];
      
      // Generate stars
      for (let i = 0; i < density; i++) {
        const size = Math.random() * 3 + 1;
        const x = Math.random() * windowWidth;
        const y = Math.random() * windowHeight;
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 5;
        const opacity = Math.random() * 0.5 + 0.3;
        
        newElements.push(
          <div 
            key={`star-${i}`}
            className="star"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${x}px`,
              top: `${y}px`,
              '--duration': `${duration}s`,
              '--delay': `${delay}s`,
              '--opacity': opacity,
            } as React.CSSProperties}
          />
        );
      }
      
      // Generate asteroids
      for (let i = 0; i < density / 10; i++) {
        const size = Math.random() * 15 + 5;
        const x = Math.random() * windowWidth;
        const y = Math.random() * windowHeight;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        const distanceX = (Math.random() - 0.5) * windowWidth * 0.5;
        const distanceY = (Math.random() - 0.5) * windowHeight * 0.5;
        
        newElements.push(
          <div 
            key={`asteroid-${i}`}
            className="asteroid"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${x}px`,
              top: `${y}px`,
              '--duration': `${duration}s`,
              '--delay': `${delay}s`,
              '--distance-x': `${distanceX}px`,
              '--distance-y': `${distanceY}px`,
            } as React.CSSProperties}
          />
        );
      }
      
      // Generate satellites
      for (let i = 0; i < density / 20; i++) {
        const x = Math.random() * windowWidth;
        const y = Math.random() * windowHeight;
        const duration = Math.random() * 30 + 20;
        const delay = Math.random() * 10;
        const endX = (Math.random() - 0.5) * windowWidth * 0.8;
        const endY = (Math.random() - 0.5) * windowHeight * 0.8;
        
        newElements.push(
          <div 
            key={`satellite-${i}`}
            className="satellite"
            style={{
              left: `${x}px`,
              top: `${y}px`,
              '--duration': `${duration}s`,
              '--delay': `${delay}s`,
              '--start-x': '0px',
              '--start-y': '0px',
              '--end-x': `${endX}px`,
              '--end-y': `${endY}px`,
            } as React.CSSProperties}
          />
        );
      }
      
      setElements(newElements);
    };
    
    generateElements();
    
    const handleResize = () => {
      generateElements();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [density]);
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {elements}
    </div>
  );
};

export default FloatingElements;