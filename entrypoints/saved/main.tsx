import { createRoot } from 'react-dom/client';
import { Route, Router, Switch } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';

createRoot(document.getElementById('root')!).render(
  <>
    <Router hook={useHashLocation}>
      <Switch>
        <Route path='/'>
          <div className='w-full h-screen flex items-center justify-center'>
            <h1>Saved Articles Here today!</h1>
          </div>
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
