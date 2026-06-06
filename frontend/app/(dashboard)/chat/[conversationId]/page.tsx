'use client';

import { use, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { chatService } from '@/services/chat.service';
import { useChatStore } from '@/store/chat.store';
import { ChatList } from '@/components/chat/ChatList';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { PresenceBadge } from '@/components/chat/PresenceBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export default function ChatPage({ params }: { params: Promise<{ conversationId: string }> }) {
  const { conversationId } = use(params);
  const router = useRouter();
  const { conversations, setConversations, setActiveConversation } = useChatStore();

  const { data: convData } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => chatService.getConversation(conversationId),
  });

  const { data: allConversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: chatService.getConversations,
  });

  useEffect(() => {
    if (allConversations) setConversations(allConversations);
    setActiveConversation(conversationId);
    return () => setActiveConversation(null);
  }, [allConversations, conversationId, setConversations, setActiveConversation]);

  const conversation = convData || conversations.find((c) => c.id === conversationId);
  const otherMember = conversation?.members.find((m) => m.id !== conversation?.members[0]?.id);

  return (
    <div className="flex h-full">
      <div className="hidden md:flex w-80 border-r flex-col">
        <ChatList conversations={conversations} />
      </div>

      <div className="flex-1 flex flex-col">
        <header className="flex items-center gap-3 px-4 py-3 border-b bg-card/50 backdrop-blur-sm shrink-0">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => router.push('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          {conversation && (
            <>
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={conversation.avatarUrl || undefined} />
                  <AvatarFallback>{(conversation.name || '?').charAt(0)}</AvatarFallback>
                </Avatar>
                {conversation.type === 'DIRECT' && otherMember && (
                  <PresenceBadge isOnline={otherMember.isOnline} status={otherMember.status} />
                )}
              </div>
              <div>
                <h2 className="font-semibold">{conversation.name}</h2>
                {conversation.type === 'DIRECT' && otherMember && (
                  <p className="text-xs text-muted-foreground">
                    {otherMember.isOnline ? 'Online' : 'Offline'}
                  </p>
                )}
              </div>
            </>
          )}
        </header>

        <ChatWindow conversationId={conversationId} />
      </div>
    </div>
  );
}
