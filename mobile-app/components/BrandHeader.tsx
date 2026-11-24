import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { BrandLogo } from './BrandLogo';
import { useCart } from '../context/CartContext';

interface BrandHeaderProps {
  showSearch?: boolean;
  showCart?: boolean;
  showBack?: boolean;
  title?: string;
}

export const BrandHeader: React.FC<BrandHeaderProps> = ({
  showSearch = true,
  showCart = true,
  showBack = false,
  title,
}) => {
  const router = useRouter();
  const { itemCount } = useCart();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.header}>
        {showBack ? (
          <View style={styles.leftRow}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [styles.iconBtn, pressed && styles.btnPressed]}
              accessibilityLabel="Go back"
            >
              <Ionicons name="arrow-back" size={22} color={Colors.textInverse} />
            </Pressable>
            {title ? (
              <Text style={styles.headerTitle} numberOfLines={1}>
                {title}
              </Text>
            ) : (
              <BrandLogo variant="light" showSubtitle={false} />
            )}
          </View>
        ) : (
          <BrandLogo variant="light" />
        )}

        <View style={styles.actions}>
          {showSearch && (
            <Pressable
              onPress={() => router.push('/search')}
              style={({ pressed }) => [styles.iconBtn, pressed && styles.btnPressed]}
              accessibilityLabel="Search parts and services"
            >
              <Ionicons name="search" size={20} color={Colors.textInverse} />
            </Pressable>
          )}

          <Pressable
            onPress={() => router.push('/notifications')}
            style={({ pressed }) => [styles.iconBtn, pressed && styles.btnPressed]}
            accessibilityLabel="Notifications"
          >
            <Ionicons name="notifications-outline" size={20} color={Colors.textInverse} />
            <View style={styles.notifDot} />
          </Pressable>

          {showCart && (
            <Pressable
              onPress={() => router.push('/cart')}
              style={({ pressed }) => [styles.iconBtn, pressed && styles.btnPressed]}
              accessibilityLabel="Shopping Cart"
            >
              <Ionicons name="cart-outline" size={22} color={Colors.textInverse} />
              {itemCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{itemCount > 99 ? '99+' : itemCount}</Text>
                </View>
              )}
            </Pressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.navy,
  },
  header: {
    height: 60,
    backgroundColor: Colors.navy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.navyLight,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  headerTitle: {
    color: Colors.textInverse,
    fontSize: 17,
    fontWeight: '700',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.navyLight,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  btnPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: Colors.navy,
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.primary,
  },
});
