export interface Task {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  completed: boolean;
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  description: string;
  createdAt: string;
}

const KEYS = {
  TASKS: 'studyflow-tasks',
  SUBJECTS: 'studyflow-subjects',
} as const;

function getItem<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setItem<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export const storage = {
  getTasks: (): Task[] => getItem<Task>(KEYS.TASKS),
  setTasks: (tasks: Task[]): void => setItem(KEYS.TASKS, tasks),
  getSubjects: (): Subject[] => getItem<Subject>(KEYS.SUBJECTS),
  setSubjects: (subjects: Subject[]): void => setItem(KEYS.SUBJECTS, subjects),
};
