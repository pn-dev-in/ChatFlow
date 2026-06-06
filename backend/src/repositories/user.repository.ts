import { Prisma, User } from '@prisma/client';
import { prisma } from '../config/database';

const userWithProfile = {
  profile: true,
  presence: true,
} satisfies Prisma.UserInclude;

export type UserWithProfile = Prisma.UserGetPayload<{ include: typeof userWithProfile }>;

export class UserRepository {
  async findById(id: string): Promise<UserWithProfile | null> {
    return prisma.user.findUnique({
      where: { id },
      include: userWithProfile,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { username } });
  }

  async create(data: {
    email: string;
    username: string;
    passwordHash: string;
    displayName: string;
  }): Promise<UserWithProfile> {
    return prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        passwordHash: data.passwordHash,
        profile: {
          create: { displayName: data.displayName },
        },
        presence: {
          create: { isOnline: false, status: 'offline' },
        },
      },
      include: userWithProfile,
    });
  }

  async updateProfile(
    userId: string,
    data: Prisma.ProfileUpdateInput
  ): Promise<UserWithProfile | null> {
    await prisma.profile.update({
      where: { userId },
      data,
    });
    return this.findById(userId);
  }

  async search(query: string, limit: number): Promise<UserWithProfile[]> {
    return prisma.user.findMany({
      where: {
        isActive: true,
        OR: [
          { username: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { profile: { displayName: { contains: query, mode: 'insensitive' } } },
        ],
      },
      include: userWithProfile,
      take: limit,
    });
  }

  async updateLastSeen(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { lastSeenAt: new Date() },
    });
  }

  async findAll(params: { skip?: number; take?: number }): Promise<UserWithProfile[]> {
    return prisma.user.findMany({
      skip: params.skip,
      take: params.take,
      include: userWithProfile,
      orderBy: { createdAt: 'desc' },
    });
  }

  async count(): Promise<number> {
    return prisma.user.count();
  }

  async setActive(userId: string, isActive: boolean): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { isActive },
    });
  }
}

export const userRepository = new UserRepository();
