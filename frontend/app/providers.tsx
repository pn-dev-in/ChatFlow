'use client';

import { useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { makeQueryClient } from '@/lib/query-client';
import { useUiStore } from '@/store/ui.store';
import { useSocket } from '@/hooks/useSocket';

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { darkMode } = useUiStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return <>{children}</>;
}

function SocketProvider({ children }: { children: React.ReactNode }) {
  useSocket();
  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => makeQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SocketProvider>{children}</SocketProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
