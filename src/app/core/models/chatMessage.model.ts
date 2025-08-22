export type Sender = 'user' | 'bot';

export interface ChatMessage {
  id: string;
  sender: Sender;
  timestamp: string;
  content: string;
}