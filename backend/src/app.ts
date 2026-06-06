import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { helmetMiddleware, corsMiddleware } from './middleware/security.middleware';
import { generalRateLimiter } from './middleware/rateLimit.middleware';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import routes from './routes';
import { swaggerSpec } from './config/swagger';
import { env } from './config/env';

const app = express();

app.set('trust proxy', 1);

app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(generalRateLimiter);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
