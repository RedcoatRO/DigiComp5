import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ChromeIcon, DriveIcon, FileExplorerIcon, WALLPAPERS, MailIcon, initialFiles } from './constants';
import BrowserWindow from './components/BrowserWindow';
import GoogleDrive from './components/GoogleDrive';
import Taskbar from './components/Taskbar';
import DesktopIcon from './components/DesktopIcon';
import ContextMenu from './components/ContextMenu';
import WallpaperSettingsModal from './components/WallpaperSettingsModal';
import ToastContainer from './components/ToastContainer';
import { ThemeProvider } from './contexts/ThemeContext';
import { ContextMenuContext } from './contexts/ContextMenuContext';
import { ToastProvider } from './contexts/ToastContext';
import { ContextMenuOptions, Collaborator, FileItem, Email, UserPermission, Role, Task } from './types';
import FileExplorerWindowContent from './components/FileExplorerWindowContent';
import usePersistentState from './hooks/usePersistentState';
import StartMenu from './components/StartMenu';
import VersionHistoryModal from './components/VersionHistoryModal';
import { WindowsNotificationProvider } from './contexts/WindowsNotificationContext';
import WindowsNotificationContainer from './components/WindowsNotificationContainer';
import MailAppWindowContent from './components/MailAppWindowContent';
import TaskChecklist from './components/TaskChecklist';
import { sendEvaluationResult } from './utils/communication';
import EvaluationResultWindow from './components/EvaluationResultWindow';


// --- GAMIFICATION SETUP ---
// Sarcinile actualizate pentru a include un punctaj specific
const TASKS: Task[] = [
    { id: 1, text: "Select 'Proiect.docx'", hintId: 'file-1', points: 10, isCompleted: ({ files }) => files.some(f => f.id === '1' && f.activity.some(a => a.action === "Selected")) },
    { id: 2, text: "Share with colegA@gmail.com", hintId: 'share-button', points: 15, isCompleted: ({ sharedWith }) => sharedWith.some(u => u.email === 'colegA@gmail.com')},
    { id: 3, text: "Set colegA's permission to Viewer", hintId: 'share-modal-input', points: 15, isCompleted: ({ sharedWith }) => sharedWith.some(u => u.email === 'colegA@gmail.com' && u.role === Role.Viewer)},
    { id: 4, text: "Share with colegB@gmail.com", hintId: 'share-modal-input', points: 15, isCompleted: ({ sharedWith }) => sharedWith.some(u => u.email === 'colegB@gmail.com')},
    { id: 5, text: "Set colegB's permission to Editor", hintId: 'share-modal-input', points: 15, isCompleted: ({ sharedWith }) => sharedWith.some(u => u.email === 'colegB@gmail.com' && u.role === Role.Editor)},
    { id: 6, text: "Copy the restricted link", hintId: 'copy-link-button', points: 30, isCompleted: ({ hasCopiedLink }) => hasCopiedLink },
];

// Calculul scorului maxim pe baza sarcinilor definite
const MAX_SCORE = TASKS.reduce((sum, task) => sum + task.points, 0);

// Componenta principală a aplicației
export default function App() {
  const [browserWindowState, setBrowserWindowState] = usePersistentState('browserWindowState', { isOpen: true, pos: { x: 150, y: 50 }, size: { width: 1200, height: 720 } });
  const [explorerWindowState, setExplorerWindowState] = usePersistentState('explorerWindowState', { isOpen: false, pos: { x: 250, y: 150 }, size: { width: 900, height: 600 } });
  const [mailWindowState, setMailWindowState] = usePersistentState('mailWindowState', { isOpen: false, pos: { x: 350, y: 100 }, size: { width: 800, height: 640 } });
  
  const [contextMenu, setContextMenu] = useState<ContextMenuOptions | null>(null);
  const [isWallpaperSettingsOpen, setWallpaperSettingsOpen] = useState(false);
  const [currentWallpaper, setCurrentWallpaper] = usePersistentState('desktopWallpaper', WALLPAPERS[0].url);
  const [isStartMenuOpen, setStartMenuOpen] = useState(false);
  const [versionHistoryFile, setVersionHistoryFile] = useState<FileItem | null>(null);
  const [activeCollaborators, setActiveCollaborators] = usePersistentState<Collaborator[]>('activeCollaborators', []);
  const [emails, setEmails] = usePersistentState<Email[]>('driveEmails', []);
  
  // --- STATE LIFTING for Gamification ---
  const [files, setFiles] = usePersistentState<FileItem[]>('driveFiles', initialFiles);
  const [sharedWith, setSharedWith] = usePersistentState<UserPermission[]>('driveSharedWith', []);
  const [hasCopiedRestrictedLink, setHasCopiedRestrictedLink] = useState(false);

  // Gamification states
  const [tasks, setTasks] = useState(TASKS);
  const [score, setScore] = useState(0);
  const [hintTarget, setHintTarget] = useState<string | null>(null);
  const inactivityTimer = useRef<number | null>(null);

  // Stare nouă pentru fereastra de evaluare
  const [isEvaluationResultOpen, setEvaluationResultOpen] = useState(false);
  const [evaluationResultData, setEvaluationResultData] = useState<{ score: number; maxScore: number; details: string; } | null>(null);

  
  // --- GAMIFICATION LOGIC ---
  // Calculează scorul pe baza punctelor din sarcini
  useEffect(() => {
    const currentGamificationState = { files, sharedWith, hasCopiedLink: hasCopiedRestrictedLink };
    const currentScore = tasks.reduce((acc, task) => {
        if (task.isCompleted(currentGamificationState)) {
            return acc + task.points;
        }
        return acc;
    }, 0);
    setScore(currentScore);
  }, [files, sharedWith, hasCopiedRestrictedLink, tasks]);

  // Funcție centralizată pentru afișarea indiciului
  const showHint = useCallback(() => {
    const allTasksCompleted = tasks.every(task => task.isCompleted({ files, sharedWith, hasCopiedLink: hasCopiedRestrictedLink }));
    if (allTasksCompleted) return;

    const firstUncompletedTask = tasks.find(task => !task.isCompleted({ files, sharedWith, hasCopiedLink: hasCopiedRestrictedLink }));
    if (firstUncompletedTask) {
        setHintTarget(firstUncompletedTask.hintId);
    }
  }, [tasks, files, sharedWith, hasCopiedRestrictedLink]);

  // Logică pentru sistemul de indicii (hints) activat prin inactivitate
  const resetInactivityTimer = useCallback(() => {
    setHintTarget(null);
    if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
    }
    inactivityTimer.current = window.setTimeout(showHint, 15000); // 15 secunde de inactivitate
  }, [showHint]);

  // Activarea indiciului la click pe butonul din Taskbar
  const handleHintClick = useCallback(() => {
    showHint();
    resetInactivityTimer(); // Resetează timer-ul de inactivitate pentru a nu arăta hint-ul imediat din nou
  }, [showHint, resetInactivityTimer]);

  useEffect(() => {
    resetInactivityTimer();
    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('keydown', resetInactivityTimer);
    return () => {
        window.removeEventListener('mousemove', resetInactivityTimer);
        window.removeEventListener('keydown', resetInactivityTimer);
        if (inactivityTimer.current) {
            clearTimeout(inactivityTimer.current);
        }
    };
  }, [resetInactivityTimer]);

  // Funcția care finalizează evaluarea
  const handleCheckEvaluation = () => {
      const currentGamificationState = { files, sharedWith, hasCopiedLink: hasCopiedRestrictedLink };
      let finalScore = 0;
      let tasksCompleted = 0;
      const detailsParts: string[] = [];

      tasks.forEach(task => {
          if (task.isCompleted(currentGamificationState)) {
              finalScore += task.points;
              tasksCompleted++;
              detailsParts.push(`- ${task.text}: ${task.points} puncte`);
          } else {
              detailsParts.push(`- ${task.text}: 0 puncte (nefinalizat)`);
          }
      });
      
      const justification = `Detalii punctaj:\n${detailsParts.join('\n')}`;

      // Trimite rezultatele către fereastra părinte folosind postMessage
      sendEvaluationResult(finalScore, MAX_SCORE, justification, tasksCompleted, tasks.length);

      // Salvează datele pentru a fi afișate în fereastra de rezultate
      setEvaluationResultData({
          score: finalScore,
          maxScore: MAX_SCORE,
          details: justification,
      });

      // Deschide fereastra cu rezultate
      setEvaluationResultOpen(true);
  };


  // Stare pentru istoricul de navigare al browser-ului
  const [browserNavState, setBrowserNavState] = useState({ history: [null as string | null], currentIndex: 0 });

  const browserNavActions = useMemo(() => ({
      navigate: (folderId: string | null) => {
          setBrowserNavState(prev => {
              const newHistory = [...prev.history.slice(0, prev.currentIndex + 1), folderId];
              return { history: newHistory, currentIndex: newHistory.length - 1 };
          });
      },
      goBack: () => setBrowserNavState(prev => ({ ...prev, currentIndex: Math.max(0, prev.currentIndex - 1) })),
      goForward: () => setBrowserNavState(prev => ({ ...prev, currentIndex: Math.min(prev.history.length - 1, prev.currentIndex + 1) })),
  }), []);
  
  const handleAddEmail = (email: Omit<Email, 'id' | 'date' | 'read'>) => {
    setEmails(prev => [{ ...email, id: Date.now().toString(), date: new Date().toISOString(), read: false }, ...prev]);
  };

  const currentFolderId = browserNavState.history[browserNavState.currentIndex];

  const openBrowser = useCallback(() => setBrowserWindowState(prev => ({ ...prev, isOpen: true })), [setBrowserWindowState]);
  const closeBrowser = useCallback(() => setBrowserWindowState(prev => ({ ...prev, isOpen: false })), [setBrowserWindowState]);
  
  const toggleFileExplorer = useCallback(() => setExplorerWindowState(prev => ({ ...prev, isOpen: !prev.isOpen })), [setExplorerWindowState]);
  const closeFileExplorer = useCallback(() => setExplorerWindowState(prev => ({ ...prev, isOpen: false })), [setExplorerWindowState]);

  const toggleMailApp = useCallback(() => setMailWindowState(prev => ({ ...prev, isOpen: !prev.isOpen })), [setMailWindowState]);
  const closeMailApp = useCallback(() => setMailWindowState(prev => ({ ...prev, isOpen: false })), [setMailWindowState]);

  const openWallpaperSettings = useCallback(() => {
    hideContextMenu();
    setWallpaperSettingsOpen(true);
  }, []);

  const showContextMenu = useCallback((e: React.MouseEvent, options: { label: string; action: () => void; disabled?: boolean }[]) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, options });
  }, []);

  const hideContextMenu = useCallback(() => setContextMenu(null), []);

  const contextMenuValue = useMemo(() => ({ showContextMenu, hideContextMenu }), [showContextMenu, hideContextMenu]);

  const handleDesktopClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
        hideContextMenu();
        setStartMenuOpen(false);
    }
  };

  const desktopContextMenuOptions = [
      { label: 'Personalize', action: openWallpaperSettings },
      { label: 'Display settings', action: () => alert('Simulating display settings...') },
      { label: 'New', action: () => {} },
  ];
  
  const unreadEmailCount = useMemo(() => emails.filter(e => !e.read).length, [emails]);

  return (
    <ThemeProvider>
      <ContextMenuContext.Provider value={contextMenuValue}>
        <ToastProvider>
          <WindowsNotificationProvider>
            <div 
                className="relative w-screen h-screen overflow-hidden bg-white dark:bg-[#202020] font-sans transition-colors duration-300"
                onClick={handleDesktopClick}
                onContextMenu={(e) => {
                    if (e.target === e.currentTarget) {
                        showContextMenu(e, desktopContextMenuOptions);
                    }
                }}
            >
              <img src={currentWallpaper} alt="Desktop Wallpaper" className="absolute inset-0 w-full h-full object-cover" />
              
              <div className="p-4 flex flex-col space-y-2">
                <DesktopIcon
                  icon={<ChromeIcon className="w-12 h-12" />}
                  label="Google Chrome"
                  onDoubleClick={openBrowser}
                  contextMenuOptions={[{ label: 'Open', action: openBrowser }]}
                />
                 <DesktopIcon
                  icon={<FileExplorerIcon className="w-12 h-12" />}
                  label="File Explorer"
                  onDoubleClick={toggleFileExplorer}
                  contextMenuOptions={[{ label: 'Open', action: toggleFileExplorer }]}
                />
                 <DesktopIcon
                  icon={<MailIcon className="w-12 h-12 text-blue-400" />}
                  label="Mail"
                  onDoubleClick={toggleMailApp}
                  contextMenuOptions={[{ label: 'Open', action: toggleMailApp }]}
                  badgeCount={unreadEmailCount}
                />
              </div>
              
              <TaskChecklist tasks={tasks} gamificationState={{ files, sharedWith, hasCopiedLink: hasCopiedRestrictedLink }} score={score} />

              <AnimatePresence>
                {browserWindowState.isOpen && (
                  <BrowserWindow 
                    id="drive-window"
                    title="Google Drive" 
                    onClose={closeBrowser}
                    icon={<DriveIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
                    initialPosition={browserWindowState.pos}
                    initialSize={browserWindowState.size}
                    onStateChange={(pos, size) => setBrowserWindowState(prev => ({...prev, pos, size}))}
                    collaborators={activeCollaborators}
                    onBack={browserNavActions.goBack}
                    onForward={browserNavActions.goForward}
                    isBackDisabled={browserNavState.currentIndex === 0}
                    isForwardDisabled={browserNavState.currentIndex === browserNavState.history.length - 1}
                  >
                    <GoogleDrive 
                      // Lifted state
                      files={files}
                      setFiles={setFiles}
                      sharedWith={sharedWith}
                      setSharedWith={setSharedWith}
                      onCopyRestrictedLink={() => setHasCopiedRestrictedLink(true)}
                      // Gamification
                      hintTarget={hintTarget}
                      // Regular props
                      onShowVersionHistory={setVersionHistoryFile}
                      onCollaboratorsChange={setActiveCollaborators}
                      currentFolderId={currentFolderId}
                      onNavigate={browserNavActions.navigate}
                      onAddEmail={handleAddEmail}
                    />
                  </BrowserWindow>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {explorerWindowState.isOpen && (
                  <BrowserWindow
                    id="explorer-window"
                    title="File Explorer" 
                    onClose={closeFileExplorer}
                    icon={<FileExplorerIcon className="w-5 h-5" />}
                    initialPosition={explorerWindowState.pos}
                    initialSize={explorerWindowState.size}
                    onStateChange={(pos, size) => setExplorerWindowState(prev => ({...prev, pos, size}))}
                  >
                    <FileExplorerWindowContent />
                  </BrowserWindow>
                )}
              </AnimatePresence>
              
               <AnimatePresence>
                {mailWindowState.isOpen && (
                  <BrowserWindow
                    id="mail-window"
                    title="Mail" 
                    onClose={closeMailApp}
                    icon={<MailIcon className="w-5 h-5 text-blue-500" />}
                    initialPosition={mailWindowState.pos}
                    initialSize={mailWindowState.size}
                    onStateChange={(pos, size) => setMailWindowState(prev => ({...prev, pos, size}))}
                  >
                    <MailAppWindowContent emails={emails} setEmails={setEmails} />
                  </BrowserWindow>
                )}
              </AnimatePresence>
              
              <AnimatePresence>
                {contextMenu && <ContextMenu {...contextMenu} />}
               </AnimatePresence>

               <AnimatePresence>
                {isWallpaperSettingsOpen && (
                    <WallpaperSettingsModal
                        onClose={() => setWallpaperSettingsOpen(false)}
                        onSelectWallpaper={setCurrentWallpaper}
                        currentWallpaper={currentWallpaper}
                    />
                )}
               </AnimatePresence>
               
               <AnimatePresence>
                {versionHistoryFile && (
                    <VersionHistoryModal
                        file={versionHistoryFile}
                        onClose={() => setVersionHistoryFile(null)}
                    />
                )}
               </AnimatePresence>

               <AnimatePresence>
                    {isStartMenuOpen && <StartMenu onClose={() => setStartMenuOpen(false)} />}
               </AnimatePresence>

               {/* Fereastra de rezultate care nu poate fi închisă */}
               <AnimatePresence>
                {isEvaluationResultOpen && evaluationResultData && (
                    <EvaluationResultWindow {...evaluationResultData} />
                )}
               </AnimatePresence>

              <ToastContainer />
              <WindowsNotificationContainer />

              <Taskbar 
                onChromeClick={openBrowser} 
                isChromeOpen={browserWindowState.isOpen}
                onFileExplorerClick={toggleFileExplorer}
                isFileExplorerOpen={explorerWindowState.isOpen}
                onStartMenuClick={() => setStartMenuOpen(v => !v)}
                score={score}
                maxScore={MAX_SCORE}
                onCheckClick={handleCheckEvaluation}
                onHintClick={handleHintClick}
              />
            </div>
          </WindowsNotificationProvider>
        </ToastProvider>
      </ContextMenuContext.Provider>
    </ThemeProvider>
  );
}