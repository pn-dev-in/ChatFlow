import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ChatFlow AI API',
      version: '1.0.0',
      description: 'Real-time AI-powered chat application API documentation',
      contact: {
        name: 'ChatFlow AI',
      },
    },
    servers: [
      { url: `${env.API_URL}/api`, description: 'API Server' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Users', description: 'User management' },
      { name: 'Conversations', description: 'Conversation management' },
      { name: 'Messages', description: 'Message operations' },
      { name: 'Groups', description: 'Group management' },
      { name: 'Notifications', description: 'Notification management' },
      { name: 'Media', description: 'File uploads' },
      { name: 'AI', description: 'AI assistant features' },
      { name: 'Friends', description: 'Friend requests' },
      { name: 'Admin', description: 'Admin dashboard' },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
