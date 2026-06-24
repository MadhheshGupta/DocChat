export type Role = 'user' | 'assistant';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
}

export interface DocumentState {
  file: File | null;
  text: string;
  charCount: number;
  isExtracting: boolean;
  error: string | null;
}
