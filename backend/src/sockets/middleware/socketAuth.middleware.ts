import { Socket } from 'socket.io';
import { verifyAccessToken } from '../../utils/jwt';
import { JwtPayload } from '../../types/auth';

export interface AuthenticatedSocket extends Socket {
  user: JwtPayload;
}

export function socketAuthMiddleware(socket: Socket, next: (err?: Error) => void) {
  try {
    const token =
      socket.handshake.auth.token ||
      socket.handshake.headers.authorization?.split(' ')[1];

    if (!token) {
      return next(new Error('Authentication required'));
    }

    const payload = verifyAccessToken(token as string);
    (socket as AuthenticatedSocket).user = payload;
    next();
  } catch {
    next(new Error('Invalid token'));
  }
}
