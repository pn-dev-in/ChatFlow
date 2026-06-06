import { NotFoundError } from '../utils/errors';
import { userRepository } from '../repositories/user.repository';

export class UserService {
  async getProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw new NotFoundError('User not found');
    return this.sanitize(user);
  }

  async updateProfile(
    userId: string,
    data: {
      displayName?: string;
      bio?: string;
      avatarUrl?: string | null;
      phone?: string | null;
      timezone?: string;
      darkMode?: boolean;
    }
  ) {
    const user = await userRepository.updateProfile(userId, data);
    if (!user) throw new NotFoundError('User not found');
    return this.sanitize(user);
  }

  async searchUsers(query: string, limit: number, currentUserId: string) {
    const users = await userRepository.search(query, limit);
    return users
      .filter((u) => u.id !== currentUserId)
      .map((u) => this.sanitize(u));
  }

  async getUserById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError('User not found');
    return this.sanitize(user);
  }

  private sanitize(user: {
    id: string;
    email: string;
    username: string;
    role: string;
    isActive: boolean;
    lastSeenAt: Date | null;
    createdAt: Date;
    profile: {
      displayName: string;
      bio: string | null;
      avatarUrl: string | null;
      phone: string | null;
      timezone: string;
      darkMode: boolean;
    } | null;
    presence?: { isOnline: boolean; status: string } | null;
  }) {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      isActive: user.isActive,
      lastSeenAt: user.lastSeenAt,
      createdAt: user.createdAt,
      profile: user.profile,
      presence: user.presence,
    };
  }
}

export const userService = new UserService();
