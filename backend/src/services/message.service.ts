import { MessageStatus, MessageType } from '@prisma/client';
import { ForbiddenError, NotFoundError } from '../utils/errors';
import { messageRepository } from '../repositories/message.repository';
import { conversationRepository } from '../repositories/conversation.repository';
import { notificationRepository } from '../repositories/notification.repository';
import { NotificationType } from '@prisma/client';

export class MessageService {
  async getMessages(conversationId: string, userId: string, cursor?: string, limit = 50) {
    const isMember = await conversationRepository.isMember(conversationId, userId);
    if (!isMember) throw new ForbiddenError('Not a member of this conversation');

    const messages = await messageRepository.findByConversation(conversationId, { cursor, limit });
    return messages.reverse();
  }

  async sendMessage(
    userId: string,
    data: {
      conversationId: string;
      content?: string;
      type?: MessageType;
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
  ) {
    const isMember = await conversationRepository.isMember(data.conversationId, userId);
    if (!isMember) throw new ForbiddenError('Not a member of this conversation');

    const message = await messageRepository.create({
      conversationId: data.conversationId,
      senderId: userId,
      content: data.content,
      type: data.type,
      replyToId: data.replyToId,
      attachments: data.attachments,
    });

    await conversationRepository.updateLastMessageAt(data.conversationId);
    await conversationRepository.incrementUnread(data.conversationId, userId);

    const conversation = await conversationRepository.findById(data.conversationId);
    if (conversation) {
      for (const member of conversation.members) {
        if (member.userId !== userId) {
          await notificationRepository.create({
            userId: member.userId,
            type: NotificationType.MESSAGE,
            title: 'New message',
            body: data.content?.substring(0, 100) || 'Sent an attachment',
            data: { conversationId: data.conversationId, messageId: message.id },
          });
        }
      }
    }

    return message;
  }

  async editMessage(messageId: string, userId: string, content: string) {
    const message = await messageRepository.findById(messageId);
    if (!message) throw new NotFoundError('Message not found');
    if (message.senderId !== userId) throw new ForbiddenError('Cannot edit this message');
    if (message.isDeleted) throw new ForbiddenError('Message has been deleted');

    return messageRepository.update(messageId, content);
  }

  async deleteMessage(messageId: string, userId: string, deleteForAll = false) {
    const message = await messageRepository.findById(messageId);
    if (!message) throw new NotFoundError('Message not found');

    if (deleteForAll) {
      if (message.senderId !== userId) throw new ForbiddenError('Cannot delete this message for everyone');
    }

    return messageRepository.softDelete(messageId, deleteForAll);
  }

  async addReaction(messageId: string, userId: string, emoji: string) {
    const message = await messageRepository.findById(messageId);
    if (!message) throw new NotFoundError('Message not found');

    const isMember = await conversationRepository.isMember(message.conversationId, userId);
    if (!isMember) throw new ForbiddenError('Not a member of this conversation');

    return messageRepository.addReaction(messageId, userId, emoji);
  }

  async removeReaction(messageId: string, userId: string, emoji: string) {
    await messageRepository.removeReaction(messageId, userId, emoji);
    return { success: true };
  }

  async searchMessages(userId: string, query: string, conversationId?: string, limit = 20) {
    return messageRepository.search(userId, query, conversationId, limit);
  }

  async markDelivered(messageId: string) {
    await messageRepository.updateStatus(messageId, MessageStatus.DELIVERED);
  }

  async markRead(messageId: string) {
    await messageRepository.updateStatus(messageId, MessageStatus.READ);
  }
}

export const messageService = new MessageService();
