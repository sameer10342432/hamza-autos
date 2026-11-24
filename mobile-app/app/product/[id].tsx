import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Linking,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { INITIAL_SPARE_PARTS, BUSINESS_INFO } from '../../data/initialData';
import { MobileApiService } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Card } from '../../components/Card';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { Colors } from '../../constants/colors';
import { Radius, Shadows } from '../../constants/theme';
import { getProductPlaceholder } from '../../utils/assetHelper';
import { SparePart } from '../../types';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addToCart } = useCart();

  const [part, setPart] = useState<SparePart | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    async function findPart() {
      setLoading(true);
      try {
        const res = await MobileApiService.getProducts();
        if (res.success && res.data) {
          const found = res.data.find(
            (p) => p.id === id || p.partNumber === id
          );
          if (found) {
            setPart(found);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.warn('Error fetching part:', e);
      }
      // Fallback
      const local = INITIAL_SPARE_PARTS.find(
        (p) => p.id === id || p.partNumber === id
      );
      setPart(local || null);
      setLoading(false);
    }
    findPart();
  }, [id]);

  if (loading) {
    return <LoadingState message="Loading spare part specifications..." />;
  }

  if (!part) {
    return (
      <View style={styles.container}>
        <ErrorState
          title="Spare Part Not Found"
          message="The requested spare part could not be found in the current Hamza Autos catalog. It may have been archived or removed."
          onRetry={() => router.back()}
        />
      </View>
    );
  }

  const isOutOfStock = part.stockQuantity <= 0;
  const isLowStock = part.stockQuantity > 0 && part.stockQuantity <= part.minStockAlert;
  const currentPrice = part.discountedPrice || part.sellingPrice;
  const hasDiscount = part.discountedPrice && part.discountedPrice < part.sellingPrice;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(part, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(part, quantity);
    router.push('/checkout');
  };

  const handleWhatsAppInquiry = () => {
    const text = encodeURIComponent(
      `Assalam-o-Alaikum Hamza Autos! I want to inquire about availability for: ${part.partName} (SKU: ${part.partNumber}, Price: PKR ${currentPrice}). Is it currently in stock at your Badami Bagh shop?`
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
        {/* Main Photo Gallery */}
        <View style={styles.galleryCard}>
          <Image
            source={getProductPlaceholder(part.category)}
            style={styles.mainImage}
            resizeMode="cover"
          />

          <View style={styles.galleryBadgeOverlay}>
            {isOutOfStock ? (
              <Badge label="Out of Stock" variant="error" />
            ) : isLowStock ? (
              <Badge label={`Low Stock: Only ${part.stockQuantity} remaining`} variant="warning" />
            ) : (
              <Badge label={`In Stock (${part.stockQuantity} units)`} variant="success" />
            )}
          </View>
        </View>

        {/* Product Details Header */}
        <Card style={styles.infoCard}>
          <View style={styles.categoryRow}>
            <Text style={styles.skuText}>SKU: {part.partNumber}</Text>
            <Badge label={part.category} variant="primary" size="sm" />
          </View>

          <Text style={styles.partTitle}>{part.partName}</Text>

          {/* Pricing Row */}
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.currentPrice}>
                PKR {currentPrice.toLocaleString()}
              </Text>
              {hasDiscount && (
                <Text style={styles.originalPrice}>
                  Original: PKR {part.sellingPrice.toLocaleString()}
                </Text>
              )}
            </View>

            {hasDiscount && (
              <Badge
                label={`Save PKR ${(part.sellingPrice - (part.discountedPrice || 0)).toLocaleString()}`}
                variant="success"
              />
            )}
          </View>

          {/* Sourcing details */}
          <View style={styles.sourcingRow}>
            <Ionicons name="storefront" size={14} color={Colors.textSecondary} />
            <Text style={styles.sourcingText}>
              Verified supplier: <Text style={styles.bold}>{part.supplier || 'Badami Bagh Auto Market'}</Text>
            </Text>
          </View>
        </Card>

        {/* Motorcycle Compatibility Guide */}
        <Card style={styles.compatCard}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="bicycle" size={18} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Guaranteed Bike Compatibility</Text>
          </View>

          <View style={styles.compatItemRow}>
            <Text style={styles.compatLabel}>Supported Brands:</Text>
            <View style={styles.compatTagList}>
              {part.compatibleBrands.map((b) => (
                <View key={b} style={styles.compatTag}>
                  <Text style={styles.compatTagText}>{b}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.compatItemRow}>
            <Text style={styles.compatLabel}>Supported Models:</Text>
            <View style={styles.compatTagList}>
              {part.compatibleModels.map((m) => (
                <View key={m} style={styles.modelTag}>
                  <Text style={styles.modelTagText}>{m}</Text>
                </View>
              ))}
            </View>
          </View>
        </Card>

        {/* Description & Specs */}
        <Card style={styles.descCard}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="document-text-outline" size={18} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Product Description</Text>
          </View>

          <Text style={styles.descriptionBody}>
            {part.description ||
              'Genuine specification replacement spare part carefully tested and verified for performance, heat dissipation, and fitment on Pakistani commuter motorcycles.'}
          </Text>

          <View style={styles.specsTable}>
            <View style={styles.specRow}>
              <Text style={styles.specKey}>Part ID</Text>
              <Text style={styles.specVal}>{part.id}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specKey}>Category</Text>
              <Text style={styles.specVal}>{part.category}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specKey}>Inventory Level</Text>
              <Text style={styles.specVal}>{part.stockQuantity} in Badami Bagh inventory</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specKey}>Last Restocked</Text>
              <Text style={styles.specVal}>{part.lastRestocked || 'Verified Fresh'}</Text>
            </View>
          </View>
        </Card>

        {/* Delivery & Warranty Information */}
        <Card style={styles.guaranteeCard}>
          <View style={styles.guaranteeRow}>
            <FontAwesome5 name="shipping-fast" size={16} color={Colors.primary} />
            <Text style={styles.guaranteeText}>
              Pakistan-Wide Courier Delivery (TCS / Leopards)
            </Text>
          </View>
          <View style={styles.guaranteeRow}>
            <Ionicons name="shield-checkmark" size={18} color={Colors.success} />
            <Text style={styles.guaranteeText}>
              Fitment Guarantee or Direct Exchange at Badami Bagh
            </Text>
          </View>
          <View style={styles.guaranteeRow}>
            <Ionicons name="cash-outline" size={18} color={Colors.gold} />
            <Text style={styles.guaranteeText}>
              Cash on Delivery (COD) available nationwide
            </Text>
          </View>
        </Card>
      </ScrollView>

      {/* Floating Bottom Bar (Qty + Add to Cart + Buy Now) */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarInner}>
          {/* Quantity Selector */}
          <View style={styles.qtyBox}>
            <Pressable
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
              style={({ pressed }) => [styles.qtyBtn, pressed && styles.btnPressed]}
            >
              <Ionicons name="remove" size={16} color={Colors.navy} />
            </Pressable>
            <Text style={styles.qtyText}>{quantity}</Text>
            <Pressable
              onPress={() => setQuantity(Math.min(part.stockQuantity, quantity + 1))}
              disabled={quantity >= part.stockQuantity}
              style={({ pressed }) => [
                styles.qtyBtn,
                quantity >= part.stockQuantity && styles.qtyBtnDisabled,
                pressed && styles.btnPressed,
              ]}
            >
              <Ionicons name="add" size={16} color={Colors.navy} />
            </Pressable>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Button
              title={addedToast ? 'Added to Cart!' : 'Add to Cart'}
              onPress={handleAddToCart}
              variant={addedToast ? 'whatsapp' : 'outline'}
              size="md"
              disabled={isOutOfStock}
              icon={
                <Ionicons
                  name={addedToast ? 'checkmark-circle' : 'cart'}
                  size={18}
                  color={addedToast ? '#FFFFFF' : Colors.primary}
                />
              }
              style={styles.cartActionBtn}
            />

            <Button
              title="Buy Now"
              onPress={handleBuyNow}
              variant="primary"
              size="md"
              disabled={isOutOfStock}
              style={styles.buyActionBtn}
            />
          </View>

          {/* WhatsApp Enquiry Icon Button */}
          <Pressable
            onPress={handleWhatsAppInquiry}
            style={({ pressed }) => [styles.whatsappIconBtn, pressed && styles.btnPressed]}
            accessibilityLabel="Enquire on WhatsApp"
          >
            <Ionicons name="logo-whatsapp" size={24} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
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
    paddingBottom: 110,
  },
  galleryCard: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 240,
    position: 'relative',
    marginBottom: 14,
    ...Shadows.card,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  galleryBadgeOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  infoCard: {
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  skuText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  partTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.navy,
    lineHeight: 24,
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  currentPrice: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.primary,
  },
  originalPrice: {
    fontSize: 12,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  sourcingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  sourcingText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  bold: {
    fontWeight: '700',
    color: Colors.navy,
  },
  compatCard: {
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.navy,
  },
  compatItemRow: {
    marginVertical: 6,
  },
  compatLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  compatTagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  compatTag: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: Radius.full,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  compatTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  modelTag: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primaryMuted,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  modelTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  descCard: {
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  descriptionBody: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
    marginBottom: 14,
  },
  specsTable: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  specKey: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  specVal: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.navy,
  },
  guaranteeCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    gap: 10,
  },
  guaranteeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  guaranteeText: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 12,
    ...Shadows.elevated,
  },
  bottomBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 44,
  },
  qtyBtn: {
    width: 32,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnDisabled: {
    opacity: 0.3,
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.navy,
    paddingHorizontal: 4,
  },
  actionButtons: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  cartActionBtn: {
    flex: 1,
  },
  buyActionBtn: {
    flex: 1,
  },
  whatsappIconBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.whatsapp,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.button,
  },
  btnPressed: {
    opacity: 0.7,
  },
});
