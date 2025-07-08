import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

/**
 * O componentă reutilizabilă pentru a afișa un tooltip informativ la hover.
 * Folosește Framer Motion pentru o animație subtilă.
 */
const Tooltip = ({ children, content }: TooltipProps) => {
  const [isHovered, setHovered] = useState(false);

  return (
    <div 
      className="relative flex items-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-max max-w-xs z-50 px-3 py-1.5 text-sm font-medium text-white bg-gray-900 rounded-md shadow-sm dark:bg-gray-700"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;