import type { Request, Response, NextFunction } from 'express';
import { readUsers } from '../data/helpers.js';
import type { User } from '../types/index.js';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.slice(7);
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    const users = await readUsers();
    const user = users.find(u => u.id === payload.userId && u.username === payload.username);
    if (!user) return res.status(401).json({ error: 'Invalid token' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
