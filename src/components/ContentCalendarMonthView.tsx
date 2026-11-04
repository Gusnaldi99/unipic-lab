'use client';

import React from 'react';
import { ContentCardItem } from '@/types/dashboard';

interface ContentCalendarMonthViewProps {
  cards: ContentCardItem[];
  brandName?: string;
  onCardClick?: (card: ContentCardItem) => void;
}

const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export const ContentCalendarMonthView: React.FC<ContentCalendarMonthViewProps> = ({
  cards,
  brandName = 'Semua Brand',
  onCardClick,
}) => {
  // November 2026 starts on Sunday (day 0), has 30 days
  const totalDays = 30;
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);

  const getCardsForDate = (dayNum: number) => {
    const formatted = `2026-11-${dayNum < 10 ? '0' + dayNum : dayNum}`;
    return cards.filter((c) => c.dueDate === formatted);
  };

  return (
    <div className="calendar-month-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--navy-900)' }}>
          Kalender Konten · November 2026
        </h3>
        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
          {brandName}
        </span>
      </div>

      <div className="calendar-days-header">
        {dayNames.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className="calendar-grid-cells">
        {daysArray.map((dayNum) => {
          const dayCards = getCardsForDate(dayNum);
          const isToday = dayNum === 18; // Nov 18 marker

          return (
            <div
              key={dayNum}
              className={`cal-day-cell ${isToday ? 'is-today' : ''}`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="cal-day-num">{dayNum}</span>
                {dayCards.length > 0 && (
                  <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--primary-600)' }}>
                    {dayCards.length} Post
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '2px' }}>
                {dayCards.slice(0, 2).map((c) => (
                  <div
                    key={c.id}
                    className="cal-post-chip"
                    role="button"
                    tabIndex={0}
                    onClick={() => onCardClick && onCardClick(c)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onCardClick && onCardClick(c);
                      }
                    }}
                    style={{
                      background: c.format.toLowerCase().includes('video')
                        ? '#EEF0FF'
                        : '#E6F7EE',
                      color: c.format.toLowerCase().includes('video')
                        ? 'var(--primary-600)'
                        : 'var(--success)',
                      cursor: 'pointer',
                    }}
                    title={`${c.title} (${c.format} - ${c.status})`}
                  >
                    {c.format.includes('Video') ? '🎬 ' : '🖼️ '}
                    {c.title}
                  </div>
                ))}
                {dayCards.length > 2 && (
                  <span style={{ fontSize: '8px', color: 'var(--text-muted)', fontWeight: 600 }}>
                    +{dayCards.length - 2} konten lainnya
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
