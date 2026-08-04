import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';

interface HeaderProps {
  page: 'dashboard' | 'public';
  onChangePage: (page: 'dashboard' | 'public') => void;
  onNewNote: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({ page, onChangePage, onNewNote, onExport, onImport, onOpenAuth }) => {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="container header-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="logo">
            <div className="logo-mark">SB</div>
            <span className="logo-text">StudyBank</span>
          </div>
          <nav style={{ display: 'flex', gap: '4px' }}>
            <button
              className={`nav-tab ${page === 'dashboard' ? 'active' : ''}`}
              onClick={() => onChangePage('dashboard')}
            >
              My Notes
            </button>
            <button
              className={`nav-tab ${page === 'public' ? 'active' : ''}`}
              onClick={() => onChangePage('public')}
            >
              Public Feed
            </button>
          </nav>
        </div>
        <div className="header-actions">
          {user ? (
            <>
              {page === 'dashboard' && (
                <>
                  <button className="btn btn-secondary btn-sm" onClick={onExport}>Export</button>
                  <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                    Import
                    <input
                      type="file"
                      accept=".json"
                      className="file-input"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onImport(file);
                        e.target.value = '';
                      }}
                    />
                  </label>
                  <button className="btn btn-primary" onClick={onNewNote}>+ New</button>
                </>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '8px', paddingLeft: '12px', borderLeft: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{user.username}</span>
                <button className="btn btn-ghost btn-sm" onClick={logout}>Logout</button>
              </div>
            </>
          ) : (
            <button className="btn btn-primary" onClick={onOpenAuth}>Sign In</button>
          )}
        </div>
      </div>
    </header>
  );
};
