import { JwtPayload } from './auth';

export interface AuthenticatedSocket {
  user: JwtPayload;
}

export interface MessageSendPayload {
  conversationId: string;
  content?: string;
  type?: string;
  replyToId?: string;
  attachments?: Array<{
    url: string;
    publicId: string;
    fileName: string;
    mimeType: string;
    fileSize: number;
    width?: number;
    height?: number;
    duration?: number;
  }>;
}

export interface TypingPayload {
  conversationId: string;
}

export interface ConversationJoinPayload {
  conversationId: string;
}

export interface MessageEditPayload {
  messageId: string;
  content: string;
}

export interface MessageDeletePayload {
  messageId: string;
  deleteForAll?: boolean;
}

export interface MessageReactionPayload {
  messageId: string;
  emoji: string;
}
