import { useState, useCallback, useEffect } from 'react';
import { storage, type Subject } from '../services/storageService';

export function useSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    setSubjects(storage.getSubjects());
  }, []);

  const persist = useCallback((updated: Subject[]) => {
    setSubjects(updated);
    storage.setSubjects(updated);
  }, []);

  const addSubject = useCallback(
    (data: Omit<Subject, 'id' | 'createdAt'>) => {
      const subject: Subject = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      persist([...subjects, subject]);
      return subject;
    },
    [subjects, persist]
  );

  const updateSubject = useCallback(
    (id: string, updates: Partial<Subject>) => {
      persist(subjects.map(s => (s.id === id ? { ...s, ...updates } : s)));
    },
    [subjects, persist]
  );

  const deleteSubject = useCallback(
    (id: string) => {
      persist(subjects.filter(s => s.id !== id));
    },
    [subjects, persist]
  );

  const getSubject = useCallback(
    (id: string) => subjects.find(s => s.id === id),
    [subjects]
  );

  return { subjects, addSubject, updateSubject, deleteSubject, getSubject };
}
