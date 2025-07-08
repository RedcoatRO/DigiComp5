import React, { createContext } from 'react';

interface ContextMenuContextType {
  showContextMenu: (e: React.MouseEvent, options: { label: string; action: () => void }[]) => void;
  hideContextMenu: () => void;
}

// Creăm contextul cu funcții goale ca valori default.
// Acestea vor fi suprascrise de Provider în componenta App.
export const ContextMenuContext = createContext<ContextMenuContextType>({
    showContextMenu: () => {},
    hideContextMenu: () => {},
});
