import React, { useState, useEffect } from 'react';

/**
 * Ceasul funcțional din Taskbar.
 * Afișează ora și data curentă și se actualizează în fiecare secundă.
 */
const Clock = () => {
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        // Setează un interval pentru a actualiza data în fiecare secundă
        const timerId = setInterval(() => setDate(new Date()), 1000);

        // Curăță intervalul la demontarea componentei pentru a preveni memory leaks
        return () => clearInterval(timerId);
    }, []);

    // Formatează ora și data
    const timeString = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
    });
    const dateString = date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
    });

    return (
        <div className="text-xs text-center text-gray-800 dark:text-gray-200">
            <div>{timeString}</div>
            <div>{dateString}</div>
        </div>
    );
};

export default Clock;
