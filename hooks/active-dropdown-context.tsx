import { createContext, useState } from 'react';

/**
 * Context for the currently open dropdown menu.
 * This fixes the visual bug of having multiple dropdown menus open at once.
 */
export const ActiveDropdownContext = createContext<{
  activeDropdown: string | null;
  setActiveDropdown: (id: string | null) => void;
}>({ activeDropdown: null, setActiveDropdown: () => {} });

export function DropdownProvider({ children }: { children: React.ReactNode }) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  return (
    <ActiveDropdownContext.Provider
      value={{ activeDropdown, setActiveDropdown }}
    >
      {children}
    </ActiveDropdownContext.Provider>
  );
}
