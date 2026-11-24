import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Colors } from '../constants/colors';
import { Radius, Shadows } from '../constants/theme';
import { BUSINESS_INFO } from '../data/initialData';
import { MobileApiService } from '../services/api';
import { CustomerOrder, OrderStatus } from '../types';

const ORDERS_STORAGE_KEY = '@hamza_autos_orders_history_v1';

const ORDER_STEPS: OrderStatus[] = [
  'New',
  'Confirmed',
  'Processing',
  'Dispatched',
  'Delivered',
];

export default function OrderTrackingScreen() {
  const params = useLocalSearchParams<{ orderNumber?: string; phone?: string }>();
  const [orderNumberInput, setOrderNumberInput] = useState(params.orderNumber || '');
  const [phoneInput, setPhoneInput] = useState(params.phone || '');
  const [order, setOrder] = useState<CustomerOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async (orderNumToFind?: string, phoneToFind?: string) => {
    const num = (orderNumToFind || orderNumberInput).trim().toUpperCase();
    const phone = (phoneToFind || phoneInput).trim();

    if (!num) {
      setError('Please enter your Order Number (e.g. HA-ORD-2026-101)');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Try local AsyncStorage orders first
      const stored = await AsyncStorage.getItem(ORDERS_STORAGE_KEY);
      if (stored) {
        const list: CustomerOrder[] = JSON.parse(stored);
        const matched = list.find(
          (o) => o.orderNumber.toUpperCase() === num
        );
        if (matched) {
          setOrder(matched);
          setLoading(false);
          return;
        }
      }

      // 2. Try remote API lookup
      const res = await MobileApiService.trackOrder(num, phone);
      if (res.success && res.data) {
        setOrder(res.data);
      } else {
        setError(res.error || `No active order found for "${num}". Please check your receipt.`);
      }
    } catch (e: any) {
      setError('Network lookup timed out. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.orderNumber) {
      handleLookup(params.orderNumber, params.phone);
    }
  }, [params.orderNumber]);

  const getStepState = (stepIndex: number, currentStatus: OrderStatus) => {
    const currentIdx = ORDER_STEPS.indexOf(currentStatus);
    if (currentStatus === 'In Transit' && stepIndex <= 3) return 'completed';
    if (currentIdx === -1) return stepIndex === 0 ? 'active' : 'pending';
    if (stepIndex < currentIdx) return 'completed';
    if (stepIndex === currentIdx) return 'active';
    return 'pending';
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Assalam-o-Alaikum Hamza Autos! I want to check delivery status for Order Number: ${order?.orderNumber || orderNumberInput}`
    );
    Linking.openURL(`https://wa.me/${BUSINESS_INFO.whatsappRaw}?text=${text}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Lookup Card */}
        <Card style={styles.lookupCard}>
          <Text style={styles.lookupTitle}>Track Spare Parts Courier Delivery</Text>
          <Text style={styles.lookupSub}>
            Enter the Order Number sent to your mobile SMS or WhatsApp.
          </Text>

          <Input
            label="Order Number (e.g. HA-ORD-2026-101)"
            placeholder="HA-ORD-2026-101"
            value={orderNumberInput}
            onChangeText={setOrderNumberInput}
            autoCapitalize="characters"
            leftIcon={<Ionicons name="barcode-outline" size={18} color={Colors.navy} />}
          />

          <Input
            label="Registered Phone Number"
            placeholder="0325 1814548"
            value={phoneInput}
            onChangeText={setPhoneInput}
            keyboardType="phone-pad"
            leftIcon={<Ionicons name="call-outline" size={18} color={Colors.navy} />}
          />

          <Button
            title="Search Order Status"
            onPress={() => handleLookup()}
            loading={loading}
            variant="primary"
            size="md"
            fullWidth
            icon={<Ionicons name="search" size={16} color="#FFFFFF" />}
          />

          {error && <Text style={styles.errorText}>{error}</Text>}
        </Card>

        {/* Order Details & Progress Timeline */}
        {order && (
          <View style={styles.resultContainer}>
            {/* Order Header Summary */}
            <Card style={styles.orderSummaryCard}>
              <View style={styles.summaryTopRow}>
                <View>
                  <Text style={styles.orderNum}>{order.orderNumber}</Text>
                  <Text style={styles.orderDate}>Ordered: {order.createdAt}</Text>
                </View>
                <Badge
                  label={order.status}
                  variant={order.status === 'Delivered' ? 'success' : 'primary'}
                  size="md"
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.infoGrid}>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Recipient</Text>
                  <Text style={styles.gridVal}>{order.customer.fullName}</Text>
                </View>

                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Phone</Text>
                  <Text style={styles.gridVal}>{order.customer.phoneNumber}</Text>
                </View>

                <View style={styles.gridItemFull}>
                  <Text style={styles.gridLabel}>Delivery Address</Text>
                  <Text style={styles.gridVal}>
                    {order.customer.streetAddress}, {order.customer.city}, {order.customer.province}
                  </Text>
                </View>

                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Payment Method</Text>
                  <Text style={styles.gridVal}>{order.paymentMethod}</Text>
                </View>

                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Total Amount</Text>
                  <Text style={styles.totalVal}>PKR {order.totalAmount.toLocaleString()}</Text>
                </View>
              </View>
            </Card>

            {/* Courier Dispatch Details */}
            <Card style={styles.courierCard}>
              <View style={styles.courierHeader}>
                <FontAwesome5 name="shipping-fast" size={18} color={Colors.primary} />
                <Text style={styles.courierTitle}>Courier Logistics & Tracking</Text>
              </View>

              <View style={styles.courierRow}>
                <Text style={styles.courierLabel}>Service Provider:</Text>
                <Text style={styles.courierVal}>{order.courierName || 'TCS Express Pakistan'}</Text>
              </View>

              <View style={styles.courierRow}>
                <Text style={styles.courierLabel}>Tracking Consignment #:</Text>
                <Text style={styles.courierTrackCode}>
                  {order.courierTrackingNumber || 'Pending Dispatch Assignment'}
                </Text>
              </View>

              <View style={styles.courierRow}>
                <Text style={styles.courierLabel}>Dispatch Origin:</Text>
                <Text style={styles.courierVal}>Badami Bagh Central Warehouse, Lahore</Text>
              </View>
            </Card>

            {/* Visual Multi-Stage Timeline */}
            <Card style={styles.timelineCard}>
              <Text style={styles.timelineTitle}>Live Delivery Timeline</Text>

              {ORDER_STEPS.map((step, idx) => {
                const state = getStepState(idx, order.status);
                const isLast = idx === ORDER_STEPS.length - 1;

                return (
                  <View key={step} style={styles.stepItem}>
                    <View style={styles.stepIndicatorCol}>
                      <View
                        style={[
                          styles.stepDot,
                          state === 'completed' && styles.stepDotCompleted,
                          state === 'active' && styles.stepDotActive,
                        ]}
                      >
                        {state === 'completed' ? (
                          <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                        ) : state === 'active' ? (
                          <View style={styles.activeDotInner} />
                        ) : null}
                      </View>

                      {!isLast && (
                        <View
                          style={[
                            styles.stepLine,
                            state === 'completed' && styles.stepLineCompleted,
                          ]}
                        />
                      )}
                    </View>

                    <View style={styles.stepTextCol}>
                      <Text
                        style={[
                          styles.stepName,
                          state === 'active' && styles.stepNameActive,
                          state === 'completed' && styles.stepNameCompleted,
                        ]}
                      >
                        {step === 'New'
                          ? '1. Order Registered'
                          : step === 'Confirmed'
                          ? '2. Order Verified by Badami Bagh Team'
                          : step === 'Processing'
                          ? '3. Parts Packed & Quality Checked'
                          : step === 'Dispatched'
                          ? '4. Handed to Courier for Delivery'
                          : '5. Delivered to Doorstep'}
                      </Text>
                      <Text style={styles.stepSub}>
                        {state === 'completed'
                          ? 'Completed successfully'
                          : state === 'active'
                          ? 'In progress right now'
                          : 'Upcoming stage'}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </Card>

            {/* Ordered Items List */}
            <Card style={styles.itemsCard}>
              <Text style={styles.timelineTitle}>Package Items ({order.items.length})</Text>
              {order.items.map((it, idx) => (
                <View key={idx} style={styles.itRow}>
                  <Text style={styles.itName} numberOfLines={1}>
                    {it.name} <Text style={styles.itQty}>× {it.quantity}</Text>
                  </Text>
                  <Text style={styles.itPrice}>PKR {it.totalPrice.toLocaleString()}</Text>
                </View>
              ))}
            </Card>

            {/* WhatsApp Inquiry Button */}
            <Button
              title="Inquire via WhatsApp Hotline"
              onPress={handleWhatsApp}
              variant="whatsapp"
              size="md"
              fullWidth
              icon={<Ionicons name="logo-whatsapp" size={18} color="#FFFFFF" />}
              style={styles.whatsappBtn}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  lookupCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  lookupTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.navy,
    marginBottom: 4,
  },
  lookupSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 14,
    lineHeight: 16,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
  },
  resultContainer: {
    gap: 14,
  },
  orderSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  summaryTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderNum: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.navy,
  },
  orderDate: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridItem: {
    width: '48%',
  },
  gridItemFull: {
    width: '100%',
  },
  gridLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  gridVal: {
    fontSize: 13,
    color: Colors.navy,
    fontWeight: '700',
    marginTop: 1,
  },
  totalVal: {
    fontSize: 15,
    color: Colors.primary,
    fontWeight: '900',
    marginTop: 1,
  },
  courierCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  courierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  courierTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.navy,
  },
  courierRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  courierLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  courierVal: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.navy,
  },
  courierTrackCode: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.info,
  },
  timelineCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.navy,
    marginBottom: 14,
  },
  stepItem: {
    flexDirection: 'row',
    gap: 12,
  },
  stepIndicatorCol: {
    alignItems: 'center',
    width: 20,
  },
  stepDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  stepDotActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryMuted,
  },
  stepDotCompleted: {
    backgroundColor: Colors.success,
  },
  activeDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  stepLine: {
    width: 2,
    flex: 1,
    minHeight: 28,
    backgroundColor: '#E2E8F0',
    marginVertical: 2,
  },
  stepLineCompleted: {
    backgroundColor: Colors.success,
  },
  stepTextCol: {
    flex: 1,
    paddingBottom: 16,
  },
  stepName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  stepNameActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
  stepNameCompleted: {
    color: Colors.navy,
    fontWeight: '700',
  },
  stepSub: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  itemsCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  itRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  itName: {
    fontSize: 12,
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  itQty: {
    fontWeight: '700',
    color: Colors.primary,
  },
  itPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.navy,
  },
  whatsappBtn: {
    marginTop: 4,
  },
});
