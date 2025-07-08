import React, { useState, useEffect, useRef } from 'react';
import { UserPermission, Role } from '../types';
import { SUGGESTIONS } from '../constants';

interface PersonPillProps {
  person: UserPermission;
  onRemove: (email: string) => void;
  onRoleChange: (email: string, role: Role) => void;
  onTransferOwnership: (email: string) => void;
  canTransferOwnership: boolean;
}

const PersonPill = ({ person, onRemove, onRoleChange, onTransferOwnership, canTransferOwnership }: PersonPillProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    
    const suggestion = SUGGESTIONS.find(s => s.email === person.email);
    const name = suggestion ? suggestion.name : person.email;
    const initial = name.charAt(0).toUpperCase();

    // Închide meniul la click în afara lui
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectOption = (action: () => void) => {
        action();
        setIsMenuOpen(false);
    };

    return (
        <div className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-1 text-sm">
            <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold flex-shrink-0 text-xs">
                {initial}
            </div>
            <span className="text-gray-800 dark:text-gray-200 truncate">{name}</span>
            <div className="relative" ref={menuRef}>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center text-gray-600 dark:text-gray-400 hover:bg-black/10 dark:hover:bg-white/10 p-1 rounded-md">
                   <span>{person.role}</span>
                   <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </button>
                {isMenuOpen && (
                    <div className="absolute top-full right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-20 py-1">
                        <button onClick={() => handleSelectOption(() => onRoleChange(person.email, Role.Viewer))} className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Viewer</button>
                        <button onClick={() => handleSelectOption(() => onRoleChange(person.email, Role.Editor))} className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Editor</button>
                        {person.role === Role.Editor && canTransferOwnership && (
                            <>
                                <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                                <button onClick={() => handleSelectOption(() => onTransferOwnership(person.email))} className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Make owner</button>
                            </>
                        )}
                    </div>
                )}
            </div>
            <button onClick={() => onRemove(person.email)} className="text-gray-500 dark:text-gray-400 hover:text-red-500 p-0.5 rounded-full">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
            </button>
        </div>
    );
};

export default PersonPill;