import { FriendRequestStatus } from '@prisma/client';
import { prisma } from '../config/database';

export class FriendRepository {
  async create(senderId: string, receiverId: string) {
    return prisma.friendRequest.create({
      data: { senderId, receiverId },
      include: {
        sender: { include: { profile: true } },
        receiver: { include: { profile: true } },
      },
    });
  }

  async findById(id: string) {
    return prisma.friendRequest.findUnique({
      where: { id },
      include: {
        sender: { include: { profile: true } },
        receiver: { include: { profile: true } },
      },
    });
  }

  async findPending(receiverId: string) {
    return prisma.friendRequest.findMany({
      where: { receiverId, status: FriendRequestStatus.PENDING },
      include: { sender: { include: { profile: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findExisting(senderId: string, receiverId: string) {
    return prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
    });
  }

  async updateStatus(id: string, status: FriendRequestStatus) {
    return prisma.friendRequest.update({
      where: { id },
      data: { status },
      include: {
        sender: { include: { profile: true } },
        receiver: { include: { profile: true } },
      },
    });
  }
}

export const friendRepository = new FriendRepository();
