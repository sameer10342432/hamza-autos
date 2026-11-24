import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Colors } from '../constants/colors';
import { Radius } from '../constants/theme';
import {
  MOTORCYCLE_BRANDS,
  MOTORCYCLE_MODELS,
  WORKSHOP_SERVICES,
  APPOINTMENT_TIME_SLOTS,
  BUSINESS_INFO,
} from '../data/initialData';
import { MobileApiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useGarage } from '../context/GarageContext';
import { BikeBrand, ServiceBookingPayload } from '../types';

export default function RepairBookingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ service?: string }>();
  const { customer } = useAuth();
  const { activeBike } = useGarage();

  // Form State
  const [customerName, setCustomerName] = useState(customer?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(customer?.phoneNumber || '');
  const [bikeBrand, setBikeBrand] = useState<BikeBrand>(
    activeBike?.brand || 'Honda'
  );
  const [bikeModel, setBikeModel] = useState(activeBike?.model || 'CD 70');
  const [registrationNumber, setRegistrationNumber] = useState(
    activeBike?.registrationNumber || ''
  );
  const [serviceRequested, setServiceRequested] = useState(
    params.service || 'Bike Tuning & Fuel Economy Optimization'
  );
  const [problemDescription, setProblemDescription] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [appointmentTime, setAppointmentTime] = useState('10:30 AM');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Generate date options for the next 7 days
  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      iso: d.toISOString().slice(0, 10),
      dayName: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateFormatted: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
  });

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!customerName.trim()) errs.customerName = 'Customer Name is required.';
    if (!phoneNumber.trim()) {
      errs.phoneNumber = 'Phone number is required for appointment confirmation.';
    } else if (phoneNumber.replace(/[^0-9]/g, '').length < 10) {
      errs.phoneNumber = 'Please enter a valid Pakistani phone number.';
    }
    if (!problemDescription.trim()) {
      errs.problemDescription = 'Please briefly describe the motorcycle problem or required service.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!validate()) {
      Alert.alert('Incomplete Booking', 'Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    const payload: ServiceBookingPayload = {
      customerName: customerName.trim(),
      phoneNumber: phoneNumber.trim(),
      bikeBrand,
      bikeModel,
      registrationNumber: registrationNumber.trim() || undefined,
      serviceRequested,
      problemDescription: problemDescription.trim(),
      appointmentDate,
      appointmentTime,
      additionalNotes: additionalNotes.trim() || undefined,
    };

    try {
      const res = await MobileApiService.submitBooking(payload);
      if (res.success) {
        Alert.alert(
          'Workshop Appointment Confirmed!',
          `Booking Reference: ${res.bookingNumber}\n\n` +
            `Service: ${serviceRequested}\n` +
            `Date & Time: ${appointmentDate} at ${appointmentTime}\n` +
            `Workshop: Abu Bakar Road, Badami Bagh, Lahore\n\n` +
            `Master Mechanic Hamza has reserved your repair bay. Please arrive 10 minutes prior.`,
          [
            {
              text: 'Track Repair / Status',
              onPress: () =>
                router.replace({
                  pathname: '/repair-tracking',
                  params: { jobCard: res.bookingNumber, phone: phoneNumber },
                }),
            },
            {
              text: 'Done',
              onPress: () => router.replace('/(tabs)/services'),
            },
          ]
        );
      }
    } catch (err: any) {
      Alert.alert('Booking Error', err.message || 'Failed to submit booking.');
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
        {/* Badami Bagh Workshop Notice Card */}
        <Card style={styles.locationNoticeCard}>
          <View style={styles.noticeRow}>
            <View style={styles.noticeIconWrap}>
              <Ionicons name="location" size={20} color={Colors.primary} />
            </View>
            <View style={styles.noticeTextWrap}>
              <Text style={styles.noticeTitle}>Physical Workshop: Badami Bagh, Lahore</Text>
              <Text style={styles.noticeDesc}>
                In-person motorcycle repairs, engine overhauls & tuning take place exclusively at our workshop near Ali Hajvery Marriage Hall, Abu Bakar Road, Badami Bagh, Lahore.
              </Text>
            </View>
          </View>
        </Card>

        {/* Customer Information Card */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>1. Rider Details</Text>

          <Input
            label="Customer Name"
            placeholder="e.g. Muhammad Arshad"
            value={customerName}
            onChangeText={setCustomerName}
            error={errors.customerName}
            required
            leftIcon={<Ionicons name="person-outline" size={16} color={Colors.navy} />}
          />

          <Input
            label="Mobile Phone Number"
            placeholder="0300 1234567"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            error={errors.phoneNumber}
            helperText="We will SMS and WhatsApp booking updates to this number"
            required
            leftIcon={<Ionicons name="call-outline" size={16} color={Colors.navy} />}
          />
        </Card>

        {/* Motorcycle Information Card */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>2. Motorcycle Information</Text>

          {/* Motorcycle Brand Chips */}
          <Text style={styles.fieldLabel}>Motorcycle Brand / Make *</Text>
          <View style={styles.chipsWrap}>
            {MOTORCYCLE_BRANDS.map((brand) => {
              const isSelected = bikeBrand === brand;
              return (
                <Pressable
                  key={brand}
                  onPress={() => {
                    setBikeBrand(brand);
                    const firstModel = MOTORCYCLE_MODELS.find((m) => m.brand === brand);
                    if (firstModel) setBikeModel(firstModel.name);
                  }}
                  style={[styles.chip, isSelected && styles.chipActive]}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                    {brand}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Model Selection */}
          <Text style={styles.fieldLabel}>Motorcycle Model *</Text>
          <View style={styles.chipsWrap}>
            {MOTORCYCLE_MODELS.filter((m) => m.brand === bikeBrand).map((m) => {
              const isSelected = bikeModel === m.name;
              return (
                <Pressable
                  key={m.id}
                  onPress={() => setBikeModel(m.name)}
                  style={[styles.chip, isSelected && styles.chipActive]}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                    {m.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Input
            label="Registration Number (Optional)"
            placeholder="e.g. LEN-23-4412"
            value={registrationNumber}
            onChangeText={setRegistrationNumber}
            autoCapitalize="characters"
            leftIcon={<Ionicons name="card-outline" size={16} color={Colors.navy} />}
          />
        </Card>

        {/* Service & Problem Description Card */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>3. Service & Mechanical Problem</Text>

          {/* Service Selector Chips */}
          <Text style={styles.fieldLabel}>Service Required *</Text>
          <View style={styles.chipsWrap}>
            {WORKSHOP_SERVICES.map((s) => {
              const isSelected = serviceRequested === s.title;
              return (
                <Pressable
                  key={s.id}
                  onPress={() => setServiceRequested(s.title)}
                  style={[styles.serviceChip, isSelected && styles.serviceChipActive]}
                >
                  <Text
                    style={[
                      styles.serviceChipText,
                      isSelected && styles.serviceChipTextActive,
                    ]}
                  >
                    {s.title}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Input
            label="Problem Description / Symptoms *"
            placeholder="Describe what is wrong (e.g. white smoke, hard starting, slipping clutch, low mileage, noisy tappets...)"
            value={problemDescription}
            onChangeText={setProblemDescription}
            multiline
            numberOfLines={3}
            error={errors.problemDescription}
            required
            containerStyle={{ marginTop: 6 }}
          />

          <Input
            label="Additional Notes (Optional)"
            placeholder="e.g. Please also check front brake shoes and change engine oil"
            value={additionalNotes}
            onChangeText={setAdditionalNotes}
          />
        </Card>

        {/* Date & Time Slot Selection Card */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>4. Preferred Date & Time Slot</Text>
          <Text style={styles.slotSubtitle}>
            Workshop hours: 9:00 AM – 9:00 PM (Monday to Sunday)
          </Text>

          {/* Date Picker Carousel */}
          <Text style={styles.fieldLabel}>Select Date *</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateScroll}
          >
            {dateOptions.map((item) => {
              const isSelected = appointmentDate === item.iso;
              return (
                <Pressable
                  key={item.iso}
                  onPress={() => setAppointmentDate(item.iso)}
                  style={[styles.dateCard, isSelected && styles.dateCardActive]}
                >
                  <Text style={[styles.dayText, isSelected && styles.dateTextActive]}>
                    {item.dayName}
                  </Text>
                  <Text style={[styles.dateText, isSelected && styles.dateTextActive]}>
                    {item.dateFormatted}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Time Slots Chips */}
          <Text style={[styles.fieldLabel, { marginTop: 14 }]}>Available Time Slots *</Text>
          <View style={styles.timeSlotsGrid}>
            {APPOINTMENT_TIME_SLOTS.map((slot) => {
              const isSelected = appointmentTime === slot;
              return (
                <Pressable
                  key={slot}
                  onPress={() => setAppointmentTime(slot)}
                  style={[styles.timeChip, isSelected && styles.timeChipActive]}
                >
                  <Ionicons
                    name="time-outline"
                    size={12}
                    color={isSelected ? Colors.primary : Colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.timeChipText,
                      isSelected && styles.timeChipTextActive,
                    ]}
                  >
                    {slot}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Card>

        {/* Submit Booking Button */}
        <Button
          title={isSubmitting ? 'Confirming Appointment...' : 'Confirm Workshop Booking'}
          onPress={handleSubmit}
          loading={isSubmitting}
          variant="primary"
          size="lg"
          fullWidth
          style={styles.submitBtn}
          icon={<Ionicons name="calendar-outline" size={18} color="#FFFFFF" />}
        />

        <Text style={styles.policyText}>
          • Zero booking fee. Labour & parts charges are paid in person at the workshop after inspection.{'\n'}
          • Free road test inspection included with every booking.
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
  locationNoticeCard: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FECDD3',
    marginBottom: 14,
  },
  noticeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  noticeIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFE4E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noticeTextWrap: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.primaryDark,
    marginBottom: 2,
  },
  noticeDesc: {
    fontSize: 11,
    color: Colors.textPrimary,
    lineHeight: 16,
  },
  card: {
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.navy,
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.navy,
    marginBottom: 8,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  chip: {
    paddingVertical: 5,
    paddingHorizontal: 10,
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
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  serviceChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: Radius.md,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  serviceChipActive: {
    backgroundColor: Colors.primaryMuted,
    borderColor: Colors.primary,
  },
  serviceChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  serviceChipTextActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
  slotSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  dateScroll: {
    gap: 8,
    paddingBottom: 4,
  },
  dateCard: {
    width: 76,
    paddingVertical: 8,
    borderRadius: Radius.md,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  dateCardActive: {
    backgroundColor: Colors.navy,
    borderColor: Colors.navy,
  },
  dayText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.navy,
    marginTop: 2,
  },
  dateTextActive: {
    color: '#FFFFFF',
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 9,
    borderRadius: Radius.sm,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  timeChipActive: {
    backgroundColor: Colors.primaryMuted,
    borderColor: Colors.primary,
  },
  timeChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  timeChipTextActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
  submitBtn: {
    marginTop: 6,
  },
  policyText: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 14,
    paddingHorizontal: 12,
  },
});
