import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface CollaboratorCursorProps {
  name: string;
}

const cursorColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#F7D842', '#A9A9A9'];

const getColorForName = (name: string) => {
    const charCodeSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return cursorColors[charCodeSum % cursorColors.length];
};

/**
 * Simulează cursorul unui colaborator care se mișcă aleatoriu
 * în interiorul containerului părinte.
 */
const CollaboratorCursor = ({ name }: CollaboratorCursorProps) => {
  const [position, setPosition] = useState({ top: 50, left: 50 });
  const cursorRef = useRef<HTMLDivElement>(null);
  const color = getColorForName(name);

  useEffect(() => {
    const moveCursor = () => {
      if (cursorRef.current) {
        const parent = cursorRef.current.parentElement;
        if (parent) {
          const parentRect = parent.getBoundingClientRect();
          const newTop = Math.random() * (parentRect.height - 40); // -40 pentru a nu ieși complet
          const newLeft = Math.random() * (parentRect.width - 100);
          setPosition({ top: newTop, left: newLeft });
        }
      }
    };

    const intervalId = setInterval(moveCursor, 2000 + Math.random() * 1000); // Mișcare la intervale neregulate

    return () => clearInterval(intervalId);
  }, []);

  return (
    <motion.div
      ref={cursorRef}
      className="absolute flex items-center pointer-events-none z-30"
      initial={{ top: '50%', left: '50%' }}
      animate={{ top: `${position.top}px`, left: `${position.left}px` }}
      transition={{ duration: 1.5, ease: 'easeInOut' }}
    >
      {/* Bara verticală a cursorului */}
      <div style={{ backgroundColor: color, height: '20px', width: '2px' }} />
      {/* Eticheta cu numele */}
      <div 
        className="text-white text-xs px-2 py-1 rounded"
        style={{ backgroundColor: color, transform: 'translateY(-100%)' }}
      >
        {name}
      </div>
    </motion.div>
  );
};

export default CollaboratorCursor;