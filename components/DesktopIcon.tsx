import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { ContextMenuContext } from '../contexts/ContextMenuContext';

interface DesktopIconProps {
  icon: React.ReactNode;
  label: string;
  onDoubleClick: () => void;
  contextMenuOptions: { label: string; action: () => void }[];
  badgeCount?: number;
}

/**
 * Componenta pentru o iconiță de pe desktop.
 * Gestionează dublu-click pentru a deschide și click-dreapta pentru meniul contextual.
 * Include animații de hover și tap și stiluri de focus pentru accesibilitate.
 * Poate afișa o insignă de notificare.
 */
const DesktopIcon = ({ icon, label, onDoubleClick, contextMenuOptions, badgeCount = 0 }: DesktopIconProps) => {
  const { showContextMenu } = useContext(ContextMenuContext);

  const handleContextMenu = (e: React.MouseEvent) => {
    showContextMenu(e, contextMenuOptions);
  };

  return (
    <motion.button
      onDoubleClick={onDoubleClick}
      onContextMenu={handleContextMenu}
      className="relative flex flex-col items-center justify-center space-y-1 w-24 h-24 rounded-md hover:bg-white/10 focus-visible:bg-white/20 outline-none p-2 text-white transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-white/50"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon}
      <span className="text-xs text-center" style={{ textShadow: '1px 1px 2px black' }}>{label}</span>
      {badgeCount > 0 && (
        <div className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white/50">
            {badgeCount}
        </div>
      )}
    </motion.button>
  );
};

export default DesktopIcon;