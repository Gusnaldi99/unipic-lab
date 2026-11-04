'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  PlusCircle,
  Video,
  Image as ImageIcon,
  Calendar,
  User,
  Link as LinkIcon,
  FileText,
} from 'lucide-react';
import { ContentCardItem, ContentFormat, ContentStatus, TeamMember } from '@/types/dashboard';
import { useAuth } from '@/context/AuthContext';

interface CreateContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandId: string;
  initialStatus?: ContentStatus;
  teamMembers?: TeamMember[];
  onCreateCard: (newCard: ContentCardItem) => void;
}

export const CreateContentModal: React.FC<CreateContentModalProps> = ({
  isOpen,
  onClose,
  brandId,
  initialStatus = 'ide',
  teamMembers = [],
  onCreateCard,
}) => {
  const { userName, userRole } = useAuth();

  // Kumpulkan list tim dari akun di database + user yang sedang login
  const effectiveMembers = useMemo(() => {
    const list: TeamMember[] = [...teamMembers];

    // Sisipkan user yang sedang login jika belum ada di list
    if (userName && !list.some((m) => m.name.toLowerCase() === userName.toLowerCase())) {
      list.unshift({
        name: userName,
        role: userRole || 'Tim Internal',
        avatarBg: '#3B6EF5',
      });
    }

    if (list.length === 0) {
      list.push({
        name: 'Tim Internal',
        role: 'Creator',
        avatarBg: '#4338E8',
      });
    }

    return list;
  }, [teamMembers, userName, userRole]);

  const [title, setTitle] = useState('');
  const [format, setFormat] = useState<ContentFormat>('Video');
  const [platform, setPlatform] = useState('IG Reels & TikTok');
  const [pillar, setPillar] = useState('Edukasi');
  const [week, setWeek] = useState('Week 1');
  const [status, setStatus] = useState<ContentStatus>(initialStatus);
  const [dueDate, setDueDate] = useState('2026-11-15');

  // Assignee state
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [customAssignee, setCustomAssignee] = useState('');
  const [isCustomAssignee, setIsCustomAssignee] = useState(false);

  const [caption, setCaption] = useState('');
  const [linkRef, setLinkRef] = useState('');
  const [linkAsset, setLinkAsset] = useState('');
  const [linkHasil, setLinkHasil] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Sinkronkan default assignee saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setStatus(initialStatus);
      if (effectiveMembers.length > 0 && !selectedAssignee) {
        setSelectedAssignee(effectiveMembers[0].name);
      }
    }
  }, [isOpen, initialStatus, effectiveMembers, selectedAssignee]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Judul konten wajib diisi.');
      return;
    }

    // Tentukan data assignee
    let finalAssigneeName = '';
    let finalAssigneeRole = '';
    let finalAvatarBg = '#3B6EF5';

    if (isCustomAssignee) {
      finalAssigneeName = customAssignee.trim() || 'Tim Internal';
      finalAssigneeRole = format === 'Video' ? 'Video Editor' : 'Graphic Designer';
    } else {
      const found = effectiveMembers.find((m) => m.name === selectedAssignee) || effectiveMembers[0];
      finalAssigneeName = found?.name || 'Tim Internal';
      finalAssigneeRole = found?.role || (format === 'Video' ? 'Video Editor' : 'Graphic Designer');
      finalAvatarBg = found?.avatarBg || '#3B6EF5';
    }

    const newCard: ContentCardItem = {
      id: `custom-${Date.now()}`,
      brandId: brandId,
      title: title.trim(),
      week: week,
      format: format,
      platform: platform.trim() || 'IG Reels & TikTok',
      pillar: pillar.trim() || 'Edukasi',
      captionSnippet: caption ? caption.slice(0, 100) + '...' : '',
      caption: caption.trim(),
      notes: notes.trim(),
      status: status,
      dueDate: dueDate || '2026-11-20',
      assignee: {
        name: finalAssigneeName,
        role: finalAssigneeRole,
        avatarBg: finalAvatarBg,
      },
      linkRef: linkRef.trim(),
      linkAsset: linkAsset.trim(),
      linkHasil: linkHasil.trim(),
    };

    onCreateCard(newCard);

    // Reset form
    setTitle('');
    setCaption('');
    setLinkRef('');
    setLinkAsset('');
    setLinkHasil('');
    setNotes('');
    setErrorMsg('');
    setIsCustomAssignee(false);
    setCustomAssignee('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-dialog content-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="detail-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusCircle size={20} color="var(--primary-600)" />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--navy-900)' }}>
              Buat Kartu Konten Baru
            </h3>
          </div>
          <button type="button" className="btn-close-modal" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {errorMsg && (
          <div style={{ background: '#FDECEC', color: 'var(--danger)', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Judul Konten */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Judul Konten <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input
              type="text"
              className="detail-input-field"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="Contoh: 3 Gerakan Melatih Sayap Punggung untuk Pemula"
              autoFocus
            />
          </div>

          {/* Grid Format, Week, Status */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Format Konten
              </label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={format}
                onChange={(e) => setFormat(e.target.value as ContentFormat)}
              >
                <option value="Video">Video (Reels / TikTok)</option>
                <option value="Foto + Grafis">Foto + Grafis (Feed / Story)</option>
                <option value="Carousel">Carousel Multi-Slide</option>
                <option value="Story">Story Interaktif</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Minggu
              </label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={week}
                onChange={(e) => setWeek(e.target.value)}
              >
                <option value="Week 1">Week 1</option>
                <option value="Week 2">Week 2</option>
                <option value="Week 3">Week 3</option>
                <option value="Week 4">Week 4</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Status Tahapan
              </label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={status === 'copywriting' || status === 'review' ? 'production' : status}
                onChange={(e) => setStatus(e.target.value as ContentStatus)}
              >
                <option value="ide">Ide & Draft</option>
                <option value="production">Produksi</option>
                <option value="ready">Siap Tayang</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Target Tanggal Tayang
              </label>
              <input
                type="date"
                className="detail-input-field"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {/* Platform, Pillar, Assignee */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Platform Post
              </label>
              <input
                type="text"
                className="detail-input-field"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                placeholder="e.g. IG Reels & TikTok"
              />
            </div>

            <div>
              <label style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Pilar Konten
              </label>
              <input
                type="text"
                className="detail-input-field"
                value={pillar}
                onChange={(e) => setPillar(e.target.value)}
                placeholder="e.g. Tips Workout, Edukasi, Promo"
              />
            </div>

            <div>
              <label style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                PIC Tim (Assignee)
              </label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={isCustomAssignee ? '__custom__' : selectedAssignee}
                onChange={(e) => {
                  if (e.target.value === '__custom__') {
                    setIsCustomAssignee(true);
                  } else {
                    setIsCustomAssignee(false);
                    setSelectedAssignee(e.target.value);
                  }
                }}
              >
                {effectiveMembers.map((m) => (
                  <option key={m.name} value={m.name}>
                    {m.name} ({m.role})
                  </option>
                ))}
                <option value="__custom__">+ Input PIC Manual...</option>
              </select>

              {isCustomAssignee && (
                <input
                  type="text"
                  className="detail-input-field"
                  style={{ marginTop: '6px' }}
                  placeholder="Ketik nama PIC tim..."
                  value={customAssignee}
                  onChange={(e) => setCustomAssignee(e.target.value)}
                  autoFocus
                />
              )}
            </div>
          </div>

          {/* Caption */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Caption & Copywriting (Opsional)
            </label>
            <textarea
              className="detail-textarea"
              rows={4}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Tulis hook pembuka video, body caption, CTA, dan hashtag wajib..."
            />
          </div>

          {/* Links */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Link Referensi Konten <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(Opsional - Boleh Kosong)</span>
              </label>
              <input
                type="text"
                className="detail-input-field"
                value={linkRef}
                onChange={(e) => setLinkRef(e.target.value)}
                placeholder="https://instagram.com/reel/... (Boleh kosong)"
              />
            </div>
            <div>
              <label style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Link Hasil Jadi <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(Opsional)</span>
              </label>
              <input
                type="text"
                className="detail-input-field"
                value={linkHasil}
                onChange={(e) => setLinkHasil(e.target.value)}
                placeholder="https://drive.google.com/... (Boleh kosong)"
              />
            </div>
          </div>

          {/* Submit buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
            <button
              type="button"
              className="btn-brand-action"
              onClick={onClose}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn-brand-action btn-primary-action"
            >
              <PlusCircle size={14} />
              <span>Tambah Konten</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
