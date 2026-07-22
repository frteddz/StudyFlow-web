import { useState, lazy, Suspense } from 'react';
import { useTheme } from './hooks/useTheme';
import { LicenseProvider, useLicense } from './licensing/LicenseProvider';
import { AnimatedBackground } from './components/AnimatedBackground';

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
  return <LicenseProvider productKey="StudyFlow"><AppInner /></LicenseProvider>;
}

function AppInner() {
  const [page, setPage] = useState<Page>(() => {
    return 'home';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark, toggle } = useTheme();
  const { isPro, loading: proLoading, setShowProModal } = useLicense();
  const PageComponent = PAGES[page];

  return (
    <>
      <AnimatedBackground />
      <button className="mobile-hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu"
        style={{ position: 'fixed', top: '0.75rem', left: '0.75rem', zIndex: 110, display: 'none', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)', cursor: 'pointer' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {mobileMenuOpen ? (
            <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
          ) : (
            <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
          )}
        </svg>
      </button>
      <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        {mobileMenuOpen && (
          <div onClick={() => setMobileMenuOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90 }}
            className="mobile-overlay" />
        )}
        <Sidebar
          currentPage={page}
          isDark={isDark}
          onNavigate={(p: Page) => { setPage(p); setMobileMenuOpen(false); }}
          onToggleTheme={toggle}
          isPro={isPro}
          proLoading={proLoading}
          onShowPro={() => setShowProModal(true)}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
        <main style={{ flex: 1, overflow: 'auto' }}>
          <Suspense fallback={<Loading />}>
            <PageComponent onNavigate={setPage} />
          </Suspense>
        </main>
      </div>
    </>
  );
}

interface SidebarProps {
  currentPage: Page;
  isDark: boolean;
  onNavigate: (page: Page) => void;
  onToggleTheme: () => void;
  isPro: boolean;
  proLoading: boolean;
  onShowPro: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

function Sidebar({ currentPage, isDark, onNavigate, onToggleTheme, isPro, proLoading, onShowPro, mobileMenuOpen, setMobileMenuOpen }: SidebarProps) {
  const isActive = (p: Page) => {
    if (p === 'home') return false;
    return currentPage === p;
  };

  return (
    <aside
      className={'sidebar-nav' + (mobileMenuOpen ? ' open' : '')}
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
        onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
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
        {!proLoading && (
          <span style={{
            fontSize: '0.625rem',
            fontWeight: 600,
            padding: '0.125rem 0.375rem',
            borderRadius: 'var(--radius-sm)',
            background: isPro ? 'var(--color-success-light)' : 'var(--color-warning-light)',
            color: isPro ? 'var(--color-success)' : 'var(--color-warning)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}>
            {isPro ? 'Pro' : 'Free'}
          </span>
        )}
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 10px' }}>
        {NAV_ITEMS.map(item => {
          const active = isActive(item.page);
          return (
            <button
              key={item.page}
              onClick={() => { onNavigate(item.page); setMobileMenuOpen(false); }}
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
        {!isPro && (
          <button
            onClick={onShowPro}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: 'var(--color-primary)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              width: '100%',
              marginBottom: '6px',
            }}
          >
            <span>⭐</span>
            Upgrade to Pro
          </button>
        )}
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
