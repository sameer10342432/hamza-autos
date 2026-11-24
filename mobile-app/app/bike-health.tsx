import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Colors } from '../constants/colors';
import { Radius, Shadows } from '../constants/theme';
import { useGarage } from '../context/GarageContext';

interface HealthCheckItem {
  id: string;
  name: string;
  score: number; // 0 - 100
  status: 'Excellent' | 'Good' | 'Needs Attention' | 'Critical';
  inspectionNotes: string;
  recommendation: string;
}

const HEALTH_CHECKS: HealthCheckItem[] = [
  {
    id: 'h1',
    name: 'Engine Compression & Piston Ring Seal',
    score: 85,
    status: 'Good',
    inspectionNotes: '140 PSI measured on warm engine. Normal tolerance for 70cc-125cc.',
    recommendation: 'Engine running healthy. Check again in 3,000 km.',
  },
  {
    id: 'h2',
    name: 'Engine Lubricant & Sump Condition',
    score: 65,
    status: 'Needs Attention',
    inspectionNotes: 'Oil color slightly darkened, 850 km elapsed since previous service.',
    recommendation: 'Recommend fresh Caltex 20W-50 oil replacement within 200 km.',
  },
  {
    id: 'h3',
    name: 'Carburetor Air-Fuel Jetting & Spark Plug',
    score: 92,
    status: 'Excellent',
    inspectionNotes: 'Light brown electrode tip indicating optimal mixture. No carbon deposit.',
    recommendation: 'Fuel economy optimized at 62 km/L.',
  },
  {
    id: 'h4',
    name: 'Brake Linings & Drum Friction',
    score: 90,
    status: 'Excellent',
    inspectionNotes: '4mm lining remaining on front & rear shoes. Drum surface true.',
    recommendation: 'Braking performance strong.',
  },
  {
    id: 'h5',
    name: 'Drive Chain Slack & Sprocket Teeth',
    score: 72,
    status: 'Needs Attention',
    inspectionNotes: 'Chain slack measured at 35mm (standard spec: 20-25mm). Dry rollers.',
    recommendation: 'Needs chain tension adjustment and heavy-duty gear lube.',
  },
  {
    id: 'h6',
    name: 'Battery Voltage & Stator Charging',
    score: 95,
    status: 'Excellent',
    inspectionNotes: '12.7V resting, 14.2V at 4000 RPM. Charging circuit fully healthy.',
    recommendation: 'No action needed.',
  },
  {
    id: 'h7',
    name: 'Front Fork Seals & Steering Cone Bearing',
    score: 88,
    status: 'Good',
    inspectionNotes: 'Zero fork oil leakage, steering head rotates smoothly without notch.',
    recommendation: 'Suspension healthy.',
  },
];

export default function BikeHealthScreen() {
  const router = useRouter();
  const { activeBike } = useGarage();

  const overallScore = Math.round(
    HEALTH_CHECKS.reduce((sum, h) => sum + h.score, 0) / HEALTH_CHECKS.length
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Overall Health Score Card */}
        <Card style={styles.scoreCard}>
          <View style={styles.scoreRow}>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreNumber}>{overallScore}%</Text>
              <Text style={styles.scoreLabel}>Health Score</Text>
            </View>

            <View style={styles.scoreTextWrap}>
              <Text style={styles.bikeName}>
                {activeBike ? `${activeBike.brand} ${activeBike.model}` : 'Honda CD 70'}
              </Text>
              <Text style={styles.bikeReg}>
                {activeBike?.registrationNumber || 'LEN-23-4412'} · {activeBike?.mileageKm || 8500} km
              </Text>
              <View style={styles.badgeWrap}>
                <Badge label="Overall Healthy" variant="success" size="sm" />
              </View>
              <Text style={styles.scoreSub}>
                Inspected by Hamza Autos Badami Bagh diagnostic methodology.
              </Text>
            </View>
          </View>
        </Card>

        {/* Action Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Component Inspection Checklist</Text>
          <Text style={styles.sectionSub}>7 critical safety and performance systems</Text>
        </View>

        {/* Health Items List */}
        {HEALTH_CHECKS.map((item) => (
          <Card key={item.id} style={styles.checkCard} padding={14}>
            <View style={styles.checkTopRow}>
              <View style={styles.nameCol}>
                <Text style={styles.checkName}>{item.name}</Text>
                <Text style={styles.notesText}>{item.inspectionNotes}</Text>
              </View>
              <Badge
                label={item.status}
                variant={
                  item.status === 'Excellent'
                    ? 'success'
                    : item.status === 'Good'
                    ? 'info'
                    : item.status === 'Needs Attention'
                    ? 'warning'
                    : 'error'
                }
                size="sm"
              />
            </View>

            <View style={styles.recBox}>
              <Ionicons
                name={
                  item.status === 'Needs Attention' || item.status === 'Critical'
                    ? 'warning'
                    : 'information-circle'
                }
                size={14}
                color={
                  item.status === 'Needs Attention'
                    ? Colors.gold
                    : Colors.textSecondary
                }
              />
              <Text style={styles.recText}>{item.recommendation}</Text>
            </View>
          </Card>
        ))}

        {/* Service Booking Card */}
        <Card style={styles.ctaCard}>
          <MaterialCommunityIcons name="wrench-clock" size={28} color={Colors.primary} />
          <Text style={styles.ctaTitle}>Schedule Maintenance Service</Text>
          <Text style={styles.ctaSub}>
            Book a dedicated workshop bay at Badami Bagh, Lahore for engine oil change, carburetor tuning, or chain adjustment.
          </Text>
          <Button
            title="Book Workshop Service Now"
            onPress={() => router.push('/repair-booking')}
            variant="primary"
            size="md"
            fullWidth
            icon={<Ionicons name="calendar-outline" size={16} color="#FFFFFF" />}
            style={styles.ctaBtn}
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
    padding: 16,
    paddingBottom: 40,
  },
  scoreCard: {
    backgroundColor: Colors.navy,
    marginBottom: 16,
    ...Shadows.elevated,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  scoreCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: Colors.navyLight,
    borderWidth: 3,
    borderColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  scoreLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  scoreTextWrap: {
    flex: 1,
  },
  bikeName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  bikeReg: {
    fontSize: 12,
    color: '#CBD5E1',
    marginTop: 2,
  },
  badgeWrap: {
    marginTop: 6,
    marginBottom: 4,
  },
  scoreSub: {
    fontSize: 10,
    color: '#94A3B8',
    lineHeight: 14,
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.navy,
  },
  sectionSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  checkCard: {
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  checkTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  nameCol: {
    flex: 1,
  },
  checkName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.navy,
  },
  notesText: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 3,
    lineHeight: 15,
  },
  recBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: Radius.sm,
    marginTop: 8,
  },
  recText: {
    fontSize: 11,
    color: Colors.textPrimary,
    fontWeight: '600',
    flex: 1,
  },
  ctaCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    alignItems: 'center',
    textAlign: 'center',
    padding: 18,
    marginTop: 8,
  },
  ctaTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.navy,
    marginTop: 6,
  },
  ctaSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
    marginVertical: 10,
  },
  ctaBtn: {
    marginTop: 4,
  },
});
