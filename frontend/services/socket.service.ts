import { io, Socket } from 'socket.io-client';
import { Message, Notification } from '@/types';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';

type EventCallback = (...args: unknown[]) => void;

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<EventCallback>> = new Map();

  connect(token: string) {
    if (this.socket?.connected) return this.socket;

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    const events = [
      'message:receive',
      'message:edit',
      'message:delete',
      'message:reaction',
      'typing:start',
      'typing:stop',
      'user:online',
      'user:offline',
      'notification:new',
      'presence:update',
    ];

    events.forEach((event) => {
      this.socket!.on(event, (data: unknown) => {
        this.emit(event, data);
      });
    });

    return this.socket;
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
    this.listeners.clear();
  }

  on(event: string, callback: EventCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    return () => this.off(event, callback);
  }

  off(event: string, callback: EventCallback) {
    this.listeners.get(event)?.delete(callback);
  }

  private emit(event: string, data: unknown) {
    this.listeners.get(event)?.forEach((cb) => cb(data));
  }

  joinConversation(conversationId: string) {
    this.socket?.emit('conversation:join', { conversationId });
  }

  leaveConversation(conversationId: string) {
    this.socket?.emit('conversation:leave', { conversationId });
  }

  sendMessage(payload: {
    conversationId: string;
    content?: string;
    type?: string;
    replyToId?: string;
    attachments?: unknown[];
  }) {
    return new Promise<{ success: boolean; message?: Message; error?: string }>((resolve) => {
      this.socket?.emit('message:send', payload, resolve);
    });
  }

  editMessage(messageId: string, content: string) {
    return new Promise<{ success: boolean }>((resolve) => {
      this.socket?.emit('message:edit', { messageId, content }, resolve);
    });
  }

  deleteMessage(messageId: string, deleteForAll = false) {
    return new Promise<{ success: boolean }>((resolve) => {
      this.socket?.emit('message:delete', { messageId, deleteForAll }, resolve);
    });
  }

  addReaction(messageId: string, emoji: string) {
    return new Promise<{ success: boolean }>((resolve) => {
      this.socket?.emit('message:reaction', { messageId, emoji }, resolve);
    });
  }

  startTyping(conversationId: string) {
    this.socket?.emit('typing:start', { conversationId });
  }

  stopTyping(conversationId: string) {
    this.socket?.emit('typing:stop', { conversationId });
  }

  markAsRead(conversationId: string) {
    this.socket?.emit('conversation:read', { conversationId });
  }

  updatePresence(status: string) {
    this.socket?.emit('presence:update', { status });
  }

  onMessageReceive(callback: (data: { message: Message; conversationId: string }) => void) {
    return this.on('message:receive', callback as EventCallback);
  }

  onTypingStart(callback: (data: { conversationId: string; userId: string }) => void) {
    return this.on('typing:start', callback as EventCallback);
  }

  onTypingStop(callback: (data: { conversationId: string; userId: string }) => void) {
    return this.on('typing:stop', callback as EventCallback);
  }

  onUserOnline(callback: (data: { userId: string; status: string }) => void) {
    return this.on('user:online', callback as EventCallback);
  }

  onUserOffline(callback: (data: { userId: string; lastSeenAt: string }) => void) {
    return this.on('user:offline', callback as EventCallback);
  }

  onNotification(callback: (data: { notification: Notification }) => void) {
    return this.on('notification:new', callback as EventCallback);
  }
}

export const socketService = new SocketService();
