import React from 'react';
import { FolderIcon } from '../constants';

/**
 * Conținutul simulat pentru fereastra File Explorer.
 * Afișează o listă de foldere comune din sistemul de operare.
 */
const FileExplorerWindowContent = () => {
    const folders = [
        'Desktop',
        'Documents',
        'Downloads',
        'Music',
        'Pictures',
        'Videos',
    ];

    return (
        <div className="p-4 h-full bg-white dark:bg-[#2b2b2b] text-gray-800 dark:text-gray-200 overflow-y-auto">
            <h1 className="text-lg font-semibold mb-4">This PC</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {folders.map(folderName => (
                    <div key={folderName} className="flex flex-col items-center p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 cursor-pointer">
                        <FolderIcon className="w-16 h-16" />
                        <span className="mt-2 text-sm text-center">{folderName}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FileExplorerWindowContent;
