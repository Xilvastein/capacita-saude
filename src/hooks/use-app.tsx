import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { UserRole, Notification } from '@/types';
import {
  initStorage,
  getUser,
  setUser as persistUser,
  clearUser,
  getNotifications,
  saveNotifications,
} from '@/services/storage';

interface AppUser {
  name: string;
  role: UserRole;
  email: string;
}

interface AppContextValue {
  user: AppUser | null;
  login: (name: string, email: string, role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: number;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setAppUser] = useState<AppUser | null>(null);
  const [notifications, setNotifs] = useState<Notification[]>([]);

  useEffect(() => {
    initStorage();
    const saved = getUser();
    if (saved) setAppUser(saved);
    setNotifs(getNotifications());
  }, []);

  const login = (name: string, email: string, role: UserRole) => {
    const u: AppUser = { name, email, role };
    persistUser(u);
    setAppUser(u);
  };

  const logout = () => {
    clearUser();
    setAppUser(null);
  };

  const switchRole = (role: UserRole) => {
    if (!user) return;
    const updated = { ...user, role };
    persistUser(updated);
    setAppUser(updated);
  };

  const markNotificationRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setNotifs(updated);
    saveNotifications(updated);
  };

  const markAllNotificationsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifs(updated);
    saveNotifications(updated);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        switchRole,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        unreadCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
