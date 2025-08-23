import type { ReactNode } from 'react';

export type UserRole = 'student' | 'instructor' | 'admin';

export interface MenuItem {
  id: string;
  label: string;
  icon: ReactNode;
  path: string;
  roles: UserRole[];
}

export interface SidebarProps {
  isCollapsed?: boolean;
  className?: string;
  onToggle?: () => void;
}

export interface SidebarErrorProps {
  error?: Error;
  resetError?: () => void;
}