import { Router } from 'express';
import { readUsers, writeUsers } from '../data/helpers.js';

const router = Router();

function createToken(userId: number, username: string): string {
  return Buffer.from(JSON.stringify({ userId, username, iat: Date.now() })).toString('base64');
}

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username?.trim() || !password?.trim()) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  const users = await readUsers();
  if (users.find(u => u.username === username.trim())) {
    return res.status(409).json({ error: 'Username taken' });
  }
  const newUser = {
    id: Date.now(),
    username: username.trim(),
    password: password.trim(),
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  await writeUsers(users);
  res.status(201).json({
    token: createToken(newUser.id, newUser.username),
    user: { id: newUser.id, username: newUser.username }
  });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const users = await readUsers();
  const user = users.find(u => u.username === username?.trim() && u.password === password?.trim());
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({
    token: createToken(user.id, user.username),
    user: { id: user.id, username: user.username }
  });
});

router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.slice(7);
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    const users = await readUsers();
    const user = users.find(u => u.id === payload.userId);
    if (!user) return res.status(401).json({ error: 'Invalid token' });
    res.json({ id: user.id, username: user.username });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
