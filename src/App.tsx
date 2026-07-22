import { useState, lazy, Suspense } from 'react';
import { useTheme } from './hooks/useTheme';

export type Page = 'home' | 'dashboard' | 'tasks' | 'subjects' | 'calendar' | 'timer';

const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const TasksPage = lazy(() => import('./pages/TasksPage').then(m => ({ default: m.TasksPage })));
const SubjectsPage = lazy(() => import('./pages/SubjectsPage').then(m => ({ default: m.SubjectsPage })));
const CalendarPage = lazy(() => import('./pages/CalendarPage').then(m => ({ default: m.CalendarPage })));
const TimerPage = lazy(() => import('./pages/TimerPage').then(m => ({ default: m.TimerPage })));

const NAV_ITEMS: { page: Page; icon: string; label: string }[] = [
  { page: 'dashboard', icon: '📊', label: 'Dashboard' },
  { page: 'tasks', icon: '📋', label: 'Tasks' },
  { page: 'subjects', icon: '📚', label: 'Subjects' },
  { page: 'calendar', icon: '📅', label: 'Calendar' },
  { page: 'timer', icon: '🍅', label: 'Timer' },
];

const PAGES: Record<Page, React.LazyExoticComponent<(props: any) => React.JSX.Element>> = {
  home: HomePage,
  dashboard: DashboardPage,
  tasks: TasksPage,
  subjects: SubjectsPage,
  calendar: CalendarPage,
  timer: TimerPage,
};

function Loading() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '40px' }}>
      <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Loading...</div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>(() => {
    return 'home';
  });
  const { isDark, toggle } = useTheme();
  const PageComponent = PAGES[page];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        currentPage={page}
        isDark={isDark}
        onNavigate={setPage}
        onToggleTheme={toggle}
      />
      <main style={{ flex: 1, overflow: 'auto' }}>
        <Suspense fallback={<Loading />}>
          <PageComponent onNavigate={setPage} />
        </Suspense>
      </main>
    </div>
  );
}

interface SidebarProps {
  currentPage: Page;
  isDark: boolean;
  onNavigate: (page: Page) => void;
  onToggleTheme: () => void;
}

function Sidebar({ currentPage, isDark, onNavigate, onToggleTheme }: SidebarProps) {
  const isActive = (p: Page) => {
    if (p === 'home') return false;
    return currentPage === p;
  };

  return (
    <aside
      style={{
        width: '220px',
        background: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 0',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}
    >
      <div
        onClick={() => onNavigate('home')}
        style={{
          padding: '0 20px',
          marginBottom: '32px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <span style={{ fontSize: '24px' }}>📖</span>
        <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-primary)' }}>
          StudyFlow
        </span>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 10px' }}>
        {NAV_ITEMS.map(item => {
          const active = isActive(item.page);
          return (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: active ? 'var(--color-primary-light)' : 'transparent',
                color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                fontWeight: active ? 600 : 400,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: '0 10px', marginTop: 'auto' }}>
        <button
          onClick={onToggleTheme}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 12px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            background: 'transparent',
            color: 'var(--color-text-secondary)',
            fontSize: '14px',
            cursor: 'pointer',
            width: '100%',
            transition: 'background var(--transition-fast)',
          }}
        >
          <span style={{ fontSize: '16px' }}>{isDark ? '☀️' : '🌙'}</span>
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </aside>
  );
}
