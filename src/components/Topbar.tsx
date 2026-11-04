'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Bell, X, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const { user, userName, userRole, signOut } = useAuth();
  const [mobileSearchActive, setMobileSearchActive] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setProfileDropdownOpen(false);
    await signOut();
    router.replace('/login');
  };

  // Initials
  const initials = userName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('') || 'UL';

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

          {/* User Account with Dropdown */}
          <div className="user-profile-relative" ref={dropdownRef}>
            <button
              type="button"
              className="user-profile-btn"
              onClick={() => setProfileDropdownOpen((prev) => !prev)}
              aria-expanded={profileDropdownOpen}
              aria-label="Menu akun pengguna"
            >
              <div className="avatar">{initials}</div>
              <div className="user-info desktop-only">
                <span className="user-name">{userName}</span>
                <span className="user-role">{userRole}</span>
              </div>
            </button>

            {profileDropdownOpen && (
              <div className="profile-dropdown-menu">
                <div className="profile-dropdown-header">
                  <div className="dropdown-user-name">{userName}</div>
                  <div className="dropdown-user-email">{user?.email || 'Mode Tamu / Demo'}</div>
                </div>

                <div className="dropdown-divider" />

                <button
                  type="button"
                  className="dropdown-item-btn danger-item"
                  onClick={handleSignOut}
                >
                  <LogOut size={15} />
                  <span>Keluar (Logout)</span>
                </button>
              </div>
            )}
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
