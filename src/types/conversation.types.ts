export interface ChatwootContact {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
}

export interface ChatwootMessage {
  id: number;
  content: string;
  messageType: 'incoming' | 'outgoing' | 'activity' | 'template';
  contentType?: string;
  createdAt: number;
  sender?: {
    id: number;
    name: string;
    avatarUrl?: string;
  };
}

export interface ChatwootConversation {
  id: number;
  status: 'open' | 'pending' | 'resolved';
  unreadCount: number;
  contact: ChatwootContact;
  messages: ChatwootMessage[];
  createdAt: number;
}
