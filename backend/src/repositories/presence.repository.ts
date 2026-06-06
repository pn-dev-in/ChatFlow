import { prisma } from '../config/database';

export class PresenceRepository {
  async setOnline(userId: string, socketId: string, status = 'online') {
    return prisma.userPresence.upsert({
      where: { userId },
      create: { userId, isOnline: true, socketId, status },
      update: { isOnline: true, socketId, status, updatedAt: new Date() },
    });
  }

  async setOffline(userId: string) {
    return prisma.userPresence.update({
      where: { userId },
      data: { isOnline: false, socketId: null, status: 'offline', updatedAt: new Date() },
    });
  }

  async updateStatus(userId: string, status: string) {
    return prisma.userPresence.update({
      where: { userId },
      data: { status, updatedAt: new Date() },
    });
  }

  async getOnlineUsers(): Promise<string[]> {
    const presences = await prisma.userPresence.findMany({
      where: { isOnline: true },
      select: { userId: true },
    });
    return presences.map((p) => p.userId);
  }

  async getOnlineCount(): Promise<number> {
    return prisma.userPresence.count({ where: { isOnline: true } });
  }
}

export const presenceRepository = new PresenceRepository();
