'use client';

import React from 'react';
import { ExternalLink, Copy, Check, UploadCloud, Plus, RotateCcw, Edit3 } from 'lucide-react';
import { BrandProfile } from '@/types/dashboard';

interface BrandHeaderProps {
  currentBrand: BrandProfile;
  brands: BrandProfile[];
  onSelectBrand: (brandId: string) => void;
  onOpenImportModal: () => void;
  onAddNewCard?: () => void;
  onEditBrand?: () => void;
  onResetDefault?: () => void;
  totalCards: number;
  publishedCount: number;
  videoCount: number;
  graphicCount: number;
}

export const BrandHeader: React.FC<BrandHeaderProps> = ({
  currentBrand,
  brands,
  onSelectBrand,
  onOpenImportModal,
  onAddNewCard,
  onEditBrand,
  onResetDefault,
  totalCards,
  publishedCount,
  videoCount,
  graphicCount,
}) => {
  const [copied, setCopied] = React.useState(false);

  const copyHashtags = () => {
    if (currentBrand.mandatoryHashtags.length > 0) {
      navigator.clipboard.writeText(currentBrand.mandatoryHashtags.join(' '));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isBlankBrand = currentBrand.id === 'brand-kosong';

  return (
    <section className="brand-header-card" aria-label="Brand Profile & Quota">
      <div className="brand-top-row">
        <div className="brand-select-group">
          <div className="brand-avatar-box" aria-hidden="true">
            {currentBrand.code}
          </div>
          <div className="brand-title-wrap">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <select
                className="brand-dropdown-select"
                value={currentBrand.id}
                onChange={(e) => onSelectBrand(e.target.value)}
                aria-label="Select Client Brand"
              >
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            <p>{currentBrand.category || 'Pilih atau kelola konten klien'}</p>
          </div>
        </div>

        <div className="brand-actions-right">
          {onAddNewCard && (
            <button
              type="button"
              className="btn-brand-action btn-primary-action"
              onClick={onAddNewCard}
              title="Buat kartu konten baru untuk brand ini"
            >
              <Plus size={14} />
              <span>+ Buat Konten</span>
            </button>
          )}

          {onEditBrand && (
            <button
              type="button"
              className="btn-brand-action"
              onClick={onEditBrand}
              title="Edit profil brand dan target kuota"
            >
              <Edit3 size={13} />
              <span>Edit Brand</span>
            </button>
          )}

          {currentBrand.socialUrl && (
            <a
              href={currentBrand.socialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-brand-action"
              title="Kunjungi Instagram Klien"
            >
              <ExternalLink size={13} />
              <span>Instagram Klien</span>
            </a>
          )}

          <button
            type="button"
            className="btn-brand-action"
            onClick={onOpenImportModal}
          >
            <UploadCloud size={14} />
            <span>Import CSV</span>
          </button>

          {onResetDefault && (
            <button
              type="button"
              className="btn-brand-action"
              onClick={onResetDefault}
              title="Reset ke data awal CSV mock"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Quota & Details Row */}
      <div className="brand-meta-stats">
        {/* Total Deliverables */}
        <div className="stat-pill-box">
          <span className="stat-pill-label">Target Konten Bulanan</span>
          <div className="stat-pill-values">
            <span className="stat-pill-main">
              {totalCards} / {currentBrand.quota.totalTarget}
            </span>
            <span className="stat-pill-sub">
              {publishedCount} Tayang
            </span>
          </div>
        </div>

        {/* Video Quota */}
        <div className="stat-pill-box">
          <span className="stat-pill-label">Video / Reels / TikTok</span>
          <div className="stat-pill-values">
            <span className="stat-pill-main" style={{ color: 'var(--primary-600)' }}>
              {videoCount} / {currentBrand.quota.videoTarget}
            </span>
            <span className="stat-pill-sub">Target Video</span>
          </div>
        </div>

        {/* Graphics Quota */}
        <div className="stat-pill-box">
          <span className="stat-pill-label">Foto & Desain Grafis</span>
          <div className="stat-pill-values">
            <span className="stat-pill-main" style={{ color: 'var(--success)' }}>
              {graphicCount} / {currentBrand.quota.graphicTarget}
            </span>
            <span className="stat-pill-sub">Target Grafis</span>
          </div>
        </div>

        {/* Hashtag & Referensi */}
        {!isBlankBrand && currentBrand.mandatoryHashtags.length > 0 && (
          <div className="stat-pill-box" style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="stat-pill-label">Hashtag Wajib Brand</span>
              <button
                type="button"
                onClick={copyHashtags}
                className="btn-brand-action"
                style={{ padding: '2px 8px', fontSize: '10px' }}
              >
                {copied ? <Check size={11} color="var(--success)" /> : <Copy size={11} />}
                <span>{copied ? 'Tersalin' : 'Salin Semua'}</span>
              </button>
            </div>
            <div className="hashtag-chips-container" style={{ marginTop: '4px' }}>
              {currentBrand.mandatoryHashtags.map((h) => (
                <span key={h} className="hashtag-chip">
                  {h}
                </span>
              ))}
              {currentBrand.references && (
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: '6px' }}>
                  Ref: {currentBrand.references}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

