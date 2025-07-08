import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Tooltip from './Tooltip';
import { Collaborator } from '../types';
import CollaboratorAvatar from './CollaboratorAvatar';

interface BrowserWindowProps {
  id?: string; // ID unic pentru key și state persistent
  children: React.ReactNode;
  title: string;
  onClose: () => void;
  icon?: React.ReactNode;
  initialPosition: { x: number; y: number };
  initialSize: { width: number; height: number };
  onStateChange: (pos: {x: number; y: number}, size: {width: number; height: number}) => void;
  collaborators?: Collaborator[];
  onBack?: () => void;
  onForward?: () => void;
  isBackDisabled?: boolean;
  isForwardDisabled?: boolean;
}

const MIN_WIDTH = 480;
const MIN_HEIGHT = 400;

const BrowserWindow = ({ 
  id,
  children, title, onClose, icon, 
  initialPosition, initialSize, onStateChange, 
  collaborators = [], onBack, onForward, 
  isBackDisabled = true, isForwardDisabled = true 
}: BrowserWindowProps) => {
  const [size, setSize] = useState(initialSize);
  const [position, setPosition] = useState(initialPosition);

  const windowRef = useRef<HTMLDivElement>(null);
  const dragInfo = useRef({ isDragging: false, offset: { x: 0, y: 0 } });
  const resizeInfo = useRef({
    isResizing: false,
    handle: '',
    initialPos: { x: 0, y: 0 },
    initialSize: { width: 0, height: 0 },
  });
  
  // Salvează starea la unmount (când se închide fereastra) sau la modificări
  // Debounce pentru a nu suprasolicita localStorage
  useEffect(() => {
    const handler = setTimeout(() => {
      onStateChange(position, size);
    }, 200);

    return () => {
      clearTimeout(handler);
    };
  }, [position, size, onStateChange]);


  const onDragStart = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    dragInfo.current = {
      isDragging: true,
      offset: { x: e.clientX - position.x, y: e.clientY - position.y },
    };
  }, [position]);

  const onResizeStart = useCallback((e: React.MouseEvent<HTMLDivElement>, handle: string) => {
    e.stopPropagation();
    resizeInfo.current = {
      isResizing: true,
      handle,
      initialPos: { x: e.clientX, y: e.clientY },
      initialSize: size,
    };
  }, [size]);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (dragInfo.current.isDragging) {
      const newPos = {
        x: e.clientX - dragInfo.current.offset.x,
        y: e.clientY - dragInfo.current.offset.y,
      };
      setPosition(newPos);
    }

    if (resizeInfo.current.isResizing) {
      const { handle, initialPos, initialSize } = resizeInfo.current;
      const dx = e.clientX - initialPos.x;
      const dy = e.clientY - initialPos.y;

      let newWidth = initialSize.width;
      let newHeight = initialSize.height;
      let newX = position.x;
      let newY = position.y;

      if (handle.includes('r')) newWidth = Math.max(MIN_WIDTH, initialSize.width + dx);
      if (handle.includes('b')) newHeight = Math.max(MIN_HEIGHT, initialSize.height + dy);
      if (handle.includes('l')) {
        const calculatedWidth = initialSize.width - dx;
        if (calculatedWidth > MIN_WIDTH) {
          newWidth = calculatedWidth;
          newX = e.clientX - (initialPos.x - position.x);
        }
      }
      if (handle.includes('t')) {
        const calculatedHeight = initialSize.height - dy;
        if (calculatedHeight > MIN_HEIGHT) {
          newHeight = calculatedHeight;
          newY = e.clientY - (initialPos.y - position.y);
        }
      }
      const newSize = { width: newWidth, height: newHeight };
      const newPos = { x: newX, y: newY };
      setSize(newSize);
      setPosition(newPos);
    }
  }, [position, size]);

  const onMouseUp = useCallback(() => {
    dragInfo.current.isDragging = false;
    resizeInfo.current.isResizing = false;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  const resizeHandles = ['t', 'b', 'l', 'r', 'tl', 'tr', 'bl', 'br'];

  return (
    <motion.div
      key={id}
      ref={windowRef}
      className="absolute bg-white dark:bg-[#2b2b2b] rounded-lg shadow-2xl overflow-hidden border border-gray-400/50 dark:border-gray-700/50 flex flex-col"
      style={{ top: position.y, left: position.x, width: size.width, height: size.height }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {resizeHandles.map(handle => (
        <div
          key={handle}
          className={`absolute z-10 
            ${handle.includes('t') ? 'top-0 h-2 cursor-n-resize' : ''}
            ${handle.includes('b') ? 'bottom-0 h-2 cursor-s-resize' : ''}
            ${handle.includes('l') ? 'left-0 w-2 cursor-w-resize' : ''}
            ${handle.includes('r') ? 'right-0 w-2 cursor-e-resize' : ''}
            ${handle === 'tl' && 'cursor-nw-resize'} ${handle === 'tr' && 'cursor-ne-resize'}
            ${handle === 'bl' && 'cursor-sw-resize'} ${handle === 'br' && 'cursor-se-resize'}
            ${!handle.includes('t') && !handle.includes('b') ? 'h-full top-0' : ''}
            ${!handle.includes('l') && !handle.includes('r') ? 'w-full left-0' : ''}
          `}
          onMouseDown={(e) => onResizeStart(e, handle)}
        />
      ))}
      
      <div
        className="h-10 bg-gray-200 dark:bg-[#3c3c3c] flex items-center justify-between px-2 flex-shrink-0"
        onMouseDown={onDragStart}
        style={{ cursor: 'move' }}
      >
        <div className="flex items-center space-x-2">
          {icon}
          <span className="text-sm text-gray-800 dark:text-gray-200">{title}</span>
        </div>
        <div className="flex items-center space-x-2 z-20">
          {/* Indicator de colaborare */}
          <div className="flex items-center mr-4 space-x-1">
             {collaborators.map(c => <CollaboratorAvatar key={c.email} name={c.name} />)}
          </div>
          <Tooltip content="Minimize">
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-black/10 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-windows-blue">
                <div className="w-3 h-0.5 bg-black dark:bg-white" />
            </button>
          </Tooltip>
           <Tooltip content="Maximize">
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-black/10 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-windows-blue">
                <div className="w-3 h-3 border border-black dark:border-white rounded-sm" />
            </button>
          </Tooltip>
           <Tooltip content="Close">
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded hover:bg-red-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path></svg>
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="h-10 bg-gray-100 dark:bg-gray-800/20 flex items-center px-4 border-b border-gray-200 dark:border-gray-700/50 flex-shrink-0">
        <div className="flex space-x-2 text-gray-500 dark:text-gray-400">
           <button onClick={onBack} disabled={isBackDisabled} className="px-2 rounded hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed">←</button>
           <button onClick={onForward} disabled={isForwardDisabled} className="px-2 rounded hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed">→</button>
           <button className="px-2 rounded hover:bg-black/10 dark:hover:bg-white/10">↻</button>
        </div>
        <div className="flex-grow mx-4">
          <div className="bg-white dark:bg-gray-700 rounded-full px-4 py-1 text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600">
            drive.google.com
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-hidden bg-white dark:bg-[#2b2b2b]">
        {children}
      </div>
    </motion.div>
  );
};

export default BrowserWindow;