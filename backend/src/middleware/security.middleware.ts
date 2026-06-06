import helmet from 'helmet';
import cors from 'cors';
import { env } from '../config/env';

export const helmetMiddleware = helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: env.NODE_ENV === 'production' ? undefined : false,
});

export const corsMiddleware = cors({
  origin: env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
