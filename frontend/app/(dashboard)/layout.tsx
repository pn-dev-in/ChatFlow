'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { NotificationPanel } from '@/components/notifications/NotificationPanel';
import { AuthGuard } from '@/components/layout/AuthGuard';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="flex items-center justify-end h-14 px-4 border-b bg-card/50 backdrop-blur-sm shrink-0">
            <NotificationPanel />
          </header>
          <div className="flex-1 overflow-hidden">{children}</div>
        </main>
      </div>
    </AuthGuard>
  );
}
