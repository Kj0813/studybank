import React from 'react';
import type { Note } from '../types';

interface NoteCardProps {
  note: Note;
  index: number;
  showAuthor?: boolean;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onView: (id: number) => void;
  onDownloadPDF?: (note: Note) => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = (now.getTime() - d.getTime()) / 86400000;
  if (diff < 1) return 'Today';
  if (diff < 2) return 'Yesterday';
  if (diff < 7) return Math.floor(diff) + 'd ago';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, index, showAuthor, onEdit, onDelete, onView, onDownloadPDF }) => {
  return (
    <div className="note-card" style={{ animationDelay: `${index * 0.04}s` }} onClick={() => onView(note.id)}>
      <div className="note-header">
        <div className="note-title">{note.title}</div>
        <div className="note-actions" onClick={(e) => e.stopPropagation()}>
          {onDownloadPDF && (
            <button className="btn btn-ghost" onClick={() => onDownloadPDF(note)} title="Download PDF">PDF</button>
          )}
          {onEdit && (
            <button className="btn btn-ghost" onClick={() => onEdit(note.id)} title="Edit">Edit</button>
          )}
          {onDelete && (
            <button className="btn btn-ghost" onClick={() => onDelete(note.id)} title="Delete">Del</button>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
        <span className="note-course">{note.course}</span>
        {showAuthor && (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>by {note.authorName}</span>
        )}
        {!note.isPublic && (
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'var(--bg)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>Private</span>
        )}
      </div>
      <div className="note-preview">{note.content}</div>
      <div className="note-footer">
        <div className="note-tags">
          {note.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
        <span>{formatDate(note.updatedAt)}</span>
      </div>
    </div>
  );
};
