import { ForbiddenError, NotFoundError, ConflictError } from '../utils/errors';
import { conversationRepository } from '../repositories/conversation.repository';
import { userRepository } from '../repositories/user.repository';

export class ConversationService {
  async getUserConversations(userId: string) {
    const conversations = await conversationRepository.findUserConversations(userId);
    return conversations.map((c) => this.formatConversation(c, userId));
  }

  async getConversation(conversationId: string, userId: string) {
    const isMember = await conversationRepository.isMember(conversationId, userId);
    if (!isMember) throw new ForbiddenError('Not a member of this conversation');

    const conversation = await conversationRepository.findById(conversationId);
    if (!conversation) throw new NotFoundError('Conversation not found');

    return this.formatConversation(conversation, userId);
  }

  async createDirectConversation(userId: string, participantId: string) {
    if (userId === participantId) {
      throw new ConflictError('Cannot create conversation with yourself');
    }

    const participant = await userRepository.findById(participantId);
    if (!participant) throw new NotFoundError('Participant not found');

    const existing = await conversationRepository.findDirectConversation(userId, participantId);
    if (existing) return this.formatConversation(existing, userId);

    const conversation = await conversationRepository.createDirect([userId, participantId]);
    return this.formatConversation(conversation, userId);
  }

  async markAsRead(conversationId: string, userId: string) {
    const isMember = await conversationRepository.isMember(conversationId, userId);
    if (!isMember) throw new ForbiddenError('Not a member of this conversation');

    await conversationRepository.markAsRead(conversationId, userId);
    return { success: true };
  }

  private formatConversation(
    conversation: Awaited<ReturnType<typeof conversationRepository.findById>>,
    currentUserId: string
  ) {
    if (!conversation) return null;

    const otherMembers = conversation.members.filter((m) => m.userId !== currentUserId);
    const currentMember = conversation.members.find((m) => m.userId === currentUserId);

    let displayName = conversation.name;
    let avatarUrl = conversation.avatarUrl;

    if (conversation.type === 'DIRECT' && otherMembers.length > 0) {
      displayName = otherMembers[0].user.profile?.displayName || otherMembers[0].user.username;
      avatarUrl = otherMembers[0].user.profile?.avatarUrl || null;
    }

    return {
      id: conversation.id,
      type: conversation.type,
      name: displayName,
      avatarUrl,
      lastMessageAt: conversation.lastMessageAt,
      unreadCount: currentMember?.unreadCount || 0,
      members: conversation.members.map((m) => ({
        id: m.user.id,
        username: m.user.username,
        displayName: m.user.profile?.displayName,
        avatarUrl: m.user.profile?.avatarUrl,
        isOnline: m.user.presence?.isOnline || false,
        status: m.user.presence?.status || 'offline',
        lastReadAt: m.lastReadAt,
      })),
      lastMessage: conversation.messages[0] || null,
      group: conversation.group,
    };
  }
}

export const conversationService = new ConversationService();
