import React, { useEffect } from 'react';
import type { Note } from '../types';

interface ViewModalProps {
  note: Note | null;
  canEdit: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDownloadPDF: (note: Note) => void;
}

function formatDateFull(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export const ViewModal: React.FC<ViewModalProps> = ({ note, canEdit, onClose, onEdit, onDownloadPDF }) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (note) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [note, onClose]);

  if (!note) return null;

  return (
    <div className="modal-overlay active" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-header">
          <h2>{note.title}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="view-meta">
            <span className="view-meta-item">Course: {note.course}</span>
            <span className="view-meta-item">By: {note.authorName}</span>
            <span className="view-meta-item">Updated: {formatDateFull(note.updatedAt)}</span>
            {note.tags.length > 0 && (
              <span className="view-meta-item">Tags: {note.tags.join(', ')}</span>
            )}
          </div>
          <div className="view-content">{note.content}</div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
          <button className="btn btn-secondary" onClick={() => onDownloadPDF(note)}>Download PDF</button>
          {canEdit && <button className="btn btn-primary" onClick={onEdit}>Edit</button>}
        </div>
      </div>
    </div>
  );
};
