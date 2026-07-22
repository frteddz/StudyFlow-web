import { useState, useEffect } from 'react';
import { getDaysDifference } from '../utils/dateUtils';

interface CountdownProps {
  label: string;
  targetDate: string;
  color?: string;
}

export function Countdown({ label, targetDate, color = 'var(--color-primary)' }: CountdownProps) {
  const [diff, setDiff] = useState(() => getDaysDifference(new Date(), new Date(targetDate)));

  useEffect(() => {
    const timer = setInterval(() => {
      setDiff(getDaysDifference(new Date(), new Date(targetDate)));
    }, 60000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const days = Math.max(0, diff);
  const hours = 0;
  const minutes = 0;

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--color-border)',
        textAlign: 'center',
        animation: 'fadeIn 0.3s ease forwards',
      }}
    >
      <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 500, marginBottom: '12px' }}>
        {label}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
        <TimeBlock value={days} label="Days" color={color} />
        <TimeBlock value={hours} label="Hours" color={color} />
        <TimeBlock value={minutes} label="Min" color={color} />
      </div>
    </div>
  );
}

function TimeBlock({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          fontSize: '32px',
          fontWeight: 700,
          color,
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {String(value).padStart(2, '0')}
      </div>
      <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </div>
    </div>
  );
}
