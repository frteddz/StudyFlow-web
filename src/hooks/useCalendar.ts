import { useState, useMemo, useCallback } from 'react';
import { getMonthGrid, getDateString, isToday, isSameDay } from '../utils/dateUtils';
import type { Task } from '../services/storageService';

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: Task[];
}

export function useCalendar(tasks: Task[]) {
  const today = useMemo(() => new Date(), []);
  const [currentDate, setCurrentDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const weeks = useMemo(() => getMonthGrid(year, month), [year, month]);

  const days: CalendarDay[] = useMemo(() => {
    return weeks.flat().map(date => {
      const dateStr = getDateString(date);
      return {
        date,
        isCurrentMonth: date.getMonth() === month,
        isToday: isToday(date),
        tasks: tasks.filter(t => t.dueDate === dateStr && !t.completed),
      };
    });
  }, [weeks, month, tasks]);

  const selectedDayTasks = useMemo(() => {
    if (!selectedDate) return [];
    return tasks.filter(t => {
      const d = new Date(t.dueDate);
      return isSameDay(d, selectedDate);
    });
  }, [selectedDate, tasks]);

  const goToPrevMonth = useCallback(() => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedDate(null);
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setSelectedDate(null);
  }, []);

  const goToToday = useCallback(() => {
    const now = new Date();
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(now);
  }, []);

  const monthName = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return {
    currentDate,
    selectedDate,
    setSelectedDate,
    days,
    weeks,
    selectedDayTasks,
    monthName,
    goToPrevMonth,
    goToNextMonth,
    goToToday,
  };
}
