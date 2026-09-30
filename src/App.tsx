import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { Container, Theme } from './settings/types';
import { OngandaPublicSite } from './components/onganda/onganda-public-sites';

// Showcase pulls in the full hub (editors, charts, authoring); keep it out of
// the public-page chunk.
const NamibiaAISystemsHub = lazy(() =>
  import('./components/onganda/NamibiaAISystemsHub').then(m => ({ default: m.NamibiaAISystemsHub }))
);

// Consumer test pages: built only from the package, see src/test-pages.
const TestPages = lazy(() => import('./test-pages').then(m => ({ default: m.TestPages })));

const theme: Theme = 'light';
// only use 'centered' container for standalone components, never for full page apps or websites.
const container: Container = 'none';

function App() {
  const [path, setPath] = useState(window.location.pathname);
  const routePath = path.replace(/\/+$/, '') || '/';

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  function setTheme(theme: Theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  setTheme(theme);

  const generatedComponent = useMemo(() => {
    if (routePath === '/showcase') return <Suspense fallback={null}><NamibiaAISystemsHub /></Suspense>;
    if (routePath === '/full') return <OngandaPublicSite page="full" />;
    if (routePath === '/test' || routePath.startsWith('/test/')) return <Suspense fallback={null}><TestPages path={routePath} /></Suspense>;
    return <OngandaPublicSite page="home" />;
  }, [routePath]);

  if (container === 'centered') {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center">
        {generatedComponent}
      </div>
    );
  } else {
    return generatedComponent;
  }
}

export default App;
