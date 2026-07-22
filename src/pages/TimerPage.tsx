import { useTasks } from '../hooks/useTasks';
import { useSubjects } from '../hooks/useSubjects';
import { useTimer } from '../hooks/useTimer';
import { PomodoroTimer } from '../components/PomodoroTimer';

export function TimerPage() {
  const { tasks } = useTasks();
  const { getSubject } = useSubjects();
  const {
    mode, minutes, seconds, progress, isRunning,
    sessionsCompleted, selectedTaskId, setSelectedTaskId,
    start, pause, reset, switchMode,
  } = useTimer();

  const activeTasks = tasks.filter(t => !t.completed);

  return (
    <div style={{ padding: '32px', maxWidth: '700px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '24px' }}>
        Pomodoro Timer
      </h2>

      <PomodoroTimer
        mode={mode}
        minutes={minutes}
        seconds={seconds}
        progress={progress}
        isRunning={isRunning}
        sessionsCompleted={sessionsCompleted}
        onStart={start}
        onPause={pause}
        onReset={reset}
        onSwitchMode={switchMode}
      />

      <div
        style={{
          marginTop: '24px',
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--color-border)',
          animation: 'fadeIn 0.3s ease forwards',
        }}
      >
        <label
          style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--color-text)',
            marginBottom: '10px',
          }}
        >
          Focus on Task
        </label>
        <select
          value={selectedTaskId ?? ''}
          onChange={e => setSelectedTaskId(e.target.value || null)}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            fontSize: '14px',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="">No specific task</option>
          {activeTasks.map(task => {
            const subj = getSubject(task.subjectId);
            return (
              <option key={task.id} value={task.id}>
                {task.title}{subj ? ` (${subj.name})` : ''}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}
