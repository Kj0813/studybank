import React, { useState, useEffect } from 'react';
import { usePublicNotes } from '../hooks/usePublicNotes.ts';
import { NoteCard } from './NoteCard.tsx';
import { EmptyState } from './EmptyState.tsx';
import type { Note } from '../types';

interface PublicFeedProps {
  onView: (note: Note) => void;
  onDownloadPDF: (note: Note) => void;
}

export const PublicFeed: React.FC<PublicFeedProps> = ({ onView, onDownloadPDF }) => {
  const { notes, courses, loading, error, fetchPublic } = usePublicNotes();
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPublic(courseFilter || undefined, search || undefined);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, courseFilter, fetchPublic]);

  return (
    <div>
      <div className="toolbar">
        <div className="search-box" style={{ flex: 1 }}>
          <span className="search-icon">Search</span>
          <input
            type="text"
            placeholder="Search public notes by title, content, or course..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          value={courseFilter}
          onChange={e => setCourseFilter(e.target.value)}
          style={{
            padding: '10px 12px',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.9rem',
            background: 'var(--surface)',
            color: 'var(--text)',
            minWidth: '160px',
          }}
        >
          <option value="">All Courses</option>
          {courses.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading public notes...</div>
      ) : error ? (
        <div className="loading" style={{ color: '#dc2626' }}>{error}</div>
      ) : (
        <div className="notes-grid">
          {notes.length === 0 ? (
            <EmptyState hasFilters={search !== '' || courseFilter !== ''} />
          ) : (
            notes.map((note, i) => (
              <NoteCard
                key={note.id}
                note={note}
                index={i}
                showAuthor
                onView={id => onView(notes.find(n => n.id === id)!)}
                onDownloadPDF={onDownloadPDF}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};
