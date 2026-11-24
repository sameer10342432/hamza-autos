import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { BrandHeader } from '../../components/BrandHeader';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { Colors } from '../../constants/colors';
import { Radius, Shadows } from '../../constants/theme';
import { CustomerOrder } from '../../types';

const ORDERS_STORAGE_KEY = '@hamza_autos_orders_history_v1';

const DEMO_ORDERS: CustomerOrder[] = [
  {
    id: 'ord-101',
    orderNumber: 'HA-ORD-2026-101',
    customer: {
      fullName: 'Muhammad Usman',
      phoneNumber: '0300 1234567',
      whatsappNumber: '0300 1234567',
      province: 'Punjab',
      city: 'Lahore',
      streetAddress: 'House 14, Street 2, Shadbagh',
    },
    items: [
      {
        partId: 'sp-3',
        sku: 'SP-OIL-001',
        name: 'Caltex Havoline 4T 20W-50 Engine Oil (0.7L)',
        unitPrice: 990,
        quantity: 2,
        totalPrice: 1980,
      },
      {
        partId: 'sp-14',
        sku: 'SP-BRK-002',
        name: 'Brake Shoe Set Front / Rear (Honda CD 70)',
        unitPrice: 480,
        quantity: 1,
        totalPrice: 480,
      },
    ],
    subtotal: 2460,
    shippingFee: 150,
    totalAmount: 2610,
    paymentMethod: 'Cash on Delivery (COD)',
    status: 'Dispatched',
    createdAt: '2026-11-22 14:30',
    updatedAt: '2026-11-23 09:15',
    courierName: 'Leopards Courier',
    courierTrackingNumber: 'LEO-78912345',
  },
  {
    id: 'ord-102',
    orderNumber: 'HA-ORD-2026-102',
    customer: {
      fullName: 'Muhammad Usman',
      phoneNumber: '0300 1234567',
      whatsappNumber: '0300 1234567',
      province: 'Punjab',
      city: 'Faisalabad',
      streetAddress: 'D-Ground, Main Boulevard',
    },
    items: [
      {
        partId: 'sp-5',
        sku: 'CP-CG125-QA',
        name: 'Heavy Duty 5-Plate Clutch Friction Plates Set (CG 125)',
        unitPrice: 1850,
        quantity: 1,
        totalPrice: 1850,
      },
    ],
    subtotal: 1850,
    shippingFee: 250,
    totalAmount: 2100,
    paymentMethod: 'Cash on Delivery (COD)',
    status: 'Delivered',
    createdAt: '2026-11-15 11:20',
    updatedAt: '2026-11-18 16:00',
    courierName: 'TCS',
    courierTrackingNumber: 'TCS-99128341',
  },
];

export default function OrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async () => {
    try {
      const stored = await AsyncStorage.getItem(ORDERS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setOrders(parsed);
          return;
        }
      }
      // Initial demo seed
      setOrders(DEMO_ORDERS);
      await AsyncStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(DEMO_ORDERS));
    } catch (err) {
      console.warn('Failed to load orders history:', err);
      setOrders(DEMO_ORDERS);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'success';
      case 'Dispatched':
      case 'In Transit':
        return 'info';
      case 'Confirmed':
      case 'Processing':
        return 'warning';
      case 'Cancelled':
        return 'error';
      default:
        return 'neutral';
    }
  };

  const renderOrderItem = ({ item }: { item: CustomerOrder }) => (
    <Card style={styles.orderCard} padding={16}>
      {/* Header */}
      <View style={styles.orderCardHeader}>
        <View>
          <Text style={styles.orderNumber}>{item.orderNumber}</Text>
          <Text style={styles.orderDate}>{item.createdAt}</Text>
        </View>
        <Badge
          label={item.status}
          variant={getStatusBadgeVariant(item.status)}
          size="md"
        />
      </View>

      {/* Items list */}
      <View style={styles.itemsDivider} />
      {item.items.map((prod, idx) => (
        <View key={idx} style={styles.productRow}>
          <View style={styles.productDot} />
          <Text style={styles.productName} numberOfLines={1}>
            {prod.name}
          </Text>
          <Text style={styles.productQty}>× {prod.quantity}</Text>
          <Text style={styles.productPrice}>PKR {prod.totalPrice.toLocaleString()}</Text>
        </View>
      ))}

      {/* Courier & Tracking if available */}
      {item.courierTrackingNumber && (
        <View style={styles.trackingInfoBox}>
          <FontAwesome5 name="truck" size={13} color={Colors.primary} />
          <Text style={styles.trackingInfoText}>
            {item.courierName || 'Courier'}:{' '}
            <Text style={styles.trackingCode}>{item.courierTrackingNumber}</Text>
          </Text>
        </View>
      )}

      {/* Footer & Total */}
      <View style={styles.orderCardFooter}>
        <View>
          <Text style={styles.totalLabel}>Total (Incl. Shipping):</Text>
          <Text style={styles.totalPrice}>PKR {item.totalAmount.toLocaleString()}</Text>
        </View>

        <Pressable
          onPress={() =>
            router.push({
              pathname: '/order-tracking',
              params: {
                orderNumber: item.orderNumber,
                phone: item.customer.phoneNumber,
              },
            })
          }
          style={({ pressed }) => [styles.trackBtn, pressed && styles.pressed]}
        >
          <Text style={styles.trackBtnText}>Track Order</Text>
          <Ionicons name="chevron-forward" size={14} color={Colors.primary} />
        </Pressable>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <BrandHeader title="My Orders" showSearch showCart />

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        ListHeaderComponent={
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Order History & Status</Text>
            <Pressable
              onPress={() => router.push('/order-tracking')}
              style={styles.lookupBtn}
            >
              <Ionicons name="search" size={14} color={Colors.primary} />
              <Text style={styles.lookupText}>Track by Order #</Text>
            </Pressable>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon="cart-outline"
            title="No Orders Placed Yet"
            message="Explore our genuine motorcycle spare parts shop and place your first order with Pakistan-wide delivery!"
            actionTitle="Go to Shop"
            onAction={() => router.push('/(tabs)/shop')}
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
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.navy,
  },
  lookupBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: Radius.md,
    backgroundColor: Colors.primaryMuted,
  },
  lookupText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  orderCard: {
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.card,
  },
  orderCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderNumber: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.navy,
  },
  orderDate: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  itemsDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 3,
  },
  productDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  productName: {
    fontSize: 12,
    color: Colors.textPrimary,
    flex: 1,
  },
  productQty: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  productPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.navy,
  },
  trackingInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: Radius.md,
    marginTop: 10,
  },
  trackingInfoText: {
    fontSize: 12,
    color: Colors.navy,
  },
  trackingCode: {
    fontWeight: '700',
    color: Colors.info,
  },
  orderCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  totalLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  totalPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primary,
  },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
    backgroundColor: Colors.primaryMuted,
  },
  trackBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  pressed: {
    opacity: 0.8,
  },
});
