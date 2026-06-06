import { userRepository } from '../repositories/user.repository';
import { groupRepository } from '../repositories/group.repository';
import { messageRepository } from '../repositories/message.repository';
import { presenceRepository } from '../repositories/presence.repository';
import { aiRepository } from '../repositories/ai.repository';
import { auditRepository } from '../repositories/audit.repository';
import { NotFoundError } from '../utils/errors';

export class AdminService {
  async getUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      userRepository.findAll({ skip, take: limit }),
      userRepository.count(),
    ]);
    return {
      users: users.map((u) => ({
        id: u.id,
        email: u.email,
        username: u.username,
        role: u.role,
        isActive: u.isActive,
        displayName: u.profile?.displayName,
        avatarUrl: u.profile?.avatarUrl,
        isOnline: u.presence?.isOnline || false,
        createdAt: u.createdAt,
      })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async toggleUserActive(userId: string, actorId: string, ipAddress?: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw new NotFoundError('User not found');

    const updated = await userRepository.setActive(userId, !user.isActive);

    await auditRepository.create({
      actorId,
      action: updated.isActive ? 'USER_ACTIVATED' : 'USER_DEACTIVATED',
      entity: 'User',
      entityId: userId,
      ipAddress,
    });

    return updated;
  }

  async getGroups(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [groups, total] = await Promise.all([
      groupRepository.findAll({ skip, take: limit }),
      groupRepository.count(),
    ]);
    return {
      groups,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async getAnalytics() {
    const [
      totalUsers,
      totalMessages,
      messagesToday,
      totalGroups,
      onlineUsers,
      aiConversations,
      aiMessages,
      aiTokens,
    ] = await Promise.all([
      userRepository.count(),
      messageRepository.count(),
      messageRepository.countToday(),
      groupRepository.count(),
      presenceRepository.getOnlineCount(),
      aiRepository.countConversations(),
      aiRepository.countMessages(),
      aiRepository.getTotalTokensUsed(),
    ]);

    return {
      users: { total: totalUsers, online: onlineUsers },
      messages: { total: totalMessages, today: messagesToday },
      groups: { total: totalGroups },
      ai: { conversations: aiConversations, messages: aiMessages, tokensUsed: aiTokens },
    };
  }

  async getAuditLogs(limit = 100) {
    return auditRepository.findRecent(limit);
  }
}

export const adminService = new AdminService();
