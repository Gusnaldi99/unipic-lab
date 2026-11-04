'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Video,
  Image as ImageIcon,
  GripVertical,
  Layers,
  Filter,
  Plus,
} from 'lucide-react';
import { ContentCardItem, ContentStatus } from '@/types/dashboard';

interface ContentKanbanBoardProps {
  cards: ContentCardItem[];
  onUpdateCardStatus: (cardId: string, newStatus: ContentStatus) => void;
  onCardClick: (card: ContentCardItem) => void;
  onAddNewCard: (initialStatus?: ContentStatus) => void;
  searchQuery: string;
}

interface ColumnDef {
  status: ContentStatus;
  title: string;
  dotClass: string;
}

const columns: ColumnDef[] = [
  { status: 'ide', title: 'Ide & Draft', dotClass: 'dot-ide' },
  { status: 'production', title: 'Produksi', dotClass: 'dot-production' },
  { status: 'ready', title: 'Siap Tayang', dotClass: 'dot-ready' },
  { status: 'published', title: 'Published', dotClass: 'dot-published' },
];

export const normalizeCardStatus = (
  status: ContentStatus
): 'ide' | 'production' | 'ready' | 'published' => {
  if (status === 'copywriting' || status === 'review') return 'production';
  return status as 'ide' | 'production' | 'ready' | 'published';
};

export const ContentKanbanBoard: React.FC<ContentKanbanBoardProps> = ({
  cards,
  onUpdateCardStatus,
  onCardClick,
  onAddNewCard,
  searchQuery,
}) => {
  const [weekFilter, setWeekFilter] = useState<string>('all');
  const [formatFilter, setFormatFilter] = useState<string>('all');
  const [activeMobileTab, setActiveMobileTab] = useState<'all' | ContentStatus>('all');
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<ContentStatus | null>(null);

  // Filter Cards
  const filteredCards = cards.filter((card) => {
    const matchesSearch =
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.pillar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.platform.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesWeek =
      weekFilter === 'all' || card.week.toLowerCase() === weekFilter.toLowerCase();

    const matchesFormat =
      formatFilter === 'all' ||
      card.format.toLowerCase().includes(formatFilter.toLowerCase());

    return matchesSearch && matchesWeek && matchesFormat;
  });

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    e.dataTransfer.setData('text/plain', cardId);
    setDraggedCardId(cardId);
  };

  const handleDragEnd = () => {
    setDraggedCardId(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, status: ContentStatus) => {
    e.preventDefault();
    if (dragOverColumn !== status) {
      setDragOverColumn(status);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: ContentStatus) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('text/plain') || draggedCardId;
    if (cardId) {
      onUpdateCardStatus(cardId, targetStatus);
    }
    setDraggedCardId(null);
    setDragOverColumn(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Filter Toolbar */}
      <div className="calendar-controls-bar">
        <div className="calendar-filters-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={13} color="var(--text-muted)" />
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Filter:
            </span>
          </div>

          <select
            className="filter-select"
            value={weekFilter}
            onChange={(e) => setWeekFilter(e.target.value)}
            aria-label="Filter berdasarkan Minggu"
          >
            <option value="all">Semua Minggu (Nov 2026)</option>
            <option value="week 1">Week 1</option>
            <option value="week 2">Week 2</option>
            <option value="week 3">Week 3</option>
            <option value="week 4">Week 4</option>
          </select>

          <select
            className="filter-select"
            value={formatFilter}
            onChange={(e) => setFormatFilter(e.target.value)}
            aria-label="Filter Format Konten"
          >
            <option value="all">Semua Format (Video & Grafis)</option>
            <option value="video">Hanya Video / Reels / TikTok</option>
            <option value="foto">Hanya Foto + Grafis</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Menampilkan <strong>{filteredCards.length}</strong> konten
          </div>

          <button
            type="button"
            className="btn-brand-action btn-primary-action"
            onClick={() => onAddNewCard('ide')}
            style={{ padding: '6px 12px', fontSize: '11px' }}
          >
            <Plus size={13} />
            <span>Buat Konten Baru</span>
          </button>
        </div>
      </div>

      {/* Mobile Column Switcher Tab Bar */}
      <div className="kanban-mobile-tabs" role="tablist" aria-label="Pilih kolom status pipeline">
        <button
          type="button"
          className={`mobile-column-tab ${activeMobileTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveMobileTab('all')}
        >
          Semua ({filteredCards.length})
        </button>
        {columns.map((c) => {
          const count = filteredCards.filter((card) => normalizeCardStatus(card.status) === c.status).length;
          return (
            <button
              key={c.status}
              type="button"
              className={`mobile-column-tab ${activeMobileTab === c.status ? 'active' : ''}`}
              onClick={() => setActiveMobileTab(c.status)}
            >
              <span className={`col-dot ${c.dotClass}`} style={{ width: 6, height: 6, display: 'inline-block' }} />
              <span>{c.title.split(' ')[0]} ({count})</span>
            </button>
          );
        })}
      </div>

      {/* 4-Column Pipeline Board */}
      <div className={`pipeline-board ${activeMobileTab !== 'all' ? 'single-column-active' : ''}`}>
        {columns.filter((col) => activeMobileTab === 'all' || col.status === activeMobileTab).map((col) => {
          const colCards = filteredCards.filter(
            (c) => normalizeCardStatus(c.status) === col.status
          );
          const isOver = dragOverColumn === col.status;

          return (
            <div
              key={col.status}
              className={`pipeline-col ${isOver ? 'drag-over' : ''}`}
              onDragOver={(e) => handleDragOver(e, col.status)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.status)}
            >
              <div className="pipeline-col-header">
                <div className="col-header-left">
                  <span className={`col-dot ${col.dotClass}`} />
                  <h3 className="col-title">{col.title}</h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="col-count-badge">{colCards.length}</span>
                  <button
                    type="button"
                    className="btn-add-col-icon"
                    onClick={() => onAddNewCard(col.status)}
                    title={`Tambah konten baru di ${col.title}`}
                    aria-label={`Tambah konten baru di ${col.title}`}
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>

              <div className="col-cards-list">
                {colCards.map((card) => {
                  const isBeingDragged = draggedCardId === card.id;

                  return (
                    <article
                      key={card.id}
                      className={`content-item-card ${isBeingDragged ? 'is-dragging' : ''}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, card.id)}
                      onDragEnd={handleDragEnd}
                      onClick={(e) => {
                        // Only trigger click if not currently dragging
                        if (!draggedCardId) {
                          onCardClick(card);
                        }
                      }}
                      title="Klik untuk melihat caption, link referensi, dan link hasil"
                    >
                      <div className="card-top-tags">
                        <span
                          className={`badge-format ${
                            card.format.toLowerCase().includes('video')
                              ? 'format-video'
                              : 'format-graphic'
                          }`}
                        >
                          {card.format.toLowerCase().includes('video') ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                              <Video size={10} /> Video
                            </span>
                          ) : (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                              <ImageIcon size={10} /> Grafis
                            </span>
                          )}
                        </span>
                        <span className="badge-week">{card.week}</span>
                      </div>

                      <h4 className="card-content-title">{card.title}</h4>

                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <span className="card-pillar-tag">{card.pillar}</span>
                        <span
                          style={{
                            fontSize: '9px',
                            fontWeight: 600,
                            color: 'var(--primary-600)',
                            background: 'var(--primary-50)',
                            padding: '1px 6px',
                            borderRadius: '4px',
                          }}
                        >
                          {card.platform}
                        </span>
                      </div>

                      {card.captionSnippet && (
                        <p className="card-caption-snippet">{card.captionSnippet}</p>
                      )}

                      {card.updatedBy && (
                        <div
                          className="card-audit-badge"
                          title={`Terakhir diubah oleh ${card.updatedBy}${
                            card.updatedAt
                              ? ` pada ${new Date(card.updatedAt).toLocaleTimeString('id-ID', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}`
                              : ''
                          }`}
                        >
                          <span className="audit-dot" />
                          <span className="audit-label">
                            diubah oleh <strong>{card.updatedBy}</strong>
                          </span>
                        </div>
                      )}

                      <div className="card-meta-bottom">
                        <div className="card-date-meta">
                          <Calendar size={11} strokeWidth={2} />
                          <span>{card.dueDate.replace('2026-', '')}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div
                            className="card-assignee-avatar"
                            style={{ backgroundColor: card.assignee.avatarBg }}
                            title={`${card.assignee.name} (${card.assignee.role})`}
                          >
                            {card.assignee.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <GripVertical size={13} color="var(--text-muted)" style={{ cursor: 'grab' }} />
                        </div>
                      </div>
                    </article>
                  );
                })}

                {colCards.length === 0 && (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '24px 10px',
                      color: 'var(--text-muted)',
                      fontSize: '11px',
                      border: '1px dashed rgba(200, 205, 230, 0.6)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    Tarik kartu ke sini
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

