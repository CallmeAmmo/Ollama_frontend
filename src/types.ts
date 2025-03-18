export interface Message {
  role: 'user' | 'assistant';
  content: string;
  thinking?: string;
}

export interface StreamResponse {
  message?: string;
  thinking?: string;
  done: boolean;
}