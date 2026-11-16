/**
 * Notification Service - In-app Notifications & Alerts
 */
import {
  getAllFromStore,
  getByIdFromStore,
  putInStore,
  deleteFromStore,
  clearStore,
  STORES
} from './storageService';
import { AppNotification } from '../types';

export const notificationService = {
  async getAll(): Promise<AppNotification[]> {
    const list = await getAllFromStore<AppNotification>(STORES.NOTIFICATIONS);
    return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async getUnread(): Promise<AppNotification[]> {
    const all = await this.getAll();
    return all.filter(n => !n.read);
  },

  async create(data: Omit<AppNotification, 'id' | 'read' | 'createdAt'> & { id?: string }): Promise<AppNotification> {
    const notif: AppNotification = {
      id: data.id || `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: data.title,
      message: data.message,
      type: data.type,
      link: data.link,
      read: false,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    await putInStore(STORES.NOTIFICATIONS, notif);
    return notif;
  },

  async markAsRead(id: string): Promise<void> {
    const notif = await getByIdFromStore<AppNotification>(STORES.NOTIFICATIONS, id);
    if (notif) {
      notif.read = true;
      await putInStore(STORES.NOTIFICATIONS, notif);
    }
  },

  async markAllAsRead(): Promise<void> {
    const all = await this.getAll();
    for (const n of all) {
      if (!n.read) {
        n.read = true;
        await putInStore(STORES.NOTIFICATIONS, n);
      }
    }
  },

  async clearAll(): Promise<void> {
    await clearStore(STORES.NOTIFICATIONS);
  }
};
