'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MessageSquare, Search } from 'lucide-react';
import { chatService } from '@/services/chat.service';
import { useChatStore } from '@/store/chat.store';
import { ChatList } from '@/components/chat/ChatList';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function HomePage() {
  const { conversations, setConversations } = useChatStore();
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: chatService.getConversations,
  });

  useEffect(() => {
    if (data) setConversations(data);
  }, [data, setConversations]);

  const filtered = conversations.filter((c) =>
    (c.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-full">
      <div className="w-full md:w-96 border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        ) : (
          <ChatList conversations={filtered} />
        )}
      </div>

      <div className="hidden md:flex flex-1 items-center justify-center bg-muted/20">
        <div className="text-center text-muted-foreground">
          <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-30" />
          <h3 className="text-xl font-medium">Select a conversation</h3>
          <p className="mt-2 text-sm">Choose a chat from the sidebar to start messaging</p>
        </div>
      </div>
    </div>
  );
}
