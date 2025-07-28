export enum Role {
  Viewer = 'Viewer',
  Editor = 'Editor',
}

// Tip nou pentru istoricul de activități
export interface ActivityLog {
  action: string;
  date: string;
}

// Tip nou pentru versiunile fișierului
export interface Version {
  id: string;
  author: string;
  date: string;
}

export interface FileItem {
  id: string;
  name:string;
  type: 'doc' | 'sheet' | 'slide' | 'folder';
  owner: string;
  modified: string;
  previewUrl?: string;
  parentId: string | null;
  isInTrash: boolean;
  size: number;
  isStarred: boolean;
  activity: ActivityLog[];
  isUploading?: boolean;
  uploadProgress?: number;
  versions?: Version[]; // Istoric versiuni
}

export interface UserPermission {
  email: string;
  role: Role;
  expiresOn?: string | null; // Data de expirare
}

export interface ContextMenuOptions {
  x: number;
  y: number;
  options: { label: string; action: () => void; disabled?: boolean }[];
}

export type ToastType = 'success' | 'info' | 'error' | 'warning' | 'mail';

export interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

export interface Wallpaper {
    id: string;
    name: string;
    url: string;
}

export type SortKey = 'name' | 'owner' | 'modified';
export type SortDirection = 'ascending' | 'descending';

// Tip nou pentru sugestii de contacte cu status de prezență
export interface Suggestion {
  name: string;
  email: string;
  status: 'online' | 'offline';
}

// Tip nou pentru colaboratorii activi
export interface Collaborator {
    email: string;
    name: string;
}

// Tip nou pentru notificările de tip Windows
export interface WindowsNotificationType {
    id: number;
    title: string;
    message: string;
    icon: React.ReactNode;
}

// Tip nou pentru email-uri simulate
export interface Email {
    id: string;
    to: string[];
    subject: string;
    body: string;
    date: string;
    read: boolean;
}

// Tip pentru lista de sarcini (gamification)
export interface Task {
    id: number;
    text: string;
    hintId: string; // ID-ul elementului UI pentru indiciu
    points: number; // Puncte acordate pentru finalizarea sarcinii
    isCompleted: (state: { files: FileItem[]; sharedWith: UserPermission[], hasCopiedLink: boolean }) => boolean;
}