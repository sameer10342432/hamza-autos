import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SparePart } from '../types';
import { Colors } from '../constants/colors';
import { Radius, Shadows } from '../constants/theme';
import { Badge } from './Badge';
import { useCart } from '../context/CartContext';
import { getProductPlaceholder } from '../utils/assetHelper';

interface ProductCardProps {
  part: SparePart;
  onPress?: () => void;
  horizontal?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  part,
  onPress,
  horizontal = false,
}) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const isOutOfStock = part.stockQuantity <= 0;
  const isLowStock = part.stockQuantity > 0 && part.stockQuantity <= part.minStockAlert;

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/product/${part.id}`);
    }
  };

  const handleAddToCart = (e: any) => {
    e.stopPropagation?.();
    if (isOutOfStock) return;
    addToCart(part, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const currentPrice = part.discountedPrice || part.sellingPrice;
  const hasDiscount = part.discountedPrice && part.discountedPrice < part.sellingPrice;

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        horizontal ? styles.cardHorizontal : styles.cardVertical,
        pressed && styles.cardPressed,
      ]}
    >
      {/* Product Image */}
      <View style={horizontal ? styles.imageWrapHorizontal : styles.imageWrapVertical}>
        <Image
          source={getProductPlaceholder(part.category)}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Stock Badge */}
        <View style={styles.badgeOverlay}>
          {isOutOfStock ? (
            <Badge label="Out of Stock" variant="error" size="sm" />
          ) : isLowStock ? (
            <Badge label={`Only ${part.stockQuantity} left`} variant="warning" size="sm" />
          ) : (
            <Badge label="In Stock" variant="success" size="sm" />
          )}
        </View>
      </View>

      {/* Content */}
      <View style={styles.info}>
        <Text style={styles.sku}>SKU: {part.partNumber}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {part.partName}
        </Text>

        {/* Compatibility info */}
        <View style={styles.compatRow}>
          <Ionicons name="bicycle" size={12} color={Colors.primary} />
          <Text style={styles.compatText} numberOfLines={1}>
            {part.compatibleBrands.slice(0, 2).join(', ')} ({part.compatibleModels[0] || 'All'})
          </Text>
        </View>

        {/* Price & Action */}
        <View style={styles.bottomRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>PKR {currentPrice.toLocaleString()}</Text>
            {hasDiscount && (
              <Text style={styles.oldPrice}>PKR {part.sellingPrice.toLocaleString()}</Text>
            )}
          </View>

          <Pressable
            onPress={handleAddToCart}
            disabled={isOutOfStock}
            style={({ pressed }) => [
              styles.addBtn,
              isOutOfStock && styles.addBtnDisabled,
              justAdded && styles.addBtnSuccess,
              pressed && styles.btnPressed,
            ]}
          >
            <Ionicons
              name={justAdded ? 'checkmark' : 'cart-outline'}
              size={18}
              color="#FFFFFF"
            />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    ...Shadows.card,
  },
  cardVertical: {
    width: '100%',
    marginBottom: 14,
  },
  cardHorizontal: {
    width: 200,
    marginRight: 12,
  },
  cardPressed: {
    opacity: 0.93,
    transform: [{ scale: 0.99 }],
  },
  imageWrapVertical: {
    width: '100%',
    height: 140,
    backgroundColor: '#F1F5F9',
    position: 'relative',
  },
  imageWrapHorizontal: {
    width: '100%',
    height: 110,
    backgroundColor: '#F1F5F9',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  info: {
    padding: 12,
  },
  sku: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.navy,
    lineHeight: 18,
    minHeight: 36,
  },
  compatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    marginBottom: 8,
  },
  compatText: {
    fontSize: 11,
    color: Colors.textSecondary,
    flex: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  priceContainer: {
    flex: 1,
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primary,
  },
  oldPrice: {
    fontSize: 11,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnDisabled: {
    backgroundColor: Colors.textMuted,
  },
  addBtnSuccess: {
    backgroundColor: Colors.success,
  },
  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
});
