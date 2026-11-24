import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Colors } from '../constants/colors';
import { Radius, Shadows } from '../constants/theme';
import { BUSINESS_INFO, FAQS } from '../data/initialData';

export default function SupportScreen() {
  const handleCall = () => {
    Linking.openURL(`tel:${BUSINESS_INFO.phoneRaw}`);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      'Assalam-o-Alaikum Hamza Autos! I need support regarding motorcycle repair / order dispatch.'
    );
    Linking.openURL(`https://wa.me/${BUSINESS_INFO.whatsappRaw}?text=${text}`);
  };

  const handleDirections = () => {
    Linking.openURL(BUSINESS_INFO.googleMapsUrl);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Support Header Card */}
        <Card style={styles.heroCard}>
          <View style={styles.heroIconBox}>
            <Ionicons name="headset" size={32} color={Colors.primary} />
          </View>
          <Text style={styles.heroTitle}>Hamza Autos Help Desk</Text>
          <Text style={styles.heroSubtitle}>
            Have a question about a spare part, motorcycle diagnostic, or delivery? Our Badami Bagh mechanics team is ready to help.
          </Text>

          <View style={styles.actionButtonsCol}>
            <Button
              title={`Call Hotline: ${BUSINESS_INFO.phone}`}
              onPress={handleCall}
              variant="primary"
              size="md"
              fullWidth
              icon={<Ionicons name="call" size={18} color="#FFFFFF" />}
            />
            <Button
              title="Chat on WhatsApp"
              onPress={handleWhatsApp}
              variant="whatsapp"
              size="md"
              fullWidth
              icon={<Ionicons name="logo-whatsapp" size={18} color="#FFFFFF" />}
              style={{ marginTop: 8 }}
            />
          </View>
        </Card>

        {/* Physical Workshop Location Notice */}
        <Card style={styles.locCard}>
          <View style={styles.locHeader}>
            <Ionicons name="location" size={22} color={Colors.primary} />
            <Text style={styles.locTitle}>Physical Workshop Coordinates</Text>
          </View>
          <Text style={styles.locName}>Hamza Autos Workshop</Text>
          <Text style={styles.locAddress}>{BUSINESS_INFO.fullAddress}</Text>

          <View style={styles.hoursRow}>
            <Ionicons name="time-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.hoursText}>
              {BUSINESS_INFO.operatingHours} · {BUSINESS_INFO.operatingDays}
            </Text>
          </View>

          <Button
            title="Open in Google Maps"
            onPress={handleDirections}
            variant="outline"
            size="sm"
            icon={<Ionicons name="map-outline" size={16} color={Colors.primary} />}
            style={{ marginTop: 12 }}
          />
        </Card>

        {/* Pakistan-Wide Delivery Policies */}
        <Card style={styles.card}>
          <View style={styles.locHeader}>
            <FontAwesome5 name="shipping-fast" size={18} color={Colors.primary} />
            <Text style={styles.locTitle}>Pakistan-Wide Delivery Policy</Text>
          </View>

          <View style={styles.policyItem}>
            <Text style={styles.policyHeading}>1. Courier Dispatch</Text>
            <Text style={styles.policyText}>
              All spare parts orders are dispatched daily via TCS, Leopards Courier, and M&P. Delivery tracking numbers are sent via SMS and WhatsApp.
            </Text>
          </View>

          <View style={styles.policyItem}>
            <Text style={styles.policyHeading}>2. Delivery Timelines</Text>
            <Text style={styles.policyText}>
              • Lahore: Same-day or next-day delivery.{'\n'}
              • Punjab & Islamabad: 24 to 48 hours.{'\n'}
              • Sindh, KPK, Balochistan, AJK & GB: 2 to 4 working days.
            </Text>
          </View>

          <View style={styles.policyItem}>
            <Text style={styles.policyHeading}>3. Fitment Guarantee</Text>
            <Text style={styles.policyText}>
              If a spare part does not fit your motorcycle model, we provide direct replacement or exchange at our Badami Bagh workshop or via courier return.
            </Text>
          </View>
        </Card>

        {/* Frequently Asked Questions */}
        <Text style={styles.faqHeader}>Frequently Asked Questions</Text>
        {FAQS.slice(0, 5).map((faq, idx) => (
          <Card key={idx} style={styles.faqCard} padding={14}>
            <Text style={styles.faqQ}>Q: {faq.question}</Text>
            <Text style={styles.faqA}>{faq.answer}</Text>
          </Card>
        ))}
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
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    alignItems: 'center',
    padding: 20,
    marginBottom: 14,
    ...Shadows.card,
  },
  heroIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.navy,
  },
  heroSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 17,
    marginTop: 4,
    marginBottom: 16,
  },
  actionButtonsCol: {
    width: '100%',
  },
  locCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  locHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  locTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.navy,
  },
  locName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  locAddress: {
    fontSize: 12,
    color: Colors.textPrimary,
    lineHeight: 17,
    marginTop: 2,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  hoursText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  policyItem: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  policyHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.navy,
    marginBottom: 2,
  },
  policyText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  faqHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.navy,
    marginTop: 6,
    marginBottom: 10,
  },
  faqCard: {
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  faqQ: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.navy,
    marginBottom: 4,
  },
  faqA: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
});
