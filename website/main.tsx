import { PortalTargetContext } from '@/hooks/portal-target-context';
import { setupThemeManagement } from '@/lib/shell';
import Website from '@/website/Website';
import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { DropdownProvider } from '~/hooks/active-dropdown-context';

const Root = () => {
  useEffect(() => {
    const observer = setupThemeManagement(document.body);
    return () => {
      observer.then((observer) => observer.disconnect());
    };
  }, []);

  return (
    <>
      <PortalTargetContext.Provider value={document.body}>
        <DropdownProvider>
          <Website />
        </DropdownProvider>
      </PortalTargetContext.Provider>
    </>
  );
};

createRoot(document.getElementById('root')!).render(<Root />);
