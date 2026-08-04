import React, { useState, useEffect, useRef } from 'react';
import type { Note, NoteFormData } from '../types';

interface NoteModalProps {
  isOpen: boolean;
  note: Note | null;
  existingCourses: string[];
  onClose: () => void;
  onSave: (data: NoteFormData) => void;
}

const emptyForm: NoteFormData = {
  title: '',
  course: '',
  content: '',
  tags: '',
  isPublic: true,
};

export const NoteModal: React.FC<NoteModalProps> = ({ isOpen, note, existingCourses, onClose, onSave }) => {
  const [form, setForm] = useState<NoteFormData>(emptyForm);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (note) {
        setForm({
          title: note.title,
          course: note.course,
          content: note.content,
          tags: note.tags.join(', '),
          isPublic: note.isPublic,
        });
      } else {
        setForm(emptyForm);
      }
      setTimeout(() => titleRef.current?.focus(), 50);
    }
  }, [isOpen, note]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    onSave(form);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay active" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-header">
          <h2>{note ? 'Edit Note' : 'New Note'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Title</label>
              <input ref={titleRef} type="text" placeholder="e.g. Week 3: Thermodynamics" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Course</label>
                <input type="text" list="courseList" placeholder="e.g. Physics 101" value={form.course} onChange={e => setForm({ ...form, course: e.target.value })} />
                <datalist id="courseList">
                  {existingCourses.map(c => <option key={c} value={c} />)}
                </datalist>
              </div>
              <div className="form-group">
                <label>Tags</label>
                <input type="text" placeholder="e.g. exam, important" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={form.isPublic}
                  onChange={e => setForm({ ...form, isPublic: e.target.checked })}
                  style={{ width: 'auto', margin: 0 }}
                />
                <span style={{ textTransform: 'none', fontWeight: 500, fontSize: '0.9rem' }}>
                  Make this note public (visible in Public Feed)
                </span>
              </label>
            </div>
            <div className="form-group">
              <label>Content</label>
              <textarea placeholder="Write your notes here..." value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">{note ? 'Save Changes' : 'Create Note'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
