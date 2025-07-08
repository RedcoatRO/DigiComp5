import React from 'react';
import Tooltip from './Tooltip';

interface CollaboratorAvatarProps {
    name: string;
}

const colors = [
    'bg-red-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-indigo-500'
];

// Generează o culoare consistentă pe baza numelui
const getColorForName = (name: string) => {
    const charCodeSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charCodeSum % colors.length];
};

const CollaboratorAvatar = ({ name }: CollaboratorAvatarProps) => {
    const initial = name.charAt(0).toUpperCase();
    const colorClass = getColorForName(name);

    return (
        <Tooltip content={name}>
            <div className={`w-7 h-7 rounded-full ${colorClass} flex items-center justify-center text-white text-sm font-bold border-2 border-white dark:border-gray-800`}>
                {initial}
            </div>
        </Tooltip>
    );
};

export default CollaboratorAvatar;
