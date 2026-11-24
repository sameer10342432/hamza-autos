import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { WorkshopService } from '../types';
import { Colors } from '../constants/colors';
import { Radius, Shadows } from '../constants/theme';
import { Badge } from './Badge';
import { getServiceImage } from '../utils/assetHelper';

interface ServiceCardProps {
  service: WorkshopService;
  onBookNow?: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onBookNow }) => {
  const router = useRouter();

  const handleCardPress = () => {
    router.push(`/service/${service.slug}`);
  };

  const handleBook = (e: any) => {
    e.stopPropagation?.();
    if (onBookNow) {
      onBookNow();
    } else {
      router.push({
        pathname: '/repair-booking',
        params: { service: service.title },
      });
    }
  };

  return (
    <Pressable
      onPress={handleCardPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={getServiceImage(service.image)}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.categoryBadge}>
          <Badge label={service.category} variant="primary" size="sm" />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {service.title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {service.shortDescription}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.metaText}>{service.estimatedTime}</Text>
          </View>
          {service.estimatedPriceRange && (
            <View style={styles.metaItem}>
              <Ionicons name="pricetag-outline" size={14} color={Colors.primary} />
              <Text style={styles.metaPrice}>{service.estimatedPriceRange}</Text>
            </View>
          )}
        </View>

        <View style={styles.actionRow}>
          <Pressable
            onPress={handleCardPress}
            style={({ pressed }) => [styles.btnDetails, pressed && styles.btnPressed]}
          >
            <Text style={styles.btnDetailsText}>Details</Text>
            <Ionicons name="chevron-forward" size={14} color={Colors.navy} />
          </Pressable>

          <Pressable
            onPress={handleBook}
            style={({ pressed }) => [styles.btnBook, pressed && styles.btnPressed]}
          >
            <Ionicons name="calendar-outline" size={14} color="#FFFFFF" />
            <Text style={styles.btnBookText}>Book Service</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 16,
    ...Shadows.card,
  },
  cardPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.99 }],
  },
  imageContainer: {
    width: '100%',
    height: 150,
    backgroundColor: '#E2E8F0',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  content: {
    padding: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.navy,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  metaPrice: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  btnDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
    backgroundColor: '#F1F5F9',
  },
  btnDetailsText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.navy,
  },
  btnBook: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    ...Shadows.button,
  },
  btnBookText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  btnPressed: {
    opacity: 0.8,
  },
});
