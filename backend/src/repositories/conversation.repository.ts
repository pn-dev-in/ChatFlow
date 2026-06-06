import { ConversationType, Prisma } from '@prisma/client';
import { prisma } from '../config/database';

const conversationInclude = {
  members: {
    include: {
      user: {
        include: { profile: true, presence: true },
      },
    },
  },
  group: true,
  messages: {
    take: 1,
    orderBy: { createdAt: 'desc' as const },
    include: {
      sender: { include: { profile: true } },
      attachments: true,
      reactions: true,
    },
  },
} satisfies Prisma.ConversationInclude;

export type ConversationWithDetails = Prisma.ConversationGetPayload<{
  include: typeof conversationInclude;
}>;

export class ConversationRepository {
  async findById(id: string): Promise<ConversationWithDetails | null> {
    return prisma.conversation.findUnique({
      where: { id },
      include: conversationInclude,
    });
  }

  async findUserConversations(userId: string): Promise<ConversationWithDetails[]> {
    return prisma.conversation.findMany({
      where: {
        members: { some: { userId } },
      },
      include: conversationInclude,
      orderBy: { lastMessageAt: 'desc' },
    });
  }

  async findDirectConversation(userId1: string, userId2: string) {
    const conversations = await prisma.conversation.findMany({
      where: {
        type: ConversationType.DIRECT,
        AND: [
          { members: { some: { userId: userId1 } } },
          { members: { some: { userId: userId2 } } },
        ],
      },
      include: conversationInclude,
    });
    return conversations.find((c) => c.members.length === 2) || null;
  }

  async createDirect(userIds: [string, string]): Promise<ConversationWithDetails> {
    return prisma.conversation.create({
      data: {
        type: ConversationType.DIRECT,
        members: {
          create: userIds.map((userId) => ({ userId })),
        },
      },
      include: conversationInclude,
    });
  }

  async createGroup(data: {
    name: string;
    memberIds: string[];
    avatarUrl?: string;
  }): Promise<ConversationWithDetails> {
    return prisma.conversation.create({
      data: {
        type: ConversationType.GROUP,
        name: data.name,
        avatarUrl: data.avatarUrl,
        members: {
          create: data.memberIds.map((userId) => ({ userId })),
        },
      },
      include: conversationInclude,
    });
  }

  async isMember(conversationId: string, userId: string): Promise<boolean> {
    const member = await prisma.conversationMember.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });
    return !!member;
  }

  async updateLastMessageAt(conversationId: string): Promise<void> {
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    });
  }

  async markAsRead(conversationId: string, userId: string): Promise<void> {
    await prisma.conversationMember.update({
      where: { conversationId_userId: { conversationId, userId } },
      data: { lastReadAt: new Date(), unreadCount: 0 },
    });
  }

  async incrementUnread(conversationId: string, excludeUserId: string): Promise<void> {
    await prisma.conversationMember.updateMany({
      where: {
        conversationId,
        userId: { not: excludeUserId },
      },
      data: { unreadCount: { increment: 1 } },
    });
  }
}

export const conversationRepository = new ConversationRepository();
