import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPermission, Role, Suggestion } from '../types';
import { ViewerIcon, EditorIcon, SUGGESTIONS, MailIcon } from '../constants';
import Spinner from './Spinner';
import Tooltip from './Tooltip';
import { useToast } from '../contexts/ToastContext';
import PersonPill from './PersonPill';
import { useWindowsNotification } from '../contexts/WindowsNotificationContext';

interface ShareModalProps {
  fileNames: string[];
  onClose: () => void;
  onShare: (users: UserPermission[], message: string) => void;
  onTransferOwnership: (newOwnerEmail: string) => void;
  currentSharedUsers: UserPermission[];
  onCopyRestrictedLink: () => void;
  hintTarget: string | null;
}

const ShareModal = ({ fileNames, onClose, onShare, onTransferOwnership, currentSharedUsers, onCopyRestrictedLink, hintTarget }: ShareModalProps) => {
  const [people, setPeople] = useState<UserPermission[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('Vă trimit fișierul pentru revizuire.');
  const [error, setError] = useState<string | null>(null);
  const [access, setAccess] = useState<'Restricted' | 'Anyone'>('Restricted');
  const [disableDownload, setDisableDownload] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [expirationEnabled, setExpirationEnabled] = useState(false);
  const [expirationDate, setExpirationDate] = useState<string | null>(null);
  const [isSuggestionsVisible, setSuggestionsVisible] = useState(false);
  const [isDirty, setIsDirty] = useState(false); // Stare pentru modificări nesalvate

  const { addToast } = useToast();
  const { addNotification } = useWindowsNotification();
  
  // Marchează formularul ca "murdar" la orice modificare
  useEffect(() => {
    if (people.length > 0 || message !== 'Vă trimit fișierul pentru revizuire.') {
        setIsDirty(true);
    }
  }, [people, message]);
  
  const handleClose = () => {
    if (isDirty) {
        if (window.confirm("You have unsaved changes. Are you sure you want to discard them?")) {
            onClose();
        }
    } else {
        onClose();
    }
  };

  const addPerson = (person: UserPermission) => {
     const isAlreadyAdded = people.some(p => p.email === person.email) || currentSharedUsers.some(p => p.email === person.email);
      if (!isAlreadyAdded) {
        setPeople(prev => [...prev, person]);
        setInputValue('');
        setError(null);
      } else {
        setError('This person has already been added.');
      }
  }

  const removePerson = (email: string) => {
    setPeople(prev => prev.filter(p => p.email !== email));
  }

  const handleAddFromInput = () => {
    if (inputValue && SUGGESTIONS.some(s => s.email.toLowerCase() === inputValue.toLowerCase())) {
        const suggestion = SUGGESTIONS.find(s => s.email.toLowerCase() === inputValue.toLowerCase())!;
        addPerson({ email: suggestion.email, role: Role.Viewer });
    } else {
      setError('Please enter a valid email from suggestions.');
    }
  };
  
  const handleAddFromSuggestion = (suggestion: Suggestion) => {
     addPerson({ email: suggestion.email, role: Role.Viewer });
     setInputValue('');
     setSuggestionsVisible(false);
  }
  
  const filteredSuggestions = useMemo(() => {
    if(!inputValue) return [];
    return SUGGESTIONS.filter(s => 
        (s.name.toLowerCase().includes(inputValue.toLowerCase()) || s.email.toLowerCase().includes(inputValue.toLowerCase())) &&
        !people.some(p => p.email === s.email) &&
        !currentSharedUsers.some(u => u.email === s.email)
    );
  }, [inputValue, people, currentSharedUsers]);

  const handleRoleChange = (email: string, role: Role) => {
    setPeople(people.map(p => (p.email === email ? { ...p, role } : p)));
  };
  
  const handleTransferOwnershipClick = (email: string) => {
    if (window.confirm(`Are you sure you want to make ${email} the new owner? This action cannot be undone.`)) {
        onTransferOwnership(email);
        onClose();
    }
  };

  const handleSend = () => {
    if (isSending) return;
    if (people.some(p => !p.role)) {
      setError('Please select an access level for each person.');
      return;
    }
    
    setIsSending(true);
    setTimeout(() => {
        const peopleWithExpiration = people.map(p => ({
            ...p,
            expiresOn: expirationEnabled ? expirationDate : null
        }));
        if (peopleWithExpiration.length > 0) {
            onShare(peopleWithExpiration, message);
            addToast('Items shared successfully', 'success');
            addNotification({
              title: "Mail Delivery Subsystem",
              message: `Invitation to collaborate sent to ${people.length} user(s).`,
              icon: <MailIcon className="w-5 h-5 text-blue-500" />
            });
        }
        setIsSending(false);
        onClose();
    }, 1500);
  };
  
  const handleCopyLink = () => {
    if (access === 'Restricted') {
        onCopyRestrictedLink();
    }
    navigator.clipboard.writeText('https://docs.google.com/document/d/xyz');
    addToast('Link copied to clipboard', 'info');
  };

  const title = fileNames.length === 1 ? `Share "${fileNames[0]}"` : `Share ${fileNames.length} items`;
  
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-white dark:bg-[#3c3c3c] rounded-2xl shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-600 flex-shrink-0">
          <h2 className="text-2xl font-normal text-gray-800 dark:text-gray-100 truncate">{title}</h2>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="relative">
            <div className={`border border-gray-300 dark:border-gray-500 rounded-md p-2 flex flex-wrap gap-2 items-center focus-within:ring-2 focus-within:ring-google-blue
                ${hintTarget === 'share-modal-input' ? 'ring-2 ring-google-blue animate-pulse-strong' : ''}
            `}>
                {people.map(person => (
                    <PersonPill 
                        key={person.email} 
                        person={person} 
                        onRemove={removePerson} 
                        onRoleChange={handleRoleChange} 
                        onTransferOwnership={handleTransferOwnershipClick}
                        canTransferOwnership={fileNames.length === 1}
                    />
                ))}
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => { setInputValue(e.target.value); setError(null); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddFromInput()}
                  onFocus={() => setSuggestionsVisible(true)}
                  onBlur={() => setTimeout(() => setSuggestionsVisible(false), 150)}
                  placeholder={people.length === 0 ? "Add people" : ""}
                  className="flex-grow outline-none bg-transparent text-gray-800 dark:text-gray-200 min-w-[120px]"
                />
            </div>
            <AnimatePresence>
            {isSuggestionsVisible && filteredSuggestions.length > 0 && (
                <motion.div 
                    initial={{opacity: 0, y: -5}} animate={{opacity: 1, y: 0}} exit={{opacity: 0}}
                    className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 mt-1 z-10"
                >
                    <p className="text-xs text-gray-500 dark:text-gray-400 p-2">Suggestions</p>
                    {filteredSuggestions.map(s => (
                      <button key={s.email} onClick={() => handleAddFromSuggestion(s)} className="flex items-center space-x-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 w-full text-left">
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                            {s.name.charAt(0)}
                          </div>
                           <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ${s.status === 'online' ? 'bg-green-400' : 'bg-gray-400'} ring-2 ring-white dark:ring-gray-800`}></span>
                        </div>
                        <div className="text-sm">
                          <p className="font-semibold text-gray-800 dark:text-gray-200">{s.name}</p>
                          <p className="text-gray-600 dark:text-gray-400">{s.email}</p>
                        </div>
                      </button>
                    ))}
                </motion.div>
            )}
            </AnimatePresence>
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Message (optional)"
            className="w-full border border-gray-300 dark:border-gray-500 rounded-md p-2 h-20 resize-none focus:ring-2 focus:ring-google-blue outline-none bg-transparent text-gray-800 dark:text-gray-200"
          />
          {currentSharedUsers.length > 0 && (
             <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">People with access</h3>
                {currentSharedUsers.map(user => (
                    <div key={user.email} className="flex items-center justify-between text-sm text-gray-800 dark:text-gray-200">
                        <span>{user.email}</span>
                        <Tooltip content={user.role}>
                          <span className="text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                              {user.role === Role.Editor ? <EditorIcon /> : <ViewerIcon />}
                              <span>{user.role}</span>
                          </span>
                        </Tooltip>
                    </div>
                ))}
             </div>
          )}
          <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">General access</h3>
            <select value={access} onChange={e => setAccess(e.target.value as 'Restricted' | 'Anyone')} className="w-full border border-gray-300 dark:border-gray-500 rounded p-2 mb-2 bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-google-blue">
              <option value="Restricted">Restricted</option>
              <option value="Anyone">Anyone with the link</option>
            </select>
            <div className="flex items-center mt-2">
              <input type="checkbox" id="expiration" checked={expirationEnabled} onChange={e => setExpirationEnabled(e.target.checked)} className="mr-2 h-4 w-4 rounded border-gray-300 text-google-blue focus:ring-google-blue"/>
              <label htmlFor="expiration" className="text-sm text-gray-600 dark:text-gray-300">Set expiration date</label>
            </div>
            {expirationEnabled && (
                <motion.div initial={{opacity: 0, height: 0}} animate={{opacity: 1, height: 'auto'}} exit={{opacity: 0, height: 0}}>
                    <input type="date" onChange={e => setExpirationDate(e.target.value)} className="mt-2 w-full border border-gray-300 dark:border-gray-500 rounded p-2 bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-google-blue" />
                </motion.div>
            )}
            <div className="flex items-center mt-2">
              <input type="checkbox" id="disableDownload" checked={disableDownload} onChange={e => setDisableDownload(e.target.checked)} className="mr-2 h-4 w-4 rounded border-gray-300 text-google-blue focus:ring-google-blue"/>
              <label htmlFor="disableDownload" className="text-sm text-gray-600 dark:text-gray-300">Disable download, print, and copy for viewers</label>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center rounded-b-2xl flex-shrink-0">
            <button 
                onClick={handleCopyLink} 
                className={`text-google-blue font-semibold hover:bg-blue-50 dark:hover:bg-blue-500/10 p-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-google-blue
                    ${hintTarget === 'copy-link-button' ? 'animate-pulse-strong' : ''}
                `}>
                Copy link
            </button>
            <div>
              <button onClick={handleClose} className="text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-gray-600/50 px-4 py-2 rounded-md mr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500 dark:focus-visible:ring-offset-gray-800">
                  Cancel
              </button>
              <button 
                onClick={handleSend}
                disabled={isSending || people.length === 0}
                className="bg-google-blue text-white font-semibold px-6 py-2 rounded-md hover:bg-google-blue-dark transition-colors flex items-center justify-center w-24 disabled:bg-google-blue/50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-google-blue dark:focus-visible:ring-offset-gray-800"
              >
                  {isSending ? <Spinner /> : 'Send'}
              </button>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ShareModal;