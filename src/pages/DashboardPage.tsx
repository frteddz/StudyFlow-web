import { useState, useMemo } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useSubjects } from '../hooks/useSubjects';
import { useTimer } from '../hooks/useTimer';
import { StatsCard } from '../components/StatsCard';
import { Countdown } from '../components/Countdown';
import { TaskCard } from '../components/TaskCard';
import { TaskForm } from '../components/TaskForm';

export function DashboardPage() {
  const {
    tasks, addTask, deleteTask, toggleComplete, getUpcomingTasks,
  } = useTasks();
  const { subjects, getSubject } = useSubjects();
  const { sessionsCompleted } = useTimer();
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const upcoming = useMemo(() => getUpcomingTasks(7), [getUpcomingTasks]);
  const totalActive = tasks.filter(t => !t.completed).length;
  const completedToday = tasks.filter(t => {
    if (!t.completed) return false;
    const d = new Date(t.dueDate);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  const examSubjects = useMemo(() => {
    return subjects.filter(s => {
      const subjTasks = tasks.filter(t => t.subjectId === s.id && !t.completed);
      return subjTasks.length > 0;
    });
  }, [subjects, tasks]);

  return (
    <div style={{ padding: '32px', maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text)' }}>Dashboard</h2>
        <button
          onClick={() => setShowQuickAdd(true)}
          style={{
            padding: '10px 20px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            background: 'var(--color-primary)',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          + Quick Add
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        <StatsCard icon="📋" label="Active Tasks" value={totalActive} />
        <StatsCard icon="✅" label="Completed Today" value={completedToday} />
        <StatsCard icon="🍅" label="Pomodoro Sessions" value={sessionsCompleted} />
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '16px' }}>
          Upcoming Tasks (next 7 days)
        </h3>
        {upcoming.length === 0 ? (
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
            No upcoming tasks. Add some tasks to get started!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {upcoming.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                subject={getSubject(task.subjectId)}
                onToggle={toggleComplete}
                onEdit={() => {}}
                onDelete={deleteTask}
              />
            ))}
          </div>
        )}
      </div>

      {examSubjects.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '16px' }}>
            Exam Countdowns
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '16px',
            }}
          >
            {examSubjects.slice(0, 4).map(s => {
              const nearestTask = tasks
                .filter(t => t.subjectId === s.id && !t.completed && new Date(t.dueDate) > new Date())
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];
              if (!nearestTask) return null;
              return (
                <Countdown
                  key={s.id}
                  label={s.name}
                  targetDate={nearestTask.dueDate}
                  color={s.color}
                />
              );
            })}
          </div>
        </div>
      )}

      <div>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '16px' }}>
          Today's Study Time
        </h3>
        <div
          style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--color-border)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--color-primary)' }}>
            {sessionsCompleted * 25}
          </div>
          <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
            minutes focused today
          </div>
        </div>
      </div>

      {showQuickAdd && (
        <TaskForm
          subjects={subjects}
          onSave={data => {
            addTask(data);
            setShowQuickAdd(false);
          }}
          onCancel={() => setShowQuickAdd(false)}
        />
      )}
    </div>
  );
}
