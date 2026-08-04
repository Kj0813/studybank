import { Router } from 'express';
import { readNotes, writeNotes } from '../data/helpers.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// GET public notes (no auth required) - supports ?course= filter
router.get('/public', async (req, res) => {
  const notes = await readNotes();
  let publicNotes = notes.filter(n => n.isPublic);
  const course = req.query.course as string;
  if (course?.trim()) {
    publicNotes = publicNotes.filter(n =>
      n.course.toLowerCase().includes(course.toLowerCase())
    );
  }
  const search = req.query.search as string;
  if (search?.trim()) {
    const q = search.toLowerCase();
    publicNotes = publicNotes.filter(n =>
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      n.course.toLowerCase().includes(q) ||
      n.tags.some(t => t.toLowerCase().includes(q))
    );
  }
  res.json(publicNotes.sort((a, b) =>
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  ));
});

// GET all courses that have public notes
router.get('/courses', async (_req, res) => {
  const notes = await readNotes();
  const courses = [...new Set(notes.filter(n => n.isPublic).map(n => n.course))].sort();
  res.json(courses);
});

// GET my notes (auth required)
router.get('/my', authMiddleware, async (req, res) => {
  const notes = await readNotes();
  const myNotes = notes.filter(n => n.authorId === req.user!.id);
  res.json(myNotes.sort((a, b) =>
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  ));
});

// GET single note (public or mine)
router.get('/:id', async (req, res) => {
  const notes = await readNotes();
  const note = notes.find(n => n.id === Number(req.params.id));
  if (!note) return res.status(404).json({ error: 'Not found' });
  if (!note.isPublic) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(403).json({ error: 'Private note' });
    }
    try {
      const payload = JSON.parse(Buffer.from(authHeader.slice(7), 'base64').toString());
      if (note.authorId !== payload.userId) {
        return res.status(403).json({ error: 'Private note' });
      }
    } catch {
      return res.status(403).json({ error: 'Private note' });
    }
  }
  res.json(note);
});

// POST create note (auth required)
router.post('/', authMiddleware, async (req, res) => {
  const { title, course, content, tags, isPublic } = req.body;
  if (!title?.trim() || !content?.trim()) {
    return res.status(400).json({ error: 'Title and content required' });
  }
  const notes = await readNotes();
  const now = new Date().toISOString();
  const newNote = {
    id: Date.now(),
    title: title.trim(),
    course: (course || 'Uncategorized').trim(),
    content: content.trim(),
    tags: Array.isArray(tags) ? tags.filter(Boolean) : [],
    authorId: req.user!.id,
    authorName: req.user!.username,
    isPublic: isPublic === true,
    createdAt: now,
    updatedAt: now
  };
  notes.push(newNote);
  await writeNotes(notes);
  res.status(201).json(newNote);
});

// PUT update note (auth required, must be owner)
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, course, content, tags, isPublic } = req.body;
  const notes = await readNotes();
  const idx = notes.findIndex(n => n.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  if (notes[idx].authorId !== req.user!.id) {
    return res.status(403).json({ error: 'Not your note' });
  }
  notes[idx] = {
    ...notes[idx],
    title: title?.trim() || notes[idx].title,
    course: (course || notes[idx].course).trim(),
    content: content?.trim() || notes[idx].content,
    tags: Array.isArray(tags) ? tags.filter(Boolean) : notes[idx].tags,
    isPublic: isPublic !== undefined ? isPublic === true : notes[idx].isPublic,
    updatedAt: new Date().toISOString()
  };
  await writeNotes(notes);
  res.json(notes[idx]);
});

// DELETE note (auth required, must be owner)
router.delete('/:id', authMiddleware, async (req, res) => {
  const notes = await readNotes();
  const note = notes.find(n => n.id === Number(req.params.id));
  if (!note) return res.status(404).json({ error: 'Not found' });
  if (note.authorId !== req.user!.id) {
    return res.status(403).json({ error: 'Not your note' });
  }
  const filtered = notes.filter(n => n.id !== Number(req.params.id));
  await writeNotes(filtered);
  res.status(204).send();
});

// Export my notes
router.get('/export/my', authMiddleware, async (_req, res) => {
  const notes = await readNotes();
  const myNotes = notes.filter(n => n.authorId === _req.user!.id);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="studybank-backup-${new Date().toISOString().slice(0,10)}.json"`);
  res.send(JSON.stringify(myNotes, null, 2));
});

// Import notes
router.post('/import', authMiddleware, async (req, res) => {
  const { notes: importedNotes } = req.body;
  if (!Array.isArray(importedNotes)) return res.status(400).json({ error: 'Invalid format' });
  const notes = await readNotes();
  const newNotes = importedNotes.map((n: any) => ({
    ...n,
    id: Date.now() + Math.random(),
    authorId: req.user!.id,
    authorName: req.user!.username,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));
  notes.push(...newNotes);
  await writeNotes(notes);
  res.json({ count: newNotes.length });
});

export default router;
