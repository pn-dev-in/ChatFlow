import { FriendRequestStatus } from '@prisma/client';
import { ConflictError, ForbiddenError, NotFoundError } from '../utils/errors';
import { friendRepository } from '../repositories/friend.repository';
import { notificationRepository } from '../repositories/notification.repository';
import { conversationRepository } from '../repositories/conversation.repository';
import { NotificationType } from '@prisma/client';

export class FriendService {
  async sendRequest(senderId: string, receiverId: string) {
    if (senderId === receiverId) throw new ConflictError('Cannot send request to yourself');

    const existing = await friendRepository.findExisting(senderId, receiverId);
    if (existing) {
      if (existing.status === FriendRequestStatus.PENDING) {
        throw new ConflictError('Friend request already pending');
      }
      if (existing.status === FriendRequestStatus.ACCEPTED) {
        throw new ConflictError('Already friends');
      }
    }

    const request = await friendRepository.create(senderId, receiverId);

    await notificationRepository.create({
      userId: receiverId,
      type: NotificationType.FRIEND_REQUEST,
      title: 'Friend request',
      body: `${request.sender.profile?.displayName || request.sender.username} sent you a friend request`,
      data: { requestId: request.id, senderId },
    });

    return request;
  }

  async getPendingRequests(userId: string) {
    return friendRepository.findPending(userId);
  }

  async acceptRequest(requestId: string, userId: string) {
    const request = await friendRepository.findById(requestId);
    if (!request) throw new NotFoundError('Request not found');
    if (request.receiverId !== userId) throw new ForbiddenError('Cannot accept this request');
    if (request.status !== FriendRequestStatus.PENDING) {
      throw new ConflictError('Request is no longer pending');
    }

    const updated = await friendRepository.updateStatus(requestId, FriendRequestStatus.ACCEPTED);
    await conversationRepository.createDirect([request.senderId, request.receiverId]);

    return updated;
  }

  async rejectRequest(requestId: string, userId: string) {
    const request = await friendRepository.findById(requestId);
    if (!request) throw new NotFoundError('Request not found');
    if (request.receiverId !== userId) throw new ForbiddenError('Cannot reject this request');

    return friendRepository.updateStatus(requestId, FriendRequestStatus.REJECTED);
  }
}

export const friendService = new FriendService();
