'use client';

import { cn } from '@/lib/utils';

interface PresenceBadgeProps {
  isOnline: boolean;
  status?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function PresenceBadge({ isOnline, status, size = 'sm', className }: PresenceBadgeProps) {
  const sizeClasses = size === 'sm' ? 'h-2.5 w-2.5' : 'h-3.5 w-3.5';

  return (
    <span
      className={cn(
        'absolute bottom-0 right-0 rounded-full border-2 border-background',
        sizeClasses,
        isOnline
          ? status === 'away'
            ? 'bg-yellow-500'
            : status === 'busy'
              ? 'bg-red-500'
              : 'bg-green-500'
          : 'bg-muted-foreground/50',
        className
      )}
      aria-label={isOnline ? `Online - ${status || 'online'}` : 'Offline'}
    />
  );
}
