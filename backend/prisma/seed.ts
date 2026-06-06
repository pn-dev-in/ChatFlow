import { PrismaClient, UserRole, ConversationType, MessageType, GroupRole } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const passwordHash = await bcrypt.hash('Password123!', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@chatflow.ai' },
    update: {},
    create: {
      email: 'admin@chatflow.ai',
      username: 'admin',
      passwordHash,
      role: UserRole.ADMIN,
      profile: { create: { displayName: 'Admin User' } },
      presence: { create: { isOnline: false, status: 'offline' } },
    },
  });

  const users = await Promise.all(
    [
      { email: 'alice@chatflow.ai', username: 'alice', displayName: 'Alice Johnson' },
      { email: 'bob@chatflow.ai', username: 'bob', displayName: 'Bob Smith' },
      { email: 'carol@chatflow.ai', username: 'carol', displayName: 'Carol Williams' },
      { email: 'dave@chatflow.ai', username: 'dave', displayName: 'Dave Brown' },
      { email: 'eve@chatflow.ai', username: 'eve', displayName: 'Eve Davis' },
    ].map((u) =>
      prisma.user.upsert({
        where: { email: u.email },
        update: {},
        create: {
          email: u.email,
          username: u.username,
          passwordHash,
          profile: { create: { displayName: u.displayName } },
          presence: { create: { isOnline: false, status: 'offline' } },
        },
      })
    )
  );

  const [alice, bob, carol, dave, eve] = users;

  const directConv1 = await prisma.conversation.create({
    data: {
      type: ConversationType.DIRECT,
      lastMessageAt: new Date(),
      members: {
        create: [{ userId: alice.id }, { userId: bob.id }],
      },
    },
  });

  const directConv2 = await prisma.conversation.create({
    data: {
      type: ConversationType.DIRECT,
      lastMessageAt: new Date(),
      members: {
        create: [{ userId: alice.id }, { userId: carol.id }],
      },
    },
  });

  const groupConv = await prisma.conversation.create({
    data: {
      type: ConversationType.GROUP,
      name: 'ChatFlow Team',
      lastMessageAt: new Date(),
      members: {
        create: [
          { userId: alice.id },
          { userId: bob.id },
          { userId: carol.id },
          { userId: dave.id },
        ],
      },
    },
  });

  const group = await prisma.group.create({
    data: {
      conversationId: groupConv.id,
      name: 'ChatFlow Team',
      description: 'Main team discussion group',
      createdById: alice.id,
      members: {
        create: [
          { userId: alice.id, role: GroupRole.OWNER },
          { userId: bob.id, role: GroupRole.ADMIN },
          { userId: carol.id, role: GroupRole.MEMBER },
          { userId: dave.id, role: GroupRole.MEMBER },
        ],
      },
    },
  });

  const messages = [
    { conversationId: directConv1.id, senderId: alice.id, content: 'Hey Bob! How are you?' },
    { conversationId: directConv1.id, senderId: bob.id, content: 'Hi Alice! Doing great, thanks!' },
    { conversationId: directConv1.id, senderId: alice.id, content: 'Want to grab coffee later?' },
    { conversationId: directConv2.id, senderId: carol.id, content: 'Alice, did you see the new features?' },
    { conversationId: directConv2.id, senderId: alice.id, content: 'Yes! The AI assistant is amazing 🚀' },
    { conversationId: groupConv.id, senderId: alice.id, content: 'Welcome everyone to ChatFlow Team!' },
    { conversationId: groupConv.id, senderId: bob.id, content: 'Thanks Alice! Excited to be here.' },
    { conversationId: groupConv.id, senderId: carol.id, content: 'The real-time messaging is so smooth!' },
    { conversationId: groupConv.id, senderId: dave.id, content: 'Agreed! Love the dark mode too.' },
  ];

  for (const msg of messages) {
    await prisma.message.create({
      data: { ...msg, type: MessageType.TEXT },
    });
  }

  const firstMessage = await prisma.message.findFirst({
    where: { conversationId: directConv1.id },
  });

  if (firstMessage) {
    await prisma.messageReaction.create({
      data: { messageId: firstMessage.id, userId: bob.id, emoji: '👍' },
    });
  }

  await prisma.friendRequest.create({
    data: { senderId: eve.id, receiverId: alice.id, status: 'PENDING' },
  });

  await prisma.notification.create({
    data: {
      userId: alice.id,
      type: 'FRIEND_REQUEST',
      title: 'Friend request',
      body: 'Eve Davis sent you a friend request',
      data: { senderId: eve.id },
    },
  });

  const aiConv = await prisma.aiConversation.create({
    data: {
      userId: alice.id,
      title: 'Getting Started with AI',
      messages: {
        create: [
          { role: 'user', content: 'How can you help me with messaging?' },
          {
            role: 'assistant',
            content:
              'I can help you draft replies, summarize conversations, translate messages, correct grammar, and suggest quick responses!',
            tokensUsed: 45,
          },
        ],
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: 'SEED_DATABASE',
      entity: 'System',
      metadata: { version: '1.0.0' },
    },
  });

  console.log('Seed completed successfully!');
  console.log('');
  console.log('Test accounts (password: Password123!):');
  console.log('  Admin: admin@chatflow.ai');
  console.log('  Users: alice@chatflow.ai, bob@chatflow.ai, carol@chatflow.ai');
  console.log(`  Group: ${group.name} (${group.id})`);
  console.log(`  AI Conversation: ${aiConv.title} (${aiConv.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
