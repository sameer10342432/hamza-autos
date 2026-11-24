import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BikeBrand, SparePart } from '../types';
import { MOTORCYCLE_BRANDS, MOTORCYCLE_MODELS } from '../data/initialData';
import { Colors } from '../constants/colors';
import { Radius, Shadows } from '../constants/theme';
import { ProductCard } from './ProductCard';

interface CompatibilityFinderProps {
  parts: SparePart[];
}

export const CompatibilityFinder: React.FC<CompatibilityFinderProps> = ({ parts }) => {
  const [selectedBrand, setSelectedBrand] = useState<BikeBrand | null>('Honda');
  const [selectedModel, setSelectedModel] = useState<string | null>('CD 70');

  // Filter models based on selected brand
  const brandModels = useMemo(() => {
    if (!selectedBrand) return [];
    return MOTORCYCLE_MODELS.filter((m) => m.brand === selectedBrand);
  }, [selectedBrand]);

  // Handle brand selection
  const handleSelectBrand = (brand: BikeBrand) => {
    setSelectedBrand(brand);
    const firstModel = MOTORCYCLE_MODELS.find((m) => m.brand === brand);
    setSelectedModel(firstModel ? firstModel.name : null);
  };

  // Find verified compatible products
  const verifiedProducts = useMemo(() => {
    if (!selectedBrand) return [];
    return parts.filter((part) => {
      // Check brand match
      const brandMatch =
        part.compatibleBrands.includes(selectedBrand) ||
        part.compatibleBrands.some(
          (b) => b.toLowerCase() === selectedBrand.toLowerCase()
        );

      if (!brandMatch) return false;

      // If model is selected, check model match
      if (selectedModel) {
        return (
          part.compatibleModels.some((m) =>
            m.toLowerCase().includes(selectedModel.toLowerCase())
          ) ||
          part.compatibleModels.some((m) =>
            m.toLowerCase().includes('all')
          )
        );
      }
      return true;
    });
  }, [parts, selectedBrand, selectedModel]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="build" size={20} color={Colors.primary} />
        </View>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>Motorcycle Compatibility Finder</Text>
          <Text style={styles.headerSubtitle}>
            Select your bike to find verified, guaranteed fitting spare parts
          </Text>
        </View>
      </View>

      {/* Step 1: Select Brand */}
      <Text style={styles.stepLabel}>Step 1: Select Brand</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsScroll}
      >
        {MOTORCYCLE_BRANDS.map((brand) => {
          const isSelected = selectedBrand === brand;
          return (
            <Pressable
              key={brand}
              onPress={() => handleSelectBrand(brand)}
              style={({ pressed }) => [
                styles.brandChip,
                isSelected && styles.brandChipActive,
                pressed && styles.chipPressed,
              ]}
            >
              <Text
                style={[
                  styles.brandChipText,
                  isSelected && styles.brandChipTextActive,
                ]}
              >
                {brand}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Step 2: Select Model */}
      {selectedBrand && brandModels.length > 0 && (
        <>
          <Text style={styles.stepLabel}>Step 2: Select Model</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsScroll}
          >
            {brandModels.map((model) => {
              const isSelected = selectedModel === model.name;
              return (
                <Pressable
                  key={model.id}
                  onPress={() => setSelectedModel(model.name)}
                  style={({ pressed }) => [
                    styles.modelChip,
                    isSelected && styles.modelChipActive,
                    pressed && styles.chipPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.modelChipText,
                      isSelected && styles.modelChipTextActive,
                    ]}
                  >
                    {model.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </>
      )}

      {/* Results Header */}
      <View style={styles.resultsBar}>
        <Text style={styles.resultsCount}>
          <Text style={styles.resultsHighlight}>{verifiedProducts.length}</Text> Verified
          Parts for{' '}
          <Text style={styles.resultsBike}>
            {selectedBrand} {selectedModel || ''}
          </Text>
        </Text>
      </View>

      {/* Compatible Products Horizontal List */}
      {verifiedProducts.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsScroll}
        >
          {verifiedProducts.map((part) => (
            <ProductCard key={part.id} part={part} horizontal />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyWrap}>
          <Ionicons name="information-circle-outline" size={32} color={Colors.textMuted} />
          <Text style={styles.emptyText}>
            No specific parts registered yet for this exact model. Contact our Badami Bagh workshop for custom sourcing.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.navy,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.navy,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 6,
    marginBottom: 8,
  },
  chipsScroll: {
    gap: 8,
    paddingBottom: 8,
  },
  brandChip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: Radius.full,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  brandChipActive: {
    backgroundColor: Colors.navy,
    borderColor: Colors.navy,
  },
  brandChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  brandChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  modelChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  modelChipActive: {
    backgroundColor: Colors.primaryMuted,
    borderColor: Colors.primary,
  },
  modelChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  modelChipTextActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
  chipPressed: {
    opacity: 0.75,
  },
  resultsBar: {
    marginTop: 10,
    marginBottom: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  resultsCount: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  resultsHighlight: {
    fontWeight: '800',
    color: Colors.primary,
  },
  resultsBike: {
    fontWeight: '700',
    color: Colors.navy,
  },
  productsScroll: {
    paddingVertical: 4,
  },
  emptyWrap: {
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
