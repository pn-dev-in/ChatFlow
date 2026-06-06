import { GroupRole } from '@prisma/client';
import { ConflictError, ForbiddenError, NotFoundError } from '../utils/errors';
import { groupRepository } from '../repositories/group.repository';
import { conversationRepository } from '../repositories/conversation.repository';
import { notificationRepository } from '../repositories/notification.repository';
import { auditRepository } from '../repositories/audit.repository';
import { NotificationType } from '@prisma/client';

export class GroupService {
  async createGroup(
    userId: string,
    data: {
      name: string;
      description?: string;
      isPrivate: boolean;
      memberIds: string[];
    }
  ) {
    const allMemberIds = [...new Set([userId, ...data.memberIds])];

    const conversation = await conversationRepository.createGroup({
      name: data.name,
      memberIds: allMemberIds,
    });

    const members = allMemberIds.map((id) => ({
      userId: id,
      role: id === userId ? GroupRole.OWNER : GroupRole.MEMBER,
    }));

    const group = await groupRepository.create({
      conversationId: conversation.id,
      name: data.name,
      description: data.description,
      isPrivate: data.isPrivate,
      createdById: userId,
      members,
    });

    for (const memberId of data.memberIds) {
      if (memberId !== userId) {
        await notificationRepository.create({
          userId: memberId,
          type: NotificationType.GROUP_INVITE,
          title: 'Group invitation',
          body: `You were added to ${data.name}`,
          data: { groupId: group.id, conversationId: conversation.id },
        });
      }
    }

    return group;
  }

  async getGroup(groupId: string, userId: string) {
    const isMember = await groupRepository.isMember(groupId, userId);
    if (!isMember) throw new ForbiddenError('Not a member of this group');

    const group = await groupRepository.findById(groupId);
    if (!group) throw new NotFoundError('Group not found');

    return group;
  }

  async updateGroup(
    groupId: string,
    userId: string,
    data: {
      name?: string;
      description?: string;
      avatarUrl?: string | null;
      isPrivate?: boolean;
    }
  ) {
    const role = await groupRepository.getMemberRole(groupId, userId);
    if (!role || (role !== GroupRole.OWNER && role !== GroupRole.ADMIN)) {
      throw new ForbiddenError('Insufficient permissions');
    }

    return groupRepository.update(groupId, data);
  }

  async addMember(groupId: string, userId: string, newUserId: string, role: GroupRole) {
    const memberRole = await groupRepository.getMemberRole(groupId, userId);
    if (!memberRole || (memberRole !== GroupRole.OWNER && memberRole !== GroupRole.ADMIN)) {
      throw new ForbiddenError('Insufficient permissions');
    }

    const alreadyMember = await groupRepository.isMember(groupId, newUserId);
    if (alreadyMember) throw new ConflictError('User is already a member');

    await groupRepository.addMember(groupId, newUserId, role);

    const group = await groupRepository.findById(groupId);
    if (group) {
      await notificationRepository.create({
        userId: newUserId,
        type: NotificationType.GROUP_INVITE,
        title: 'Group invitation',
        body: `You were added to ${group.name}`,
        data: { groupId },
      });
    }

    return { success: true };
  }

  async removeMember(groupId: string, userId: string, targetUserId: string) {
    const memberRole = await groupRepository.getMemberRole(groupId, userId);
    const targetRole = await groupRepository.getMemberRole(groupId, targetUserId);

    if (!memberRole) throw new ForbiddenError('Not a member');

    const canRemove =
      userId === targetUserId ||
      memberRole === GroupRole.OWNER ||
      (memberRole === GroupRole.ADMIN && targetRole === GroupRole.MEMBER);

    if (!canRemove) throw new ForbiddenError('Insufficient permissions');

    await groupRepository.removeMember(groupId, targetUserId);
    return { success: true };
  }

  async getAllGroups(skip = 0, take = 50) {
    return groupRepository.findAll({ skip, take });
  }
}

export const groupService = new GroupService();
