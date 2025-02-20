import ArticlesPage from '@/entrypoints/saved/pages/articles';
import { createRoot } from 'react-dom/client';
import { Route, Router, Switch } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';

createRoot(document.getElementById('root')!).render(
  <>
    <Router hook={useHashLocation}>
      <Switch>
        <Route path='/'>
          <ArticlesPage />
        </Route>
        <Route path='/saved'>
          <div className='w-full h-screen flex items-center justify-center'>
            <h1>saveddddd</h1>
          </div>
        </Route>
      </Switch>
    </Router>
  </>
);
