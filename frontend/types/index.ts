export interface UserProfile {
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  phone: string | null;
  timezone: string;
  darkMode: boolean;
}

export interface UserPresence {
  isOnline: boolean;
  status: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  isActive: boolean;
  lastSeenAt: string | null;
  createdAt: string;
  profile: UserProfile | null;
  presence?: UserPresence | null;
}

export interface ConversationMember {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string | null;
  isOnline: boolean;
  status: string;
  lastReadAt?: string | null;
}

export interface Attachment {
  id: string;
  url: string;
  publicId: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  width?: number;
  height?: number;
  duration?: number;
}

export interface MessageReaction {
  id: string;
  emoji: string;
  userId: string;
  user?: { profile?: { displayName: string } };
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string | null;
  type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'SYSTEM';
  status: 'SENT' | 'DELIVERED' | 'READ';
  replyToId?: string | null;
  isEdited: boolean;
  isDeleted: boolean;
  deletedForAll: boolean;
  createdAt: string;
  updatedAt: string;
  sender: User;
  replyTo?: Message | null;
  attachments: Attachment[];
  reactions: MessageReaction[];
}

export interface Conversation {
  id: string;
  type: 'DIRECT' | 'GROUP';
  name: string | null;
  avatarUrl: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
  members: ConversationMember[];
  lastMessage: Message | null;
  group?: Group | null;
}

export interface Group {
  id: string;
  conversationId: string;
  name: string;
  description: string | null;
  avatarUrl: string | null;
  isPrivate: boolean;
  createdById: string;
  members?: Array<{
    userId: string;
    role: string;
    user: User;
  }>;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  data: Record<string, unknown> | null;
  isRead: boolean;
  createdAt: string;
}

export interface AiConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: AiMessage[];
}

export interface AiMessage {
  id: string;
  role: string;
  content: string;
  tokensUsed?: number;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: { message: string; code: string };
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface Analytics {
  users: { total: number; online: number };
  messages: { total: number; today: number };
  groups: { total: number };
  ai: { conversations: number; messages: number; tokensUsed: number };
}
