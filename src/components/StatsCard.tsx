import type { ReactNode } from 'react';

interface StatsCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
}

const cardStyle: React.CSSProperties = {
  background: 'var(--color-surface)',
  borderRadius: 'var(--radius-lg)',
  padding: '20px',
  boxShadow: 'var(--shadow-sm)',
  border: '1px solid var(--color-border)',
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  animation: 'fadeIn 0.3s ease forwards',
};

export function StatsCard({ icon, label, value }: StatsCardProps) {
  return (
    <div style={cardStyle}>
      <div style={{ fontSize: '28px', lineHeight: 1 }}>{icon}</div>
      <div>
        <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
          {label}
        </div>
        <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.3 }}>
          {value}
        </div>
      </div>
    </div>
  );
}
