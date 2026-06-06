import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../middleware/socketAuth.middleware';
import { presenceRepository } from '../../repositories/presence.repository';
import { userRepository } from '../../repositories/user.repository';

const typingUsers = new Map<string, Set<string>>();

export function registerPresenceHandlers(io: Server, socket: AuthenticatedSocket) {
  socket.on('typing:start', ({ conversationId }) => {
    if (!typingUsers.has(conversationId)) {
      typingUsers.set(conversationId, new Set());
    }
    typingUsers.get(conversationId)!.add(socket.user.userId);

    socket.to(`conversation:${conversationId}`).emit('typing:start', {
      conversationId,
      userId: socket.user.userId,
    });
  });

  socket.on('typing:stop', ({ conversationId }) => {
    typingUsers.get(conversationId)?.delete(socket.user.userId);

    socket.to(`conversation:${conversationId}`).emit('typing:stop', {
      conversationId,
      userId: socket.user.userId,
    });
  });

  socket.on('presence:update', async ({ status }) => {
    await presenceRepository.updateStatus(socket.user.userId, status);
    socket.broadcast.emit('presence:update', {
      userId: socket.user.userId,
      status,
    });
  });
}

export async function handleUserOnline(io: Server, socket: AuthenticatedSocket) {
  await presenceRepository.setOnline(socket.user.userId, socket.id);
  socket.join(`user:${socket.user.userId}`);

  io.emit('user:online', {
    userId: socket.user.userId,
    status: 'online',
  });
}

export async function handleUserOffline(io: Server, socket: AuthenticatedSocket) {
  await presenceRepository.setOffline(socket.user.userId);
  await userRepository.updateLastSeen(socket.user.userId);

  io.emit('user:offline', {
    userId: socket.user.userId,
    lastSeenAt: new Date().toISOString(),
  });
}
