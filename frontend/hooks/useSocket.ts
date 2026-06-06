'use client';

import { useEffect } from 'react';
import { socketService } from '@/services/socket.service';
import { useAuthStore } from '@/store/auth.store';
import { useChatStore } from '@/store/chat.store';
import { useQueryClient } from '@tanstack/react-query';

export function useSocket() {
  const { accessToken, isAuthenticated } = useAuthStore();
  const { setUserOnline, addMessage, incrementUnread, activeConversationId } = useChatStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;

    socketService.connect(accessToken);

    const unsubOnline = socketService.onUserOnline(({ userId }) => {
      setUserOnline(userId, true);
    });

    const unsubOffline = socketService.onUserOffline(({ userId }) => {
      setUserOnline(userId, false);
    });

    const unsubMessage = socketService.onMessageReceive(({ message, conversationId }) => {
      if (conversationId !== activeConversationId) {
        incrementUnread(conversationId);
      }
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    });

    const unsubNotification = socketService.onNotification(() => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    });

    return () => {
      unsubOnline();
      unsubOffline();
      unsubMessage();
      unsubNotification();
      socketService.disconnect();
    };
  }, [isAuthenticated, accessToken, setUserOnline, incrementUnread, activeConversationId, queryClient]);
}
