// utils/communication.ts

interface EvaluationResult {
  type: 'evaluationResult';
  score: number;
  maxScore: number;
  details: string;
  tasksCompleted: number;
  totalTasks: number;
  extractedText: string;
  timestamp: string;
}

/**
 * Construiește și trimite rezultatul evaluării către fereastra părinte.
 * @param score - Scorul obținut.
 * @param maxScore - Scorul maxim posibil.
 * @param details - O justificare text a scorului.
 * @param tasksCompleted - Numărul de sarcini finalizate.
 * @param totalTasks - Numărul total de sarcini.
 */
export const sendEvaluationResult = (
    score: number,
    maxScore: number,
    details: string,
    tasksCompleted: number,
    totalTasks: number
) => {
    // Construiește obiectul cu datele evaluării
    const result: EvaluationResult = {
        type: 'evaluationResult', // Tipul mesajului, conform cerinței
        score,
        maxScore,
        details,
        tasksCompleted,
        totalTasks,
        extractedText: `Scor: ${score}/${maxScore}. ${details}`,
        timestamp: new Date().toISOString(),
    };

    // Trimite mesajul către fereastra părinte, dacă există
    if (window.parent) {
        window.parent.postMessage(result, '*');
    }
    
    // Afișează obiectul trimis în consolă pentru depanare
    console.log('Trimit rezultat:', result);
};
