# ChatFlow AI API Documentation

Base URL: `http://localhost:4000/api`

Interactive Swagger UI: `http://localhost:4000/api/docs`

## Authentication

All protected endpoints require `Authorization: Bearer <access_token>` header.

Refresh tokens are stored in httpOnly cookies and used via `POST /auth/refresh`.

## Endpoints

### Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | No | Register new user |
| POST | `/auth/login` | No | Login |
| POST | `/auth/refresh` | Cookie | Refresh access token |
| POST | `/auth/logout` | Yes | Logout |

### Users

| Method | Path | Description |
|--------|------|-------------|
| GET | `/users/me` | Get current profile |
| PATCH | `/users/me` | Update profile |
| GET | `/users/search?q=` | Search users |
| GET | `/users/:userId` | Get user by ID |

### Conversations

| Method | Path | Description |
|--------|------|-------------|
| GET | `/conversations` | List user conversations |
| POST | `/conversations/direct` | Create direct chat |
| GET | `/conversations/:id` | Get conversation |
| POST | `/conversations/:id/read` | Mark as read |

### Messages

| Method | Path | Description |
|--------|------|-------------|
| GET | `/messages/:conversationId` | Get messages |
| POST | `/messages/:conversationId` | Send message |
| PATCH | `/messages/:messageId` | Edit message |
| DELETE | `/messages/:messageId` | Delete message |
| POST | `/messages/:messageId/reactions` | Add reaction |
| GET | `/messages/search?q=` | Search messages |

### Groups

| Method | Path | Description |
|--------|------|-------------|
| POST | `/groups` | Create group |
| GET | `/groups/:groupId` | Get group |
| PATCH | `/groups/:groupId` | Update group |
| POST | `/groups/:groupId/members` | Add member |

### AI

| Method | Path | Description |
|--------|------|-------------|
| POST | `/ai/conversations` | Create AI chat |
| GET | `/ai/conversations` | List AI chats |
| POST | `/ai/conversations/:id/messages` | Send AI message |
| POST | `/ai/reply` | Generate reply |
| POST | `/ai/summarize` | Summarize conversation |
| POST | `/ai/translate` | Translate text |
| POST | `/ai/grammar` | Correct grammar |
| POST | `/ai/suggestions` | Smart suggestions |

### Admin (ADMIN/MODERATOR only)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/users` | List users |
| PATCH | `/admin/users/:id/toggle-active` | Toggle user status |
| GET | `/admin/groups` | List groups |
| GET | `/admin/analytics` | Platform analytics |
| GET | `/admin/audit-logs` | Audit logs |
