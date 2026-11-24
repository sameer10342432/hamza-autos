import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { Colors } from '../constants/colors';
import { Radius, Shadows } from '../constants/theme';
import { getProductPlaceholder } from '../utils/assetHelper';
import { PAKISTAN_PROVINCES, PAKISTAN_MAJOR_CITIES } from '../data/initialData';
import { PakistanProvince, CartItem } from '../types';

export default function CartScreen() {
  const router = useRouter();
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    shippingFee,
    totalAmount,
    selectedProvince,
    selectedCity,
    setDeliveryLocation,
  } = useCart();

  const handleCheckout = () => {
    if (items.length === 0) return;
    router.push('/checkout');
  };

  const renderCartItem = ({ item }: { item: CartItem }) => {
    const unitPrice = item.part.discountedPrice || item.part.sellingPrice;
    const itemTotal = unitPrice * item.quantity;

    return (
      <Card style={styles.cartItemCard} padding={12}>
        <View style={styles.itemRow}>
          {/* Thumbnail */}
          <View style={styles.thumbnailWrap}>
            <Image
              source={getProductPlaceholder(item.part.category)}
              style={styles.thumbnail}
              resizeMode="cover"
            />
          </View>

          {/* Details */}
          <View style={styles.itemDetails}>
            <Text style={styles.itemSku}>SKU: {item.part.partNumber}</Text>
            <Text style={styles.itemName} numberOfLines={2}>
              {item.part.partName}
            </Text>
            <Text style={styles.itemUnitPrice}>
              PKR {unitPrice.toLocaleString()} each
            </Text>

            {/* Qty & Controls */}
            <View style={styles.controlsRow}>
              <View style={styles.qtyBox}>
                <Pressable
                  onPress={() => updateQuantity(item.part.id, item.quantity - 1)}
                  style={({ pressed }) => [styles.qtyBtn, pressed && styles.btnPressed]}
                >
                  <Ionicons name="remove" size={16} color={Colors.navy} />
                </Pressable>

                <Text style={styles.qtyText}>{item.quantity}</Text>

                <Pressable
                  onPress={() => updateQuantity(item.part.id, item.quantity + 1)}
                  disabled={item.quantity >= item.part.stockQuantity}
                  style={({ pressed }) => [
                    styles.qtyBtn,
                    item.quantity >= item.part.stockQuantity && styles.qtyBtnDisabled,
                    pressed && styles.btnPressed,
                  ]}
                >
                  <Ionicons name="add" size={16} color={Colors.navy} />
                </Pressable>
              </View>

              <Text style={styles.itemTotal}>PKR {itemTotal.toLocaleString()}</Text>

              <Pressable
                onPress={() => removeFromCart(item.part.id)}
                style={({ pressed }) => [styles.deleteBtn, pressed && styles.btnPressed]}
              >
                <Ionicons name="trash-outline" size={18} color={Colors.error} />
              </Pressable>
            </View>
          </View>
        </View>
      </Card>
    );
  };

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="cart-off"
          title="Your Shopping Cart is Empty"
          message="You have no motorcycle spare parts in your cart. Browse our store to order genuine engine parts, lubricants, filters, and brake components."
          actionTitle="Explore Spare Parts Store"
          onAction={() => router.push('/(tabs)/shop')}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.part.id}
        renderItem={renderCartItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerBar}>
            <Text style={styles.headerTitle}>
              Cart Items ({items.reduce((s, i) => s + i.quantity, 0)})
            </Text>
            <Pressable onPress={clearCart}>
              <Text style={styles.clearCartText}>Clear All</Text>
            </Pressable>
          </View>
        }
        ListFooterComponent={
          <View style={styles.footerSection}>
            {/* Delivery Destination Selector */}
            <Card style={styles.deliverySelectorCard}>
              <View style={styles.deliveryHeader}>
                <Ionicons name="location-outline" size={18} color={Colors.primary} />
                <Text style={styles.deliveryTitle}>Shipping Destination (Pakistan)</Text>
              </View>
              <Text style={styles.deliverySubtitle}>
                Select province to calculate exact courier shipping fee:
              </Text>

              {/* Province Picker Chips */}
              <View style={styles.provinceChips}>
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

              {/* City Selector */}
              {selectedProvince && PAKISTAN_MAJOR_CITIES[selectedProvince] && (
                <View style={styles.citySelectorRow}>
                  <Text style={styles.cityLabel}>City:</Text>
                  <View style={styles.cityChips}>
                    {PAKISTAN_MAJOR_CITIES[selectedProvince].slice(0, 5).map((city) => (
                      <Pressable
                        key={city}
                        onPress={() => setDeliveryLocation(selectedProvince, city)}
                        style={[
                          styles.cityChip,
                          selectedCity === city && styles.cityChipActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.cityChipText,
                            selectedCity === city && styles.cityChipTextActive,
                          ]}
                        >
                          {city}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}
            </Card>

            {/* Price Summary Card */}
            <Card style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Order Summary</Text>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryVal}>PKR {subtotal.toLocaleString()}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  Courier Shipping ({selectedCity}, {selectedProvince})
                </Text>
                <Text style={styles.summaryVal}>PKR {shippingFee.toLocaleString()}</Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Estimated Total</Text>
                <Text style={styles.totalVal}>PKR {totalAmount.toLocaleString()}</Text>
              </View>

              <Text style={styles.paymentNotice}>
                • Cash on Delivery (COD) available nationwide{'\n'}
                • Direct dispatch from Badami Bagh, Lahore market
              </Text>

              <Button
                title={`Proceed to Checkout • PKR ${totalAmount.toLocaleString()}`}
                onPress={handleCheckout}
                variant="primary"
                size="lg"
                fullWidth
                style={styles.checkoutBtn}
                icon={<Ionicons name="arrow-forward" size={18} color="#FFFFFF" />}
                iconPosition="right"
              />
            </Card>
          </View>
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
    paddingBottom: 40,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.navy,
  },
  clearCartText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.error,
  },
  cartItemCard: {
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  itemRow: {
    flexDirection: 'row',
    gap: 12,
  },
  thumbnailWrap: {
    width: 80,
    height: 80,
    borderRadius: Radius.md,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  itemDetails: {
    flex: 1,
  },
  itemSku: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  itemName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.navy,
    marginVertical: 2,
    lineHeight: 17,
  },
  itemUnitPrice: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  qtyBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnDisabled: {
    opacity: 0.3,
  },
  qtyText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.navy,
    paddingHorizontal: 8,
  },
  itemTotal: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.primary,
  },
  deleteBtn: {
    padding: 6,
  },
  btnPressed: {
    opacity: 0.7,
  },
  footerSection: {
    marginTop: 10,
  },
  deliverySelectorCard: {
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  deliveryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  deliveryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.navy,
  },
  deliverySubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  provinceChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
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
  citySelectorRow: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  cityLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  cityChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
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
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.navy,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  summaryLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  summaryVal: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.navy,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.navy,
  },
  totalVal: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.primary,
  },
  paymentNotice: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: Radius.sm,
    marginBottom: 14,
  },
  checkoutBtn: {
    marginTop: 4,
  },
});
