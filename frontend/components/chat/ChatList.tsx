'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Conversation } from '@/types';
import { cn, formatMessageTime } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PresenceBadge } from './PresenceBadge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatListProps {
  conversations: Conversation[];
}

export function ChatList({ conversations }: ChatListProps) {
  const pathname = usePathname();

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground">
        <p className="text-lg font-medium">No conversations yet</p>
        <p className="text-sm mt-2">Start a new chat or accept a friend request</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-2 space-y-1">
        {conversations.map((conv, i) => {
          const isActive = pathname === `/chat/${conv.id}`;
          const otherMember = conv.members.find((m) => m.id !== conv.members[0]?.id);
          const isOnline = conv.type === 'DIRECT' && otherMember?.isOnline;

          return (
            <motion.div
              key={conv.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link
                href={`/chat/${conv.id}`}
                className={cn(
                  'flex items-center gap-3 rounded-xl p-3 transition-all hover:bg-accent/50',
                  isActive && 'bg-accent/80 border border-border/50'
                )}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={conv.avatarUrl || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {(conv.name || '?').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {conv.type === 'DIRECT' && (
                    <PresenceBadge isOnline={!!isOnline} status={otherMember?.status} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium truncate">{conv.name}</p>
                    {conv.lastMessageAt && (
                      <span className="text-xs text-muted-foreground shrink-0 ml-2">
                        {formatMessageTime(conv.lastMessageAt)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-sm text-muted-foreground truncate">
                      {conv.lastMessage?.content || 'No messages yet'}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground px-1.5">
                        {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
