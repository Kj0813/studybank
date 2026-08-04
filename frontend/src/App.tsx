import React, { useState, useCallback, useMemo } from 'react';
import './App.css';
import { useAuth } from './context/AuthContext.tsx';
import { useNotes } from './hooks/useNotes.ts';
import { Header } from './components/Header.tsx';
import { StatsBar } from './components/StatsBar.tsx';
import { NoteCard } from './components/NoteCard.tsx';
import { NoteModal } from './components/NoteModal.tsx';
import { ViewModal } from './components/ViewModal.tsx';
import { PublicFeed } from './components/PublicFeed.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { ToastContainer, type ToastItem, type ToastType } from './components/Toast.tsx';
import { EmptyState } from './components/EmptyState.tsx';
import { openPDFView } from './components/PDFView.ts';
import type { Note, NoteFormData } from './types';

function App() {
  const { user } = useAuth();
  const { notes, loading, error, createNote, updateNote, deleteNote, exportNotes, importNotes } = useNotes();
  const [page, setPage] = useState<'dashboard' | 'public'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    setToasts(prev => [...prev, { id: Date.now() + Math.random(), message, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const courses = useMemo(() => {
    return Array.from(new Set(notes.map(n => n.course))).sort();
  }, [notes]);

  const filteredNotes = useMemo(() => {
    let filtered = [...notes];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.course.toLowerCase().includes(q) ||
        n.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return filtered;
  }, [notes, searchQuery]);

  const handleNewNote = () => {
    if (!user) { setAuthOpen(true); return; }
    setEditingNote(null);
    setModalOpen(true);
  };

  const handleEdit = (id: number) => {
    const note = notes.find(n => n.id === id);
    if (note) { setEditingNote(note); setModalOpen(true); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this note? This cannot be undone.')) return;
    try { await deleteNote(id); addToast('Note deleted', 'info'); if (viewingNote?.id === id) setViewingNote(null); }
    catch { addToast('Failed to delete', 'error'); }
  };

  const handleSave = async (formData: NoteFormData) => {
    try {
      if (editingNote) { await updateNote(editingNote.id, formData); addToast('Note updated', 'success'); }
      else { await createNote(formData); addToast('Note created', 'success'); }
      setModalOpen(false); setEditingNote(null);
    } catch { addToast('Something went wrong', 'error'); }
  };

  const handleView = (note: Note) => setViewingNote(note);
  const handleViewById = (id: number) => {
    const note = notes.find(n => n.id === id);
    if (note) setViewingNote(note);
  };

  const handleDownloadPDF = (note: Note) => {
    openPDFView(note);
    addToast('PDF opened — use Print to save', 'info');
  };

  const handleExport = async () => {
    try { await exportNotes(); addToast('Notes exported', 'success'); }
    catch { addToast('Export failed', 'error'); }
  };

  const handleImport = async (file: File) => {
    try { await importNotes(file); addToast('Notes imported', 'success'); }
    catch { addToast('Import failed', 'error'); }
  };

  return (
    <div className="app">
      <Header
        page={page}
        onChangePage={setPage}
        onNewNote={handleNewNote}
        onExport={handleExport}
        onImport={handleImport}
        onOpenAuth={() => setAuthOpen(true)}
      />

      <main className="container">
        {page === 'dashboard' ? (
          <>
            {!user ? (
              <div className="empty-state" style={{ padding: '100px 20px' }}>
                <span className="empty-state-icon">Welcome</span>
                <h3>Sign in to manage your notes</h3>
                <p>Create an account or sign in to start taking and sharing course notes.</p>
                <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={() => setAuthOpen(true)}>
                  Get Started
                </button>
              </div>
            ) : (
              <>
                <StatsBar notes={notes} />
                <div className="toolbar">
                  <div className="search-box" style={{ flex: 1 }}>
                    <span className="search-icon">Search</span>
                    <input type="text" placeholder="Search your notes..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                  </div>
                </div>
                {loading ? (
                  <div className="loading">Loading notes...</div>
                ) : error ? (
                  <div className="loading" style={{ color: '#dc2626' }}>{error}</div>
                ) : (
                  <div className="notes-grid">
                    {filteredNotes.length === 0 ? (
                      <EmptyState hasFilters={searchQuery !== ''} />
                    ) : (
                      filteredNotes.map((note, i) => (
                        <NoteCard
                          key={note.id}
                          note={note}
                          index={i}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          onView={handleViewById}
                          onDownloadPDF={handleDownloadPDF}
                        />
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <PublicFeed onView={handleView} onDownloadPDF={handleDownloadPDF} />
        )}
      </main>

      <NoteModal
        isOpen={modalOpen}
        note={editingNote}
        existingCourses={courses}
        onClose={() => { setModalOpen(false); setEditingNote(null); }}
        onSave={handleSave}
      />

      <ViewModal
        note={viewingNote}
        canEdit={!!user && viewingNote?.authorId === user.id}
        onClose={() => setViewingNote(null)}
        onEdit={() => {
          if (viewingNote) { setEditingNote(viewingNote); setViewingNote(null); setModalOpen(true); }
        }}
        onDownloadPDF={handleDownloadPDF}
      />

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default App;
