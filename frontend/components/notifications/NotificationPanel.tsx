'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, X, Check } from 'lucide-react';
import { notificationService } from '@/services/notification.service';
import { useUiStore } from '@/store/ui.store';
import { formatMessageTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export function NotificationPanel() {
  const { notificationPanelOpen, setNotificationPanelOpen } = useUiStore();
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationService.getNotifications,
    enabled: notificationPanelOpen,
  });

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: notificationService.getUnreadCount,
    refetchInterval: 30000,
  });

  const markAllMutation = useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  if (!notificationPanelOpen) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setNotificationPanelOpen(true)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>
    );
  }

  return (
    <div className="fixed right-4 top-16 z-50 w-80 rounded-xl border bg-card/95 backdrop-blur-xl shadow-2xl animate-slide-up">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">Notifications</h3>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => markAllMutation.mutate()}>
            <Check className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setNotificationPanelOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="max-h-96">
        {notifications.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">No notifications</p>
        ) : (
          <div className="p-2 space-y-1">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`rounded-lg p-3 text-sm ${n.isRead ? 'opacity-60' : 'bg-accent/50'}`}
              >
                <p className="font-medium">{n.title}</p>
                <p className="text-muted-foreground mt-0.5">{n.body}</p>
                <p className="text-xs text-muted-foreground mt-1">{formatMessageTime(n.createdAt)}</p>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
