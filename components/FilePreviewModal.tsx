import React from 'react';
import { motion } from 'framer-motion';
import { FileItem, Collaborator } from '../types';
import CollaboratorCursor from './CollaboratorCursor';

interface FilePreviewModalProps {
  file: FileItem;
  onClose: () => void;
  activeCollaborators: Collaborator[];
}

/**
 * Un modal mare pentru a previzualiza imaginea unui fișier.
 * Se închide la click pe fundal sau pe butonul de închidere.
 * Afișează cursoarele colaboratorilor activi.
 */
const FilePreviewModal = ({ file, onClose, activeCollaborators }: FilePreviewModalProps) => {
  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative max-w-4xl max-h-[90vh] bg-gray-900 rounded-lg shadow-xl flex flex-col"
        onClick={e => e.stopPropagation()} // Previne închiderea la click în interior
      >
        <div className="flex justify-between items-center p-4 text-white border-b border-gray-700">
          <h3 className="font-semibold truncate">{file.name}</h3>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-white/10 text-white"
            aria-label="Close preview"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path></svg>
          </button>
        </div>
        <div className="flex-grow p-4 flex items-center justify-center">
            <div className="relative w-full h-full">
                {file.previewUrl ? (
                    <img src={file.previewUrl} alt={`Preview of ${file.name}`} className="w-full h-full object-contain rounded-md" />
                ) : (
                    <div className="text-gray-400">No preview available.</div>
                )}

                {/* Afișează cursoarele colaboratorilor */}
                {activeCollaborators.map(collaborator => (
                    <CollaboratorCursor key={collaborator.email} name={collaborator.name} />
                ))}
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FilePreviewModal;