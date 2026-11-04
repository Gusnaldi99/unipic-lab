'use client';

import React, { useState } from 'react';
import { Calendar, Video, Image as ImageIcon, ChevronRight } from 'lucide-react';
import { ContentCardItem } from '@/types/dashboard';

interface ContentCalendarMonthViewProps {
  cards: ContentCardItem[];
  brandName?: string;
  onCardClick?: (card: ContentCardItem) => void;
  onAddNewCardForDate?: (dateStr: string) => void;
}

const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export const ContentCalendarMonthView: React.FC<ContentCalendarMonthViewProps> = ({
  cards,
  brandName = 'Semua Brand',
  onCardClick,
  onAddNewCardForDate,
}) => {
  // November 2026 starts on Sunday (day 0), has 30 days
  const totalDays = 30;
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);

  // Default selected date: 18 or first date with cards
  const [selectedDay, setSelectedDay] = useState<number>(18);

  const getCardsForDate = (dayNum: number) => {
    const formatted = `2026-11-${dayNum < 10 ? '0' + dayNum : dayNum}`;
    return cards.filter((c) => c.dueDate === formatted);
  };

  const selectedDateStr = `2026-11-${selectedDay < 10 ? '0' + selectedDay : selectedDay}`;
  const selectedDateCards = cards.filter((c) => c.dueDate === selectedDateStr);

  return (
    <div className="calendar-month-container">
      {/* Calendar Header */}
      <div className="calendar-header-row">
        <div>
          <h3 className="calendar-title">
            Kalender Konten · November 2026
          </h3>
          <span className="calendar-subtitle">
            {brandName}
          </span>
        </div>
      </div>

      {/* Weekdays Header */}
      <div className="calendar-days-header">
        {dayNames.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      {/* Grid Cells */}
      <div className="calendar-grid-cells">
        {daysArray.map((dayNum) => {
          const dayCards = getCardsForDate(dayNum);
          const isToday = dayNum === 18;
          const isSelected = dayNum === selectedDay;

          return (
            <div
              key={dayNum}
              className={`cal-day-cell ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}`}
              onClick={() => setSelectedDay(dayNum)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedDay(dayNum);
                }
              }}
              aria-label={`Tanggal ${dayNum} November 2026, ${dayCards.length} konten`}
            >
              <div className="cal-cell-top">
                <span className="cal-day-num">{dayNum}</span>
                {dayCards.length > 0 && (
                  <span className="cal-post-counter">
                    {dayCards.length}
                  </span>
                )}
              </div>

              {/* Mobile Indicator Dots (Only visible on narrow screens) */}
              {dayCards.length > 0 && (
                <div className="cal-dots-mobile" aria-hidden="true">
                  {dayCards.slice(0, 3).map((c) => (
                    <span
                      key={c.id}
                      className={`cal-dot-indicator ${
                        c.format.toLowerCase().includes('video') ? 'dot-video' : 'dot-graphic'
                      }`}
                    />
                  ))}
                  {dayCards.length > 3 && (
                    <span className="cal-dot-more">+{dayCards.length - 3}</span>
                  )}
                </div>
              )}

              {/* Desktop Post Chips (Visible on tablet/desktop) */}
              <div className="cal-chips-desktop">
                {dayCards.slice(0, 2).map((c) => (
                  <div
                    key={c.id}
                    className="cal-post-chip"
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      onCardClick && onCardClick(c);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.stopPropagation();
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
                    }}
                    title={`${c.title} (${c.format} - ${c.status})`}
                  >
                    {c.format.includes('Video') ? '🎬 ' : '🖼️ '}
                    {c.title}
                  </div>
                ))}
                {dayCards.length > 2 && (
                  <span className="cal-more-label">
                    +{dayCards.length - 2} lainnya
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Day Agenda Breakdown */}
      <div className="cal-mobile-agenda" aria-label={`Agenda tanggal ${selectedDay} November 2026`}>
        <div className="agenda-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="agenda-date-badge">
              {selectedDay} Nov 2026
            </span>
            <span className="agenda-count-text">
              {selectedDateCards.length} Konten Terjadwal
            </span>
          </div>

          {onAddNewCardForDate && (
            <button
              type="button"
              className="btn-agenda-add"
              onClick={() => onAddNewCardForDate(selectedDateStr)}
            >
              + Jadwalkan
            </button>
          )}
        </div>

        {selectedDateCards.length === 0 ? (
          <div className="agenda-empty-box">
            <Calendar size={20} color="var(--text-muted)" />
            <span>Tidak ada postingan yang dijadwalkan di tanggal ini</span>
          </div>
        ) : (
          <div className="agenda-cards-list">
            {selectedDateCards.map((card) => {
              const isVideo = card.format.toLowerCase().includes('video');
              return (
                <div
                  key={card.id}
                  className="agenda-card-item"
                  role="button"
                  tabIndex={0}
                  onClick={() => onCardClick && onCardClick(card)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onCardClick && onCardClick(card);
                    }
                  }}
                >
                  <div className="agenda-card-left">
                    <div className={`agenda-format-icon ${isVideo ? 'bg-video' : 'bg-graphic'}`}>
                      {isVideo ? <Video size={14} /> : <ImageIcon size={14} />}
                    </div>
                    <div className="agenda-card-info">
                      <div className="agenda-meta-row">
                        <span className="agenda-format-badge">{card.format}</span>
                        <span className="agenda-pillar-badge">{card.pillar}</span>
                        <span className="agenda-status-badge">{card.status}</span>
                      </div>
                      <h4 className="agenda-card-title">{card.title}</h4>
                      {card.captionSnippet && (
                        <p className="agenda-card-snippet">{card.captionSnippet}</p>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={16} color="var(--text-muted)" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
