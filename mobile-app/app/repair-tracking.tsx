import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Colors } from '../constants/colors';
import { Radius, Shadows } from '../constants/theme';
import { MobileApiService } from '../services/api';
import { BUSINESS_INFO } from '../data/initialData';
import { RepairStage, RepairJobCard } from '../types';

const REPAIR_STAGES: RepairStage[] = [
  'Booking Requested',
  'Booking Confirmed',
  'Bike Received',
  'Inspection in Progress',
  'Quotation Prepared',
  'Customer Approval Pending',
  'Repair in Progress',
  'Quality Inspection',
  'Ready for Collection',
  'Completed',
];

export default function RepairTrackingScreen() {
  const params = useLocalSearchParams<{ jobCard?: string; phone?: string }>();
  const [jobCardInput, setJobCardInput] = useState(params.jobCard || '');
  const [phoneInput, setPhoneInput] = useState(params.phone || '');
  const [jobCard, setJobCard] = useState<RepairJobCard | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async (cardToFind?: string, phoneToFind?: string) => {
    const card = (cardToFind || jobCardInput).trim();
    const phone = (phoneToFind || phoneInput).trim();

    if (!card) {
      setError('Please enter your Job Card Number (e.g. HA-JC-2026-001)');
      return;
    }
    if (!phone) {
      setError('Please enter your registered mobile phone number for security verification.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await MobileApiService.trackRepair(card, phone);
      if (res.success && res.data) {
        setJobCard(res.data);
      } else {
        setError(res.error || `No repair found for Job Card "${card}".`);
      }
    } catch (e: any) {
      setError('Lookup error. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.jobCard && params.phone) {
      handleLookup(params.jobCard, params.phone);
    } else if (params.jobCard) {
      setJobCardInput(params.jobCard);
    }
  }, [params.jobCard, params.phone]);

  const getStageState = (stageIndex: number, currentStage: RepairStage) => {
    const currentIdx = REPAIR_STAGES.indexOf(currentStage);
    if (currentIdx === -1) return stageIndex === 0 ? 'active' : 'pending';
    if (stageIndex < currentIdx) return 'completed';
    if (stageIndex === currentIdx) return 'active';
    return 'pending';
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Assalam-o-Alaikum Hamza Autos! Inquiring regarding Job Card: ${jobCard?.jobCardNumber || jobCardInput} at Badami Bagh workshop.`
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
        {/* Security Lookup Card */}
        <Card style={styles.lookupCard}>
          <View style={styles.shieldHeader}>
            <View style={styles.shieldIconWrap}>
              <Ionicons name="shield-checkmark" size={20} color={Colors.primary} />
            </View>
            <View style={styles.shieldTextWrap}>
              <Text style={styles.shieldTitle}>Secure Repair Tracking Lookup</Text>
              <Text style={styles.shieldSubtitle}>
                2-Factor verification: Requires both Job Card Number and Customer Phone Number to protect your privacy.
              </Text>
            </View>
          </View>

          <Input
            label="Job Card / Booking # (e.g. HA-JC-2026-001)"
            placeholder="HA-JC-2026-001"
            value={jobCardInput}
            onChangeText={setJobCardInput}
            autoCapitalize="characters"
            leftIcon={<Ionicons name="receipt-outline" size={18} color={Colors.navy} />}
          />

          <Input
            label="Registered Customer Phone Number"
            placeholder="0300 1234567"
            value={phoneInput}
            onChangeText={setPhoneInput}
            keyboardType="phone-pad"
            leftIcon={<Ionicons name="call-outline" size={18} color={Colors.navy} />}
          />

          <Button
            title="Track Repair Progress"
            onPress={() => handleLookup()}
            loading={loading}
            variant="primary"
            size="md"
            fullWidth
            icon={<Ionicons name="search" size={16} color="#FFFFFF" />}
          />

          {error && <Text style={styles.errorText}>{error}</Text>}
        </Card>

        {/* Live Repair Job Card Details */}
        {jobCard && (
          <View style={styles.resultContainer}>
            {/* Header Status Card */}
            <Card style={styles.statusCard}>
              <View style={styles.statusHeaderRow}>
                <View>
                  <Text style={styles.jobCardNum}>{jobCard.jobCardNumber}</Text>
                  <Text style={styles.customerName}>
                    {jobCard.customerName} · {jobCard.bikeBrand} {jobCard.bikeModel}
                  </Text>
                  {jobCard.registrationNumber && (
                    <Text style={styles.regNum}>{jobCard.registrationNumber}</Text>
                  )}
                </View>

                <Badge
                  label={jobCard.repairStatus}
                  variant={
                    jobCard.repairStatus === 'Completed' ||
                    jobCard.repairStatus === 'Ready for Collection'
                      ? 'success'
                      : 'primary'
                  }
                  size="md"
                />
              </View>

              <View style={styles.metaRow}>
                <View style={styles.metaCol}>
                  <Text style={styles.metaLabel}>Assigned Technician</Text>
                  <Text style={styles.metaVal}>{jobCard.assignedMechanicName || 'Master Mechanic Hamza'}</Text>
                </View>
                <View style={styles.metaCol}>
                  <Text style={styles.metaLabel}>Estimated Cost</Text>
                  <Text style={styles.costVal}>PKR {jobCard.estimatedCost.toLocaleString()}</Text>
                </View>
              </View>
            </Card>

            {/* Complaint & Required Services */}
            <Card style={styles.card}>
              <Text style={styles.sectionTitle}>Customer Complaint & Scope</Text>
              <Text style={styles.complaintText}>"{jobCard.customerComplaint}"</Text>

              <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Required Services</Text>
              {jobCard.requiredServices.map((svc, i) => (
                <View key={i} style={styles.serviceBullet}>
                  <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
                  <Text style={styles.serviceText}>{svc}</Text>
                </View>
              ))}
            </Card>

            {/* 10-Stage Visual Timeline */}
            <Card style={styles.card}>
              <Text style={styles.sectionTitle}>10-Stage Workshop Progress</Text>

              {REPAIR_STAGES.map((stage, idx) => {
                const state = getStageState(idx, jobCard.repairStatus);
                const isLast = idx === REPAIR_STAGES.length - 1;

                return (
                  <View key={stage} style={styles.stageRow}>
                    <View style={styles.indicatorCol}>
                      <View
                        style={[
                          styles.stageDot,
                          state === 'completed' && styles.stageDotCompleted,
                          state === 'active' && styles.stageDotActive,
                        ]}
                      >
                        {state === 'completed' ? (
                          <Ionicons name="checkmark" size={11} color="#FFFFFF" />
                        ) : state === 'active' ? (
                          <View style={styles.activeDot} />
                        ) : null}
                      </View>

                      {!isLast && (
                        <View
                          style={[
                            styles.stageLine,
                            state === 'completed' && styles.stageLineCompleted,
                          ]}
                        />
                      )}
                    </View>

                    <View style={styles.stageInfoCol}>
                      <Text
                        style={[
                          styles.stageName,
                          state === 'active' && styles.stageNameActive,
                          state === 'completed' && styles.stageNameCompleted,
                        ]}
                      >
                        {idx + 1}. {stage}
                      </Text>
                      <Text style={styles.stageStatusDesc}>
                        {state === 'completed'
                          ? 'Passed & Verified'
                          : state === 'active'
                          ? 'Current active workshop stage'
                          : 'Pending'}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </Card>

            {/* Bike Health Report Card */}
            {jobCard.healthReport && jobCard.healthReport.length > 0 && (
              <Card style={styles.card}>
                <View style={styles.healthTitleRow}>
                  <Ionicons name="fitness" size={18} color={Colors.primary} />
                  <Text style={styles.sectionTitle}>Bike Health Inspection Report</Text>
                </View>

                {jobCard.healthReport.map((h, idx) => (
                  <View key={idx} style={styles.healthItem}>
                    <View style={styles.healthTop}>
                      <Text style={styles.healthComp}>{h.component}</Text>
                      <Badge
                        label={h.condition}
                        variant={
                          h.condition === 'Excellent'
                            ? 'success'
                            : h.condition === 'Good'
                            ? 'info'
                            : h.condition === 'Needs Attention'
                            ? 'warning'
                            : 'error'
                        }
                        size="sm"
                      />
                    </View>
                    <Text style={styles.healthRec}>{h.recommendation}</Text>
                  </View>
                ))}
              </Card>
            )}

            {/* WhatsApp Contact Button */}
            <Button
              title="Chat with Workshop Manager on WhatsApp"
              onPress={handleWhatsApp}
              variant="whatsapp"
              size="md"
              fullWidth
              icon={<Ionicons name="logo-whatsapp" size={18} color="#FFFFFF" />}
              style={styles.whatsappBtn}
            />
          </View>
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
  lookupCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  shieldHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 14,
  },
  shieldIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldTextWrap: {
    flex: 1,
  },
  shieldTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.navy,
  },
  shieldSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginTop: 2,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
  },
  resultContainer: {
    gap: 14,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  statusHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  jobCardNum: {
    fontSize: 17,
    fontWeight: '900',
    color: Colors.navy,
  },
  customerName: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: '600',
  },
  regNum: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  metaCol: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  metaVal: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.navy,
    marginTop: 2,
  },
  costVal: {
    fontSize: 15,
    fontWeight: '900',
    color: Colors.primary,
    marginTop: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.navy,
    marginBottom: 8,
  },
  complaintText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: Colors.textPrimary,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: Radius.sm,
    lineHeight: 18,
  },
  serviceBullet: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 3,
  },
  serviceText: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  stageRow: {
    flexDirection: 'row',
    gap: 12,
  },
  indicatorCol: {
    alignItems: 'center',
    width: 20,
  },
  stageDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  stageDotActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryMuted,
  },
  stageDotCompleted: {
    backgroundColor: Colors.success,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  stageLine: {
    width: 2,
    flex: 1,
    minHeight: 22,
    backgroundColor: '#E2E8F0',
    marginVertical: 2,
  },
  stageLineCompleted: {
    backgroundColor: Colors.success,
  },
  stageInfoCol: {
    flex: 1,
    paddingBottom: 12,
  },
  stageName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  stageNameActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
  stageNameCompleted: {
    color: Colors.navy,
    fontWeight: '700',
  },
  stageStatusDesc: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 1,
  },
  healthTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  healthItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  healthTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  healthComp: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.navy,
  },
  healthRec: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  whatsappBtn: {
    marginTop: 4,
  },
});
