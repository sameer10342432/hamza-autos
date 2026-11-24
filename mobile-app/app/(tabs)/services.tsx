import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Linking,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BrandHeader } from '../../components/BrandHeader';
import { ServiceCard } from '../../components/ServiceCard';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Colors } from '../../constants/colors';
import { Radius, Shadows } from '../../constants/theme';
import { WORKSHOP_SERVICES, BUSINESS_INFO } from '../../data/initialData';

const SERVICE_CATEGORIES = [
  'All Services',
  'Engine & Mechanical',
  'Performance & Tuning',
  'Routine Servicing',
  'General Maintenance',
  'Electrical Work',
  'Brake Repair',
  'Clutch Repair',
  'Tyre & Puncture',
  'Bike Modification',
];

export default function ServicesScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All Services');

  const filteredServices = WORKSHOP_SERVICES.filter((s) => {
    if (selectedCategory === 'All Services') return true;
    return s.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  const handleDirections = () => {
    Linking.openURL(BUSINESS_INFO.googleMapsUrl);
  };

  return (
    <View style={styles.container}>
      <BrandHeader title="Workshop Services" showSearch showCart />

      {/* Workshop Location Notice Banner */}
      <View style={styles.locationBanner}>
        <View style={styles.locationIconWrap}>
          <Ionicons name="location" size={18} color={Colors.primary} />
        </View>
        <View style={styles.locationTextWrap}>
          <Text style={styles.locationTitle}>Badami Bagh, Lahore Workshop</Text>
          <Text style={styles.locationSubtitle}>
            Abu Bakar Road, Near Ali Hajvery Marriage Hall · Open 7 Days
          </Text>
        </View>
        <Pressable onPress={handleDirections} style={styles.mapBtn}>
          <Text style={styles.mapBtnText}>Map</Text>
        </Pressable>
      </View>

      {/* Service Category Filters */}
      <View style={styles.categoryBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {SERVICE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[styles.catChip, isSelected && styles.catChipActive]}
              >
                <Text style={[styles.catChipText, isSelected && styles.catChipTextActive]}>
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Services List */}
      <FlatList
        data={filteredServices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ServiceCard service={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.headerCount}>
              Showing <Text style={styles.boldText}>{filteredServices.length}</Text> Specialized Workshop Services
            </Text>
          </View>
        }
        ListFooterComponent={
          <Card style={styles.customJobCard}>
            <MaterialCommunityIcons name="tools" size={32} color={Colors.primary} />
            <Text style={styles.customTitle}>Custom Motorcycle Problem or Project?</Text>
            <Text style={styles.customDesc}>
              Visit our Badami Bagh workshop directly for free inspection by Master Mechanic Hamza.
            </Text>
            <Button
              title="Book Inspection Appointment"
              onPress={() => router.push('/repair-booking')}
              variant="primary"
              size="sm"
              icon={<Ionicons name="calendar" size={16} color="#FFFFFF" />}
              style={styles.customBtn}
            />
          </Card>
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
  locationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 10,
  },
  locationIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationTextWrap: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.navy,
  },
  locationSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  mapBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: Radius.md,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  mapBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.navy,
  },
  categoryBar: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  catChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: Radius.full,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  catChipActive: {
    backgroundColor: Colors.navy,
    borderColor: Colors.navy,
  },
  catChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  catChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  listHeader: {
    paddingVertical: 12,
  },
  headerCount: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  boldText: {
    fontWeight: '700',
    color: Colors.navy,
  },
  customJobCard: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    textAlign: 'center',
    padding: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.card,
  },
  customTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.navy,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  customDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 17,
    maxWidth: 290,
    marginBottom: 16,
  },
  customBtn: {
    width: '100%',
  },
});
