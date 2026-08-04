import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import type { User, Note } from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');
const NOTES_FILE = path.join(__dirname, '..', 'data', 'notes.json');

async function ensureDir(filePath: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

export async function readUsers(): Promise<User[]> {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch { return []; }
}

export async function writeUsers(users: User[]): Promise<void> {
  await ensureDir(USERS_FILE);
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

export async function readNotes(): Promise<Note[]> {
  try {
    const data = await fs.readFile(NOTES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch { return []; }
}

export async function writeNotes(notes: Note[]): Promise<void> {
  await ensureDir(NOTES_FILE);
  await fs.writeFile(NOTES_FILE, JSON.stringify(notes, null, 2));
}
