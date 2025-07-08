import React, { useState, useEffect, useRef } from 'react';
import { FileItem } from '../types';
import { DocIcon, SheetIcon, SlideIcon, FolderIcon, StarIcon, StarFilledIcon } from '../constants';

const fileIcons: Record<string, React.ReactNode> = {
  doc: <DocIcon className="w-16 h-16" />,
  sheet: <SheetIcon className="w-16 h-16" />,
  slide: <SlideIcon className="w-16 h-16" />,
  folder: <FolderIcon className="w-16 h-16 text-gray-700 dark:text-gray-300" />,
};

interface FileGridItemProps {
    item: FileItem;
    isSelected: boolean;
    isRenaming: boolean;
    onSelect: (id: string, e: React.MouseEvent) => void;
    onDoubleClick: (item: FileItem) => void;
    onContextMenu: (e: React.MouseEvent, item: FileItem) => void;
    onRename: (id: string, newName: string) => void;
    onCancelRename: () => void;
    onStar: (id: string) => void;
    hintTarget: string | null;
}

const FileGridItem = ({ item, isSelected, isRenaming, onSelect, onDoubleClick, onContextMenu, onRename, onCancelRename, onStar, hintTarget }: FileGridItemProps) => {
    const [name, setName] = useState(item.name);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isRenaming) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isRenaming]);

    const handleRenameSubmit = () => {
        if (name.trim() && name.trim() !== item.name) {
            onRename(item.id, name.trim());
        } else {
            onCancelRename();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleRenameSubmit();
        else if (e.key === 'Escape') {
            onCancelRename();
            setName(item.name);
        }
    };
    
    const handleStarClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onStar(item.id);
    };
    
    const isHinted = hintTarget === `file-${item.id}`;

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={(e) => onSelect(item.id, e)}
            onDoubleClick={() => onDoubleClick(item)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !isRenaming) onDoubleClick(item)
            }}
            onContextMenu={(e) => onContextMenu(e, item)}
            className={`relative flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer outline-none transition-colors duration-150 h-40 overflow-hidden
              ${isSelected ? 'bg-blue-100 dark:bg-blue-500/20' : 'hover:bg-gray-100 dark:hover:bg-gray-700/30'}
              focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-google-blue dark:focus-visible:ring-offset-gray-800
              ${isHinted ? 'animate-pulse-strong ring-2 ring-google-blue' : ''}
              `}
        >
            {/* Bara de progres pentru încărcare */}
            {item.isUploading && (
                <div className="absolute top-0 left-0 w-full h-full bg-blue-200/50 dark:bg-blue-800/50" style={{ transform: `translateY(${100 - (item.uploadProgress ?? 0)}%)` }} />
            )}

            <button onClick={handleStarClick} className="absolute top-2 right-2 text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 p-1 rounded-full z-10 focus:outline-none focus:ring-1 focus:ring-yellow-500">
                {item.isStarred ? <StarFilledIcon className="w-5 h-5 text-yellow-500" /> : <StarIcon className="w-5 h-5" />}
            </button>
            <div className="flex-grow flex items-center justify-center">
                {fileIcons[item.type]}
            </div>
            {isRenaming ? (
                 <input
                    ref={inputRef}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={handleRenameSubmit}
                    onKeyDown={handleKeyDown}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full text-center bg-white dark:bg-gray-800 border border-google-blue rounded-md px-1 py-0.5 outline-none shadow-md mt-2 text-sm z-10"
                />
            ) : (
                <span className="relative w-full text-center text-sm mt-2 truncate">{item.name}</span>
            )}
        </div>
    );
}

export default FileGridItem;