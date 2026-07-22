import { useState, useMemo } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useSubjects } from '../hooks/useSubjects';
import { useCalendar } from '../hooks/useCalendar';
import { CalendarGrid } from '../components/CalendarGrid';
import { TaskCard } from '../components/TaskCard';
import { TaskForm } from '../components/TaskForm';
import { getDateString } from '../utils/dateUtils';
import type { Task } from '../services/storageService';

export function CalendarPage() {
  const { tasks, addTask, updateTask, deleteTask, toggleComplete } = useTasks();
  const { subjects, getSubject } = useSubjects();
  const {
    days, weeks, selectedDate, setSelectedDate,
    selectedDayTasks, monthName,
    goToPrevMonth, goToNextMonth, goToToday,
  } = useCalendar(tasks);

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const preselectedDate = useMemo(() => {
    return selectedDate ? getDateString(selectedDate) : '';
  }, [selectedDate]);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleSave = (data: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
    } else {
      addTask(data);
    }
    setShowForm(false);
    setEditingTask(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  return (
    <div style={{ padding: '32px', maxWidth: '960px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '24px' }}>
        Calendar
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 320px',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        <div
          style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <button onClick={goToPrevMonth} style={navBtnStyle}>
              ←
            </button>
            <div style={{ fontWeight: 600, fontSize: '16px', color: 'var(--color-text)' }}>
              {monthName}
            </div>
            <button onClick={goToNextMonth} style={navBtnStyle}>
              →
            </button>
          </div>

          <CalendarGrid
            days={days}
            weeks={weeks}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />

          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <button
              onClick={goToToday}
              style={{
                padding: '6px 16px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-background)',
                color: 'var(--color-text)',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Today
            </button>
          </div>
        </div>

        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text)' }}>
              {selectedDate
                ? selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
                : 'Select a date'}
            </h3>
            {selectedDate && (
              <button
                onClick={() => setShowForm(true)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: 'var(--color-primary)',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                + Add
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {selectedDayTasks.length === 0 ? (
              <div
                style={{
                  background: 'var(--color-surface)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  textAlign: 'center',
                  color: 'var(--color-text-secondary)',
                  fontSize: '13px',
                  border: '1px solid var(--color-border)',
                }}
              >
                {selectedDate ? 'No tasks for this day' : 'Click a date to see tasks'}
              </div>
            ) : (
              selectedDayTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  subject={getSubject(task.subjectId)}
                  onToggle={toggleComplete}
                  onEdit={handleEdit}
                  onDelete={deleteTask}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <TaskForm
          subjects={subjects}
          initial={editingTask}
          preselectedDate={preselectedDate}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

const navBtnStyle: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  background: 'var(--color-background)',
  color: 'var(--color-text)',
  fontSize: '16px',
  cursor: 'pointer',
  fontWeight: 500,
};
