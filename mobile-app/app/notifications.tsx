import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { EmptyState } from '../components/EmptyState';
import { Colors } from '../constants/colors';
import { Radius } from '../constants/theme';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'order' | 'repair' | 'maintenance' | 'offer';
  isRead: boolean;
  linkRoute?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Spare Parts Order #HA-ORD-2026-101 Dispatched',
    message: 'Your order has been handed over to Leopards Courier. Tracking number: LEO-78912345.',
    timestamp: '2 hours ago',
    type: 'order',
    isRead: false,
    linkRoute: '/order-tracking',
  },
  {
    id: 'notif-2',
    title: 'Engine Oil Change Reminder (Caltex 20W-50)',
    message: 'Your Honda CD 70 has traveled 850 km since previous servicing. Oil change recommended soon.',
    timestamp: 'Yesterday',
    type: 'maintenance',
    isRead: false,
    linkRoute: '/my-garage',
  },
  {
    id: 'notif-3',
    title: 'Workshop Booking Confirmed',
    message: 'Your service bay reservation at Abu Bakar Road, Badami Bagh is confirmed with Master Mechanic Hamza.',
    timestamp: '3 days ago',
    type: 'repair',
    isRead: true,
    linkRoute: '/repair-tracking',
  },
  {
    id: 'notif-4',
    title: 'Genuine Atlas Honda Spare Parts Restocked',
    message: 'New batch of CG 125 clutch plates, CD 70 piston sets, and Keihin slide carburettors available.',
    timestamp: '5 days ago',
    type: 'offer',
    isRead: true,
    linkRoute: '/(tabs)/shop',
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handlePressItem = (item: NotificationItem) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
    );
    if (item.linkRoute) {
      router.push(item.linkRoute as any);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'order':
        return { name: 'cube-outline' as const, color: Colors.info, bg: '#EFF6FF' };
      case 'repair':
        return { name: 'construct-outline' as const, color: Colors.primary, bg: Colors.primaryMuted };
      case 'maintenance':
        return { name: 'time-outline' as const, color: Colors.gold, bg: '#FFFBEB' };
      default:
        return { name: 'sparkles-outline' as const, color: Colors.success, bg: '#ECFDF5' };
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>
              Inbox ({notifications.filter((n) => !n.isRead).length} unread)
            </Text>
            {notifications.some((n) => !n.isRead) && (
              <Pressable onPress={markAllRead}>
                <Text style={styles.markReadText}>Mark all as read</Text>
              </Pressable>
            )}
          </View>
        }
        renderItem={({ item }) => {
          const icon = getTypeIcon(item.type);
          return (
            <Card
              style={StyleSheet.flatten([styles.notifCard, !item.isRead && styles.notifUnread])}
              padding={12}
              onPress={() => handlePressItem(item)}
            >
              <View style={styles.notifRow}>
                <View style={[styles.iconWrap, { backgroundColor: icon.bg }]}>
                  <Ionicons name={icon.name} size={20} color={icon.color} />
                </View>

                <View style={styles.contentCol}>
                  <View style={styles.titleRow}>
                    <Text style={[styles.title, !item.isRead && styles.titleUnread]} numberOfLines={1}>
                      {item.title}
                    </Text>
                    {!item.isRead && <View style={styles.unreadDot} />}
                  </View>

                  <Text style={styles.message} numberOfLines={2}>
                    {item.message}
                  </Text>

                  <Text style={styles.timeText}>{item.timestamp}</Text>
                </View>
              </View>
            </Card>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            icon="bell-off-outline"
            title="No Notifications"
            message="You are all caught up! Booking updates, courier dispatches, and maintenance alerts will appear here."
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.navy,
  },
  markReadText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  notifCard: {
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  notifUnread: {
    backgroundColor: '#FFFFFF',
    borderColor: '#BFDBFE',
    borderWidth: 1.5,
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  contentCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.navy,
    flex: 1,
  },
  titleUnread: {
    fontWeight: '800',
    color: Colors.navy,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.primary,
    marginLeft: 6,
  },
  message: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginBottom: 6,
  },
  timeText: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '500',
  },
});
