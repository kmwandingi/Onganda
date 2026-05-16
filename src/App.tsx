import { useEffect, useMemo, useState } from 'react';
import { Container, Theme } from './settings/types';
import {
  NamibiaAISystemsHub,
  OkaandaPublicSite,
} from './components/generated/okaanda-design-system';

const theme: Theme = 'light';
// only use 'centered' container for standalone components, never for full page apps or websites.
const container: Container = 'none';

function App() {
  const [path, setPath] = useState(window.location.pathname);

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
    if (path === '/showcase') return <NamibiaAISystemsHub />;
    if (path === '/systems') return <OkaandaPublicSite page="systems" />;
    if (path === '/contact') return <OkaandaPublicSite page="contact" />;
    if (path === '/full') return <OkaandaPublicSite page="full" />;
    return <OkaandaPublicSite page="home" />;
  }, [path]);

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
