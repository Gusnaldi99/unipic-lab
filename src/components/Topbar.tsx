'use client';

import React, { useState } from 'react';
import { Menu, Search, Bell, X } from 'lucide-react';

interface TopbarProps {
  title: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToggleSidebar: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  title,
  searchQuery,
  onSearchChange,
  onToggleSidebar,
}) => {
  const [mobileSearchActive, setMobileSearchActive] = useState(false);

  return (
    <header className="topbar">
      <div className="topbar-main-row">
        <div className="topbar-left">
          <button
            className="btn-hamburger"
            id="hamburgerBtn"
            aria-label="Buka menu navigasi"
            onClick={onToggleSidebar}
            type="button"
          >
            <Menu size={22} strokeWidth={2} />
          </button>
          <h2 className="page-title">{title}</h2>
        </div>

        {/* Live Search Desktop */}
        <div className="topbar-search desktop-only">
          <Search className="search-icon" size={15} strokeWidth={2} aria-hidden="true" />
          <input
            type="search"
            id="dashboardSearch"
            className="search-input"
            placeholder="Cari konten, brand, caption, atau format..."
            aria-label="Cari konten dashboard"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Actions & Profile */}
        <div className="topbar-right">
          {/* Mobile Search Toggle Button */}
          <button
            type="button"
            className="btn-icon-badge mobile-search-btn"
            onClick={() => setMobileSearchActive((prev) => !prev)}
            aria-label={mobileSearchActive ? 'Tutup pencarian' : 'Buka pencarian'}
            title="Cari konten"
          >
            {mobileSearchActive ? <X size={18} /> : <Search size={18} />}
          </button>

          <button
            className="btn-icon-badge"
            aria-label="Notifikasi konten kalender"
            type="button"
          >
            <Bell size={16} strokeWidth={2} />
            <span className="badge-count">Nov</span>
          </button>

          {/* User Account */}
          <div
            className="user-profile"
            tabIndex={0}
            role="button"
            aria-label="Profil Tim Internal Unipic Lab"
          >
            <div className="avatar">UL</div>
            <div className="user-info">
              <span className="user-name">Unipic Team</span>
              <span className="user-role">Internal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar Dropdown */}
      {mobileSearchActive && (
        <div className="topbar-mobile-search-strip">
          <Search size={15} color="var(--primary-600)" />
          <input
            type="search"
            className="mobile-search-input"
            placeholder="Cari judul, pilar, atau format..."
            autoFocus
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Pencarian konten di mobile"
          />
          {searchQuery && (
            <button
              type="button"
              className="btn-clear-search"
              onClick={() => onSearchChange('')}
              aria-label="Hapus kata kunci pencarian"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}
    </header>
  );
};
