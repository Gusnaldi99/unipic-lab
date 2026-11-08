'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  ExternalLink,
  Link as LinkIcon,
  Video,
  Image as ImageIcon,
  Calendar,
  User,
  Save,
  FileText,
  FolderOpen,
  Trash2,
  Edit3,
} from 'lucide-react';
import { ContentCardItem, ContentFormat, ContentStatus, TeamMember } from '@/types/dashboard';

interface ContentDetailModalProps {
  card: ContentCardItem | null;
  isOpen: boolean;
  onClose: () => void;
  teamMembers?: TeamMember[];
  onSaveCard: (updatedCard: ContentCardItem) => void;
  onDeleteCard: (cardId: string) => void;
}

export const ContentDetailModal: React.FC<ContentDetailModalProps> = ({
  card,
  isOpen,
  onClose,
  teamMembers = [],
  onSaveCard,
  onDeleteCard,
}) => {
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Editable fields
  const [editedTitle, setEditedTitle] = useState('');
  const [editedFormat, setEditedFormat] = useState<ContentFormat>('Video');
  const [editedPlatform, setEditedPlatform] = useState('');
  const [editedPillar, setEditedPillar] = useState('');
  const [editedWeek, setEditedWeek] = useState('Week 1');
  const [editedDueDate, setEditedDueDate] = useState('');
  const [editedCaption, setEditedCaption] = useState('');
  const [editedLinkRef, setEditedLinkRef] = useState('');
  const [editedLinkAsset, setEditedLinkAsset] = useState('');
  const [editedLinkHasil, setEditedLinkHasil] = useState('');
  const [editedNotes, setEditedNotes] = useState('');
  const [editedStatus, setEditedStatus] = useState<ContentStatus>('ide');
  const [editedAssigneeName, setEditedAssigneeName] = useState('');
  const [editedAssigneeRole, setEditedAssigneeRole] = useState('');
  const [editedAssigneeAvatarBg, setEditedAssigneeAvatarBg] = useState('#3B6EF5');

  // Gabungkan daftar tim dari akun di database + card assignee saat ini
  const effectiveMembers = React.useMemo(() => {
    const list: TeamMember[] = [...teamMembers];
    if (card?.assignee?.name && !list.some((m) => m.name.toLowerCase() === card.assignee.name.toLowerCase())) {
      list.push({
        name: card.assignee.name,
        role: card.assignee.role || 'Creator',
        avatarBg: card.assignee.avatarBg || '#3B6EF5',
      });
    }
    if (list.length === 0) {
      list.push({
        name: 'Tim Internal',
        role: 'Creator',
        avatarBg: '#3B6EF5',
      });
    }
    return list;
  }, [teamMembers, card?.assignee]);

  useEffect(() => {
    if (card) {
      setEditedTitle(card.title);
      setEditedFormat(card.format);
      setEditedPlatform(card.platform);
      setEditedPillar(card.pillar);
      setEditedWeek(card.week);
      setEditedDueDate(card.dueDate);
      setEditedCaption(card.caption || card.captionSnippet || '');
      setEditedLinkRef(card.linkRef || '');
      setEditedLinkAsset(card.linkAsset || '');
      setEditedLinkHasil(card.linkHasil || '');
      setEditedNotes(card.notes || '');
      setEditedStatus(card.status);
      setEditedAssigneeName(card.assignee?.name || 'Tim Internal');
      setEditedAssigneeRole(card.assignee?.role || 'Creator');
      setEditedAssigneeAvatarBg(card.assignee?.avatarBg || '#3B6EF5');
      setIsEditing(false);
      setConfirmDelete(false);
      setCopiedCaption(false);
    }
  }, [card]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !card) return null;

  const handleCopyCaption = () => {
    const textToCopy = isEditing ? editedCaption : card.caption || card.captionSnippet || '';
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2000);
    }
  };

  const handleSave = () => {
    const updated: ContentCardItem = {
      ...card,
      title: editedTitle.trim() || 'Tanpa Judul',
      format: editedFormat,
      platform: editedPlatform.trim() || 'IG Reels & TikTok',
      pillar: editedPillar.trim() || 'Edukasi',
      week: editedWeek,
      dueDate: editedDueDate || card.dueDate,
      assignee: {
        name: editedAssigneeName.trim() || card.assignee?.name || 'Tim Internal',
        role: editedAssigneeRole || card.assignee?.role || 'Creator',
        avatarBg: editedAssigneeAvatarBg || card.assignee?.avatarBg || '#3B6EF5',
      },
      caption: editedCaption,
      captionSnippet: editedCaption ? editedCaption.slice(0, 100) + '...' : '',
      linkRef: editedLinkRef.trim(),
      linkAsset: editedLinkAsset.trim(),
      linkHasil: editedLinkHasil.trim(),
      notes: editedNotes.trim(),
      status: editedStatus,
    };
    onSaveCard(updated);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDeleteCard(card.id);
    onClose();
  };

  const getStatusLabel = (status: ContentStatus) => {
    switch (status) {
      case 'ide': return 'Ide & Draft';
      case 'copywriting':
      case 'review':
      case 'production': return 'Produksi';
      case 'ready': return 'Siap Tayang';
      case 'published': return 'Published';
      default: return 'Ide & Draft';
    }
  };

  const ensureProtocol = (url?: string) => {
    if (!url) return '';
    const trimmed = url.trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-dialog content-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="detail-modal-header">
          <div className="detail-header-tags">
            {isEditing ? (
              <>
                <select
                  className="filter-select"
                  value={editedFormat}
                  onChange={(e) => setEditedFormat(e.target.value as ContentFormat)}
                >
                  <option value="Video">Video</option>
                  <option value="Foto + Grafis">Foto + Grafis</option>
                  <option value="Carousel">Carousel</option>
                  <option value="Story">Story</option>
                </select>

                <select
                  className="filter-select"
                  value={editedWeek}
                  onChange={(e) => setEditedWeek(e.target.value)}
                >
                  <option value="Week 1">Week 1</option>
                  <option value="Week 2">Week 2</option>
                  <option value="Week 3">Week 3</option>
                  <option value="Week 4">Week 4</option>
                </select>

                <select
                  className="filter-select"
                  value={editedStatus === 'copywriting' || editedStatus === 'review' ? 'production' : editedStatus}
                  onChange={(e) => setEditedStatus(e.target.value as ContentStatus)}
                >
                  <option value="ide">Ide & Draft</option>
                  <option value="production">Produksi</option>
                  <option value="ready">Siap Tayang</option>
                  <option value="published">Published</option>
                </select>
              </>
            ) : (
              <>
                <span
                  className={`badge-format ${
                    card.format.toLowerCase().includes('video')
                      ? 'format-video'
                      : 'format-graphic'
                  }`}
                >
                  {card.format.toLowerCase().includes('video') ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <Video size={11} /> {card.format}
                    </span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <ImageIcon size={11} /> {card.format}
                    </span>
                  )}
                </span>

                <span className="badge-week">{card.week}</span>
                <span className="card-pillar-tag">{card.pillar}</span>
                <span className="detail-status-pill">{getStatusLabel(card.status)}</span>
              </>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              className="btn-close-modal"
              onClick={onClose}
              aria-label="Tutup modal detail konten"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Title */}
        <div className="detail-title-section">
          {isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Judul Konten:
              </label>
              <input
                type="text"
                className="detail-input-field"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                placeholder="Masukkan judul konten..."
                style={{ fontSize: '15px', fontWeight: 700 }}
              />
            </div>
          ) : (
            <h2 className="detail-content-title">{card.title}</h2>
          )}
        </div>

        {/* Meta Bar: Due date, platform, pillar, assignee */}
        <div className="detail-meta-strip">
          {isEditing ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px', width: '100%' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', fontWeight: 600, marginBottom: '2px' }}>Target Tanggal:</label>
                <input
                  type="date"
                  className="detail-input-field"
                  value={editedDueDate}
                  onChange={(e) => setEditedDueDate(e.target.value)}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', fontWeight: 600, marginBottom: '2px' }}>Platform Post:</label>
                <input
                  type="text"
                  className="detail-input-field"
                  value={editedPlatform}
                  onChange={(e) => setEditedPlatform(e.target.value)}
                  placeholder="e.g. IG Reels & TikTok"
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', fontWeight: 600, marginBottom: '2px' }}>Pillar Konten:</label>
                <input
                  type="text"
                  className="detail-input-field"
                  value={editedPillar}
                  onChange={(e) => setEditedPillar(e.target.value)}
                  placeholder="e.g. Edukasi / Promo"
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', fontWeight: 600, marginBottom: '2px' }}>PIC Tim (Database):</label>
                <select
                  className="filter-select"
                  style={{ width: '100%', minHeight: '38px' }}
                  value={editedAssigneeName}
                  onChange={(e) => {
                    const chosen = effectiveMembers.find((m) => m.name === e.target.value);
                    setEditedAssigneeName(e.target.value);
                    if (chosen?.role) setEditedAssigneeRole(chosen.role);
                    if (chosen?.avatarBg) setEditedAssigneeAvatarBg(chosen.avatarBg);
                  }}
                >
                  {effectiveMembers.map((m) => (
                    <option key={m.name} value={m.name}>
                      {m.name} ({m.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <>
              <div className="meta-strip-item">
                <Calendar size={13} strokeWidth={2} />
                <span>Target Tayang: <strong>{card.dueDate}</strong></span>
              </div>
              <div className="meta-strip-item">
                <span>Platform: <strong>{card.platform}</strong></span>
              </div>
              <div className="meta-strip-item">
                <User size={13} strokeWidth={2} />
                <span>PIC: <strong>{card.assignee.name}</strong> ({card.assignee.role})</span>
              </div>
            </>
          )}
        </div>

        {/* Main Content Body */}
        <div className="detail-body-grid">
          {/* Section 1: Caption & Copywriting */}
          <div className="detail-card-panel">
            <div className="panel-header-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={15} color="var(--primary-600)" />
                <h3 className="panel-title">Caption & Copywriting</h3>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn-copy-caption"
                  onClick={handleCopyCaption}
                  title="Salin caption ke clipboard"
                >
                  {copiedCaption ? <Check size={12} color="var(--success)" /> : <Copy size={12} />}
                  <span>{copiedCaption ? 'Tersalin!' : 'Salin Caption'}</span>
                </button>
              </div>
            </div>

            {isEditing ? (
              <textarea
                className="detail-textarea"
                rows={7}
                value={editedCaption}
                onChange={(e) => setEditedCaption(e.target.value)}
                placeholder="Tulis caption, hook video, dan hashtag di sini..."
              />
            ) : (
              <div className="detail-caption-box">
                {card.caption || card.captionSnippet ? (
                  <pre className="caption-pre-formatted">{card.caption || card.captionSnippet}</pre>
                ) : (
                  <p className="empty-text">Belum ada caption untuk konten ini.</p>
                )}
              </div>
            )}
          </div>

          {/* Section 2: Links (Referensi, Asset, Hasil) */}
          <div className="detail-card-panel">
            <div className="panel-header-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <LinkIcon size={15} color="var(--primary-600)" />
                <h3 className="panel-title">Link Referensi & Hasil Jadi</h3>
              </div>
            </div>

            <div className="links-list-container">
              {/* 1. Link Referensi */}
              <div className="link-item-row">
                <div className="link-item-info">
                  <span className="link-type-label">Link Referensi Konten (Opsional)</span>
                  {isEditing ? (
                    <input
                      type="text"
                      className="detail-input-field"
                      placeholder="https://instagram.com/reel/... (Boleh kosong)"
                      value={editedLinkRef}
                      onChange={(e) => setEditedLinkRef(e.target.value)}
                    />
                  ) : card.linkRef ? (
                    <a
                      href={ensureProtocol(card.linkRef)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-anchor"
                    >
                      <span>{card.linkRef}</span>
                      <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="empty-link-tag">Belum ada link referensi (Opsional)</span>
                  )}
                </div>
              </div>

              {/* 2. Link Asset Edit / Bahan */}
              <div className="link-item-row">
                <div className="link-item-info">
                  <span className="link-type-label">Link Asset Edit / Bahan (Raw Footage) (Opsional)</span>
                  {isEditing ? (
                    <input
                      type="text"
                      className="detail-input-field"
                      placeholder="https://drive.google.com/... (Boleh kosong)"
                      value={editedLinkAsset}
                      onChange={(e) => setEditedLinkAsset(e.target.value)}
                    />
                  ) : card.linkAsset ? (
                    <a
                      href={ensureProtocol(card.linkAsset)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-anchor"
                    >
                      <span>{card.linkAsset}</span>
                      <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="empty-link-tag">Belum ada link asset (Opsional)</span>
                  )}
                </div>
              </div>

              {/* 3. Link Hasil Jadi */}
              <div className="link-item-row highlight-hasil-row">
                <div className="link-item-info">
                  <span className="link-type-label highlight-label">
                    Link Hasil Jadi (Final Video / Graphic) (Opsional)
                  </span>
                  {isEditing ? (
                    <input
                      type="text"
                      className="detail-input-field"
                      placeholder="https://drive.google.com/final... (Boleh kosong)"
                      value={editedLinkHasil}
                      onChange={(e) => setEditedLinkHasil(e.target.value)}
                    />
                  ) : card.linkHasil ? (
                    <a
                      href={ensureProtocol(card.linkHasil)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-anchor highlight-anchor"
                    >
                      <FolderOpen size={13} />
                      <span>{card.linkHasil}</span>
                      <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="empty-link-tag">Belum diupload hasil jadi (Opsional)</span>
                  )}
                </div>
              </div>

              {/* Catatan / Keterangan */}
              <div style={{ marginTop: '8px' }}>
                <span className="link-type-label">Keterangan / Catatan Tim:</span>
                {isEditing ? (
                  <input
                    type="text"
                    className="detail-input-field"
                    value={editedNotes}
                    onChange={(e) => setEditedNotes(e.target.value)}
                    placeholder="Catatan shoot, revisi, atau request khusus"
                    style={{ marginTop: '4px' }}
                  />
                ) : (
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {card.notes || '-'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {card.updatedBy && (
            <div className="detail-audit-footer">
              <User size={13} />
              <span>
                Terakhir diubah oleh <strong>{card.updatedBy}</strong>
                {card.updatedAt
                  ? ` • ${new Date(card.updatedAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })} pukul ${new Date(card.updatedAt).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}`
                  : ''}
              </span>
            </div>
          )}
        </div>

        {/* Modal Footer with Delete & Save */}
        <div className="detail-modal-footer">
          {confirmDelete ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: '#FDECEC', padding: '8px 12px', borderRadius: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--danger)' }}>
                Yakin ingin menghapus konten ini secara permanen?
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn-brand-action"
                  onClick={() => setConfirmDelete(false)}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="btn-brand-action"
                  style={{ background: 'var(--danger)', color: '#FFFFFF', borderColor: 'var(--danger)' }}
                  onClick={handleDelete}
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          ) : isEditing ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <button
                type="button"
                className="btn-brand-action"
                style={{ color: 'var(--danger)' }}
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 size={13} />
                <span>Hapus Konten</span>
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn-brand-action"
                  onClick={() => setIsEditing(false)}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="btn-brand-action btn-primary-action"
                  onClick={handleSave}
                >
                  <Save size={13} />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <button
                type="button"
                className="btn-brand-action"
                style={{ color: 'var(--danger)' }}
                onClick={() => setConfirmDelete(true)}
                title="Hapus kartu konten ini"
              >
                <Trash2 size={13} />
                <span>Hapus</span>
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn-brand-action"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit3 size={13} />
                  <span>Edit Konten</span>
                </button>
                <button
                  type="button"
                  className="btn-brand-action btn-primary-action"
                  onClick={onClose}
                >
                  Tutup
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
