'use client';

import React from 'react';
import { LayoutDashboard, CalendarDays, Columns3, FileEdit, Menu } from 'lucide-react';

interface MobileBottomNavProps {
  activeMenu: string;
  onSelectMenu: (menu: string) => void;
  onToggleSidebar: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeMenu,
  onSelectMenu,
  onToggleSidebar,
}) => {
  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Bottom Navigation">
      <button
        type="button"
        className={`mobile-nav-btn ${activeMenu === 'dashboard' ? 'active' : ''}`}
        onClick={() => onSelectMenu('dashboard')}
        aria-current={activeMenu === 'dashboard' ? 'page' : undefined}
      >
        <LayoutDashboard size={20} strokeWidth={activeMenu === 'dashboard' ? 2.2 : 1.8} />
        <span className="mobile-nav-label">Dashboard</span>
      </button>

      <button
        type="button"
        className={`mobile-nav-btn ${activeMenu === 'calendar' ? 'active' : ''}`}
        onClick={() => onSelectMenu('calendar')}
        aria-current={activeMenu === 'calendar' ? 'page' : undefined}
      >
        <CalendarDays size={20} strokeWidth={activeMenu === 'calendar' ? 2.2 : 1.8} />
        <span className="mobile-nav-label">Kalender</span>
      </button>

      <button
        type="button"
        className={`mobile-nav-btn ${activeMenu === 'kanban' ? 'active' : ''}`}
        onClick={() => onSelectMenu('kanban')}
        aria-current={activeMenu === 'kanban' ? 'page' : undefined}
      >
        <Columns3 size={20} strokeWidth={activeMenu === 'kanban' ? 2.2 : 1.8} />
        <span className="mobile-nav-label">Pipeline</span>
      </button>

      <button
        type="button"
        className={`mobile-nav-btn ${activeMenu === 'scripts' ? 'active' : ''}`}
        onClick={() => onSelectMenu('scripts')}
        aria-current={activeMenu === 'scripts' ? 'page' : undefined}
      >
        <FileEdit size={20} strokeWidth={activeMenu === 'scripts' ? 2.2 : 1.8} />
        <span className="mobile-nav-label">Skrip</span>
      </button>

      <button
        type="button"
        className="mobile-nav-btn"
        onClick={onToggleSidebar}
        aria-label="Buka menu navigasi agensi"
      >
        <Menu size={20} strokeWidth={1.8} />
        <span className="mobile-nav-label">Menu</span>
      </button>
    </nav>
  );
};

