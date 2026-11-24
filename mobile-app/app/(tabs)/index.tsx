import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Linking,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { BrandHeader } from '../../components/BrandHeader';
import { ProductCard } from '../../components/ProductCard';
import { ServiceCard } from '../../components/ServiceCard';
import { CompatibilityFinder } from '../../components/CompatibilityFinder';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Card } from '../../components/Card';
import { Colors } from '../../constants/colors';
import { Radius, Shadows } from '../../constants/theme';
import {
  BUSINESS_INFO,
  MOTORCYCLE_BRANDS,
  WORKSHOP_SERVICES,
  INITIAL_SPARE_PARTS,
} from '../../data/initialData';
import { HERO_IMAGE, BRAND_IMAGES } from '../../utils/assetHelper';
import { MobileApiService } from '../../services/api';
import { useGarage } from '../../context/GarageContext';
import { useAuth } from '../../context/AuthContext';
import { SparePart } from '../../types';

export default function HomeScreen() {
  const router = useRouter();
  const { activeBike, reminders } = useGarage();
  const { customer } = useAuth();
  const [products, setProducts] = useState<SparePart[]>(INITIAL_SPARE_PARTS);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const res = await MobileApiService.getProducts();
      if (res.success && res.data) {
        setProducts(res.data);
      }
    } catch (err) {
      console.warn('Error loading products on home:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      'Assalam-o-Alaikum Hamza Autos! I need information about motorcycle repair / spare parts.'
    );
    Linking.openURL(`https://wa.me/${BUSINESS_INFO.whatsappRaw}?text=${text}`);
  };

  const pendingReminders = reminders.filter((r) => !r.isCompleted);

  return (
    <View style={styles.container}>
      <BrandHeader showSearch showCart />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Welcome Bar */}
        <View style={styles.welcomeBar}>
          <View style={styles.welcomeLeft}>
            <Text style={styles.welcomeSub}>Welcome back to Hamza Autos,</Text>
            <Text style={styles.welcomeName}>
              {customer?.name || 'Rider & Motorcycle Enthusiast'}
            </Text>
          </View>
          <Pressable
            onPress={() => router.push('/support')}
            style={styles.callBadge}
          >
            <Ionicons name="call" size={13} color="#FFFFFF" />
            <Text style={styles.callBadgeText}>Hotline</Text>
          </Pressable>
        </View>

        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <Image source={HERO_IMAGE} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <View style={styles.heroTag}>
              <View style={styles.livePulse} />
              <Text style={styles.heroTagText}>BADAMI BAGH, LAHORE WORKSHOP</Text>
            </View>
            <Text style={styles.heroTitle}>
              Master Motorcycle Repair & Genuine Spare Parts
            </Text>
            <Text style={styles.heroSubtitle}>
              Engine overhauls, high-mileage tuning, genuine parts and courier delivery across Pakistan.
            </Text>

            <View style={styles.heroActions}>
              <Button
                title="Book Service"
                onPress={() => router.push('/repair-booking')}
                variant="primary"
                size="sm"
                icon={<Ionicons name="calendar-outline" size={16} color="#FFFFFF" />}
              />
              <Button
                title="Shop Parts"
                onPress={() => router.push('/(tabs)/shop')}
                variant="outline"
                size="sm"
                style={styles.heroSecondaryBtn}
                textStyle={{ color: '#FFFFFF' }}
              />
            </View>
          </View>
        </View>

        {/* Quick Access Action Cards */}
        <View style={styles.quickActionsGrid}>
          <Pressable
            onPress={() => router.push('/repair-tracking')}
            style={({ pressed }) => [styles.quickActionCard, pressed && styles.pressed]}
          >
            <View style={[styles.quickIconWrap, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="analytics" size={22} color={Colors.info} />
            </View>
            <Text style={styles.quickActionTitle}>Track Repair</Text>
            <Text style={styles.quickActionSub}>Job card & timeline</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/repair-booking')}
            style={({ pressed }) => [styles.quickActionCard, pressed && styles.pressed]}
          >
            <View style={[styles.quickIconWrap, { backgroundColor: Colors.primaryMuted }]}>
              <Ionicons name="construct" size={22} color={Colors.primary} />
            </View>
            <Text style={styles.quickActionTitle}>Book Repair</Text>
            <Text style={styles.quickActionSub}>Badami Bagh Bay</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/my-garage')}
            style={({ pressed }) => [styles.quickActionCard, pressed && styles.pressed]}
          >
            <View style={[styles.quickIconWrap, { backgroundColor: '#ECFDF5' }]}>
              <MaterialCommunityIcons name="motorbike" size={24} color={Colors.success} />
            </View>
            <Text style={styles.quickActionTitle}>My Garage</Text>
            <Text style={styles.quickActionSub}>Bikes & alerts</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/order-tracking')}
            style={({ pressed }) => [styles.quickActionCard, pressed && styles.pressed]}
          >
            <View style={[styles.quickIconWrap, { backgroundColor: '#FFFBEB' }]}>
              <Ionicons name="cube" size={22} color={Colors.gold} />
            </View>
            <Text style={styles.quickActionTitle}>Track Order</Text>
            <Text style={styles.quickActionSub}>Courier delivery</Text>
          </Pressable>
        </View>

        {/* Active Bike & Maintenance Alert Card */}
        {activeBike && (
          <Card style={styles.garageCard} padding={14}>
            <View style={styles.garageHeader}>
              <View style={styles.garageLeft}>
                <View style={styles.bikeIconBox}>
                  <MaterialCommunityIcons name="motorbike" size={20} color={Colors.primary} />
                </View>
                <View>
                  <Text style={styles.garageBikeName}>
                    {activeBike.brand} {activeBike.model}
                  </Text>
                  <Text style={styles.garageBikeReg}>
                    {activeBike.registrationNumber || 'Registered in Garage'} · {activeBike.mileageKm || 0} km
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={() => router.push('/my-garage')}
                style={styles.garageManageBtn}
              >
                <Text style={styles.garageManageText}>Manage</Text>
                <Ionicons name="chevron-forward" size={14} color={Colors.primary} />
              </Pressable>
            </View>

            {pendingReminders.length > 0 && (
              <View style={styles.reminderBanner}>
                <Ionicons name="alert-circle" size={16} color={Colors.warning} />
                <Text style={styles.reminderText} numberOfLines={1}>
                  Next: {pendingReminders[0].title}
                </Text>
                <Badge label="Due Soon" variant="warning" size="sm" />
              </View>
            )}
          </Card>
        )}

        {/* Motorcycle Compatibility Finder Component */}
        <CompatibilityFinder parts={products} />

        {/* Motorcycle Brands Showcase */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Supported Brands</Text>
            <Text style={styles.sectionSubtitle}>
              Specialized mechanics & spare parts for all major makes
            </Text>
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.brandsScroll}
        >
          {MOTORCYCLE_BRANDS.map((brand) => (
            <Pressable
              key={brand}
              onPress={() => router.push({ pathname: '/(tabs)/shop', params: { brand } })}
              style={({ pressed }) => [styles.brandCard, pressed && styles.pressed]}
            >
              <View style={styles.brandImageWrap}>
                <Image
                  source={BRAND_IMAGES[brand] || BRAND_IMAGES['Honda']}
                  style={styles.brandImage}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.brandName}>{brand}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Featured Spare Parts */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Featured Spare Parts</Text>
            <Text style={styles.sectionSubtitle}>
              Genuine and tested components in stock for immediate dispatch
            </Text>
          </View>
          <Pressable onPress={() => router.push('/(tabs)/shop')}>
            <Text style={styles.seeAllText}>See All</Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalProducts}
        >
          {products.slice(0, 6).map((part) => (
            <ProductCard key={part.id} part={part} horizontal />
          ))}
        </ScrollView>

        {/* Workshop Services Highlights */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Workshop Services</Text>
            <Text style={styles.sectionSubtitle}>
              Professional motorcycle service bays in Badami Bagh, Lahore
            </Text>
          </View>
          <Pressable onPress={() => router.push('/(tabs)/services')}>
            <Text style={styles.seeAllText}>All Services</Text>
          </Pressable>
        </View>

        {WORKSHOP_SERVICES.slice(0, 4).map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}

        {/* Pakistan-Wide Delivery Assurance Card */}
        <Card style={styles.deliveryCard}>
          <View style={styles.deliveryRow}>
            <View style={styles.deliveryIcon}>
              <FontAwesome5 name="shipping-fast" size={24} color={Colors.primary} />
            </View>
            <View style={styles.deliveryTextWrap}>
              <Text style={styles.deliveryTitle}>Pakistan-Wide Delivery</Text>
              <Text style={styles.deliveryBody}>
                Fast courier dispatch via TCS, Leopards & M&P across Punjab, Sindh, KPK, Balochistan, Islamabad, GB & AJK.
              </Text>
            </View>
          </View>
          <View style={styles.deliveryBadges}>
            <Badge label="Cash on Delivery" variant="success" size="sm" />
            <Badge label="Verified Fitment" variant="info" size="sm" />
            <Badge label="Careful Packaging" variant="neutral" size="sm" />
          </View>
        </Card>

        {/* WhatsApp & Workshop Direct Support */}
        <Card style={styles.whatsappCard}>
          <View style={styles.whatsappLeft}>
            <Ionicons name="logo-whatsapp" size={32} color="#FFFFFF" />
            <View style={styles.whatsappTextWrap}>
              <Text style={styles.whatsappTitle}>Need Help or Custom Sourcing?</Text>
              <Text style={styles.whatsappDesc}>
                Chat directly with Hamza Autos Master Mechanics on WhatsApp
              </Text>
            </View>
          </View>
          <Button
            title="Chat on WhatsApp"
            onPress={handleWhatsApp}
            variant="whatsapp"
            size="md"
            icon={<Ionicons name="chatbubbles" size={18} color="#FFFFFF" />}
            style={styles.whatsappBtn}
          />
        </Card>
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
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  welcomeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  welcomeLeft: {
    flex: 1,
  },
  welcomeSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  welcomeName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.navy,
  },
  callBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.navy,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: Radius.full,
  },
  callBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  heroBanner: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
    height: 220,
    position: 'relative',
    marginBottom: 16,
    ...Shadows.elevated,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(16, 24, 43, 0.78)',
  },
  heroContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 18,
    justifyContent: 'center',
  },
  heroTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(230, 0, 18, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(230, 0, 18, 0.6)',
    borderRadius: Radius.full,
    paddingVertical: 3,
    paddingHorizontal: 9,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  livePulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  heroTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 25,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 12,
    color: '#E2E8F0',
    lineHeight: 16,
    marginBottom: 14,
  },
  heroActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heroSecondaryBtn: {
    borderColor: '#FFFFFF',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.card,
  },
  quickIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.navy,
    textAlign: 'center',
  },
  quickActionSub: {
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  garageCard: {
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  garageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  garageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  bikeIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  garageBikeName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.navy,
  },
  garageBikeReg: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  garageManageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  garageManageText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  reminderBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.warningLight,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: Radius.md,
    marginTop: 10,
  },
  reminderText: {
    flex: 1,
    fontSize: 11,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 18,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.navy,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  brandsScroll: {
    gap: 12,
    paddingVertical: 4,
  },
  brandCard: {
    width: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    paddingBottom: 8,
    ...Shadows.card,
  },
  brandImageWrap: {
    width: '100%',
    height: 65,
    backgroundColor: '#F1F5F9',
  },
  brandImage: {
    width: '100%',
    height: '100%',
  },
  brandName: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.navy,
    marginTop: 6,
    textAlign: 'center',
  },
  horizontalProducts: {
    paddingVertical: 4,
    gap: 12,
  },
  deliveryCard: {
    marginVertical: 14,
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  deliveryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryTextWrap: {
    flex: 1,
  },
  deliveryTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.navy,
    marginBottom: 3,
  },
  deliveryBody: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  deliveryBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  whatsappCard: {
    backgroundColor: Colors.navy,
    borderColor: Colors.navyLight,
    padding: 16,
    marginTop: 6,
  },
  whatsappLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  whatsappTextWrap: {
    flex: 1,
  },
  whatsappTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  whatsappDesc: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 16,
  },
  whatsappBtn: {
    width: '100%',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
