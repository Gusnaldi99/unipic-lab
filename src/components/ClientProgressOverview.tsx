'use client';

import React from 'react';
import {
  Briefcase,
  Lightbulb,
  Video,
  Upload,
  CheckCircle2,
  ArrowRight,
  Plus,
  Edit3,
} from 'lucide-react';
import { BrandProfile, ContentCardItem } from '@/types/dashboard';
import { normalizeCardStatus } from '@/components/ContentKanbanBoard';

interface ClientProgressOverviewProps {
  brands: BrandProfile[];
  allCards: ContentCardItem[];
  onSelectBrandAndOpenCalendar: (brandId: string) => void;
  onAddNewBrand: () => void;
  onEditBrand: (brand: BrandProfile) => void;
}

export const ClientProgressOverview: React.FC<ClientProgressOverviewProps> = ({
  brands,
  allCards,
  onSelectBrandAndOpenCalendar,
  onAddNewBrand,
  onEditBrand,
}) => {
  // Hanya tampilkan brand yang bukan template kosong default
  const activeClients = brands.filter((b) => b.id !== 'brand-kosong');

  // Compute Total Agency Aggregates Lintas Klien
  const totalIde = allCards.filter(
    (c) => normalizeCardStatus(c.status) === 'ide'
  ).length;

  const totalProduksi = allCards.filter(
    (c) => normalizeCardStatus(c.status) === 'production'
  ).length;

  const totalReady = allCards.filter(
    (c) => normalizeCardStatus(c.status) === 'ready'
  ).length;

  const totalPublished = allCards.filter(
    (c) => normalizeCardStatus(c.status) === 'published'
  ).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* ========================================================
          1. TOP AGENCY AGGREGATE KPI CARDS (5 METRICS)
          ======================================================== */}
      <section className="kpi-grid agency-kpi-5-grid" aria-label="Ringkasan Status Konten Lintas Klien">
        {/* Total Klien */}
        <article className="card kpi-card">
          <div className="kpi-icon-circle bg-kpi-blue" aria-hidden="true">
            <Briefcase size={22} strokeWidth={2} />
          </div>
          <div className="kpi-data">
            <span className="kpi-label">Total Klien Aktif</span>
            <div className="kpi-value-row">
              <span className="kpi-value">{activeClients.length}</span>
              <span className="trend-badge trend-up">Aktif</span>
            </div>
            <span className="kpi-subtext">Brand Partner</span>
          </div>
        </article>

        {/* Ide & Draft */}
        <article className="card kpi-card">
          <div className="kpi-icon-circle" style={{ backgroundColor: '#8B5CF6' }} aria-hidden="true">
            <Lightbulb size={22} strokeWidth={2} />
          </div>
          <div className="kpi-data">
            <span className="kpi-label">Ide & Draft</span>
            <div className="kpi-value-row">
              <span className="kpi-value">{totalIde}</span>
              <span className="trend-badge" style={{ background: '#F3EEFF', color: '#8B5CF6' }}>
                Brainstorm
              </span>
            </div>
            <span className="kpi-subtext">Belum Masuk Produksi</span>
          </div>
        </article>

        {/* Dalam Produksi */}
        <article className="card kpi-card">
          <div className="kpi-icon-circle" style={{ backgroundColor: '#EC4899' }} aria-hidden="true">
            <Video size={22} strokeWidth={2} />
          </div>
          <div className="kpi-data">
            <span className="kpi-label">Dalam Produksi</span>
            <div className="kpi-value-row">
              <span className="kpi-value">{totalProduksi}</span>
              <span className="trend-badge" style={{ background: '#FDECEC', color: '#EC4899' }}>
                Editing
              </span>
            </div>
            <span className="kpi-subtext">Script / Video / Desain</span>
          </div>
        </article>

        {/* Siap Tayang / Ready to Upload */}
        <article className="card kpi-card">
          <div className="kpi-icon-circle" style={{ backgroundColor: '#3B6EF5' }} aria-hidden="true">
            <Upload size={22} strokeWidth={2} />
          </div>
          <div className="kpi-data">
            <span className="kpi-label">Siap Tayang</span>
            <div className="kpi-value-row">
              <span className="kpi-value">{totalReady}</span>
              <span className="trend-badge" style={{ background: '#EEF3FF', color: '#3B6EF5' }}>
                Approved
              </span>
            </div>
            <span className="kpi-subtext">Ready to Upload</span>
          </div>
        </article>

        {/* Published */}
        <article className="card kpi-card">
          <div className="kpi-icon-circle bg-kpi-green" aria-hidden="true">
            <CheckCircle2 size={22} strokeWidth={2} />
          </div>
          <div className="kpi-data">
            <span className="kpi-label">Published</span>
            <div className="kpi-value-row">
              <span className="kpi-value">{totalPublished}</span>
              <span className="trend-badge trend-up">Live</span>
            </div>
            <span className="kpi-subtext">Bulan November 2026</span>
          </div>
        </article>
      </section>

      {/* ========================================================
          2. CLIENT CONTENT PROGRESS MATRIX (SEGMENTED BARS)
          ======================================================== */}
      <section aria-label="Visual Progres Konten Per Klien">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--navy-900)' }}>
              Visual Progres Konten Lintas Klien
            </h3>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Pantau tahapan produksi dan pemenuhan kuota deliverable setiap brand.
            </p>
          </div>

          <button
            type="button"
            className="btn-brand-action btn-primary-action"
            onClick={onAddNewBrand}
          >
            <Plus size={13} />
            <span>+ Tambah Klien Baru</span>
          </button>
        </div>

        <div className="client-progress-grid">
          {activeClients.map((client) => {
            const clientCards = allCards.filter((c) => c.brandId === client.id);

            const ide = clientCards.filter((c) => normalizeCardStatus(c.status) === 'ide').length;
            const prod = clientCards.filter((c) => normalizeCardStatus(c.status) === 'production').length;
            const ready = clientCards.filter((c) => normalizeCardStatus(c.status) === 'ready').length;
            const pub = clientCards.filter((c) => normalizeCardStatus(c.status) === 'published').length;

            const target = client.quota.totalTarget || 1;
            const totalCreated = clientCards.length;
            const percentFilled = Math.min(100, Math.round((totalCreated / target) * 100));

            // Percentages for segmented bar
            const pctPub = (pub / target) * 100;
            const pctReady = (ready / target) * 100;
            const pctProd = (prod / target) * 100;
            const pctIde = (ide / target) * 100;

            return (
              <article key={client.id} className="card client-progress-card">
                {/* Client Header Info */}
                <div className="client-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="client-avatar-badge" aria-hidden="true">
                      {client.code}
                    </div>
                    <div>
                      <h4 className="client-name-title">{client.name}</h4>
                      <span className="client-category-sub">{client.category}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span className="quota-ratio-main">
                      {totalCreated} / {target} Konten
                    </span>
                    <span className="quota-percent-sub">{percentFilled}% Terpenuhi</span>
                  </div>
                </div>

                {/* Segmented Multi-Color Progress Bar */}
                <div
                  className="segmented-progress-track"
                  role="progressbar"
                  aria-label={`Progres konten ${client.name}`}
                >
                  {/* 1. Published (Hijau) */}
                  {pctPub > 0 && (
                    <div
                      className="seg-bar seg-published"
                      style={{ width: `${pctPub}%` }}
                      title={`Published: ${pub} konten`}
                    />
                  )}
                  {/* 2. Siap Tayang (Biru) */}
                  {pctReady > 0 && (
                    <div
                      className="seg-bar seg-ready"
                      style={{ width: `${pctReady}%` }}
                      title={`Siap Tayang: ${ready} konten`}
                    />
                  )}
                  {/* 3. Produksi (Pink/Oranye) */}
                  {pctProd > 0 && (
                    <div
                      className="seg-bar seg-production"
                      style={{ width: `${pctProd}%` }}
                      title={`Dalam Produksi: ${prod} konten`}
                    />
                  )}
                  {/* 4. Ide & Draft (Ungu) */}
                  {pctIde > 0 && (
                    <div
                      className="seg-bar seg-ide"
                      style={{ width: `${pctIde}%` }}
                      title={`Ide & Draft: ${ide} konten`}
                    />
                  )}
                </div>

                {/* Status Breakdown Legend Chips */}
                <div className="segmented-legend-row">
                  <div className="seg-legend-item">
                    <span className="seg-dot dot-published" />
                    <span><strong>{pub}</strong> Published</span>
                  </div>
                  <div className="seg-legend-item">
                    <span className="seg-dot dot-ready" />
                    <span><strong>{ready}</strong> Siap Tayang</span>
                  </div>
                  <div className="seg-legend-item">
                    <span className="seg-dot dot-production" />
                    <span><strong>{prod}</strong> Produksi</span>
                  </div>
                  <div className="seg-legend-item">
                    <span className="seg-dot dot-ide" />
                    <span><strong>{ide}</strong> Ide / Draft</span>
                  </div>
                </div>

                {/* Footer target info & Action Buttons */}
                <div className="client-card-footer">
                  <span className="client-target-pill">
                    Target: <strong>{client.quota.videoTarget} Video</strong> · <strong>{client.quota.graphicTarget} Grafis</strong>
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      className="btn-brand-action"
                      style={{ padding: '4px 8px', fontSize: '11px', gap: '4px' }}
                      onClick={() => onEditBrand(client)}
                      title={`Edit profil dan kuota ${client.name}`}
                    >
                      <Edit3 size={11} />
                      <span>Edit Klien</span>
                    </button>

                    <button
                      type="button"
                      className="btn-open-client-cal"
                      onClick={() => onSelectBrandAndOpenCalendar(client.id)}
                    >
                      <span>Kalender</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};
