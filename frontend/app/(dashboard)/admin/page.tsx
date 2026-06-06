'use client';

import { useQuery } from '@tanstack/react-query';
import { Users, MessageSquare, UsersRound, Sparkles, Activity } from 'lucide-react';
import { adminService } from '@/services/admin.service';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
      router.replace('/');
    }
  }, [user, router]);

  const { data: analytics } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: adminService.getAnalytics,
    enabled: user?.role === 'ADMIN' || user?.role === 'MODERATOR',
  });

  const stats = [
    { label: 'Total Users', value: analytics?.users.total, icon: Users, sub: `${analytics?.users.online || 0} online` },
    { label: 'Messages', value: analytics?.messages.total, icon: MessageSquare, sub: `${analytics?.messages.today || 0} today` },
    { label: 'Groups', value: analytics?.groups.total, icon: UsersRound },
    { label: 'AI Messages', value: analytics?.ai.messages, icon: Sparkles, sub: `${analytics?.ai.tokensUsed || 0} tokens` },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-8">Platform analytics and management</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, sub }) => (
          <div key={label} className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Icon className="h-8 w-8 text-primary" />
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold">{value ?? '—'}</p>
            <p className="text-sm text-muted-foreground mt-1">{label}</p>
            {sub && <p className="text-xs text-primary mt-1">{sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a href="/admin/users" className="glass rounded-xl p-6 hover:bg-accent/50 transition-colors">
          <Users className="h-6 w-6 text-primary mb-2" />
          <h3 className="font-semibold">User Management</h3>
          <p className="text-sm text-muted-foreground">View and manage users</p>
        </a>
        <a href="/admin/groups" className="glass rounded-xl p-6 hover:bg-accent/50 transition-colors">
          <UsersRound className="h-6 w-6 text-primary mb-2" />
          <h3 className="font-semibold">Group Management</h3>
          <p className="text-sm text-muted-foreground">View all groups</p>
        </a>
      </div>
    </div>
  );
}
