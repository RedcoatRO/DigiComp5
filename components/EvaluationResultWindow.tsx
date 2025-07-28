import React from 'react';
import { motion } from 'framer-motion';

interface EvaluationResultWindowProps {
  score: number;
  maxScore: number;
  details: string;
}

/**
 * O fereastră modală specială, care nu poate fi închisă, pentru afișarea rezultatului final.
 * Prezintă scorul, un mesaj de felicitare și o detaliere a punctajului.
 */
const EvaluationResultWindow = ({ score, maxScore, details }: EvaluationResultWindowProps) => {
  const isPerfectScore = score === maxScore;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-white dark:bg-[#333] rounded-lg shadow-2xl w-full max-w-2xl flex flex-col border border-gray-400/50 dark:border-gray-700/50"
      >
        {/* Header-ul ferestrei este customizat și nu conține butoane de control */}
        <div className="h-10 bg-gray-200 dark:bg-[#3c3c3c] flex items-center px-4 rounded-t-lg">
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Rezultatul evaluării</span>
        </div>

        {/* Corpul ferestrei cu detaliile scorului */}
        <div className="p-8 flex-grow overflow-y-auto text-center">
            <h2 className="text-5xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                {score} <span className="text-3xl text-gray-500 dark:text-gray-400">/ {maxScore} Puncte</span>
            </h2>
            <p className={`text-2xl font-semibold mb-6 ${isPerfectScore ? 'text-green-500' : 'text-yellow-500'}`}>
                {isPerfectScore ? 'Felicitări, ai un punctaj perfect!' : 'Ai finalizat evaluarea!'}
            </p>
            
            <div className="text-left bg-gray-100 dark:bg-gray-800/50 p-4 rounded-md max-h-80 overflow-y-auto border border-gray-200 dark:border-gray-700">
                <h4 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-200">Justificare scor:</h4>
                <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans">
                    {details.replace("Detalii punctaj:\n", "")}
                </pre>
            </div>
        </div>

        {/* Footer-ul este intenționat omis pentru a preveni închiderea ferestrei */}
      </motion.div>
    </div>
  );
};

export default EvaluationResultWindow;
