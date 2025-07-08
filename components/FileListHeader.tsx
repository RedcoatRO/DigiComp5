import React from 'react';
import { SortKey, SortDirection } from '../types';
import { ArrowUpIcon, ArrowDownIcon } from '../constants';

interface SortConfig {
    key: SortKey;
    direction: SortDirection;
}

interface FileListHeaderProps {
    sortConfig: SortConfig;
    onSort: (key: SortKey) => void;
}

/**
 * Componenta pentru antetul listei de fișiere.
 * Permite sortarea după diverse criterii.
 */
const FileListHeader = ({ sortConfig, onSort }: FileListHeaderProps) => {
    // Afișează o săgeată pentru a indica direcția de sortare
    const renderSortArrow = (key: SortKey) => {
        if (sortConfig.key !== key) return null;
        if (sortConfig.direction === 'ascending') {
            return <ArrowUpIcon className="w-4 h-4 ml-1" />;
        }
        return <ArrowDownIcon className="w-4 h-4 ml-1" />;
    };
    
    // Definirea coloanelor și a lățimii lor relative
    const columns: { key: SortKey; label: string; className: string }[] = [
        { key: 'name', label: 'Name', className: 'w-1/2' },
        { key: 'owner', label: 'Owner', className: 'w-1/4' },
        { key: 'modified', label: 'Last modified', className: 'w-1/4' },
    ];

    return (
        <div className="flex items-center w-full p-2 border-b border-gray-200 dark:border-gray-700/50 text-xs font-semibold text-gray-600 dark:text-gray-400 sticky top-0 bg-white dark:bg-[#2b2b2b] z-10">
            {columns.map(({ key, label, className }) => (
                 <button 
                    key={key} 
                    onClick={() => onSort(key)} 
                    className={`flex items-center px-2 ${className} hover:bg-gray-100 dark:hover:bg-gray-700/30 rounded-md py-1 focus:outline-none focus:ring-2 focus:ring-google-blue`}
                 >
                    {label}
                    {renderSortArrow(key)}
                </button>
            ))}
        </div>
    );
};

export default FileListHeader;
