import React, { useState } from 'react';
import { FileItem } from '../types';
import { DocIcon, SheetIcon, SlideIcon, FolderIcon } from '../constants';

const fileIcons: Record<string, React.ReactNode> = {
  doc: <DocIcon className="w-6 h-6" />,
  sheet: <SheetIcon className="w-6 h-6" />,
  slide: <SlideIcon className="w-6 h-6" />,
  folder: <FolderIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />,
};

interface DetailsPanelProps {
  selectedFiles: FileItem[];
  onLogActivity: (fileIds: string[], message: string) => void;
  onShare: () => void;
  hintTarget: string | null;
}

const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export const DetailsPanel = ({ selectedFiles, onLogActivity, onShare, hintTarget }: DetailsPanelProps) => {
  const [activeTab, setActiveTab] = useState<'details' | 'activity'>('details');
  const [comment, setComment] = useState('');

  const handleCommentSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && comment.trim()) {
        onLogActivity(selectedFiles.map(f => f.id), `Commented: "${comment.trim()}"`);
        setComment('');
    }
  }
  
  if (selectedFiles.length === 0) {
    return (
      <aside className="w-80 border-l border-gray-200 dark:border-gray-700/50 p-4 flex-shrink-0 flex-col space-y-4 hidden lg:flex overflow-y-auto">
        <div className="text-gray-500 dark:text-gray-400 text-center mt-10">Select an item to see details</div>
      </aside>
    );
  }

  const firstFile = selectedFiles[0];
  const isHinted = hintTarget === 'share-button';

  return (
    <aside className="w-80 border-l border-gray-200 dark:border-gray-700/50 flex-shrink-0 flex-col space-y-4 hidden lg:flex">
        <div className="p-4 flex-grow overflow-y-auto">
            <button
                onClick={onShare}
                className={`w-full mb-4 px-4 py-2 bg-google-blue text-white rounded-md hover:bg-google-blue-dark transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-google-blue
                    ${isHinted ? 'animate-pulse-strong' : ''}
                `}
            >
                Share
            </button>
        {selectedFiles.length === 1 ? (
            <>
            <h3 className="font-bold text-lg break-words">{firstFile.name}</h3>
             <div className="flex border-b border-gray-200 dark:border-gray-700 mt-4">
                <button onClick={() => setActiveTab('details')} className={`py-2 px-4 font-semibold ${activeTab === 'details' ? 'border-b-2 border-google-blue text-google-blue' : 'text-gray-500'}`}>Details</button>
                <button onClick={() => setActiveTab('activity')} className={`py-2 px-4 font-semibold ${activeTab === 'activity' ? 'border-b-2 border-google-blue text-google-blue' : 'text-gray-500'}`}>Activity</button>
            </div>
            {activeTab === 'details' ? (
                <div className="space-y-4 mt-4 text-sm text-gray-700 dark:text-gray-300">
                     {firstFile.previewUrl && (
                        <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            <img src={firstFile.previewUrl} alt={`Preview of ${firstFile.name}`} className="max-w-full max-h-full object-contain rounded-md" />
                        </div>
                     )}
                     <h4 className="font-semibold text-base">File details</h4>
                     <div className="space-y-1">
                         <p><span className="font-medium text-gray-500 dark:text-gray-400 w-20 inline-block">Type:</span> {firstFile.type.charAt(0).toUpperCase() + firstFile.type.slice(1)}</p>
                         <p><span className="font-medium text-gray-500 dark:text-gray-400 w-20 inline-block">Size:</span> {new Intl.NumberFormat().format(firstFile.size)} bytes</p>
                         <p><span className="font-medium text-gray-500 dark:text-gray-400 w-20 inline-block">Owner:</span> {firstFile.owner}</p>
                         <p><span className="font-medium text-gray-500 dark:text-gray-400 w-20 inline-block">Modified:</span> {new Date(firstFile.modified).toLocaleDateString()}</p>
                     </div>
                </div>
            ) : (
                <div className="space-y-4 mt-4">
                   {firstFile.activity.map((log, index) => (
                       <div key={index} className="flex space-x-3">
                           <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 flex-shrink-0">
                                {firstFile.owner.charAt(0).toUpperCase()}
                           </div>
                           <div>
                               <p className="text-sm text-gray-800 dark:text-gray-200 break-words">{log.action}</p>
                               <p className="text-xs text-gray-500 dark:text-gray-400">{formatRelativeTime(log.date)}</p>
                           </div>
                       </div>
                   ))}
                </div>
            )}
            </>
        ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="relative w-24 h-24">
                    {selectedFiles.slice(0, 3).map((file, index) => (
                        <div key={file.id} className={`absolute w-16 h-16 ${index === 0 ? 'top-0 left-4' : index === 1 ? 'bottom-0 left-0' : 'bottom-0 right-0'}`}>
                         {fileIcons[file.type]}
                        </div>
                    ))}
                </div>
                <h3 className="font-bold text-lg mt-4">{selectedFiles.length} items selected</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total size: {new Intl.NumberFormat().format(selectedFiles.reduce((sum, f) => sum + f.size, 0))} bytes</p>
            </div>
        )}
        </div>
        {/* Câmpul pentru comentarii */}
        {selectedFiles.length === 1 && activeTab === 'activity' && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700/50 flex-shrink-0">
                <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={handleCommentSubmit}
                    placeholder="Add a comment..."
                    className="w-full bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-google-blue outline-none"
                />
            </div>
        )}
    </aside>
  );
};