import React from 'react';
import { ListViewIcon, GridViewIcon } from '../constants';
import Tooltip from './Tooltip';

type ViewMode = 'list' | 'grid';

interface ViewToggleProps {
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
}

/**
 * Un comutator pentru a schimba între vizualizarea de tip listă și grilă.
 */
const ViewToggle = ({ viewMode, onViewModeChange }: ViewToggleProps) => (
    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
        <Tooltip content="List view">
            <button 
                onClick={() => onViewModeChange('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-google-blue dark:bg-blue-500/20' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/30'} rounded-l-md focus:outline-none focus:ring-2 focus:ring-google-blue`}
                aria-label="Switch to list view"
            >
                <ListViewIcon className="w-5 h-5" />
            </button>
        </Tooltip>
        <Tooltip content="Grid view">
            <button 
                onClick={() => onViewModeChange('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-google-blue dark:bg-blue-500/20' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/30'} rounded-r-md focus:outline-none focus:ring-2 focus:ring-google-blue`}
                 aria-label="Switch to grid view"
            >
                <GridViewIcon className="w-5 h-5" />
            </button>
        </Tooltip>
    </div>
);

export default ViewToggle;
