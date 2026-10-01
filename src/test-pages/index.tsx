// ─── Test pages — router ─────────────────────────────────────────────────────
import type { ReactElement } from 'react';
import { DarkProvider } from '@onganda/design-system';
import { AppScreen } from './AppScreen';
import { Article } from './Article';
import { Dashboard } from './Dashboard';
import { FormPage } from './FormPage';
import { Landing } from './Landing';
import { Launch } from './Launch';
import { Studio } from './Studio';
import { TestIndex } from './shell';

const PAGES: Record<string, () => ReactElement> = {
  '/test/app': AppScreen,
  '/test/studio': Studio,
  '/test/dashboard': Dashboard,
  '/test/form': FormPage,
  '/test/landing': Landing,
  '/test/launch': Launch,
  '/test/article': Article
};

export const TestPages = ({ path }: { path: string }) => {
  const Page = PAGES[path] ?? TestIndex;
  // Every consumer app wraps in DarkProvider; so do these.
  return <DarkProvider><Page /></DarkProvider>;
};
