export interface AppNotification {
  id: string;
  userId?: string; // If undefined, applies to all/admins depending on logic
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  timestamp: string;
}
