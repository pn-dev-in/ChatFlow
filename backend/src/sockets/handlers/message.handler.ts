import { Server } from 'socket.io';
import { MessageType } from '@prisma/client';
import { AuthenticatedSocket } from '../middleware/socketAuth.middleware';
import { messageService } from '../../services/message.service';
import { conversationRepository } from '../../repositories/conversation.repository';
import { notificationRepository } from '../../repositories/notification.repository';
import { logger } from '../../utils/logger';

export function registerMessageHandlers(io: Server, socket: AuthenticatedSocket) {
  socket.on('message:send', async (payload, callback) => {
    try {
      const message = await messageService.sendMessage(socket.user.userId, {
        conversationId: payload.conversationId,
        content: payload.content,
        type: (payload.type as MessageType) || MessageType.TEXT,
        replyToId: payload.replyToId,
        attachments: payload.attachments,
      });

      io.to(`conversation:${payload.conversationId}`).emit('message:receive', {
        message,
        conversationId: payload.conversationId,
      });

      const conversation = await conversationRepository.findById(payload.conversationId);
      if (conversation) {
        for (const member of conversation.members) {
          if (member.userId !== socket.user.userId) {
            const notification = await notificationRepository.findByUser(member.userId, 1);
            io.to(`user:${member.userId}`).emit('notification:new', {
              notification: notification[0],
            });
          }
        }
      }

      callback?.({ success: true, message });
    } catch (error) {
      logger.error('message:send error:', error);
      callback?.({ success: false, error: (error as Error).message });
    }
  });

  socket.on('message:edit', async (payload, callback) => {
    try {
      const message = await messageService.editMessage(
        payload.messageId,
        socket.user.userId,
        payload.content
      );

      io.to(`conversation:${message.conversationId}`).emit('message:edit', {
        messageId: message.id,
        content: message.content,
        isEdited: true,
        conversationId: message.conversationId,
      });

      callback?.({ success: true, message });
    } catch (error) {
      callback?.({ success: false, error: (error as Error).message });
    }
  });

  socket.on('message:delete', async (payload, callback) => {
    try {
      const message = await messageService.deleteMessage(
        payload.messageId,
        socket.user.userId,
        payload.deleteForAll
      );

      io.to(`conversation:${message.conversationId}`).emit('message:delete', {
        messageId: message.id,
        deletedForAll: message.deletedForAll,
        conversationId: message.conversationId,
      });

      callback?.({ success: true });
    } catch (error) {
      callback?.({ success: false, error: (error as Error).message });
    }
  });

  socket.on('message:reaction', async (payload, callback) => {
    try {
      const reaction = await messageService.addReaction(
        payload.messageId,
        socket.user.userId,
        payload.emoji
      );

      const { messageRepository } = await import('../../repositories/message.repository');
      const msg = await messageRepository.findById(payload.messageId);

      if (msg) {
        io.to(`conversation:${msg.conversationId}`).emit('message:reaction', {
          messageId: payload.messageId,
          reaction,
          conversationId: msg.conversationId,
        });
      }

      callback?.({ success: true, reaction });
    } catch (error) {
      callback?.({ success: false, error: (error as Error).message });
    }
  });
}
