# ChatFlow

A production-ready, real-time communication platform inspired by WhatsApp, Telegram, Discord, and Slack.

## Features

- **Authentication** — JWT access/refresh tokens, bcrypt password hashing, protected routes
- **Real-time Messaging** — Socket.IO with typing indicators, presence, read/delivered receipts
- **Groups & Conversations** — Direct and group chats, friend requests
- **Media Sharing** — Cloudinary integration for images, videos, documents
- **AI Assistant** — OpenAI-powered replies, summarization, translation, grammar correction
- **Notifications** — Real-time notifications with unread counts
- **Admin Dashboard** — User/group management, analytics, audit logs
- **Dark Mode** — Full theme support with glassmorphism UI

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS, ShadCN UI, Zustand, React Query, Socket.IO |
| Backend | Node.js, Express, TypeScript, Prisma, Socket.IO, JWT, bcrypt |
| Database | PostgreSQL |
| Storage | Cloudinary |
| DevOps | Docker, Docker Compose, GitHub Actions |

## Project Structure

```
chatflow-ai/
├── frontend/          # Next.js 15 application
├── backend/           # Express API + Socket.IO server
├── docker-compose.yml
├── .github/workflows/
└── README.md
```

## Quick Start (Local Development)

### Prerequisites

- Node.js 20+
- PostgreSQL 16+ (or Docker)
- Optional: Cloudinary account, OpenAI API key

### 1. Start PostgreSQL

```bash
docker compose up postgres -d
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

Backend runs at `http://localhost:4000`
API docs at `http://localhost:4000/api/docs`

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`

### Test Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@chatflow.ai | Password123! | Admin |
| alice@chatflow.ai | Password123! | User |
| bob@chatflow.ai | Password123! | User |

## Docker (Full Stack)

```bash
docker compose up --build
```

Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- API Docs: http://localhost:4000/api/docs

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | Min 32 chars |
| `JWT_REFRESH_SECRET` | Min 32 chars |
| `FRONTEND_URL` | Frontend origin for CORS |
| `CLOUDINARY_*` | Cloudinary credentials (optional) |
| `OPENAI_API_KEY` | OpenAI API key (optional) |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL |
| `NEXT_PUBLIC_SOCKET_URL` | Socket.IO server URL |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh token |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/conversations` | List conversations |
| POST | `/api/conversations/direct` | Create direct chat |
| GET | `/api/messages/:conversationId` | Get messages |
| POST | `/api/groups` | Create group |
| POST | `/api/media/upload` | Upload file |
| POST | `/api/ai/conversations` | Create AI chat |
| GET | `/api/admin/analytics` | Admin analytics |

Full documentation: `http://localhost:4000/api/docs`

## Socket.IO Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `message:send` | Client → Server | Send message |
| `message:receive` | Server → Client | New message |
| `message:edit` | Both | Edit message |
| `message:delete` | Both | Delete message |
| `message:reaction` | Both | Add reaction |
| `typing:start` / `typing:stop` | Both | Typing indicators |
| `user:online` / `user:offline` | Server → Client | Presence |
| `notification:new` | Server → Client | New notification |
| `conversation:join` / `leave` | Client → Server | Room management |

## Database Schema

Core entities: `users`, `profiles`, `conversations`, `conversation_members`, `messages`, `message_reactions`, `attachments`, `notifications`, `friend_requests`, `user_presence`, `ai_conversations`, `ai_messages`, `groups`, `group_members`, `audit_logs`

See `backend/prisma/schema.prisma` for full schema with indexes and constraints.

## Deployment

### Vercel (Frontend)

1. Connect GitHub repo
2. Set root directory to `frontend`
3. Add env vars: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SOCKET_URL`
4. Deploy

### Railway (Backend)

1. Create new project from GitHub
2. Set root directory to `backend`
3. Add PostgreSQL plugin
4. Set all env vars from `.env.example`
5. Deploy

### Production Docker

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Testing

```bash
cd backend && npm test
```

## License

MIT
