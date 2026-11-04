import React from 'react';
import { Globe, Database } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabaseClient';

export const WindowHeader: React.FC = () => {
  const isConnected = isSupabaseConfigured();

  return (
    <header className="window-titlebar" aria-label="Window control header">
      <div className="window-dots">
        <span className="window-dot dot-red" title="Close" />
        <span className="window-dot dot-yellow" title="Minimize" />
        <span className="window-dot dot-green" title="Maximize" />
      </div>
      <div className="window-url-bar">
        <Globe size={13} aria-hidden="true" />
        <span>unipiclab.com/app/dashboard</span>
      </div>
      <div className="window-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span
          className="badge-tag"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: isConnected ? '#E6F7EE' : 'var(--primary-50)',
            color: isConnected ? 'var(--success)' : 'var(--primary-600)',
          }}
          title={
            isConnected
              ? 'Tersambung ke PostgreSQL Supabase'
              : 'Konfigurasikan NEXT_PUBLIC_SUPABASE_URL di .env.local untuk sync cloud'
          }
        >
          <Database size={11} />
          {isConnected ? 'Supabase Active' : 'Local Storage Mode'}
        </span>
      </div>
    </header>
  );
};
