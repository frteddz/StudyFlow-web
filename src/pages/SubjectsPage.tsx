import { useState, useMemo } from 'react';
import { useSubjects } from '../hooks/useSubjects';
import { useTasks } from '../hooks/useTasks';
import { SubjectCard } from '../components/SubjectCard';
import { SubjectForm } from '../components/SubjectForm';
import type { Subject } from '../services/storageService';

export function SubjectsPage() {
  const { subjects, addSubject, updateSubject, deleteSubject } = useSubjects();
  const { tasks } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const stats = useMemo(() => {
    const map = new Map<string, { total: number; completed: number }>();
    subjects.forEach(s => map.set(s.id, { total: 0, completed: 0 }));
    tasks.forEach(t => {
      const entry = map.get(t.subjectId);
      if (entry) {
        entry.total++;
        if (t.completed) entry.completed++;
      }
    });
    return map;
  }, [subjects, tasks]);

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setShowForm(true);
  };

  const handleSave = (data: { name: string; color: string; description: string }) => {
    if (editingSubject) {
      updateSubject(editingSubject.id, data);
    } else {
      addSubject(data);
    }
    setShowForm(false);
    setEditingSubject(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSubject(null);
  };

  return (
    <div style={{ padding: '32px', maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text)' }}>Subjects</h2>
        <button
          onClick={() => setShowForm(true)}
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
          + Add Subject
        </button>
      </div>

      {subjects.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '48px',
            color: 'var(--color-text-secondary)',
            fontSize: '14px',
          }}
        >
          No subjects yet. Click "Add Subject" to create your first one!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {subjects.map(s => {
            const sStats = stats.get(s.id) ?? { total: 0, completed: 0 };
            return (
              <SubjectCard
                key={s.id}
                subject={s}
                taskCount={sStats.total}
                completedCount={sStats.completed}
                onEdit={handleEdit}
                onDelete={deleteSubject}
              />
            );
          })}
        </div>
      )}

      {showForm && (
        <SubjectForm
          initial={editingSubject}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
