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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useGarage } from '../context/GarageContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Colors } from '../constants/colors';
import { Radius, Shadows } from '../constants/theme';
import { MOTORCYCLE_BRANDS, MOTORCYCLE_MODELS } from '../data/initialData';
import { BikeBrand, SavedMotorcycle } from '../types';

export default function MyGarageScreen() {
  const router = useRouter();
  const {
    bikes,
    reminders,
    activeBike,
    setActiveBike,
    addBike,
    removeBike,
    toggleReminder,
    deleteReminder,
  } = useGarage();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newBrand, setNewBrand] = useState<BikeBrand>('Honda');
  const [newModel, setNewModel] = useState('CD 70');
  const [newYear, setNewYear] = useState('2023');
  const [newReg, setNewReg] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const [newMileage, setNewMileage] = useState('8500');

  const handleAddBike = async () => {
    if (!newBrand || !newModel) {
      Alert.alert('Required', 'Please select motorcycle brand and model.');
      return;
    }

    await addBike({
      brand: newBrand,
      model: newModel,
      year: newYear || undefined,
      registrationNumber: newReg.trim() || undefined,
      nickname: newNickname.trim() || undefined,
      mileageKm: Number(newMileage) || 0,
    });

    setShowAddModal(false);
    setNewReg('');
    setNewNickname('');
    Alert.alert('Motorcycle Added', `${newBrand} ${newModel} added to your garage!`);
  };

  const handleDeleteBike = (bike: SavedMotorcycle) => {
    Alert.alert(
      'Remove Bike',
      `Are you sure you want to remove ${bike.brand} ${bike.model} from your garage?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeBike(bike.id),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Active Bike Banner Card */}
        {activeBike && (
          <Card style={styles.activeBikeCard}>
            <View style={styles.activeBikeTop}>
              <View style={styles.bikeIconWrap}>
                <MaterialCommunityIcons name="motorbike" size={26} color="#FFFFFF" />
              </View>
              <View style={styles.bikeInfoCol}>
                <View style={styles.activeLabelRow}>
                  <Text style={styles.activeLabel}>ACTIVE VEHICLE</Text>
                  <Badge label="Primary" variant="success" size="sm" />
                </View>
                <Text style={styles.activeBikeName}>
                  {activeBike.brand} {activeBike.model}
                </Text>
                <Text style={styles.activeBikeSub}>
                  {activeBike.registrationNumber || 'No Plate Added'} · Model {activeBike.year || '2023'}
                </Text>
              </View>
            </View>

            <View style={styles.mileageRow}>
              <View style={styles.mileageBox}>
                <Text style={styles.mileageVal}>{activeBike.mileageKm || 0} km</Text>
                <Text style={styles.mileageLabel}>Odometer</Text>
              </View>
              <View style={styles.mileageDivider} />
              <View style={styles.mileageBox}>
                <Text style={styles.mileageVal}>
                  {reminders.filter((r) => r.bikeId === activeBike.id && !r.isCompleted).length}
                </Text>
                <Text style={styles.mileageLabel}>Alerts Due</Text>
              </View>
              <View style={styles.mileageDivider} />
              <View style={styles.mileageBox}>
                <Pressable
                  onPress={() => router.push('/bike-health')}
                  style={styles.healthBtn}
                >
                  <Text style={styles.healthBtnText}>View Health</Text>
                  <Ionicons name="chevron-forward" size={12} color={Colors.primary} />
                </Pressable>
              </View>
            </View>
          </Card>
        )}

        {/* All Garage Bikes Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>My Motorcycles ({bikes.length})</Text>
          <Pressable
            onPress={() => setShowAddModal(!showAddModal)}
            style={styles.addBikeBtn}
          >
            <Ionicons name="add-circle" size={16} color={Colors.primary} />
            <Text style={styles.addBikeText}>Add Bike</Text>
          </Pressable>
        </View>

        {/* Add Bike Form (Expandable) */}
        {showAddModal && (
          <Card style={styles.addBikeCard}>
            <Text style={styles.addCardTitle}>Register Motorcycle in Garage</Text>

            <Text style={styles.inputLabel}>Select Brand *</Text>
            <View style={styles.brandChipsWrap}>
              {MOTORCYCLE_BRANDS.map((b) => (
                <Pressable
                  key={b}
                  onPress={() => {
                    setNewBrand(b);
                    const first = MOTORCYCLE_MODELS.find((m) => m.brand === b);
                    if (first) setNewModel(first.name);
                  }}
                  style={[
                    styles.brandChip,
                    newBrand === b && styles.brandChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.brandChipText,
                      newBrand === b && styles.brandChipTextActive,
                    ]}
                  >
                    {b}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.inputLabel}>Select Model *</Text>
            <View style={styles.brandChipsWrap}>
              {MOTORCYCLE_MODELS.filter((m) => m.brand === newBrand).map((m) => (
                <Pressable
                  key={m.id}
                  onPress={() => setNewModel(m.name)}
                  style={[
                    styles.modelChip,
                    newModel === m.name && styles.modelChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.modelChipText,
                      newModel === m.name && styles.modelChipTextActive,
                    ]}
                  >
                    {m.name}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Input
              label="Registration Number (e.g. LEN-23-4412)"
              placeholder="LEN-23-4412"
              value={newReg}
              onChangeText={setNewReg}
              autoCapitalize="characters"
            />

            <View style={styles.rowInputs}>
              <View style={{ flex: 1 }}>
                <Input
                  label="Model Year"
                  placeholder="2023"
                  value={newYear}
                  onChangeText={setNewYear}
                  keyboardType="numeric"
                />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Input
                  label="Current Mileage (km)"
                  placeholder="8500"
                  value={newMileage}
                  onChangeText={setNewMileage}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.addActionsRow}>
              <Button
                title="Cancel"
                onPress={() => setShowAddModal(false)}
                variant="outline"
                size="sm"
                style={{ flex: 1 }}
              />
              <Button
                title="Save Motorcycle"
                onPress={handleAddBike}
                variant="primary"
                size="sm"
                style={{ flex: 1, marginLeft: 10 }}
              />
            </View>
          </Card>
        )}

        {/* Bikes List */}
        {bikes.map((bike) => {
          const isActive = activeBike?.id === bike.id;
          return (
            <Card key={bike.id} style={styles.bikeItemCard} padding={12}>
              <Pressable
                onPress={() => setActiveBike(bike)}
                style={styles.bikeItemRow}
              >
                <View style={styles.bikeIconCol}>
                  <MaterialCommunityIcons
                    name="motorbike"
                    size={22}
                    color={isActive ? Colors.primary : Colors.navy}
                  />
                </View>

                <View style={styles.bikeDetailsCol}>
                  <Text style={styles.bikeItemName}>
                    {bike.brand} {bike.model}
                  </Text>
                  <Text style={styles.bikeItemSub}>
                    {bike.registrationNumber || 'No plate'} · {bike.year || '2023'}
                  </Text>
                </View>

                {isActive ? (
                  <Badge label="Selected" variant="primary" size="sm" />
                ) : (
                  <Pressable
                    onPress={() => setActiveBike(bike)}
                    style={styles.selectBtn}
                  >
                    <Text style={styles.selectBtnText}>Switch</Text>
                  </Pressable>
                )}

                {bikes.length > 1 && (
                  <Pressable
                    onPress={() => handleDeleteBike(bike)}
                    style={styles.deleteBikeBtn}
                  >
                    <Ionicons name="trash-outline" size={16} color={Colors.error} />
                  </Pressable>
                )}
              </Pressable>
            </Card>
          );
        })}

        {/* Maintenance Reminders Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Maintenance Reminders</Text>
          <Badge label={`${reminders.filter((r) => !r.isCompleted).length} Due`} variant="warning" size="sm" />
        </View>

        {reminders.map((rem) => (
          <Card key={rem.id} style={styles.reminderCard} padding={12}>
            <View style={styles.reminderRow}>
              <Pressable
                onPress={() => toggleReminder(rem.id)}
                style={styles.checkboxTouch}
              >
                <Ionicons
                  name={rem.isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
                  size={22}
                  color={rem.isCompleted ? Colors.success : Colors.textMuted}
                />
              </Pressable>

              <View style={styles.reminderContent}>
                <Text
                  style={[
                    styles.reminderTitle,
                    rem.isCompleted && styles.reminderCompleted,
                  ]}
                >
                  {rem.title}
                </Text>
                <Text style={styles.reminderSub}>
                  {rem.bikeName} · Due: {rem.dueDate} {rem.dueKm ? `(${rem.dueKm} km)` : ''}
                </Text>
              </View>

              <Pressable
                onPress={() => deleteReminder(rem.id)}
                style={styles.remDeleteBtn}
              >
                <Ionicons name="close" size={16} color={Colors.textMuted} />
              </Pressable>
            </View>
          </Card>
        ))}

        {/* Book Service Quick Action */}
        <Button
          title="Book Badami Bagh Workshop Service"
          onPress={() => router.push('/repair-booking')}
          variant="primary"
          size="md"
          fullWidth
          icon={<Ionicons name="calendar-outline" size={16} color="#FFFFFF" />}
          style={styles.bookBtn}
        />
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
  activeBikeCard: {
    backgroundColor: Colors.navy,
    marginBottom: 16,
    ...Shadows.elevated,
  },
  activeBikeTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bikeIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bikeInfoCol: {
    flex: 1,
  },
  activeLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  activeLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  activeBikeName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  activeBikeSub: {
    fontSize: 11,
    color: '#CBD5E1',
    marginTop: 1,
  },
  mileageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.navyLight,
    borderRadius: Radius.md,
    paddingVertical: 10,
    marginTop: 14,
  },
  mileageBox: {
    flex: 1,
    alignItems: 'center',
  },
  mileageVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  mileageLabel: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  mileageDivider: {
    width: 1,
    height: 22,
    backgroundColor: '#334155',
  },
  healthBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: Colors.primaryMuted,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: Radius.sm,
  },
  healthBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.navy,
  },
  addBikeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addBikeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  addBikeCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  addCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.navy,
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.navy,
    marginBottom: 6,
  },
  brandChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  brandChip: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: Radius.sm,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  brandChipActive: {
    backgroundColor: Colors.navy,
    borderColor: Colors.navy,
  },
  brandChipText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  brandChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  modelChip: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: Radius.xs,
    backgroundColor: '#F1F5F9',
  },
  modelChipActive: {
    backgroundColor: Colors.primaryMuted,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  modelChipText: {
    fontSize: 11,
    color: Colors.textPrimary,
  },
  modelChipTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  rowInputs: {
    flexDirection: 'row',
  },
  addActionsRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  bikeItemCard: {
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  bikeItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bikeIconCol: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bikeDetailsCol: {
    flex: 1,
  },
  bikeItemName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.navy,
  },
  bikeItemSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  selectBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: Radius.xs,
    backgroundColor: '#F1F5F9',
  },
  selectBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  deleteBikeBtn: {
    padding: 6,
  },
  reminderCard: {
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkboxTouch: {
    padding: 2,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.navy,
  },
  reminderCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.textMuted,
  },
  reminderSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  remDeleteBtn: {
    padding: 4,
  },
  bookBtn: {
    marginTop: 12,
  },
});
