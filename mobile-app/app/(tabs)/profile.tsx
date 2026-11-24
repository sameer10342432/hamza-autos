import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { BrandHeader } from '../../components/BrandHeader';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Colors } from '../../constants/colors';
import { Radius, Shadows } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useGarage } from '../../context/GarageContext';
import { BUSINESS_INFO } from '../../data/initialData';

export default function ProfileScreen() {
  const router = useRouter();
  const { customer, isAuthenticated, login, logout } = useAuth();
  const { bikes } = useGarage();

  const [phoneInput, setPhoneInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLoginSubmit = async () => {
    if (!phoneInput.trim()) {
      Alert.alert('Required', 'Please enter your Pakistani mobile phone number.');
      return;
    }
    setIsLoggingIn(true);
    const ok = await login(phoneInput, nameInput || undefined);
    setIsLoggingIn(false);
    if (!ok) {
      Alert.alert('Error', 'Unable to log in. Please try again.');
    }
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out of Hamza Autos?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  const handleCallHotline = () => {
    Linking.openURL(`tel:${BUSINESS_INFO.phoneRaw}`);
  };

  const handleWhatsApp = () => {
    Linking.openURL(`https://wa.me/${BUSINESS_INFO.whatsappRaw}`);
  };

  return (
    <View style={styles.container}>
      <BrandHeader title="Rider Profile" showSearch={false} showCart />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info / Login Card */}
        {isAuthenticated && customer ? (
          <Card style={styles.userCard}>
            <View style={styles.userRow}>
              <View style={styles.avatarCircle}>
                <Ionicons name="person" size={28} color="#FFFFFF" />
              </View>
              <View style={styles.userTextWrap}>
                <Text style={styles.userName}>{customer.name}</Text>
                <Text style={styles.userPhone}>{customer.phoneNumber}</Text>
                <Text style={styles.userArea}>
                  {customer.area || 'Badami Bagh, Lahore'}
                </Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statVal}>{bikes.length}</Text>
                <Text style={styles.statLabel}>My Bikes</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statVal}>Active</Text>
                <Text style={styles.statLabel}>Workshop</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statVal}>Gold</Text>
                <Text style={styles.statLabel}>Rider Tier</Text>
              </View>
            </View>
          </Card>
        ) : (
          <Card style={styles.loginCard}>
            <View style={styles.loginHeader}>
              <MaterialCommunityIcons name="shield-account" size={32} color={Colors.primary} />
              <Text style={styles.loginTitle}>Customer Login & Verification</Text>
              <Text style={styles.loginSub}>
                Enter your mobile number to view saved motorcycles, repair history and orders.
              </Text>
            </View>

            <Input
              label="Mobile Number (03xx xxxxxxx)"
              placeholder="0325 1814548"
              value={phoneInput}
              onChangeText={setPhoneInput}
              keyboardType="phone-pad"
              leftIcon={<Ionicons name="call-outline" size={18} color={Colors.navy} />}
            />

            <Input
              label="Your Full Name (Optional)"
              placeholder="e.g. Muhammad Hamza"
              value={nameInput}
              onChangeText={setNameInput}
              leftIcon={<Ionicons name="person-outline" size={18} color={Colors.navy} />}
            />

            <Button
              title="Verify & Continue"
              onPress={handleLoginSubmit}
              loading={isLoggingIn}
              variant="primary"
              size="md"
              fullWidth
            />
          </Card>
        )}

        {/* Profile Menu Actions */}
        <Text style={styles.menuGroupTitle}>Motorcycle & Workshop</Text>
        <Card padding={0} style={styles.menuCard}>
          <Pressable
            onPress={() => router.push('/my-garage')}
            style={({ pressed }) => [styles.menuItem, pressed && styles.itemPressed]}
          >
            <View style={[styles.menuIconWrap, { backgroundColor: '#ECFDF5' }]}>
              <MaterialCommunityIcons name="motorbike" size={20} color={Colors.success} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuText}>My Garage</Text>
              <Text style={styles.menuSub}>{bikes.length} saved motorcycles</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </Pressable>

          <View style={styles.menuDivider} />

          <Pressable
            onPress={() => router.push('/bike-health')}
            style={({ pressed }) => [styles.menuItem, pressed && styles.itemPressed]}
          >
            <View style={[styles.menuIconWrap, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="fitness" size={20} color={Colors.info} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuText}>Bike Health Report</Text>
              <Text style={styles.menuSub}>Compression, brakes, chain health</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </Pressable>

          <View style={styles.menuDivider} />

          <Pressable
            onPress={() => router.push('/repair-tracking')}
            style={({ pressed }) => [styles.menuItem, pressed && styles.itemPressed]}
          >
            <View style={[styles.menuIconWrap, { backgroundColor: Colors.primaryMuted }]}>
              <Ionicons name="construct" size={20} color={Colors.primary} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuText}>Track Active Repair</Text>
              <Text style={styles.menuSub}>Job card number & live status</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </Pressable>
        </Card>

        {/* Orders & Addresses */}
        <Text style={styles.menuGroupTitle}>Shopping & Addresses</Text>
        <Card padding={0} style={styles.menuCard}>
          <Pressable
            onPress={() => router.push('/(tabs)/orders')}
            style={({ pressed }) => [styles.menuItem, pressed && styles.itemPressed]}
          >
            <View style={[styles.menuIconWrap, { backgroundColor: '#FFFBEB' }]}>
              <Ionicons name="receipt" size={20} color={Colors.gold} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuText}>Order History</Text>
              <Text style={styles.menuSub}>Past spare parts orders</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </Pressable>

          <View style={styles.menuDivider} />

          <Pressable
            onPress={() => router.push('/saved-addresses')}
            style={({ pressed }) => [styles.menuItem, pressed && styles.itemPressed]}
          >
            <View style={[styles.menuIconWrap, { backgroundColor: '#F1F5F9' }]}>
              <Ionicons name="location" size={20} color={Colors.navy} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuText}>Saved Delivery Addresses</Text>
              <Text style={styles.menuSub}>Pakistan addresses & postal codes</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </Pressable>
        </Card>

        {/* Support & Legal */}
        <Text style={styles.menuGroupTitle}>Support & Workshop Location</Text>
        <Card padding={0} style={styles.menuCard}>
          <Pressable
            onPress={() => router.push('/support')}
            style={({ pressed }) => [styles.menuItem, pressed && styles.itemPressed]}
          >
            <View style={[styles.menuIconWrap, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="headset" size={20} color={Colors.success} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuText}>Customer Support & Hotline</Text>
              <Text style={styles.menuSub}>{BUSINESS_INFO.phone}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </Pressable>

          <View style={styles.menuDivider} />

          <Pressable
            onPress={handleWhatsApp}
            style={({ pressed }) => [styles.menuItem, pressed && styles.itemPressed]}
          >
            <View style={[styles.menuIconWrap, { backgroundColor: '#DCFCE7' }]}>
              <Ionicons name="logo-whatsapp" size={20} color={Colors.whatsapp} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuText}>WhatsApp Mechanics Desk</Text>
              <Text style={styles.menuSub}>Chat with Badami Bagh team</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </Pressable>

          <View style={styles.menuDivider} />

          <Pressable
            onPress={handleCallHotline}
            style={({ pressed }) => [styles.menuItem, pressed && styles.itemPressed]}
          >
            <View style={[styles.menuIconWrap, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="call" size={20} color={Colors.primary} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuText}>Direct Phone Call</Text>
              <Text style={styles.menuSub}>Call workshop during business hours</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </Pressable>
        </Card>

        {/* Logout Button if authenticated */}
        {isAuthenticated && (
          <Button
            title="Log Out"
            onPress={handleLogout}
            variant="outline"
            size="md"
            icon={<Ionicons name="log-out-outline" size={18} color={Colors.primary} />}
            style={styles.logoutBtn}
          />
        )}

        {/* App Version Info */}
        <View style={styles.footerInfo}>
          <Text style={styles.versionText}>Hamza Autos Mobile v1.0.0</Text>
          <Text style={styles.copyrightText}>
            © 2026 Hamza Autos. Badami Bagh, Lahore, Pakistan. All rights reserved.
          </Text>
        </View>
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
    paddingTop: 12,
    paddingBottom: 30,
  },
  userCard: {
    backgroundColor: Colors.navy,
    marginBottom: 16,
    borderWidth: 0,
    ...Shadows.elevated,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userTextWrap: {
    flex: 1,
  },
  userName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userPhone: {
    fontSize: 13,
    color: '#CBD5E1',
    marginTop: 2,
  },
  userArea: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.navyLight,
    borderRadius: Radius.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#334155',
  },
  loginCard: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  loginHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  loginTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.navy,
    marginTop: 8,
    textAlign: 'center',
  },
  loginSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
  },
  menuGroupTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 10,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    ...Shadows.card,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: {
    flex: 1,
  },
  menuText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.navy,
  },
  menuSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 62,
  },
  itemPressed: {
    backgroundColor: '#F8FAFC',
  },
  logoutBtn: {
    marginTop: 8,
    marginBottom: 16,
  },
  footerInfo: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  copyrightText: {
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 14,
  },
});
