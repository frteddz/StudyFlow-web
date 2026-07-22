import type { Page } from '../App';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

const FEATURES = [
  { icon: '📋', title: 'Tasks', desc: 'Manage assignments with priorities and deadlines' },
  { icon: '📚', title: 'Subjects', desc: 'Organize courses with color coding' },
  { icon: '⏰', title: 'Exam Countdown', desc: 'Track days until exams' },
  { icon: '🍅', title: 'Pomodoro Timer', desc: 'Stay focused with timed sessions' },
  { icon: '📅', title: 'Calendar', desc: 'Visualize your schedule monthly' },
  { icon: '💾', title: 'Local Storage', desc: 'All data stays on your device' },
];

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '40px 20px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>📖</div>
      <h1
        style={{
          fontSize: '42px',
          fontWeight: 700,
          color: 'var(--color-primary)',
          marginBottom: '8px',
          letterSpacing: '-0.5px',
        }}
      >
        StudyFlow
      </h1>
      <p style={{ fontSize: '18px', color: 'var(--color-text-secondary)', marginBottom: '48px' }}>
        Study Planner
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '16px',
          maxWidth: '700px',
          width: '100%',
        }}
      >
        {FEATURES.map(f => (
          <div
            key={f.title}
            style={{
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--color-border)',
              animation: 'fadeIn 0.3s ease forwards',
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{f.icon}</div>
            <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-text)', marginBottom: '4px' }}>
              {f.title}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              {f.desc}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => onNavigate('dashboard')}
        style={{
          marginTop: '40px',
          padding: '14px 40px',
          borderRadius: 'var(--radius-md)',
          border: 'none',
          background: 'var(--color-primary)',
          color: '#fff',
          fontSize: '16px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'background var(--transition-fast)',
        }}
      >
        Get Started
      </button>
    </div>
  );
}
