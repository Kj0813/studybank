import React from 'react';
import type { Note } from '../types';

interface StatsBarProps {
  notes: Note[];
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

export const StatsBar: React.FC<StatsBarProps> = ({ notes }) => {
  const total = notes.length;
  const courses = new Set(notes.map(n => n.course)).size;
  const publicCount = notes.filter(n => n.isPublic).length;
  const lastUpdated = notes.length > 0
    ? formatDate(notes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0].updatedAt)
    : '—';

  return (
    <div className="stats-bar">
      <div className="stat-card"><div className="stat-label">My Notes</div><div className="stat-value">{total}</div></div>
      <div className="stat-card"><div className="stat-label">Courses</div><div className="stat-value">{courses}</div></div>
      <div className="stat-card"><div className="stat-label">Public</div><div className="stat-value">{publicCount}</div></div>
      <div className="stat-card"><div className="stat-label">Last Updated</div><div className="stat-value small">{lastUpdated}</div></div>
    </div>
  );
};