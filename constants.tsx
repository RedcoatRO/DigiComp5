import React from 'react';
import { Wallpaper, Suggestion, FileItem } from './types';

export const ChromeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.9 12a9 9 0 1 1-17.8 0 9 9 0 0 1 17.8 0Z" fill="#fff"/>
    <path d="M12 3a9 9 0 0 1 8.9 10.8L12 21a9 9 0 0 1-.1-18Z" fill="#EA4335"/>
    <path d="M20.9 12a9 9 0 0 1-2.6 6.4L12 3a9 9 0 0 1 8.9 9Z" fill="#4285F4"/>
    <path d="M3.1 12a9 9 0 0 1 6.3-8.6L12 21a9 9 0 0 1-8.9-9Z" fill="#FBBC05"/>
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" fill="#fff"/>
    <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" fill="#4285F4"/>
  </svg>
);

export const DriveIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.333 16.63L7.333 7.683L12.433 16.63H2.333Z" fill="#FFC107"/>
        <path d="M9.833 2.833L14.75 11.667H4.917L9.833 2.833Z" fill="#2196F3"/>
        <path d="M15.167 11.667L12.5 16.63H22.333L17.25 7.683L15.167 11.667Z" fill="#4CAF50"/>
    </svg>
);

export const FileExplorerIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 6C2 4.89543 2.89543 4 4 4H10.4142C10.9478 4 11.4593 4.21071 11.8284 4.5798L13.4142 6.16569C13.7833 6.53478 14.2948 6.74549 14.8284 6.74549H20C21.1046 6.74549 22 7.64092 22 8.74549V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6Z" fill="#FFD95A"/>
        <path d="M1 9H23V18C23 19.6569 21.6569 21 20 21H4C2.34315 21 1 19.6569 1 18V9Z" fill="#4596E6"/>
    </svg>
);

export const WindowsIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M3,3 H11 V11 H3 V3 M13,3 H21 V11 H13 V3 M3,13 H11 V21 H3 V13 M13,13 H21 V21 H13 V13" />
    </svg>
);


export const FolderIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 6.5C3 5.39543 3.89543 4.5 5 4.5H9.52513C9.99539 4.5 10.4473 4.68069 10.793 5.01382L12.143 6.30751C12.4887 6.64064 12.9406 6.82133 13.4109 6.82133H19C20.1046 6.82133 21 7.71676 21 8.82133V17.5C21 18.6046 20.1046 19.5 19 19.5H5C3.89543 19.5 3 18.6046 3 17.5V6.5Z" fill="#5E6368" />
        <path d="M3 9.5C3 8.39543 3.89543 7.5 5 7.5H19C20.1046 7.5 21 8.39543 21 9.5V17.5C21 18.6046 20.1046 19.5 19 19.5H5C3.89543 19.5 3 18.6046 3 17.5V9.5Z" fill="#7F868E" />
    </svg>
);


export const DocIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#4285F4"/>
    <path d="M13 9H18L13 3V9Z" fill="#3B78DE"/>
    <path d="M16 13H8V11H16V13ZM16 17H8V15H16V17ZM10 9H8V7H10V9Z" fill="white"/>
  </svg>
);

export const SheetIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#34A853"/>
    <path d="M13 9H18L13 3V9Z" fill="#2E944A"/>
    <path d="M12 18H8V16H12V18ZM16 18H14V16H16V18ZM12 14H8V12H12V14ZM16 14H14V12H16V14ZM12 10H8V8H12V10ZM16 10H14V8H16V10Z" fill="white"/>
  </svg>
);

export const SlideIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#FBBC05"/>
    <path d="M13 9H18L13 3V9Z" fill="#E4A904"/>
    <path d="M16 15H8V17H16V15ZM16 11H8V13H16V11Z" fill="white"/>
  </svg>
);


export const UploadIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M9 16h6v-6h4l-8-8-8 8h4v6zm-4 2h14v2H5v-2z"/></svg>
);

export const NewFolderIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M20 6h-8l-2-2H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-1 8h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2z"/></svg>
);

export const MailIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
);

export const UserIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
);

export const SettingsIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01-.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path></svg>
);

export const PhotosIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path></svg>
);

export const PowerIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9"></path></svg>
);


export const ViewerIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
    </svg>
);

export const EditorIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);

export const SpinnerIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


export const ListViewIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
);

export const GridViewIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M4 11h5V5H4v6zm0 7h5v-6H4v6zm6 0h5v-6h-5v6zm6 0h5v-6h-5v6zm-6-7h5V5h-5v6zm6-6v6h5V5h-5z"/></svg>
);

export const ArrowUpIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd"/></svg>
);

export const ArrowDownIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
);


export const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
);

export const StarFilledIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
);

const today = new Date().toISOString().split('T')[0];

export const initialFiles: FileItem[] = [
  { 
    id: '1', name: 'Proiect.docx', type: 'doc', owner: 'utilizator@gmail.com', modified: '2024-03-15', 
    previewUrl: 'https://i.imgur.com/4z1q2h1.png', parentId: null, isInTrash: false, 
    size: 1572864, isStarred: false, 
    activity: [{action: 'Created', date: '2024-03-15'}],
    versions: [
      { id: 'v3', author: 'utilizator@gmail.com', date: '2024-03-15' },
      { id: 'v2', author: 'Coleg B', date: '2024-03-14' },
      { id: 'v1', author: 'utilizator@gmail.com', date: '2024-03-13' },
    ]
  },
  { 
    id: '2', name: 'Budget.xlsx', type: 'sheet', owner: 'utilizator@gmail.com', modified: '2024-03-12', 
    previewUrl: 'https://i.imgur.com/gK2R5A6.png', parentId: null, isInTrash: false,
    size: 8388608, isStarred: true, activity: [{action: 'Created', date: '2024-03-12'}]
  },
  { 
    id: '3', name: 'Prezentare.pptx', type: 'slide', owner: 'utilizator@gmail.com', modified: '2024-03-10', 
    previewUrl: 'https://i.imgur.com/u8xAv3g.png', parentId: null, isInTrash: false,
    size: 2097152, isStarred: false, activity: [{action: 'Created', date: '2024-03-10'}]
  },
  { 
    id: '4', name: 'Q3 Report.docx', type: 'doc', owner: 'colegB@gmail.com', modified: '2024-03-18', 
    previewUrl: 'https://i.imgur.com/4z1q2h1.png', parentId: null, isInTrash: false,
    size: 3145728, isStarred: false, activity: [{action: 'Shared with you', date: '2024-03-18'}]
  },
  { 
    id: '5', name: 'Photos', type: 'folder', owner: 'utilizator@gmail.com', modified: '2024-03-09', 
    parentId: null, isInTrash: false,
    size: 0, isStarred: true, activity: [{action: 'Created', date: '2024-03-09'}]
  },
  { 
    id: '6', name: 'Holiday Snaps.docx', type: 'doc', owner: 'utilizator@gmail.com', modified: '2024-03-09',
    previewUrl: 'https://i.imgur.com/4z1q2h1.png', parentId: '5', isInTrash: false,
    size: 5242880, isStarred: false, activity: [{action: 'Created', date: '2024-03-09'}]
  },
];

export const MOCK_SHARE_LINK = 'https://docs.google.com/document/d/1aBcDeFgHiJkLmNoPqRsTuVwXyZ/edit?usp=sharing';

export const WALLPAPERS: Wallpaper[] = [
    { id: '1', name: 'Grayscale City', url: 'https://picsum.photos/1920/1080?grayscale' },
    { id: '2', name: 'Forest Path', url: 'https://picsum.photos/seed/forest/1920/1080' },
    { id: '3', name: 'Mountain Peak', url: 'https://picsum.photos/seed/mountain/1920/1080' },
    { id: '4', name: 'Abstract Waves', url: 'https://picsum.photos/seed/waves/1920/1080' },
];

// Sugestii de contacte pentru modalul de partajare
export const SUGGESTIONS: Suggestion[] = [
    { name: 'Coleg A', email: 'colegA@gmail.com', status: 'online' },
    { name: 'Coleg B', email: 'colegB@gmail.com', status: 'online' }, // Changed to online for simulation
];