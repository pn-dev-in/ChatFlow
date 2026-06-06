'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

const publicPaths = ['/login', '/register'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const isPublic = publicPaths.some((p) => pathname.startsWith(p));

    if (!isAuthenticated && !token && !isPublic) {
      router.replace('/login');
    } else if ((isAuthenticated || token) && isPublic) {
      router.replace('/');
    }
  }, [isAuthenticated, pathname, router]);

  return <>{children}</>;
}
