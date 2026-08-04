export interface User {
  id: number;
  username: string;
  password: string;
  createdAt: string;
}

export interface Note {
  id: number;
  title: string;
  course: string;
  content: string;
  tags: string[];
  authorId: number;
  authorName: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthRequest extends Request {
  user?: User;
}
