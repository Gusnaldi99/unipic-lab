'use client';

import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';

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
  return (
    <header className="topbar">
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

      {/* Live Search */}
      <div className="topbar-search">
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
            <span className="user-role">Agency Internal</span>
          </div>
        </div>
      </div>
    </header>
  );
};
