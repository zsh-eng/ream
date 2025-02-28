import { useEffect, useState } from 'react';

export function useSidePanelMessage() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const listener = (message: { action: string }) => {
      if (message.action === 'toggle-sidepanel') {
        setIsOpen((open) => !open);
      }
    };

    browser.runtime.onMessage.addListener(listener);
    return () => {
      browser.runtime.onMessage.removeListener(listener);
    };
  }, []);

  return { isOpen, setIsOpen };
}
