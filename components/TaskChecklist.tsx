import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task, FileItem, UserPermission } from '../types';

interface TaskChecklistProps {
  tasks: Task[];
  gamificationState: {
    files: FileItem[];
    sharedWith: UserPermission[];
    hasCopiedLink: boolean;
  };
  score: number;
}

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

/**
 * Afișează lista de sarcini (gamification), scorul, și bifează
 * automat obiectivele pe măsură ce sunt îndeplinite.
 */
const TaskChecklist = ({ tasks, gamificationState, score }: TaskChecklistProps) => {
    const allTasksCompleted = tasks.every(task => task.isCompleted(gamificationState));

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="fixed top-20 right-4 w-80 bg-gray-800/70 dark:bg-black/70 backdrop-blur-md rounded-lg p-4 shadow-2xl border border-white/10 z-50 text-white"
        >
            <h3 className="text-lg font-bold mb-3 border-b border-white/20 pb-2">Your Mission</h3>
            <ul className="space-y-2">
                {tasks.map(task => {
                    const isCompleted = task.isCompleted(gamificationState);
                    return (
                        <motion.li
                            key={task.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 + task.id * 0.1 }}
                            className="flex items-center space-x-3 text-sm"
                        >
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300
                                ${isCompleted ? 'bg-green-500' : 'bg-white/20 border-2 border-white/30'}
                            `}>
                                {isCompleted && <CheckIcon className="w-3 h-3 text-white" />}
                            </div>
                            <span className={isCompleted ? 'line-through text-gray-400' : ''}>
                                {task.text}
                            </span>
                        </motion.li>
                    );
                })}
            </ul>
            <AnimatePresence>
            {allTasksCompleted && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-4 text-center bg-green-500/20 text-green-300 p-2 rounded-md font-semibold"
                >
                    Mission Complete! Well done.
                </motion.div>
            )}
            </AnimatePresence>
            <div className="mt-4 pt-3 border-t border-white/20 flex justify-between items-center">
                <span className="text-sm font-bold text-gray-300">SCORE:</span>
                <span className="text-lg font-bold text-green-400">{score}</span>
            </div>
        </motion.div>
    );
};

export default TaskChecklist;