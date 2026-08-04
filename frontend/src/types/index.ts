export interface User {
  id: number;
  username: string;
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

export interface NoteFormData {
  title: string;
  course: string;
  content: string;
  tags: string;
  isPublic: boolean;
}
