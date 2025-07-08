import React, { useState } from 'react';
import { Email } from '../types';
import { UserIcon } from '../constants';

interface MailAppWindowContentProps {
  emails: Email[];
  setEmails: React.Dispatch<React.SetStateAction<Email[]>>;
}

const MailAppWindowContent = ({ emails, setEmails }: MailAppWindowContentProps) => {
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(emails[0] || null);

    const handleSelectEmail = (email: Email) => {
        setSelectedEmail(email);
        // Marchează email-ul ca citit
        if (!email.read) {
            setEmails(prevEmails => 
                prevEmails.map(e => e.id === email.id ? { ...e, read: true } : e)
            );
        }
    };

    return (
        <div className="flex h-full bg-white dark:bg-[#202020] text-gray-800 dark:text-gray-200">
            {/* Panoul cu lista de email-uri */}
            <div className="w-1/3 border-r border-gray-200 dark:border-gray-700/50 flex-shrink-0 overflow-y-auto">
                <div className="p-2 border-b border-gray-200 dark:border-gray-700/50">
                    <h2 className="text-lg font-semibold px-2">Inbox</h2>
                </div>
                <ul>
                    {emails.map(email => (
                        <li key={email.id}>
                            <button 
                                onClick={() => handleSelectEmail(email)}
                                className={`w-full text-left p-3 border-b border-gray-100 dark:border-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 ${selectedEmail?.id === email.id ? 'bg-blue-100 dark:bg-blue-500/20' : ''}`}
                            >
                                <div className="flex justify-between items-center">
                                    <p className={`font-semibold truncate ${!email.read ? 'text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}`}>{email.to.join(', ')}</p>
                                    <p className={`text-xs flex-shrink-0 ${!email.read ? 'text-gray-800 dark:text-gray-200' : 'text-gray-500'}`}>{new Date(email.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}</p>
                                </div>
                                <p className={`truncate text-sm ${!email.read ? 'text-gray-800 dark:text-gray-200' : 'text-gray-500'}`}>{email.subject}</p>
                            </button>
                        </li>
                    ))}
                    {emails.length === 0 && <p className="p-4 text-sm text-gray-500">No new mail.</p>}
                </ul>
            </div>

            {/* Panoul cu conținutul email-ului selectat */}
            <div className="w-2/3 p-6 overflow-y-auto">
                {selectedEmail ? (
                    <div>
                        <h1 className="text-2xl font-bold mb-2">{selectedEmail.subject}</h1>
                        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700/50">
                             <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                <UserIcon className="w-6 h-6 text-gray-600 dark:text-gray-300"/>
                            </div>
                            <div>
                                <p className="font-semibold">{selectedEmail.to.join(', ')}</p>
                                <p className="text-sm text-gray-500">to me</p>
                            </div>
                        </div>
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                            <p>{selectedEmail.body}</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <p>Select an email to read</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MailAppWindowContent;