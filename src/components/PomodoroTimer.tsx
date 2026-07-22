import type { TimerMode } from '../hooks/useTimer';

interface PomodoroTimerProps {
  mode: TimerMode;
  minutes: number;
  seconds: number;
  progress: number;
  isRunning: boolean;
  sessionsCompleted: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSwitchMode: (mode: TimerMode) => void;
}

const MODE_LABELS: Record<TimerMode, string> = {
  focus: 'Focus',
  break: 'Break',
  longBreak: 'Long Break',
};

const RADIUS = 140;
const STROKE = 8;
const NORMALIZED = RADIUS - STROKE / 2;
const CIRCUMFERENCE = 2 * Math.PI * NORMALIZED;

export function PomodoroTimer({
  mode,
  minutes,
  seconds,
  progress,
  isRunning,
  sessionsCompleted,
  onStart,
  onPause,
  onReset,
  onSwitchMode,
}: PomodoroTimerProps) {
  const offset = CIRCUMFERENCE * (1 - progress);
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        padding: '32px',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--color-border)',
        animation: 'fadeIn 0.3s ease forwards',
      }}
    >
      <div style={{ display: 'flex', gap: '8px' }}>
        {(Object.keys(MODE_LABELS) as TimerMode[]).map(m => (
          <button
            key={m}
            onClick={() => onSwitchMode(m)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              background: mode === m ? 'var(--color-primary)' : 'var(--color-background)',
              color: mode === m ? '#fff' : 'var(--color-text-secondary)',
              transition: 'all var(--transition-fast)',
            }}
          >
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>

      <div style={{ position: 'relative', width: `${RADIUS * 2}px`, height: `${RADIUS * 2}px` }}>
        <svg width={RADIUS * 2} height={RADIUS * 2} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={RADIUS}
            cy={RADIUS}
            r={NORMALIZED}
            fill="none"
            stroke="var(--color-background)"
            strokeWidth={STROKE}
          />
          <circle
            cx={RADIUS}
            cy={RADIUS}
            r={NORMALIZED}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth={STROKE}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontSize: '52px',
              fontWeight: 700,
              color: 'var(--color-text)',
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1,
            }}
          >
            {timeStr}
          </div>
          <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '8px', fontWeight: 500 }}>
            {MODE_LABELS[mode]}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        {isRunning ? (
          <button
            onClick={onPause}
            style={btnStyle}
          >
            ⏸ Pause
          </button>
        ) : (
          <button
            onClick={onStart}
            style={{ ...btnStyle, background: 'var(--color-primary)', color: '#fff' }}
          >
            ▶ Start
          </button>
        )}
        <button
          onClick={onReset}
          style={{ ...btnStyle, background: 'var(--color-background)', color: 'var(--color-text-secondary)' }}
        >
          ↻ Reset
        </button>
      </div>

      <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
        Sessions completed: <strong style={{ color: 'var(--color-text)' }}>{sessionsCompleted}</strong>
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: '12px 28px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  fontSize: '15px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all var(--transition-fast)',
};
