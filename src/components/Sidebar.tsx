'use client';

import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Columns3,
  FileEdit,
  PenTool,
  BarChart3,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  activeMenu: string;
  onSelectMenu: (menu: string) => void;
  onClose: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'calendar', label: 'Konten Kalender', icon: CalendarDays },
  { id: 'kanban', label: 'Pipeline Produksi', icon: Columns3 },
  { id: 'scripts', label: 'Skrip Builder', icon: FileEdit, isSoon: true },
  { id: 'captions', label: 'Caption Builder', icon: PenTool, isSoon: true },
  { id: 'reports', label: 'Report Klien', icon: BarChart3, isSoon: true },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  activeMenu,
  onSelectMenu,
  onClose,
}) => {
  return (
    <aside
      className={`sidebar ${isOpen ? 'open' : ''}`}
      id="sidebar"
      aria-label="Main Navigation"
    >
      <div>
        {/* Brand Logo */}
        <div className="sidebar-brand">
          <div className="brand-logo" aria-hidden="true">
            U
          </div>
          <div className="brand-text">
            <h1>Unipic</h1>
            <span>Lab</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav>
          <ul className="sidebar-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <li
                  key={item.id}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <button
                    type="button"
                    className="nav-link"
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => {
                      onSelectMenu(item.id);
                      onClose();
                    }}
                  >
                    <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
                    <span>{item.label}</span>
                    {item.isSoon && (
                      <span
                        style={{
                          marginLeft: 'auto',
                          fontSize: '9px',
                          fontWeight: 700,
                          padding: '1px 5px',
                          borderRadius: '4px',
                          background: 'var(--primary-50)',
                          color: 'var(--primary-600)',
                        }}
                      >
                        SOON
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Internal Workspace Info */}
      <div
        style={{
          padding: '12px',
          background: 'var(--bg-page)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--navy-900)' }}>
          Unipic Workspace
        </span>
        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
          Agency Production · Nov 2026
        </span>
      </div>
    </aside>
  );
};
