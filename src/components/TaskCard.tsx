import type { Task, Subject } from '../services/storageService';

interface TaskCardProps {
  task: Task;
  subject?: Subject;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const PRIORITY_STYLES: Record<string, React.CSSProperties> = {
  high: { background: 'var(--color-error-light)', color: 'var(--color-error)' },
  medium: { background: 'var(--color-warning-light)', color: 'var(--color-warning)' },
  low: { background: 'var(--color-success-light)', color: 'var(--color-success)' },
};

const cardStyle: React.CSSProperties = {
  background: 'var(--color-surface)',
  borderRadius: 'var(--radius-md)',
  padding: '14px 16px',
  boxShadow: 'var(--shadow-sm)',
  border: '1px solid var(--color-border)',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  transition: 'opacity var(--transition-fast), border-color var(--transition-fast)',
  animation: 'fadeIn 0.25s ease forwards',
};

export function TaskCard({ task, subject, onToggle, onEdit, onDelete }: TaskCardProps) {
  const priorityLabel = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);

  return (
    <div
      style={{
        ...cardStyle,
        opacity: task.completed ? 0.6 : 1,
        borderLeft: subject ? `4px solid ${subject.color}` : '4px solid var(--color-border)',
      }}
    >
      <label style={{ flexShrink: 0, paddingTop: '2px' }}>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--color-primary)' }}
        />
      </label>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '15px',
            fontWeight: 500,
            color: 'var(--color-text)',
            textDecoration: task.completed ? 'line-through' : 'none',
            marginBottom: '6px',
          }}
        >
          {task.title}
        </div>

        {task.description && (
          <div
            style={{
              fontSize: '13px',
              color: 'var(--color-text-secondary)',
              marginBottom: '8px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {task.description}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {subject && (
            <span
              style={{
                fontSize: '12px',
                fontWeight: 500,
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm)',
                background: subject.color + '20',
                color: subject.color,
              }}
            >
              {subject.name}
            </span>
          )}

          <span
            style={{
              fontSize: '12px',
              fontWeight: 500,
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              ...PRIORITY_STYLES[task.priority],
            }}
          >
            {priorityLabel}
          </span>

          {task.dueDate && (
            <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
              📅 {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
        <button
          onClick={() => onEdit(task)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '15px', color: 'var(--color-text-secondary)',
            padding: '4px',
          }}
          title="Edit"
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete(task.id)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '15px', color: 'var(--color-text-secondary)',
            padding: '4px',
          }}
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
