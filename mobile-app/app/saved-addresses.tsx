import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Badge } from '../components/Badge';
import { Colors } from '../constants/colors';
import { Radius } from '../constants/theme';
import { PAKISTAN_PROVINCES, PAKISTAN_MAJOR_CITIES } from '../data/initialData';
import { DeliveryAddress, PakistanProvince } from '../types';

export default function SavedAddressesScreen() {
  const { customer, addSavedAddress, removeSavedAddress } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);

  const [fullName, setFullName] = useState(customer?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(customer?.phoneNumber || '');
  const [province, setProvince] = useState<PakistanProvince>('Punjab');
  const [city, setCity] = useState('Lahore');
  const [streetAddress, setStreetAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const handleSave = async () => {
    if (!fullName.trim() || !phoneNumber.trim() || !streetAddress.trim()) {
      Alert.alert('Required Fields', 'Please fill in Name, Phone Number, and Street Address.');
      return;
    }

    const newAddr: DeliveryAddress = {
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      whatsappNumber: phoneNumber.trim(),
      province,
      city,
      streetAddress: streetAddress.trim(),
      postalCode: postalCode.trim() || undefined,
    };

    await addSavedAddress(newAddr);
    setShowAddForm(false);
    setStreetAddress('');
    setPostalCode('');
    Alert.alert('Address Saved', 'Your delivery address has been saved.');
  };

  const addresses = customer?.savedAddresses || [];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Delivery Addresses ({addresses.length})</Text>
          <Pressable
            onPress={() => setShowAddForm(!showAddForm)}
            style={styles.addBtn}
          >
            <Ionicons name="add-circle" size={16} color={Colors.primary} />
            <Text style={styles.addBtnText}>Add New</Text>
          </Pressable>
        </View>

        {/* Add Address Form */}
        {showAddForm && (
          <Card style={styles.formCard}>
            <Text style={styles.formTitle}>Add Pakistan Delivery Address</Text>

            <Input
              label="Recipient Name *"
              placeholder="e.g. Muhammad Hamza"
              value={fullName}
              onChangeText={setFullName}
            />

            <Input
              label="Mobile Phone Number *"
              placeholder="0325 1814548"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />

            <Text style={styles.fieldLabel}>Province *</Text>
            <View style={styles.chipsWrap}>
              {PAKISTAN_PROVINCES.map((p) => (
                <Pressable
                  key={p}
                  onPress={() => {
                    setProvince(p as PakistanProvince);
                    const defCity = PAKISTAN_MAJOR_CITIES[p]?.[0] || 'Lahore';
                    setCity(defCity);
                  }}
                  style={[
                    styles.chip,
                    province === p && styles.chipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      province === p && styles.chipTextActive,
                    ]}
                  >
                    {p}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.fieldLabel}>City *</Text>
            <View style={styles.chipsWrap}>
              {PAKISTAN_MAJOR_CITIES[province]?.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => setCity(c)}
                  style={[styles.chip, city === c && styles.chipActive]}
                >
                  <Text style={[styles.chipText, city === c && styles.chipTextActive]}>
                    {c}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Input
              label="Complete Street / House Address *"
              placeholder="House #, Street, Mohallah / Sector, Landmark"
              value={streetAddress}
              onChangeText={setStreetAddress}
              multiline
              numberOfLines={2}
            />

            <Input
              label="Postal Code (Optional)"
              placeholder="e.g. 54000"
              value={postalCode}
              onChangeText={setPostalCode}
              keyboardType="numeric"
            />

            <View style={styles.formActions}>
              <Button
                title="Cancel"
                onPress={() => setShowAddForm(false)}
                variant="outline"
                size="sm"
                style={{ flex: 1 }}
              />
              <Button
                title="Save Address"
                onPress={handleSave}
                variant="primary"
                size="sm"
                style={{ flex: 1, marginLeft: 10 }}
              />
            </View>
          </Card>
        )}

        {/* Addresses List */}
        {addresses.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Ionicons name="location-outline" size={36} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No Addresses Saved</Text>
            <Text style={styles.emptySub}>
              Save your frequent shipping destinations in Pakistan for instant 1-tap checkout.
            </Text>
            <Button
              title="Add Address Now"
              onPress={() => setShowAddForm(true)}
              variant="outline"
              size="sm"
              style={{ marginTop: 12 }}
            />
          </Card>
        ) : (
          addresses.map((addr, idx) => (
            <Card key={idx} style={styles.addrCard} padding={14}>
              <View style={styles.addrHeader}>
                <View style={styles.addrNameRow}>
                  <Text style={styles.addrName}>{addr.fullName}</Text>
                  {idx === 0 && <Badge label="Default" variant="primary" size="sm" />}
                </View>
                <Pressable
                  onPress={() => removeSavedAddress(idx)}
                  style={styles.delBtn}
                >
                  <Ionicons name="trash-outline" size={16} color={Colors.error} />
                </Pressable>
              </View>

              <Text style={styles.addrStreet}>{addr.streetAddress}</Text>
              <Text style={styles.addrCity}>
                {addr.city}, {addr.province} {addr.postalCode ? `(${addr.postalCode})` : ''}
              </Text>
              <Text style={styles.addrPhone}>Contact: {addr.phoneNumber}</Text>
            </Card>
          ))
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
  headerRow: {
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
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  formTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.navy,
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.navy,
    marginBottom: 6,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  chip: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: Radius.sm,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: Colors.navy,
    borderColor: Colors.navy,
  },
  chipText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  formActions: {
    flexDirection: 'row',
    marginTop: 6,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.navy,
    marginTop: 8,
  },
  emptySub: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
  },
  addrCard: {
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  addrHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  addrNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addrName: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.navy,
  },
  delBtn: {
    padding: 4,
  },
  addrStreet: {
    fontSize: 12,
    color: Colors.textPrimary,
    lineHeight: 16,
  },
  addrCity: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: '600',
  },
  addrPhone: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 4,
  },
});
