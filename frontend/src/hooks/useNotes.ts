import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import type { Note, NoteFormData } from '../types';

export function useNotes() {
  const { token } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const headers = token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };

  const fetchNotes = useCallback(async () => {
    if (!token) { setNotes([]); setLoading(false); return; }
    try {
      setLoading(true);
      const res = await fetch('/api/notes/my', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setNotes(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const createNote = async (formData: NoteFormData): Promise<Note> => {
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        title: formData.title,
        course: formData.course,
        content: formData.content,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        isPublic: formData.isPublic,
      }),
    });
    if (!res.ok) throw new Error('Failed to create');
    const note = await res.json();
    setNotes(prev => [note, ...prev]);
    return note;
  };

  const updateNote = async (id: number, formData: NoteFormData): Promise<Note> => {
    const res = await fetch(`/api/notes/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        title: formData.title,
        course: formData.course,
        content: formData.content,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        isPublic: formData.isPublic,
      }),
    });
    if (!res.ok) throw new Error('Failed to update');
    const note = await res.json();
    setNotes(prev => prev.map(n => n.id === id ? note : n));
    return note;
  };

  const deleteNote = async (id: number): Promise<void> => {
    const res = await fetch(`/api/notes/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error('Failed to delete');
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const exportNotes = async (): Promise<void> => {
    const res = await fetch('/api/notes/export/my', { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error('Export failed');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studybank-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importNotes = async (file: File): Promise<void> => {
    const text = await file.text();
    const data = JSON.parse(text);
    const res = await fetch('/api/notes/import', {
      method: 'POST',
      headers,
      body: JSON.stringify({ notes: data }),
    });
    if (!res.ok) throw new Error('Import failed');
    await fetchNotes();
  };

  return { notes, loading, error, createNote, updateNote, deleteNote, exportNotes, importNotes, refresh: fetchNotes };
}
