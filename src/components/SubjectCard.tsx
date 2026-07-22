import type { Subject } from '../services/storageService';

interface SubjectCardProps {
  subject: Subject;
  taskCount: number;
  completedCount: number;
  onEdit: (subject: Subject) => void;
  onDelete: (id: string) => void;
}

const cardStyle: React.CSSProperties = {
  background: 'var(--color-surface)',
  borderRadius: 'var(--radius-lg)',
  padding: '20px',
  boxShadow: 'var(--shadow-sm)',
  border: '1px solid var(--color-border)',
  animation: 'fadeIn 0.3s ease forwards',
};

export function SubjectCard({ subject, taskCount, completedCount, onEdit, onDelete }: SubjectCardProps) {
  const progress = taskCount > 0 ? completedCount / taskCount : 0;

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <div
          style={{
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            background: subject.color,
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--color-text)' }}>
            {subject.name}
          </div>
          {subject.description && (
            <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              {subject.description}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => onEdit(subject)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-secondary)',
              fontSize: '16px',
              padding: '4px',
              cursor: 'pointer',
            }}
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(subject.id)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-secondary)',
              fontSize: '16px',
              padding: '4px',
              cursor: 'pointer',
            }}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>
      <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
        {taskCount} task{taskCount !== 1 ? 's' : ''}
      </div>
      <div
        style={{
          height: '6px',
          background: 'var(--color-background)',
          borderRadius: '3px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${Math.round(progress * 100)}%`,
            background: subject.color,
            borderRadius: '3px',
            transition: 'width var(--transition-normal)',
          }}
        />
      </div>
    </div>
  );
}
