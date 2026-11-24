import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { WORKSHOP_SERVICES, BUSINESS_INFO } from '../../data/initialData';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Colors } from '../../constants/colors';
import { Radius, Shadows } from '../../constants/theme';
import { getServiceImage } from '../../utils/assetHelper';

export default function ServiceDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();

  const service = WORKSHOP_SERVICES.find(
    (s) => s.slug === slug || s.id === slug
  );

  if (!service) {
    return (
      <View style={styles.container}>
        <View style={styles.errorWrap}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.error} />
          <Text style={styles.errorTitle}>Service Not Found</Text>
          <Text style={styles.errorSub}>The requested service could not be located.</Text>
          <Button
            title="View All Services"
            onPress={() => router.replace('/(tabs)/services')}
            variant="primary"
            size="sm"
            style={{ marginTop: 14 }}
          />
        </View>
      </View>
    );
  }

  const handleBook = () => {
    router.push({
      pathname: '/repair-booking',
      params: { service: service.title },
    });
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Assalam-o-Alaikum Hamza Autos! I want to consult about: ${service.title} for my motorcycle.`
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
        {/* Hero Image */}
        <View style={styles.heroCard}>
          <Image
            source={getServiceImage(service.image)}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroBadgeOverlay}>
            <Badge label={service.category} variant="primary" />
          </View>
        </View>

        {/* Title & Timing Card */}
        <Card style={styles.card}>
          <Text style={styles.serviceTitle}>{service.title}</Text>
          <Text style={styles.shortDesc}>{service.shortDescription}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaBox}>
              <Ionicons name="time-outline" size={16} color={Colors.primary} />
              <View>
                <Text style={styles.metaLabel}>Turnaround Time</Text>
                <Text style={styles.metaVal}>{service.estimatedTime}</Text>
              </View>
            </View>

            <View style={styles.metaBox}>
              <Ionicons name="cash-outline" size={16} color={Colors.success} />
              <View>
                <Text style={styles.metaLabel}>Estimated Labour</Text>
                <Text style={styles.metaVal}>{service.estimatedPriceRange || 'PKR 500 – 1,500'}</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Full Overview Description */}
        <Card style={styles.card}>
          <Text style={styles.sectionHeading}>Service Overview</Text>
          <Text style={styles.fullDesc}>{service.fullDescription}</Text>
        </Card>

        {/* Symptoms / When to book */}
        <Card style={styles.card}>
          <View style={styles.headingRow}>
            <Ionicons name="warning-outline" size={18} color={Colors.warning} />
            <Text style={styles.sectionHeading}>Common Symptoms & Warning Signs</Text>
          </View>
          {service.commonSymptoms.map((symptom, idx) => (
            <View key={idx} style={styles.bulletRow}>
              <Ionicons name="alert-circle" size={14} color={Colors.primary} style={styles.bulletIcon} />
              <Text style={styles.bulletText}>{symptom}</Text>
            </View>
          ))}
        </Card>

        {/* Key Features */}
        <Card style={styles.card}>
          <View style={styles.headingRow}>
            <Ionicons name="checkmark-done-circle-outline" size={18} color={Colors.success} />
            <Text style={styles.sectionHeading}>What is Included in This Service</Text>
          </View>
          {service.keyFeatures.map((feat, idx) => (
            <View key={idx} style={styles.bulletRow}>
              <Ionicons name="checkmark" size={14} color={Colors.success} style={styles.bulletIcon} />
              <Text style={styles.bulletText}>{feat}</Text>
            </View>
          ))}
        </Card>

        {/* Step-by-Step Workshop Process */}
        <Card style={styles.card}>
          <View style={styles.headingRow}>
            <MaterialCommunityIcons name="cog-clockwise" size={18} color={Colors.primary} />
            <Text style={styles.sectionHeading}>Workshop Procedure Steps</Text>
          </View>
          {service.processSteps.map((step, idx) => (
            <View key={idx} style={styles.processRow}>
              <View style={styles.processStepBadge}>
                <Text style={styles.stepNum}>{idx + 1}</Text>
              </View>
              <Text style={styles.processText}>{step.replace(/^[0-9]\.\s*/, '')}</Text>
            </View>
          ))}
        </Card>

        {/* Supported Motorcycles */}
        <Card style={styles.card}>
          <View style={styles.headingRow}>
            <Ionicons name="bicycle" size={18} color={Colors.navy} />
            <Text style={styles.sectionHeading}>Compatible Motorcycles</Text>
          </View>
          <View style={styles.tagsWrap}>
            {service.supportedBikes.map((bike, idx) => (
              <View key={idx} style={styles.bikeTag}>
                <Text style={styles.bikeTagText}>{bike}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Physical Location Notice */}
        <Card style={styles.locationCard}>
          <View style={styles.locRow}>
            <Ionicons name="location" size={20} color={Colors.primary} />
            <View style={styles.locTextWrap}>
              <Text style={styles.locTitle}>Physical Workshop Location</Text>
              <Text style={styles.locAddress}>{BUSINESS_INFO.fullAddress}</Text>
              <Text style={styles.locHours}>Hours: {BUSINESS_INFO.operatingHours} (Mon - Sun)</Text>
            </View>
          </View>
        </Card>
      </ScrollView>

      {/* Floating CTA Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarInner}>
          <Button
            title="Book This Service"
            onPress={handleBook}
            variant="primary"
            size="lg"
            icon={<Ionicons name="calendar-outline" size={18} color="#FFFFFF" />}
            style={styles.bookCtaBtn}
          />
          <Pressable
            onPress={handleWhatsApp}
            style={({ pressed }) => [styles.whatsappBtn, pressed && styles.pressed]}
            accessibilityLabel="Chat about this service on WhatsApp"
          >
            <Ionicons name="logo-whatsapp" size={22} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
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
    paddingBottom: 90,
  },
  errorWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.navy,
    marginTop: 10,
  },
  errorSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  heroCard: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    height: 200,
    backgroundColor: '#E2E8F0',
    position: 'relative',
    marginBottom: 14,
    ...Shadows.card,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroBadgeOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  card: {
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  serviceTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: Colors.navy,
    lineHeight: 25,
    marginBottom: 6,
  },
  shortDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 14,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  metaBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: Radius.md,
  },
  metaLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  metaVal: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.navy,
    marginTop: 1,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.navy,
    marginBottom: 8,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  fullDesc: {
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 4,
    gap: 8,
  },
  bulletIcon: {
    marginTop: 3,
  },
  bulletText: {
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 18,
    flex: 1,
  },
  processRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 6,
    gap: 10,
  },
  processStepBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  stepNum: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
  },
  processText: {
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 18,
    flex: 1,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  bikeTag: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: Radius.sm,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bikeTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.navy,
  },
  locationCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  locTextWrap: {
    flex: 1,
  },
  locTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.navy,
    marginBottom: 2,
  },
  locAddress: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  locHours: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
    marginTop: 4,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...Shadows.elevated,
  },
  bottomBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bookCtaBtn: {
    flex: 1,
  },
  whatsappBtn: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: Colors.whatsapp,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.button,
  },
  pressed: {
    opacity: 0.8,
  },
});
