import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UiState {
  darkMode: boolean;
  sidebarOpen: boolean;
  notificationPanelOpen: boolean;
  searchOpen: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  setNotificationPanelOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      darkMode: true,
      sidebarOpen: true,
      notificationPanelOpen: false,
      searchOpen: false,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      setDarkMode: (value) => set({ darkMode: value }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setNotificationPanelOpen: (open) => set({ notificationPanelOpen: open }),
      setSearchOpen: (open) => set({ searchOpen: open }),
    }),
    { name: 'chatflow-ui' }
  )
);
