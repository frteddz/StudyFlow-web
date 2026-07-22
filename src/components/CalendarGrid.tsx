import { useMemo } from 'react';
import { getDateString } from '../utils/dateUtils';
import type { CalendarDay } from '../hooks/useCalendar';

interface CalendarGridProps {
  days: CalendarDay[];
  weeks: Date[][];
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const cellStyle: React.CSSProperties = {
  width: '100%',
  aspectRatio: '1',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 'var(--radius-md)',
  cursor: 'pointer',
  border: 'none',
  background: 'none',
  fontFamily: 'inherit',
  fontSize: '14px',
  transition: 'background var(--transition-fast)',
  position: 'relative',
  padding: '4px',
};

export function CalendarGrid({ days, weeks, selectedDate, onSelectDate }: CalendarGridProps) {
  const dayMap = useMemo(() => {
    const map = new Map<string, CalendarDay>();
    days.forEach(d => {
      map.set(getDateString(d.date), d);
    });
    return map;
  }, [days]);

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '2px',
          marginBottom: '4px',
        }}
      >
        {DAY_NAMES.map(name => (
          <div
            key={name}
            style={{
              textAlign: 'center',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--color-text-tertiary)',
              padding: '8px 0',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {name}
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '2px',
        }}
      >
        {weeks.flat().map((date, idx) => {
          const key = getDateString(date);
          const day = dayMap.get(key);
          const isSelected = selectedDate && getDateString(selectedDate) === key;
          const isCurrentMonth = day?.isCurrentMonth ?? date.getMonth() === weeks[0][0].getMonth();
          const isToday = day?.isToday ?? false;
          const taskCount = day?.tasks.length ?? 0;

          return (
            <button
              key={idx}
              onClick={() => onSelectDate(date)}
              style={{
                ...cellStyle,
                background: isSelected
                  ? 'var(--color-primary)'
                  : isToday
                  ? 'var(--color-primary-light)'
                  : 'transparent',
                color: isSelected
                  ? '#fff'
                  : isCurrentMonth
                  ? 'var(--color-text)'
                  : 'var(--color-text-tertiary)',
                fontWeight: isToday ? 700 : 500,
              }}
            >
              <span>{date.getDate()}</span>
              {taskCount > 0 && (
                <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>
                  {Array.from({ length: Math.min(taskCount, 3) }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        background: isSelected ? '#fff' : 'var(--color-primary)',
                      }}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
