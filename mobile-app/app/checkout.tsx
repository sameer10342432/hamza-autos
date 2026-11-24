import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Colors } from '../constants/colors';
import { Radius, Shadows } from '../constants/theme';
import {
  PAKISTAN_PROVINCES,
  PAKISTAN_MAJOR_CITIES,
  BUSINESS_INFO,
} from '../data/initialData';
import { MobileApiService } from '../services/api';
import {
  PakistanProvince,
  PaymentMethod,
  CustomerOrder,
  OrderItemRecord,
} from '../types';

const ORDERS_STORAGE_KEY = '@hamza_autos_orders_history_v1';

export default function CheckoutScreen() {
  const router = useRouter();
  const {
    items,
    subtotal,
    shippingFee,
    totalAmount,
    selectedProvince,
    selectedCity,
    setDeliveryLocation,
    clearCart,
  } = useCart();
  const { customer } = useAuth();

  // Form Fields
  const [fullName, setFullName] = useState(customer?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(customer?.phoneNumber || '');
  const [whatsappNumber, setWhatsappNumber] = useState(customer?.phoneNumber || '');
  const [email, setEmail] = useState(customer?.email || '');
  const [streetAddress, setStreetAddress] = useState(
    customer?.savedAddresses?.[0]?.streetAddress || ''
  );
  const [postalCode, setPostalCode] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [customCity, setCustomCity] = useState('');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    'Cash on Delivery (COD)'
  );

  // Submission Guard
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Full Name is required.';
    if (!phoneNumber.trim()) {
      errs.phoneNumber = 'Mobile Number is required for delivery coordination.';
    } else if (phoneNumber.replace(/[^0-9]/g, '').length < 10) {
      errs.phoneNumber = 'Please enter a valid 11-digit Pakistani phone number.';
    }
    if (!streetAddress.trim()) {
      errs.streetAddress = 'Complete street / house address is required.';
    }
    const effectiveCity = customCity.trim() || selectedCity;
    if (!effectiveCity) {
      errs.city = 'Please specify your delivery city.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (isSubmitting) return; // Duplicate prevention
    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Your shopping cart is empty.');
      return;
    }
    if (!validate()) {
      Alert.alert('Incomplete Form', 'Please fix the highlighted errors before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      const currentYear = new Date().getFullYear();
      const rand = Math.floor(100 + Math.random() * 900);
      const orderNumber = `HA-ORD-${currentYear}-${rand}`;
      const effectiveCity = customCity.trim() || selectedCity;
      const now = new Date().toISOString().replace('T', ' ').slice(0, 16);

      const orderItems: OrderItemRecord[] = items.map((i) => ({
        partId: i.part.id,
        sku: i.part.partNumber,
        name: i.part.partName,
        unitPrice: i.part.discountedPrice || i.part.sellingPrice,
        quantity: i.quantity,
        totalPrice: (i.part.discountedPrice || i.part.sellingPrice) * i.quantity,
      }));

      const newOrder: CustomerOrder = {
        id: `ord_${Date.now()}`,
        orderNumber,
        customer: {
          fullName: fullName.trim(),
          phoneNumber: phoneNumber.trim(),
          whatsappNumber: (whatsappNumber || phoneNumber).trim(),
          email: email.trim() || undefined,
          province: selectedProvince,
          city: effectiveCity,
          streetAddress: streetAddress.trim(),
          postalCode: postalCode.trim() || undefined,
          orderNotes: orderNotes.trim() || undefined,
        },
        items: orderItems,
        subtotal,
        shippingFee,
        totalAmount,
        paymentMethod,
        status: 'New',
        createdAt: now,
        updatedAt: now,
        courierName: selectedProvince === 'Punjab' && effectiveCity.toLowerCase() === 'lahore' ? 'Local Delivery' : 'TCS',
      };

      // 1. Submit to Backend API
      const result = await MobileApiService.submitOrder(newOrder);

      // 2. Persist in Local Orders History
      const existingRaw = await AsyncStorage.getItem(ORDERS_STORAGE_KEY);
      const existingList: CustomerOrder[] = existingRaw ? JSON.parse(existingRaw) : [];
      const updatedList = [newOrder, ...existingList];
      await AsyncStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedList));

      // 3. Clear Cart
      clearCart();

      // 4. Confirmation Alert
      Alert.alert(
        'Order Placed Successfully!',
        `Order Number: ${orderNumber}\n\nThank you ${fullName}! We have registered your spare parts order. Our dispatch team in Badami Bagh, Lahore will contact you on WhatsApp (${phoneNumber}) to confirm shipment.\n\nCourier: ${newOrder.courierName}`,
        [
          {
            text: 'Track Order',
            onPress: () =>
              router.replace({
                pathname: '/order-tracking',
                params: { orderNumber, phone: phoneNumber },
              }),
          },
          {
            text: 'Done',
            onPress: () => router.replace('/(tabs)/orders'),
          },
        ]
      );
    } catch (err: any) {
      Alert.alert('Order Submission Error', err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Guest vs User Notice */}
        {!customer && (
          <View style={styles.guestNotice}>
            <Ionicons name="information-circle" size={18} color={Colors.info} />
            <Text style={styles.guestNoticeText}>
              Guest Checkout: No account required. Your phone number will be used for delivery updates.
            </Text>
          </View>
        )}

        {/* Customer Information Card */}
        <Card style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="person" size={18} color={Colors.primary} />
            <Text style={styles.cardTitle}>1. Customer Contact Details</Text>
          </View>

          <Input
            label="Full Name"
            placeholder="Muhammad Hamza"
            value={fullName}
            onChangeText={setFullName}
            error={errors.fullName}
            required
            leftIcon={<Ionicons name="person-outline" size={16} color={Colors.navy} />}
          />

          <Input
            label="Mobile Phone Number"
            placeholder="0325 1814548"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            error={errors.phoneNumber}
            helperText="Courier will call this number prior to delivery"
            required
            leftIcon={<Ionicons name="call-outline" size={16} color={Colors.navy} />}
          />

          <Input
            label="WhatsApp Number (if different)"
            placeholder="0325 1814548"
            value={whatsappNumber}
            onChangeText={setWhatsappNumber}
            keyboardType="phone-pad"
            helperText="For order confirmation and courier tracking slips"
            leftIcon={<Ionicons name="logo-whatsapp" size={16} color={Colors.whatsapp} />}
          />

          <Input
            label="Email Address (Optional)"
            placeholder="rider@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            leftIcon={<Ionicons name="mail-outline" size={16} color={Colors.navy} />}
          />
        </Card>

        {/* Pakistan Delivery Address Card */}
        <Card style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="location" size={18} color={Colors.primary} />
            <Text style={styles.cardTitle}>2. Pakistan Delivery Address</Text>
          </View>

          {/* Province Selector */}
          <Text style={styles.fieldLabel}>Province / Territory *</Text>
          <View style={styles.provinceWrap}>
            {PAKISTAN_PROVINCES.map((prov) => {
              const isSelected = selectedProvince === prov;
              return (
                <Pressable
                  key={prov}
                  onPress={() => {
                    const defaultCity = PAKISTAN_MAJOR_CITIES[prov]?.[0] || 'Lahore';
                    setDeliveryLocation(prov as PakistanProvince, defaultCity);
                  }}
                  style={[
                    styles.provinceChip,
                    isSelected && styles.provinceChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.provinceChipText,
                      isSelected && styles.provinceChipTextActive,
                    ]}
                  >
                    {prov}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* City Selection */}
          <Text style={styles.fieldLabel}>City / Town *</Text>
          {selectedProvince && PAKISTAN_MAJOR_CITIES[selectedProvince] && (
            <View style={styles.cityChipsWrap}>
              {PAKISTAN_MAJOR_CITIES[selectedProvince].map((c) => {
                const isSelected = selectedCity === c && !customCity;
                return (
                  <Pressable
                    key={c}
                    onPress={() => {
                      setDeliveryLocation(selectedProvince, c);
                      setCustomCity('');
                    }}
                    style={[styles.cityChip, isSelected && styles.cityChipActive]}
                  >
                    <Text
                      style={[
                        styles.cityChipText,
                        isSelected && styles.cityChipTextActive,
                      ]}
                    >
                      {c}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          <Input
            placeholder="Or type other city/tehsil name..."
            value={customCity}
            onChangeText={(txt) => {
              setCustomCity(txt);
              if (txt) setDeliveryLocation(selectedProvince, txt);
            }}
            containerStyle={styles.customCityInput}
          />
          {errors.city && <Text style={styles.errorInline}>{errors.city}</Text>}

          <Input
            label="Complete Delivery Address"
            placeholder="House/Shop #, Street name, Mohallah/Sector, Landmark"
            value={streetAddress}
            onChangeText={setStreetAddress}
            multiline
            numberOfLines={2}
            error={errors.streetAddress}
            required
            leftIcon={<Ionicons name="home-outline" size={16} color={Colors.navy} />}
          />

          <Input
            label="Postal / Zip Code (Optional)"
            placeholder="e.g. 54000"
            value={postalCode}
            onChangeText={setPostalCode}
            keyboardType="numeric"
          />

          <Input
            label="Special Delivery Instructions (Optional)"
            placeholder="e.g. Deliver between 2 PM to 5 PM, or call on arrival"
            value={orderNotes}
            onChangeText={setOrderNotes}
          />
        </Card>

        {/* Payment Method Selection Card */}
        <Card style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="wallet" size={18} color={Colors.primary} />
            <Text style={styles.cardTitle}>3. Payment Method</Text>
          </View>

          {/* Cash on Delivery (COD) */}
          <Pressable
            onPress={() => setPaymentMethod('Cash on Delivery (COD)')}
            style={[
              styles.paymentOption,
              paymentMethod === 'Cash on Delivery (COD)' && styles.paymentOptionActive,
            ]}
          >
            <View style={styles.radioCircle}>
              {paymentMethod === 'Cash on Delivery (COD)' && (
                <View style={styles.radioInner} />
              )}
            </View>
            <View style={styles.paymentInfo}>
              <View style={styles.paymentTitleRow}>
                <Text style={styles.paymentName}>Cash on Delivery (COD)</Text>
                <Badge label="Recommended" variant="success" size="sm" />
              </View>
              <Text style={styles.paymentSub}>
                Pay cash to the courier rider when parts are delivered to your doorstep.
              </Text>
            </View>
          </Pressable>

          {/* Bank Transfer / Manual Payment */}
          <Pressable
            onPress={() => setPaymentMethod('Bank Transfer / Manual Payment')}
            style={[
              styles.paymentOption,
              paymentMethod === 'Bank Transfer / Manual Payment' && styles.paymentOptionActive,
            ]}
          >
            <View style={styles.radioCircle}>
              {paymentMethod === 'Bank Transfer / Manual Payment' && (
                <View style={styles.radioInner} />
              )}
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentName}>Bank Transfer / JazzCash / Nayapay</Text>
              <Text style={styles.paymentSub}>
                Transfer order amount to Hamza Autos business account and share receipt on WhatsApp.
              </Text>
            </View>
          </Pressable>

          {paymentMethod === 'Bank Transfer / Manual Payment' && (
            <View style={styles.bankDetailsBox}>
              <Text style={styles.bankTitle}>Hamza Autos Official Account:</Text>
              <Text style={styles.bankLine}>• Bank: Meezan Bank / Allied Bank</Text>
              <Text style={styles.bankLine}>• Account Title: Hamza Autos Lahore</Text>
              <Text style={styles.bankLine}>• Account / IBAN: PK52MEZN0001814548001</Text>
              <Text style={styles.bankLine}>• WhatsApp for Receipt: {BUSINESS_INFO.whatsappNumber}</Text>
            </View>
          )}
        </Card>

        {/* Order Items Review Card */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>4. Order Summary</Text>

          {items.map((i) => {
            const price = i.part.discountedPrice || i.part.sellingPrice;
            return (
              <View key={i.part.id} style={styles.reviewItemRow}>
                <Text style={styles.reviewItemName} numberOfLines={1}>
                  {i.part.partName} <Text style={styles.qtySpan}>× {i.quantity}</Text>
                </Text>
                <Text style={styles.reviewItemPrice}>
                  PKR {(price * i.quantity).toLocaleString()}
                </Text>
              </View>
            );
          })}

          <View style={styles.divider} />

          <View style={styles.subtotalRow}>
            <Text style={styles.subtotalLabel}>Parts Subtotal</Text>
            <Text style={styles.subtotalVal}>PKR {subtotal.toLocaleString()}</Text>
          </View>

          <View style={styles.subtotalRow}>
            <Text style={styles.subtotalLabel}>Courier Shipping ({selectedCity})</Text>
            <Text style={styles.subtotalVal}>PKR {shippingFee.toLocaleString()}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Grand Total (Net Payable)</Text>
            <Text style={styles.grandTotalVal}>PKR {totalAmount.toLocaleString()}</Text>
          </View>
        </Card>

        {/* Place Order CTA Button */}
        <Button
          title={isSubmitting ? 'Submitting Order...' : `Confirm & Place Order • PKR ${totalAmount.toLocaleString()}`}
          onPress={handlePlaceOrder}
          loading={isSubmitting}
          variant="primary"
          size="lg"
          fullWidth
          style={styles.placeOrderBtn}
          icon={<Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />}
        />

        <Text style={styles.guaranteeNotice}>
          🔒 Your order is protected by the Hamza Autos Badami Bagh Fitment Guarantee. Real-time verification on WhatsApp (+92 325 1814548).
        </Text>
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
  guestNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 14,
  },
  guestNoticeText: {
    flex: 1,
    fontSize: 12,
    color: Colors.navy,
    lineHeight: 16,
  },
  card: {
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.navy,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.navy,
    marginBottom: 6,
  },
  provinceWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  provinceChip: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: Radius.sm,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  provinceChipActive: {
    backgroundColor: Colors.navy,
    borderColor: Colors.navy,
  },
  provinceChipText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  provinceChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  cityChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  cityChip: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: Radius.xs,
    backgroundColor: '#F1F5F9',
  },
  cityChipActive: {
    backgroundColor: Colors.primaryMuted,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  cityChipText: {
    fontSize: 11,
    color: Colors.textPrimary,
  },
  cityChipTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  customCityInput: {
    marginTop: 4,
    marginBottom: 8,
  },
  errorInline: {
    fontSize: 11,
    color: Colors.error,
    marginBottom: 6,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 12,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    marginBottom: 10,
  },
  paymentOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryMuted,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  paymentName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.navy,
  },
  paymentSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  bankDetailsBox: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 4,
  },
  bankTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.navy,
    marginBottom: 4,
  },
  bankLine: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  reviewItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  reviewItemName: {
    fontSize: 12,
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  qtySpan: {
    fontWeight: '700',
    color: Colors.primary,
  },
  reviewItemPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.navy,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 8,
  },
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  subtotalLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  subtotalVal: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.navy,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 4,
  },
  grandTotalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.navy,
  },
  grandTotalVal: {
    fontSize: 17,
    fontWeight: '900',
    color: Colors.primary,
  },
  placeOrderBtn: {
    marginTop: 6,
  },
  guaranteeNotice: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 14,
    paddingHorizontal: 8,
  },
});
