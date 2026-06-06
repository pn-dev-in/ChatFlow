import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import { socketAuthMiddleware, AuthenticatedSocket } from './middleware/socketAuth.middleware';
import { registerMessageHandlers } from './handlers/message.handler';
import { registerPresenceHandlers, handleUserOnline, handleUserOffline } from './handlers/presence.handler';
import { registerConversationHandlers } from './handlers/conversation.handler';
import { prisma } from '../config/database';

let io: Server | null = null;

export function initializeSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: env.FRONTEND_URL,
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.use(socketAuthMiddleware);

  io.on('connection', async (socket) => {
    const authSocket = socket as AuthenticatedSocket;
    logger.info(`Socket connected: ${authSocket.id} (user: ${authSocket.user.userId})`);

    await handleUserOnline(io!, authSocket);

    const memberships = await prisma.conversationMember.findMany({
      where: { userId: authSocket.user.userId },
      select: { conversationId: true },
    });

    for (const { conversationId } of memberships) {
      authSocket.join(`conversation:${conversationId}`);
    }

    registerMessageHandlers(io!, authSocket);
    registerPresenceHandlers(io!, authSocket);
    registerConversationHandlers(authSocket);

    authSocket.on('disconnect', async () => {
      logger.info(`Socket disconnected: ${authSocket.id}`);
      await handleUserOffline(io!, authSocket);
    });
  });

  return io;
}

export function getIO(): Server {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
}
