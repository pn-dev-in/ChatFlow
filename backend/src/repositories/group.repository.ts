import { GroupRole, Prisma } from '@prisma/client';
import { prisma } from '../config/database';

const groupInclude = {
  conversation: {
    include: {
      members: {
        include: {
          user: { include: { profile: true, presence: true } },
        },
      },
    },
  },
  members: {
    include: {
      user: { include: { profile: true, presence: true } },
    },
  },
} satisfies Prisma.GroupInclude;

export type GroupWithDetails = Prisma.GroupGetPayload<{ include: typeof groupInclude }>;

export class GroupRepository {
  async findById(id: string): Promise<GroupWithDetails | null> {
    return prisma.group.findUnique({
      where: { id },
      include: groupInclude,
    });
  }

  async findAll(params: { skip?: number; take?: number }): Promise<GroupWithDetails[]> {
    return prisma.group.findMany({
      skip: params.skip,
      take: params.take,
      include: groupInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: {
    conversationId: string;
    name: string;
    description?: string;
    isPrivate: boolean;
    createdById: string;
    members: Array<{ userId: string; role: GroupRole }>;
  }): Promise<GroupWithDetails> {
    return prisma.group.create({
      data: {
        conversationId: data.conversationId,
        name: data.name,
        description: data.description,
        isPrivate: data.isPrivate,
        createdById: data.createdById,
        members: {
          create: data.members,
        },
      },
      include: groupInclude,
    });
  }

  async update(id: string, data: Prisma.GroupUpdateInput): Promise<GroupWithDetails> {
    return prisma.group.update({
      where: { id },
      data,
      include: groupInclude,
    });
  }

  async addMember(groupId: string, userId: string, role: GroupRole): Promise<void> {
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      select: { conversationId: true },
    });
    if (!group) return;

    await prisma.$transaction([
      prisma.groupMember.create({
        data: { groupId, userId, role },
      }),
      prisma.conversationMember.create({
        data: { conversationId: group.conversationId, userId },
      }),
    ]);
  }

  async removeMember(groupId: string, userId: string): Promise<void> {
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      select: { conversationId: true },
    });
    if (!group) return;

    await prisma.$transaction([
      prisma.groupMember.delete({
        where: { groupId_userId: { groupId, userId } },
      }),
      prisma.conversationMember.delete({
        where: { conversationId_userId: { conversationId: group.conversationId, userId } },
      }),
    ]);
  }

  async isMember(groupId: string, userId: string): Promise<boolean> {
    const member = await prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId } },
    });
    return !!member;
  }

  async getMemberRole(groupId: string, userId: string): Promise<GroupRole | null> {
    const member = await prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId } },
    });
    return member?.role || null;
  }

  async count(): Promise<number> {
    return prisma.group.count();
  }
}

export const groupRepository = new GroupRepository();
