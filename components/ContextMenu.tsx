import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { ContextMenuContext } from '../contexts/ContextMenuContext';

interface ContextMenuProps {
  x: number;
  y: number;
  options: { label:string; action: () => void }[];
}

/**
 * Componenta pentru meniul contextual.
 * Se afișează la coordonatele specificate, conține opțiunile primite,
 * și are stiluri de focus pentru accesibilitate.
 */
const ContextMenu = ({ x, y, options }: ContextMenuProps) => {
  const { hideContextMenu } = useContext(ContextMenuContext);

  const menuVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.1 } },
  };

  return (
    <motion.div
      className="absolute z-50 w-48 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-md rounded-md shadow-lg border border-gray-300/50 dark:border-gray-700/50 py-1"
      style={{ top: y, left: x }}
      variants={menuVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <ul role="menu">
        {options.map((option, index) => (
          <li key={index} role="presentation">
            <button
              role="menuitem"
              onClick={() => {
                option.action();
                hideContextMenu();
              }}
              className="w-full text-left px-3 py-1.5 text-sm text-gray-800 dark:text-gray-200 hover:bg-google-blue hover:text-white dark:hover:bg-google-blue focus-visible:bg-google-blue focus-visible:text-white focus-visible:outline-none"
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default ContextMenu;