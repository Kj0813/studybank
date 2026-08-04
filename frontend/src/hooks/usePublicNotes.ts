import { useState, useEffect, useCallback } from 'react';
import type { Note } from '../types';

const API_URL = 'studybank-api.onrender.com'; // ← your Render URL

export function usePublicNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [courses, setCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPublic = useCallback(async (courseFilter?: string, search?: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (courseFilter) params.set('course', courseFilter);
      if (search) params.set('search', search);
      const res = await fetch(`${API_URL}/api/notes/public?${params}`);
      if (!res.ok) throw new Error('Failed to fetch public notes');
      const data = await res.json();
      setNotes(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCourses = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/notes/courses`);
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setCourses(data);
    } catch {
      setCourses([]);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
    fetchPublic();
  }, [fetchCourses, fetchPublic]);

  return { notes, courses, loading, error, fetchPublic, fetchCourses };
}