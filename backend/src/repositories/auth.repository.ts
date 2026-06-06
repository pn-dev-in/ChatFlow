import { prisma } from '../config/database';

export class AuthRepository {
  async saveRefreshToken(userId: string, token: string, expiresAt: Date) {
    return prisma.refreshToken.create({
      data: { userId, token, expiresAt },
    });
  }

  async findRefreshToken(token: string) {
    return prisma.refreshToken.findUnique({
      where: { token },
      include: { user: { include: { profile: true } } },
    });
  }

  async deleteRefreshToken(token: string): Promise<void> {
    await prisma.refreshToken.deleteMany({ where: { token } });
  }

  async deleteAllUserRefreshTokens(userId: string): Promise<void> {
    await prisma.refreshToken.deleteMany({ where: { userId } });
  }

  async deleteExpiredTokens(): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  }
}

export const authRepository = new AuthRepository();
