import React, { useState, useCallback, useContext, useMemo, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FileItem, UserPermission, Role, SortKey, SortDirection, Collaborator, Email } from '../types';
import ShareModal from './ShareModal';
import { ContextMenuContext } from '../contexts/ContextMenuContext';
import { useToast } from '../contexts/ToastContext';
import Breadcrumbs from './Breadcrumbs';
import NewItemMenu from './NewItemMenu';
import FileListItem from './FileListItem';
import FileGridItem from './FileGridItem';
import ViewToggle from './ViewToggle';
import FileListHeader from './FileListHeader';
import FilePreviewModal from './FilePreviewModal';
import StorageIndicator from './StorageIndicator';
import { DetailsPanel } from './DetailsPanel';

interface GoogleDriveProps {
    // State lifted to App
    files: FileItem[];
    setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>;
    sharedWith: UserPermission[];
    setSharedWith: React.Dispatch<React.SetStateAction<UserPermission[]>>;
    onCopyRestrictedLink: () => void;
    // Gamification
    hintTarget: string | null;
    // Regular props
    onShowVersionHistory: (file: FileItem) => void;
    onCollaboratorsChange: React.Dispatch<React.SetStateAction<Collaborator[]>>;
    currentFolderId: string | null;
    onNavigate: (folderId: string | null) => void;
    onAddEmail: (email: Omit<Email, 'id' | 'date' | 'read'>) => void;
}

const GoogleDrive = ({ 
    files, setFiles, sharedWith, setSharedWith, onCopyRestrictedLink,
    hintTarget,
    onShowVersionHistory, onCollaboratorsChange, currentFolderId, onNavigate, onAddEmail 
}: GoogleDriveProps) => {
  const [recentFileIds, setRecentFileIds] = useState<string[]>([]);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [lastClickedId, setLastClickedId] = useState<string | null>(null);
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<'drive' | 'shared' | 'trash' | 'recent' | 'starred'>('drive');
  const [searchQuery, setSearchQuery] = useState('');
  const [renamingFileId, setRenamingFileId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'name', direction: 'ascending' });
  const [previewingFile, setPreviewingFile] = useState<FileItem | null>(null);

  const { showContextMenu, hideContextMenu } = useContext(ContextMenuContext);
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;
      if (e.key === 'Delete' && selectedFileIds.length > 0) handleDeleteItems();
      if (e.key === 'F2' && selectedFileIds.length === 1) {
        e.preventDefault();
        setRenamingFileId(selectedFileIds[0]);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedFileIds, files]);


  // Resetare căutare la schimbarea vizualizării sau folderului
  useEffect(() => {
    setSearchQuery('');
  }, [activeView, currentFolderId]);

  const logActivity = useCallback((fileIds: string[], action: string) => {
    const now = new Date().toISOString();
    setFiles(currentFiles => 
      currentFiles.map(file => 
        fileIds.includes(file.id) 
          ? { ...file, activity: [{ action, date: now }, ...file.activity] }
          : file
      )
    );
  }, [setFiles]);

  const handleItemsAction = (ids: string[], update: (file: FileItem) => Partial<FileItem>, successMessage: string) => {
    setFiles(currentFiles => currentFiles.map(file => ids.includes(file.id) ? { ...file, ...update(file) } : file));
    addToast(successMessage, 'info');
    hideContextMenu();
  };
  
  const handleDeleteItems = () => handleItemsAction(selectedFileIds, () => ({ isInTrash: true, modified: new Date().toISOString() }), `${selectedFileIds.length} item(s) moved to Trash.`);
  const handleRestoreItems = () => handleItemsAction(selectedFileIds, () => ({ isInTrash: false, modified: new Date().toISOString() }), `${selectedFileIds.length} item(s) restored.`);
  const handleDeleteForever = () => {
    setFiles(currentFiles => currentFiles.filter(f => !selectedFileIds.includes(f.id)));
    addToast(`${selectedFileIds.length} item(s) deleted forever.`, 'warning');
    hideContextMenu();
    setSelectedFileIds([]);
  };
  const handleStarItems = () => {
    const isStarring = files.find(f => f.id === selectedFileIds[0])?.isStarred === false;
    handleItemsAction(selectedFileIds, (f) => ({ isStarred: !f.isStarred }), `Toggled star on ${selectedFileIds.length} item(s).`);
    logActivity(selectedFileIds, isStarring ? 'Starred item' : 'Unstarred item');
  };
  
  const handleCopyItems = () => {
    const copies: FileItem[] = [];
    selectedFileIds.forEach(id => {
      const original = files.find(f => f.id === id);
      if (original) {
        const newId = Date.now().toString() + Math.random();
        const copy: FileItem = {
          ...original,
          id: newId,
          name: `Copy of ${original.name}`,
          modified: new Date().toISOString(),
          activity: [{ action: 'Created as a copy', date: new Date().toISOString() }]
        };
        copies.push(copy);
      }
    });
    setFiles(prev => [...prev, ...copies]);
    addToast(`Created ${copies.length} copy/copies.`, 'success');
    hideContextMenu();
  };

  const handleRenameFile = (fileId: string, newName: string) => {
    setFiles(files.map(f => (f.id === fileId ? { ...f, name: newName, modified: new Date().toISOString() } : f)));
    addToast('File renamed', 'success');
    logActivity([fileId], `Renamed to "${newName}"`);
    setRenamingFileId(null);
  };
  const handleCancelRename = () => setRenamingFileId(null);

  const handleCreateFolder = () => {
    const folderName = prompt('Enter folder name:');
    if (folderName) {
        const newFolder: FileItem = {
            id: Date.now().toString(),
            name: folderName,
            type: 'folder',
            owner: 'utilizator@gmail.com',
            modified: new Date().toISOString(),
            parentId: currentFolderId,
            isInTrash: false,
            size: 0,
            isStarred: false,
            activity: [{ action: 'Created', date: new Date().toISOString() }],
        };
        setFiles(prev => [...prev, newFolder]);
        logActivity([newFolder.id], 'Created');
        addToast('Folder created', 'success');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newFileId = Date.now().toString();
      const newFile: FileItem = {
        id: newFileId,
        name: file.name,
        type: 'doc',
        owner: 'utilizator@gmail.com',
        modified: new Date().toISOString(),
        parentId: currentFolderId,
        isInTrash: false,
        size: file.size,
        isStarred: false,
        activity: [{ action: 'Created', date: new Date().toISOString() }],
        previewUrl: 'https://i.imgur.com/4z1q2h1.png',
        isUploading: true,
        uploadProgress: 0,
      };
      setFiles(prev => [...prev, newFile]);
      const interval = setInterval(() => {
        setFiles(currentFiles => currentFiles.map(f => {
          if (f.id === newFileId && f.uploadProgress! < 100) {
            const newProgress = f.uploadProgress! + 10;
            if (newProgress >= 100) {
              clearInterval(interval);
              addToast('File uploaded successfully', 'success');
              logActivity([newFileId], 'Uploaded item');
              return { ...f, uploadProgress: 100, isUploading: false };
            }
            return { ...f, uploadProgress: newProgress };
          }
          return f;
        }));
      }, 200);
    }
    if(fileInputRef.current) fileInputRef.current.value = "";
  };
  
  const handleSort = (key: SortKey) => setSortConfig(prev => ({ key, direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending' }));
  
  const selectedFiles = useMemo(() => files.filter(f => selectedFileIds.includes(f.id)), [files, selectedFileIds]);
  const activeCollaborators = useMemo(() => sharedWith
      .filter(u => u.role === Role.Editor)
      .map(u => ({ email: u.email, name: u.email.split('@')[0] })),
    [sharedWith]
  );

  const displayedItems = useMemo(() => {
    let items: FileItem[] = [...files];
    if (searchQuery) return items.filter(item => !item.isInTrash && item.name.toLowerCase().includes(searchQuery.toLowerCase()));

    switch (activeView) {
      case 'trash': items = items.filter(item => item.isInTrash); break;
      case 'shared': items = items.filter(item => !item.isInTrash && item.owner !== 'utilizator@gmail.com'); break;
      case 'starred': items = items.filter(item => !item.isInTrash && item.isStarred); break;
      case 'recent': 
        const recentFilesMap = new Map(items.map(f => [f.id, f]));
        items = recentFileIds.map(id => recentFilesMap.get(id)).filter(Boolean) as FileItem[];
        break;
      case 'drive':
      default: items = items.filter(item => !item.isInTrash && item.parentId === currentFolderId); break;
    }
    
    return items.sort((a, b) => {
      if (a.type === 'folder' && b.type !== 'folder') return -1;
      if (a.type !== 'folder' && b.type === 'folder') return 1;
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];
      const comparison = typeof valA === 'string' && typeof valB === 'string' ? valA.localeCompare(valB) : (valA > valB ? 1 : -1);
      return sortConfig.direction === 'ascending' ? comparison : -comparison;
    });
  }, [files, activeView, currentFolderId, searchQuery, sortConfig, recentFileIds]);

  const handleFileSelect = useCallback((id: string, e: React.MouseEvent) => {
    setRenamingFileId(null);
    logActivity([id], "Selected"); // Log selection for gamification
    if (e.shiftKey && lastClickedId) {
      const lastIndex = displayedItems.findIndex(item => item.id === lastClickedId);
      const currentIndex = displayedItems.findIndex(item => item.id === id);
      const start = Math.min(lastIndex, currentIndex);
      const end = Math.max(lastIndex, currentIndex);
      const rangeIds = displayedItems.slice(start, end + 1).map(item => item.id);
      setSelectedFileIds(rangeIds);
    } else if (e.ctrlKey || e.metaKey) {
      setSelectedFileIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
      setLastClickedId(id);
    } else {
      setSelectedFileIds([id]);
      setLastClickedId(id);
    }
  }, [displayedItems, lastClickedId, logActivity]);
  
  const handleDoubleClick = (item: FileItem) => {
    if (item.type === 'folder') {
      onNavigate(item.id);
    } else {
      setPreviewingFile(item);
      setRecentFileIds(prev => [item.id, ...prev.filter(id => id !== item.id)]);
      logActivity([item.id], 'Opened item');
    }
  };
  
  const openShareModal = useCallback(() => {
    hideContextMenu();
    if (selectedFileIds.length > 0) setShareModalOpen(true);
  }, [selectedFileIds.length, hideContextMenu]);

  const handleShare = useCallback((users: UserPermission[], message: string) => {
    setSharedWith(prev => {
        const newUsers = users.filter(u => !prev.some(p => p.email === u.email));
        return [...prev, ...newUsers];
    });
    // Adaugă editorii la lista de colaboratori activi
    const editors = users.filter(u => u.role === Role.Editor);
    onCollaboratorsChange(prev => {
        const newCollaborators = editors
          .map(e => ({ email: e.email, name: e.email === 'colegB@gmail.com' ? 'Coleg B' : e.email === 'colegA@gmail.com' ? 'Coleg A' : 'Unknown' }))
          .filter(c => !prev.some(p => p.email === c.email));
        return [...prev, ...newCollaborators];
    });
    logActivity(selectedFileIds, `Shared with ${users.map(u => u.email).join(', ')}`);
    onAddEmail({
        to: users.map(u => u.email),
        subject: `Invitation to collaborate on: ${selectedFiles.map(f => f.name).join(', ')}`,
        body: message,
    });
  }, [selectedFileIds, logActivity, setSharedWith, onCollaboratorsChange, onAddEmail, selectedFiles]);

  const handleTransferOwnership = (newOwnerEmail: string) => {
    if (selectedFileIds.length !== 1) return;
    const fileId = selectedFileIds[0];
    const originalOwner = files.find(f => f.id === fileId)?.owner;
    
    setFiles(currentFiles => currentFiles.map(file => 
        file.id === fileId ? { ...file, owner: newOwnerEmail } : file
    ));
    logActivity([fileId], `Transferred ownership from ${originalOwner} to ${newOwnerEmail}`);
    addToast(`Ownership transferred to ${newOwnerEmail}`, 'success');
  };
  
  const handleFileContextMenu = (e: React.MouseEvent, item: FileItem) => {
    if (!selectedFileIds.includes(item.id)) {
        handleFileSelect(item.id, e);
    }

    let options = [];
    if (activeView === 'trash') {
        options = [
            { label: 'Restore', action: handleRestoreItems },
            { label: 'Delete forever', action: handleDeleteForever }
        ];
    } else {
        options = [
            { label: 'Preview', action: () => handleDoubleClick(item), disabled: item.type === 'folder' },
            { label: 'Share', action: openShareModal },
            { label: 'Make a copy', action: handleCopyItems },
            { label: 'Rename', action: () => { hideContextMenu(); setRenamingFileId(item.id); }, disabled: selectedFileIds.length > 1 },
            { label: 'Version history', action: () => { hideContextMenu(); onShowVersionHistory(item); }, disabled: item.type === 'folder' },
            { label: item.isStarred ? 'Unstar' : 'Star', action: handleStarItems },
            { label: 'Delete', action: handleDeleteItems },
        ];
    }
    showContextMenu(e, options);
  };

  const changeActiveView = (view: typeof activeView) => {
    setActiveView(view);
    onNavigate(null); // Resetează folderul curent la schimbarea vizualizării principale
  }

  return (
    <div className="bg-white dark:bg-[#2b2b2b] text-black dark:text-gray-200 h-full flex text-sm overflow-hidden">
      <nav className="w-60 border-r border-gray-200 dark:border-gray-700/50 p-4 flex-shrink-0 flex flex-col hidden md:block">
         <NewItemMenu onFileUploadClick={() => fileInputRef.current?.click()} onNewFolderClick={handleCreateFolder} />
         <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
        <div className="mt-4 space-y-1 flex-grow">
            {[
              { id: 'drive', label: 'My Drive' },
              { id: 'shared', label: 'Shared with me' },
              { id: 'recent', label: 'Recent' },
              { id: 'starred', label: 'Starred' },
              { id: 'trash', label: 'Trash' },
            ].map(view => (
              <button key={view.id} onClick={() => changeActiveView(view.id as any)} className={`w-full text-left px-4 py-2 rounded-r-full ${activeView === view.id ? 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300 font-bold' : 'hover:bg-gray-100 dark:hover:bg-gray-700/30'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-google-blue`}>
                {view.label}
              </button>
            ))}
        </div>
        <StorageIndicator files={files} />
      </nav>

      <main className="flex-grow flex flex-col min-w-0">
        <header className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700/50 flex items-center justify-between">
           <Breadcrumbs currentFolderId={currentFolderId} allFiles={files} onNavigate={onNavigate} />
           <div className="flex items-center space-x-4">
             <input type="search" ref={searchInputRef} placeholder="Search in Drive" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full min-w-[200px] bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-google-blue outline-none" />
             <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
           </div>
        </header>
        <div className="flex-grow p-4 overflow-y-auto relative">
          {viewMode === 'list' && <FileListHeader sortConfig={sortConfig} onSort={handleSort} />}
          <div className={viewMode === 'list' ? "mt-2 space-y-1" : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"}>
            {displayedItems.map((item, index) => {
              const ItemComponent = viewMode === 'list' ? FileListItem : FileGridItem;
              return (<ItemComponent
                key={item.id}
                item={item}
                isSelected={selectedFileIds.includes(item.id)}
                isRenaming={renamingFileId === item.id}
                hintTarget={hintTarget}
                onSelect={handleFileSelect}
                onDoubleClick={handleDoubleClick}
                onContextMenu={handleFileContextMenu}
                onRename={handleRenameFile}
                onCancelRename={handleCancelRename}
                onStar={handleStarItems}
              />)
            })}
            {displayedItems.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-10 col-span-full">
                    <p>{searchQuery ? `No results found for "${searchQuery}".` : 'This folder is empty.'}</p>
                </div>
            )}
          </div>
        </div>
      </main>

      <DetailsPanel 
        selectedFiles={selectedFiles} 
        onLogActivity={logActivity}
        onShare={openShareModal}
        hintTarget={hintTarget}
      />
      
      <AnimatePresence>
      {isShareModalOpen && selectedFiles.length > 0 && (
        <ShareModal
          fileNames={selectedFiles.map(f => f.name)}
          onClose={() => setShareModalOpen(false)}
          onShare={handleShare}
          onTransferOwnership={handleTransferOwnership}
          currentSharedUsers={sharedWith}
          onCopyRestrictedLink={onCopyRestrictedLink}
          hintTarget={hintTarget}
        />
      )}
      </AnimatePresence>
       <AnimatePresence>
        {previewingFile && (
            <FilePreviewModal file={previewingFile} activeCollaborators={activeCollaborators} onClose={() => setPreviewingFile(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GoogleDrive;