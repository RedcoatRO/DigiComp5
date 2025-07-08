import React, { useState, useEffect, useRef } from 'react';
import { FileItem } from '../types';
import { DocIcon, SheetIcon, SlideIcon, FolderIcon, StarIcon, StarFilledIcon } from '../constants';

const fileIcons: Record<string, React.ReactNode> = {
  doc: <DocIcon className="w-6 h-6" />,
  sheet: <SheetIcon className="w-6 h-6" />,
  slide: <SlideIcon className="w-6 h-6" />,
  folder: <FolderIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />,
};

interface FileListItemProps {
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

const FileListItem = ({ item, isSelected, isRenaming, onSelect, onDoubleClick, onContextMenu, onRename, onCancelRename, onStar, hintTarget }: FileListItemProps) => {
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
        e.stopPropagation(); // Previne selectarea fișierului
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
                if(e.key === 'Enter' && !isRenaming) onDoubleClick(item)
            }}
            onContextMenu={(e) => onContextMenu(e, item)}
            className={`flex items-center w-full rounded-md cursor-pointer outline-none transition-colors duration-150 relative
              ${isSelected ? 'bg-blue-100 dark:bg-blue-500/20' : 'hover:bg-gray-100 dark:hover:bg-gray-700/30'}
              focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-google-blue dark:focus-visible:ring-offset-gray-800
              ${isHinted ? 'animate-pulse-strong ring-2 ring-google-blue' : ''}
              `}
        >
            {/* Bara de progres pentru încărcare */}
            {item.isUploading && (
                <div className="absolute top-0 left-0 h-full bg-blue-200/50 dark:bg-blue-800/50 rounded-md" style={{ width: `${item.uploadProgress}%` }} />
            )}
            
            <div className="relative flex items-center space-x-4 p-2 w-1/2 flex-shrink-0">
                {fileIcons[item.type]}
                {isRenaming ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={handleRenameSubmit}
                        onKeyDown={handleKeyDown}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full bg-white dark:bg-gray-800 border border-google-blue rounded-md px-2 py-1 outline-none shadow-md z-10"
                    />
                ) : (
                    <span className="truncate">{item.name}</span>
                )}
            </div>
            <div className="w-1/4 px-2 truncate text-gray-600 dark:text-gray-400 flex items-center">
                <button onClick={handleStarClick} className="mr-2 text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 p-1 rounded-full focus:outline-none focus:ring-1 focus:ring-yellow-500">
                    {item.isStarred ? <StarFilledIcon className="w-4 h-4 text-yellow-500" /> : <StarIcon className="w-4 h-4" />}
                </button>
                {item.owner}
            </div>
            <div className="w-1/4 px-2 truncate text-gray-600 dark:text-gray-400">{new Date(item.modified).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
    );
}

export default FileListItem;