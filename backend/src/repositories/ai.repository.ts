import { prisma } from '../config/database';

export class AiRepository {
  async createConversation(userId: string, title = 'New Chat') {
    return prisma.aiConversation.create({
      data: { userId, title },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
  }

  async findConversation(id: string, userId: string) {
    return prisma.aiConversation.findFirst({
      where: { id, userId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
  }

  async findUserConversations(userId: string) {
    return prisma.aiConversation.findMany({
      where: { userId },
      include: {
        messages: { take: 1, orderBy: { createdAt: 'desc' } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async addMessage(data: {
    aiConversationId: string;
    role: string;
    content: string;
    tokensUsed?: number;
  }) {
    const [message] = await prisma.$transaction([
      prisma.aiMessage.create({ data }),
      prisma.aiConversation.update({
        where: { id: data.aiConversationId },
        data: { updatedAt: new Date() },
      }),
    ]);
    return message;
  }

  async getTotalTokensUsed(): Promise<number> {
    const result = await prisma.aiMessage.aggregate({
      _sum: { tokensUsed: true },
    });
    return result._sum.tokensUsed || 0;
  }

  async countConversations(): Promise<number> {
    return prisma.aiConversation.count();
  }

  async countMessages(): Promise<number> {
    return prisma.aiMessage.count();
  }
}

export const aiRepository = new AiRepository();
