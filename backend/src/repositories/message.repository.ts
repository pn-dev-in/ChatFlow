import { MessageStatus, MessageType, Prisma } from '@prisma/client';
import { prisma } from '../config/database';

const messageInclude = {
  sender: { include: { profile: true, presence: true } },
  replyTo: {
    include: { sender: { include: { profile: true } } },
  },
  attachments: true,
  reactions: {
    include: { user: { include: { profile: true } } },
  },
} satisfies Prisma.MessageInclude;

export type MessageWithDetails = Prisma.MessageGetPayload<{ include: typeof messageInclude }>;

export class MessageRepository {
  async findById(id: string): Promise<MessageWithDetails | null> {
    return prisma.message.findUnique({
      where: { id },
      include: messageInclude,
    });
  }

  async findByConversation(
    conversationId: string,
    params: { cursor?: string; limit: number }
  ): Promise<MessageWithDetails[]> {
    return prisma.message.findMany({
      where: {
        conversationId,
        isDeleted: false,
        deletedForAll: false,
      },
      include: messageInclude,
      orderBy: { createdAt: 'desc' },
      take: params.limit,
      ...(params.cursor && {
        cursor: { id: params.cursor },
        skip: 1,
      }),
    });
  }

  async create(data: {
    conversationId: string;
    senderId: string;
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
  }): Promise<MessageWithDetails> {
    return prisma.message.create({
      data: {
        conversationId: data.conversationId,
        senderId: data.senderId,
        content: data.content,
        type: data.type || MessageType.TEXT,
        replyToId: data.replyToId,
        attachments: data.attachments
          ? { create: data.attachments }
          : undefined,
      },
      include: messageInclude,
    });
  }

  async update(id: string, content: string): Promise<MessageWithDetails> {
    return prisma.message.update({
      where: { id },
      data: { content, isEdited: true },
      include: messageInclude,
    });
  }

  async softDelete(id: string, deleteForAll: boolean): Promise<MessageWithDetails> {
    return prisma.message.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedForAll: deleteForAll,
        content: deleteForAll ? null : undefined,
      },
      include: messageInclude,
    });
  }

  async updateStatus(id: string, status: MessageStatus): Promise<void> {
    await prisma.message.update({
      where: { id },
      data: { status },
    });
  }

  async search(
    userId: string,
    query: string,
    conversationId?: string,
    limit = 20
  ): Promise<MessageWithDetails[]> {
    return prisma.message.findMany({
      where: {
        isDeleted: false,
        content: { contains: query, mode: 'insensitive' },
        ...(conversationId && { conversationId }),
        conversation: {
          members: { some: { userId } },
        },
      },
      include: messageInclude,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async addReaction(messageId: string, userId: string, emoji: string) {
    return prisma.messageReaction.upsert({
      where: {
        messageId_userId_emoji: { messageId, userId, emoji },
      },
      create: { messageId, userId, emoji },
      update: {},
      include: { user: { include: { profile: true } } },
    });
  }

  async removeReaction(messageId: string, userId: string, emoji: string): Promise<void> {
    await prisma.messageReaction.deleteMany({
      where: { messageId, userId, emoji },
    });
  }

  async count(): Promise<number> {
    return prisma.message.count({ where: { isDeleted: false } });
  }

  async countToday(): Promise<number> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    return prisma.message.count({
      where: { createdAt: { gte: startOfDay }, isDeleted: false },
    });
  }
}

export const messageRepository = new MessageRepository();
