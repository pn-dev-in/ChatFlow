'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, Paperclip, Sparkles, X, Image as ImageIcon } from 'lucide-react';
import { chatService } from '@/services/chat.service';
import { socketService } from '@/services/socket.service';
import { mediaService } from '@/services/media.service';
import { aiService } from '@/services/ai.service';
import { useAuthStore } from '@/store/auth.store';
import { useChatStore } from '@/store/chat.store';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message } from '@/types';

interface ChatWindowProps {
  conversationId: string;
}

export function ChatWindow({ conversationId }: ChatWindowProps) {
  const { user } = useAuthStore();
  const {
    messages,
    setMessages,
    addMessage,
    updateMessage,
    removeMessage,
    typingUsers,
    setTyping,
    replyTo,
    setReplyTo,
    clearUnread,
  } = useChatStore();
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const conversationMessages = messages[conversationId] || [];

  const { data: fetchedMessages, isLoading } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => chatService.getMessages(conversationId),
    enabled: !!conversationId,
  });

  useEffect(() => {
    if (fetchedMessages) {
      setMessages(conversationId, fetchedMessages);
    }
  }, [fetchedMessages, conversationId, setMessages]);

  useEffect(() => {
    socketService.joinConversation(conversationId);
    socketService.markAsRead(conversationId);
    clearUnread(conversationId);
    chatService.markAsRead(conversationId);

    const unsubReceive = socketService.onMessageReceive(({ message, conversationId: convId }) => {
      if (convId === conversationId) {
        addMessage(conversationId, message);
      }
    });

    const unsubTypingStart = socketService.onTypingStart(({ conversationId: convId, userId }) => {
      if (convId === conversationId && userId !== user?.id) {
        setTyping(conversationId, userId, true);
      }
    });

    const unsubTypingStop = socketService.onTypingStop(({ conversationId: convId, userId }) => {
      if (convId === conversationId) {
        setTyping(conversationId, userId, false);
      }
    });

    return () => {
      socketService.leaveConversation(conversationId);
      unsubReceive();
      unsubTypingStart();
      unsubTypingStop();
    };
  }, [conversationId, user?.id, addMessage, setTyping, clearUnread]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages.length]);

  const handleTyping = useCallback(() => {
    socketService.startTyping(conversationId);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketService.stopTyping(conversationId);
    }, 2000);
  }, [conversationId]);

  const sendMutation = useMutation({
    mutationFn: async (content: string) => {
      const result = await socketService.sendMessage({
        conversationId,
        content,
        replyToId: replyTo?.id,
      });
      if (!result.success) {
        return chatService.sendMessage(conversationId, {
          content,
          replyToId: replyTo?.id,
        });
      }
      return result.message!;
    },
    onSuccess: (message) => {
      addMessage(conversationId, message);
      setInput('');
      setReplyTo(null);
      setSuggestions([]);
      socketService.stopTyping(conversationId);
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  const handleSend = () => {
    const content = input.trim();
    if (!content) return;
    if (editingId) {
      socketService.editMessage(editingId, content).then(() => {
        updateMessage(conversationId, editingId, { content, isEdited: true });
        setEditingId(null);
        setInput('');
      });
      return;
    }
    sendMutation.mutate(content);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const upload = await mediaService.upload(file);
      const type = file.type.startsWith('image/')
        ? 'IMAGE'
        : file.type.startsWith('video/')
          ? 'VIDEO'
          : 'DOCUMENT';
      await socketService.sendMessage({
        conversationId,
        type,
        attachments: [upload],
      });
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAiSuggest = async () => {
    if (!input.trim()) return;
    try {
      const sug = await aiService.getSuggestions(input);
      setSuggestions(sug);
    } catch {
      setSuggestions([]);
    }
  };

  const typingInConv = (typingUsers[conversationId] || []).filter((id) => id !== user?.id);

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-muted-foreground">Loading messages...</div>
          </div>
        ) : (
          <div className="space-y-1">
            {conversationMessages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                onEdit={(m) => {
                  setEditingId(m.id);
                  setInput(m.content || '');
                }}
                onDelete={(id, deleteForAll) => {
                  socketService.deleteMessage(id, deleteForAll).then(() => {
                    if (deleteForAll) {
                      updateMessage(conversationId, id, { isDeleted: true, deletedForAll: true });
                    } else {
                      removeMessage(conversationId, id);
                    }
                  });
                }}
                onReact={(id, emoji) => socketService.addReaction(id, emoji)}
              />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </ScrollArea>

      {typingInConv.length > 0 && <TypingIndicator names={typingInConv.map(() => 'User')} />}

      {replyTo && (
        <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 border-t">
          <span className="text-sm text-muted-foreground truncate flex-1">
            Replying to: {replyTo.content?.substring(0, 50)}
          </span>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setReplyTo(null)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="flex gap-2 px-4 py-2 border-t overflow-x-auto">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => setInput(s)}
              className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs hover:bg-primary/20"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 p-4 border-t bg-card/50 backdrop-blur-sm">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*,video/*,.pdf,.doc,.docx,.txt"
          onChange={handleFileUpload}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleAiSuggest}>
          <Sparkles className="h-5 w-5" />
        </Button>
        <Input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            handleTyping();
          }}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
          placeholder={editingId ? 'Edit message...' : 'Type a message...'}
          className="flex-1"
        />
        <Button onClick={handleSend} disabled={!input.trim() || sendMutation.isPending}>
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
