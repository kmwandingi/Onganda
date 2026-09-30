// ─── Test pages — router ─────────────────────────────────────────────────────
import type { ReactElement } from 'react';
import { AppScreen } from './AppScreen';
import { Article } from './Article';
import { Dashboard } from './Dashboard';
import { FormPage } from './FormPage';
import { Landing } from './Landing';
import { TestIndex } from './shell';

const PAGES: Record<string, () => ReactElement> = {
  '/test/app': AppScreen,
  '/test/dashboard': Dashboard,
  '/test/form': FormPage,
  '/test/landing': Landing,
  '/test/article': Article
};

export const TestPages = ({ path }: { path: string }) => {
  const Page = PAGES[path] ?? TestIndex;
  return <Page />;
};
