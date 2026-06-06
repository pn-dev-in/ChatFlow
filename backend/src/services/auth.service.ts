import { ConflictError, UnauthorizedError } from '../utils/errors';
import { hashPassword, comparePassword } from '../utils/password';
import { signAccessToken, signRefreshToken, verifyRefreshToken, getRefreshTokenExpiry } from '../utils/jwt';
import { userRepository } from '../repositories/user.repository';
import { authRepository } from '../repositories/auth.repository';
import { JwtPayload } from '../types/auth';

function sanitizeUser(user: {
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

export class AuthService {
  private createPayload(user: { id: string; email: string; role: string }): JwtPayload {
    return { userId: user.id, email: user.email, role: user.role as JwtPayload['role'] };
  }

  async register(data: {
    email: string;
    username: string;
    password: string;
    displayName?: string;
  }) {
    const existingEmail = await userRepository.findByEmail(data.email);
    if (existingEmail) throw new ConflictError('Email already registered');

    const existingUsername = await userRepository.findByUsername(data.username);
    if (existingUsername) throw new ConflictError('Username already taken');

    const passwordHash = await hashPassword(data.password);
    const user = await userRepository.create({
      email: data.email,
      username: data.username,
      passwordHash,
      displayName: data.displayName || data.username,
    });

    const payload = this.createPayload(user);
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await authRepository.saveRefreshToken(user.id, refreshToken, getRefreshTokenExpiry());

    return {
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user || !user.isActive) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) throw new UnauthorizedError('Invalid email or password');

    const fullUser = await userRepository.findById(user.id);
    if (!fullUser) throw new UnauthorizedError('User not found');

    const payload = this.createPayload(user);
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await authRepository.saveRefreshToken(user.id, refreshToken, getRefreshTokenExpiry());

    return {
      user: sanitizeUser(fullUser),
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = verifyRefreshToken(refreshToken);
      const stored = await authRepository.findRefreshToken(refreshToken);

      if (!stored || stored.expiresAt < new Date()) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      const user = await userRepository.findById(payload.userId);
      if (!user || !user.isActive) {
        throw new UnauthorizedError('User not found or inactive');
      }

      await authRepository.deleteRefreshToken(refreshToken);

      const newPayload = this.createPayload(user);
      const accessToken = signAccessToken(newPayload);
      const newRefreshToken = signRefreshToken(newPayload);

      await authRepository.saveRefreshToken(user.id, newRefreshToken, getRefreshTokenExpiry());

      return {
        user: sanitizeUser(user),
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      if (error instanceof UnauthorizedError) throw error;
      throw new UnauthorizedError('Invalid refresh token');
    }
  }

  async logout(refreshToken?: string, userId?: string) {
    if (refreshToken) {
      await authRepository.deleteRefreshToken(refreshToken);
    }
    if (userId) {
      await authRepository.deleteAllUserRefreshTokens(userId);
    }
  }
}

export const authService = new AuthService();
