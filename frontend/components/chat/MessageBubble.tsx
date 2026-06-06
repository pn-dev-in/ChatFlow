'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, CheckCheck, Pencil, Trash2, Reply } from 'lucide-react';
import { Message } from '@/types';
import { cn, formatMessageTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth.store';
import { useChatStore } from '@/store/chat.store';

interface MessageBubbleProps {
  message: Message;
  onEdit?: (message: Message) => void;
  onDelete?: (messageId: string, deleteForAll: boolean) => void;
  onReact?: (messageId: string, emoji: string) => void;
}

const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

export function MessageBubble({ message, onEdit, onDelete, onReact }: MessageBubbleProps) {
  const { user } = useAuthStore();
  const { setReplyTo } = useChatStore();
  const [showActions, setShowActions] = useState(false);
  const isOwn = message.senderId === user?.id;

  if (message.isDeleted || message.deletedForAll) {
    return (
      <div className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}>
        <p className="text-xs italic text-muted-foreground px-4 py-2">
          {message.deletedForAll ? 'This message was deleted' : 'Message deleted'}
        </p>
      </div>
    );
  }

  const StatusIcon = () => {
    if (!isOwn) return null;
    if (message.status === 'READ') return <CheckCheck className="h-3 w-3 text-blue-400" />;
    if (message.status === 'DELIVERED') return <CheckCheck className="h-3 w-3" />;
    return <Check className="h-3 w-3" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('group flex px-4 py-1', isOwn ? 'justify-end' : 'justify-start')}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={cn('relative max-w-[75%] md:max-w-[60%]', isOwn ? 'items-end' : 'items-start')}>
        {!isOwn && (
          <p className="text-xs text-muted-foreground mb-1 ml-1">
            {message.sender.profile?.displayName || message.sender.username}
          </p>
        )}

        {message.replyTo && (
          <div className="mb-1 rounded-lg border-l-2 border-primary bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground">
            {message.replyTo.content?.substring(0, 100)}
          </div>
        )}

        <div
          className={cn(
            'rounded-2xl px-4 py-2.5 shadow-sm',
            isOwn
              ? 'bg-primary text-primary-foreground rounded-br-md'
              : 'bg-card border border-border rounded-bl-md'
          )}
        >
          {message.attachments?.map((att) => (
            <div key={att.id} className="mb-2">
              {att.mimeType.startsWith('image/') ? (
                <img src={att.url} alt={att.fileName} className="max-w-full rounded-lg" />
              ) : att.mimeType.startsWith('video/') ? (
                <video src={att.url} controls className="max-w-full rounded-lg" />
              ) : (
                <a href={att.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 underline">
                  📎 {att.fileName}
                </a>
              )}
            </div>
          ))}

          {message.content && (
            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          )}

          <div className={cn('flex items-center gap-1 mt-1', isOwn ? 'justify-end' : 'justify-start')}>
            <span className={cn('text-[10px]', isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
              {formatMessageTime(message.createdAt)}
              {message.isEdited && ' · edited'}
            </span>
            <StatusIcon />
          </div>
        </div>

        {message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {message.reactions.map((r) => (
              <button
                key={r.id}
                onClick={() => onReact?.(message.id, r.emoji)}
                className="rounded-full bg-muted px-2 py-0.5 text-xs hover:bg-muted/80"
              >
                {r.emoji}
              </button>
            ))}
          </div>
        )}

        {showActions && (
          <div
            className={cn(
              'absolute top-0 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity',
              isOwn ? 'right-full mr-2' : 'left-full ml-2'
            )}
          >
            {QUICK_REACTIONS.slice(0, 3).map((emoji) => (
              <button
                key={emoji}
                onClick={() => onReact?.(message.id, emoji)}
                className="rounded-full bg-card border p-1 text-xs hover:bg-muted"
              >
                {emoji}
              </button>
            ))}
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setReplyTo(message)}>
              <Reply className="h-3.5 w-3.5" />
            </Button>
            {isOwn && (
              <>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit?.(message)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onDelete?.(message.id, true)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
