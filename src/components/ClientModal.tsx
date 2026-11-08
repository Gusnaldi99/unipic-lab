'use client';

import React, { useState, useEffect } from 'react';
import { X, Briefcase, PlusCircle, Save, Trash2 } from 'lucide-react';
import { BrandProfile } from '@/types/dashboard';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandToEdit: BrandProfile | null; // null jika Create baru
  onSaveBrand: (brand: BrandProfile) => void;
  onDeleteBrand?: (brandId: string) => void;
}

export const ClientModal: React.FC<ClientModalProps> = ({
  isOpen,
  onClose,
  brandToEdit,
  onSaveBrand,
  onDeleteBrand,
}) => {
  const isEditing = !!brandToEdit;

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState('');
  const [socialUrl, setSocialUrl] = useState('');
  const [references, setReferences] = useState('');
  const [hashtagsText, setHashtagsText] = useState('');
  const [videoTarget, setVideoTarget] = useState<number>(10);
  const [graphicTarget, setGraphicTarget] = useState<number>(5);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (brandToEdit) {
      setName(brandToEdit.name);
      setCode(brandToEdit.code);
      setCategory(brandToEdit.category);
      setSocialUrl(brandToEdit.socialUrl || '');
      setReferences(brandToEdit.references || '');
      setHashtagsText(brandToEdit.mandatoryHashtags ? brandToEdit.mandatoryHashtags.join(' ') : '');
      setVideoTarget(brandToEdit.quota?.videoTarget || 10);
      setGraphicTarget(brandToEdit.quota?.graphicTarget || 5);
      setConfirmDelete(false);
      setErrorMsg('');
    } else {
      // Reset untuk mode tambah baru
      setName('');
      setCode('');
      setCategory('');
      setSocialUrl('');
      setReferences('');
      setHashtagsText('');
      setVideoTarget(12);
      setGraphicTarget(8);
      setConfirmDelete(false);
      setErrorMsg('');
    }
  }, [brandToEdit, isOpen]);

  if (!isOpen) return null;

  // Auto generate code inisial jika user mengisi nama brand
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing && !code) {
      const words = val.trim().split(/\s+/);
      const generated = words.map((w) => w[0] || '').join('').toUpperCase().slice(0, 3);
      setCode(generated);
    }
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Nama brand klien wajib diisi.');
      return;
    }

    const brandId = isEditing
      ? brandToEdit.id
      : `brand-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`;

    const parsedHashtags = hashtagsText
      .split(/[\s,]+/)
      .map((h) => h.trim())
      .filter((h) => h.length > 0)
      .map((h) => (h.startsWith('#') ? h : `#${h}`));

    const totalTarget = (Number(videoTarget) || 0) + (Number(graphicTarget) || 0);

    const savedBrand: BrandProfile = {
      id: brandId,
      name: name.trim(),
      code: (code.trim() || name.slice(0, 2)).toUpperCase(),
      category: category.trim() || 'General Business',
      socialUrl: socialUrl.trim(),
      references: references.trim(),
      mandatoryHashtags: parsedHashtags,
      quota: {
        totalTarget: totalTarget > 0 ? totalTarget : 15,
        videoTarget: Number(videoTarget) || 0,
        graphicTarget: Number(graphicTarget) || 0,
      },
    };

    onSaveBrand(savedBrand);
    onClose();
  };

  const handleDelete = () => {
    if (brandToEdit && onDeleteBrand) {
      onDeleteBrand(brandToEdit.id);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-dialog content-detail-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '540px' }}
      >
        {/* Header */}
        <div className="detail-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={20} color="var(--primary-600)" />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--navy-900)' }}>
              {isEditing ? `Edit Profil Klien: ${brandToEdit.name}` : 'Tambah Klien Brand Baru'}
            </h3>
          </div>
          <button
            type="button"
            className="btn-close-modal"
            onClick={onClose}
            aria-label="Tutup dialog klien"
          >
            <X size={18} />
          </button>
        </div>

        {errorMsg && (
          <div
            style={{
              background: '#FDECEC',
              color: 'var(--danger)',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Baris 1: Nama Brand & Inisial */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Nama Brand Klien <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                type="text"
                className="detail-input-field"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Contoh: Kopi Kenangan Senopati"
                autoFocus
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Inisial / Kode
              </label>
              <input
                type="text"
                className="detail-input-field"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="KK"
                maxLength={4}
              />
            </div>
          </div>

          {/* Baris 2: Kategori & Instagram */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Kategori / Industri
              </label>
              <input
                type="text"
                className="detail-input-field"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. F&B Specialty Coffee"
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Link Medsos / Instagram
              </label>
              <input
                type="url"
                className="detail-input-field"
                value={socialUrl}
                onChange={(e) => setSocialUrl(e.target.value)}
                placeholder="https://instagram.com/..."
              />
            </div>
          </div>

          {/* Baris 3: Target Kuota Konten Bulanan */}
          <div
            style={{
              background: 'var(--bg-page)',
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
            }}
          >
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy-900)', display: 'block', marginBottom: '8px' }}>
              Target Kuota Konten Bulanan (Deliverables)
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '2px', fontWeight: 600 }}>
                  Target Video (Reels/TikTok)
                </label>
                <input
                  type="number"
                  min={0}
                  className="detail-input-field"
                  value={videoTarget}
                  onChange={(e) => setVideoTarget(parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '2px', fontWeight: 600 }}>
                  Target Foto & Desain Grafis
                </label>
                <input
                  type="number"
                  min={0}
                  className="detail-input-field"
                  value={graphicTarget}
                  onChange={(e) => setGraphicTarget(parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '2px', fontWeight: 600 }}>
                  Total Target Otomatis
                </label>
                <div
                  style={{
                    padding: '8px 10px',
                    fontSize: '14px',
                    fontWeight: 700,
                    background: '#FFFFFF',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--primary-600)',
                  }}
                >
                  {(Number(videoTarget) || 0) + (Number(graphicTarget) || 0)} Konten
                </div>
              </div>
            </div>
          </div>

          {/* Baris 4: Referensi & Hashtag */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Referensi Kompetitor / Moodboard
            </label>
            <input
              type="text"
              className="detail-input-field"
              value={references}
              onChange={(e) => setReferences(e.target.value)}
              placeholder="e.g. Fore, Tomoro, Starbucks (opsional)"
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Hashtag Wajib Brand (pisahkan dengan spasi)
            </label>
            <input
              type="text"
              className="detail-input-field"
              value={hashtagsText}
              onChange={(e) => setHashtagsText(e.target.value)}
              placeholder="#BrandName #TaglineBrand #Campaign2026"
            />
          </div>

          {/* Footer Actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid var(--border)',
              paddingTop: '12px',
              marginTop: '4px',
            }}
          >
            {isEditing && onDeleteBrand ? (
              confirmDelete ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--danger)', fontWeight: 600 }}>
                    Hapus klien ini beserta seluruh kontennya?
                  </span>
                  <button
                    type="button"
                    className="btn-brand-action"
                    style={{ background: 'var(--danger)', color: '#FFFFFF', borderColor: 'var(--danger)', padding: '5px 10px', fontSize: '11px' }}
                    onClick={handleDelete}
                  >
                    Ya, Hapus
                  </button>
                  <button
                    type="button"
                    className="btn-brand-action"
                    style={{ padding: '5px 10px', fontSize: '11px' }}
                    onClick={() => setConfirmDelete(false)}
                  >
                    Batal
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn-brand-action"
                  style={{ color: 'var(--danger)', gap: '4px' }}
                  onClick={() => setConfirmDelete(true)}
                >
                  <Trash2 size={13} />
                  <span>Hapus Klien</span>
                </button>
              )
            ) : (
              <div />
            )}

            <div style={{ display: 'flex', gap: '8px' }}>
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
                {isEditing ? <Save size={13} /> : <PlusCircle size={13} />}
                <span>{isEditing ? 'Simpan Perubahan' : 'Tambahkan Klien'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

