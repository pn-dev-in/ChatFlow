# Database ER Diagram Description

## Entity Relationships

### User Domain
- **User** 1:1 **Profile** — Extended user information
- **User** 1:1 **UserPresence** — Online/offline status
- **User** 1:N **RefreshToken** — JWT refresh tokens

### Messaging Domain
- **Conversation** M:N **User** via **ConversationMember**
- **Conversation** 1:N **Message**
- **Message** self-references for **replyTo** (threading)
- **Message** 1:N **Attachment** — Media files
- **Message** 1:N **MessageReaction** — Emoji reactions

### Groups
- **Group** 1:1 **Conversation** — Group chats use conversation model
- **Group** M:N **User** via **GroupMember** with roles (OWNER, ADMIN, MEMBER)

### Social
- **FriendRequest** — sender/receiver relationship with status (PENDING, ACCEPTED, REJECTED)

### Notifications
- **Notification** — Per-user notifications with JSON data payload

### AI
- **AiConversation** 1:N **AiMessage** — Separate from main messaging

### Audit
- **AuditLog** — Admin action tracking with actor, entity, metadata

## Indexes

Performance-critical indexes on:
- `Message(conversationId, createdAt)` — Message history queries
- `ConversationMember(userId)` — User's conversation list
- `Notification(userId, isRead)` — Unread notification counts
- `User(email)`, `User(username)` — Auth lookups

## Constraints

- Unique email and username per user
- Unique conversation membership (one row per user per conversation)
- Unique friend request pairs
- Cascade deletes on user/conversation/message deletion
