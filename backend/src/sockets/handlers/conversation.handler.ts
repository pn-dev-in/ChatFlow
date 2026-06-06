import { AuthenticatedSocket } from '../middleware/socketAuth.middleware';
import { conversationRepository } from '../../repositories/conversation.repository';
import { conversationService } from '../../services/conversation.service';

export function registerConversationHandlers(socket: AuthenticatedSocket) {
  socket.on('conversation:join', async ({ conversationId }, callback) => {
    try {
      const isMember = await conversationRepository.isMember(conversationId, socket.user.userId);
      if (!isMember) {
        callback?.({ success: false, error: 'Not a member' });
        return;
      }

      socket.join(`conversation:${conversationId}`);
      callback?.({ success: true });
    } catch (error) {
      callback?.({ success: false, error: (error as Error).message });
    }
  });

  socket.on('conversation:leave', ({ conversationId }) => {
    socket.leave(`conversation:${conversationId}`);
  });

  socket.on('conversation:read', async ({ conversationId }, callback) => {
    try {
      await conversationService.markAsRead(conversationId, socket.user.userId);
      callback?.({ success: true });
    } catch (error) {
      callback?.({ success: false, error: (error as Error).message });
    }
  });
}
