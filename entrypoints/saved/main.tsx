import ArticlesPage from '@/entrypoints/saved/pages/articles';
import SavedArticlePage from '@/entrypoints/saved/pages/saved-article';
import { setupThemeManagement } from '@/lib/shell';
import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Route, Router, Switch } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import { PortalTargetContext } from '@/hooks/portal-target-context';

function Root() {
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
          <Router hook={useHashLocation}>
            <Switch>
              <Route path='/'>
                <ArticlesPage />
              </Route>
              <Route path='/article/:url'>
                {(params) => {
                  const decodedUrl = decodeURIComponent(params.url);
                  return <SavedArticlePage url={decodedUrl} />;
                }}
              </Route>
            </Switch>
          </Router>
        </DropdownProvider>
      </PortalTargetContext.Provider>
    </>
  );
}

createRoot(document.getElementById('root')!).render(<Root />);
