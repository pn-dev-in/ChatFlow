'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MessageSquare,
  Users,
  Sparkles,
  Settings,
  Shield,
  LogOut,
  Moon,
  Sun,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import { useUiStore } from '@/store/ui.store';
import { authService } from '@/services/auth.service';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/', icon: MessageSquare, label: 'Chats' },
  { href: '/groups/new', icon: Users, label: 'New Group' },
//  { href: '/ai', icon: Sparkles, label: 'AI Assistant' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { darkMode, toggleDarkMode, sidebarOpen, setSidebarOpen } = useUiStore();

  const handleLogout = async () => {
    await authService.logout();
    logout();
    window.location.href = '/login';
  };

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'MODERATOR';

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <aside
        className={cn(
          'fixed md:static inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-card/80 backdrop-blur-xl transition-transform md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center gap-3 p-6 border-b">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold">
            CF
          </div>
          <div>
            <h1 className="font-bold text-lg">ChatFlow</h1>
            <p className="text-xs text-muted-foreground">Real-time messaging</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                pathname === href || (href !== '/' && pathname.startsWith(href))
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent'
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}

          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                pathname.startsWith('/admin') ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
              )}
            >
              <Shield className="h-5 w-5" />
              Admin
            </Link>
          )}
        </nav>

        <div className="p-4 border-t space-y-2">
          <div className="flex items-center gap-3 px-2">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.profile?.avatarUrl || undefined} />
              <AvatarFallback>
                {(user?.profile?.displayName || user?.username || 'U').charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.profile?.displayName || user?.username}
              </p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>

          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="flex-1">
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="flex-1">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
