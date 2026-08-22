import type { AppNotification } from '../types/notification';

type NotificationListener = (notifications: AppNotification[]) => void;

class NotificationService {
  private notifications: AppNotification[] = [
    {
      id: 'notif-1',
      title: 'Welcome to DAYFLOW',
      message: 'Your profile has been successfully set up.',
      type: 'info',
      isRead: false,
      timestamp: new Date().toISOString()
    }
  ];
  private listeners: NotificationListener[] = [];

  subscribe(listener: NotificationListener) {
    this.listeners.push(listener);
    // Immediately fire with current state
    listener(this.notifications);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(l => l([...this.notifications]));
  }

  getNotifications(userId?: string): AppNotification[] {
    if (!userId) return this.notifications;
    return this.notifications.filter(n => !n.userId || n.userId === userId);
  }

  addNotification(notification: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) {
    const newNotif: AppNotification = {
      ...notification,
      id: `notif-${Date.now()}`,
      isRead: false,
      timestamp: new Date().toISOString()
    };
    this.notifications = [newNotif, ...this.notifications];
    this.notifyListeners();
  }

  markAsRead(id: string) {
    this.notifications = this.notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    );
    this.notifyListeners();
  }

  markAllAsRead(userId?: string) {
    this.notifications = this.notifications.map(n => {
      if (!userId || !n.userId || n.userId === userId) {
        return { ...n, isRead: true };
      }
      return n;
    });
    this.notifyListeners();
  }
}

export const notificationService = new NotificationService();
