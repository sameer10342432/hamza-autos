import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BrandHeader } from '../../components/BrandHeader';
import { ProductCard } from '../../components/ProductCard';
import { Input } from '../../components/Input';
import { EmptyState } from '../../components/EmptyState';
import { Colors } from '../../constants/colors';
import { Radius } from '../../constants/theme';
import { INITIAL_SPARE_PARTS, MOTORCYCLE_BRANDS } from '../../data/initialData';
import { MobileApiService } from '../../services/api';
import { SparePart, BikeBrand } from '../../types';

const CATEGORIES = [
  'All',
  'Engine Parts',
  'Clutch Parts',
  'Brake Parts',
  'Electrical Parts',
  'Carburettor & Fuel System',
  'Chain & Sprocket',
  'Tyres & Tubes',
  'Filters',
  'Cables & Controls',
  'Lights & Indicators',
  'Batteries',
  'Oils & Lubricants',
  'Bike Accessories',
  'Other Spare Parts',
];

export default function ShopScreen() {
  const params = useLocalSearchParams<{ brand?: string; category?: string }>();
  const [products, setProducts] = useState<SparePart[]>(INITIAL_SPARE_PARTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(params.category || 'All');
  const [selectedBrand, setSelectedBrand] = useState<string>(params.brand || 'All');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (params.brand) setSelectedBrand(params.brand);
    if (params.category) setSelectedCategory(params.category);
  }, [params.brand, params.category]);

  const loadProducts = async () => {
    try {
      const res = await MobileApiService.getProducts();
      if (res.success && res.data) {
        setProducts(res.data);
      }
    } catch (err) {
      console.warn('Error loading shop products:', err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  // Filter products by search query, category, and brand
  const filteredProducts = useMemo(() => {
    return products.filter((part) => {
      // Search match (name, SKU, description)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = part.partName.toLowerCase().includes(q);
        const matchesSku = part.partNumber.toLowerCase().includes(q);
        const matchesDesc = (part.description || '').toLowerCase().includes(q);
        if (!matchesName && !matchesSku && !matchesDesc) return false;
      }

      // Category match
      if (selectedCategory !== 'All') {
        const catClean = selectedCategory.toLowerCase().replace(/[^a-z]/g, '');
        const partCatClean = part.category.toLowerCase().replace(/[^a-z]/g, '');
        if (!partCatClean.includes(catClean) && !catClean.includes(partCatClean)) {
          return false;
        }
      }

      // Brand match
      if (selectedBrand !== 'All') {
        const brandMatch = part.compatibleBrands.some(
          (b) => b.toLowerCase() === selectedBrand.toLowerCase()
        );
        if (!brandMatch) return false;
      }

      return true;
    });
  }, [products, searchQuery, selectedCategory, selectedBrand]);

  return (
    <View style={styles.container}>
      <BrandHeader title="Spare Parts Store" showSearch={false} showCart />

      {/* Search Input Bar */}
      <View style={styles.searchBar}>
        <Input
          placeholder="Search parts by name, SKU (e.g. CD70, piston, oil)..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Ionicons name="search" size={18} color={Colors.textSecondary} />}
          rightIcon={
            searchQuery ? (
              <Pressable onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
              </Pressable>
            ) : null
          }
          containerStyle={styles.searchInputContainer}
        />
      </View>

      {/* Brand Filters Horizontal Bar */}
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          <Pressable
            onPress={() => setSelectedBrand('All')}
            style={[styles.brandPill, selectedBrand === 'All' && styles.brandPillActive]}
          >
            <Text style={[styles.brandPillText, selectedBrand === 'All' && styles.brandPillTextActive]}>
              All Makes
            </Text>
          </Pressable>
          {MOTORCYCLE_BRANDS.map((brand) => (
            <Pressable
              key={brand}
              onPress={() => setSelectedBrand(brand)}
              style={[styles.brandPill, selectedBrand === brand && styles.brandPillActive]}
            >
              <Text style={[styles.brandPillText, selectedBrand === brand && styles.brandPillTextActive]}>
                {brand}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Category Pills Horizontal Bar */}
      <View style={styles.categorySection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[styles.catPill, isSelected && styles.catPillActive]}
              >
                <Text style={[styles.catPillText, isSelected && styles.catPillTextActive]}>
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Results Header */}
      <View style={styles.resultsInfoRow}>
        <Text style={styles.resultsCount}>
          Showing <Text style={styles.countBold}>{filteredProducts.length}</Text> spare parts
        </Text>
        {(selectedBrand !== 'All' || selectedCategory !== 'All' || searchQuery) && (
          <Pressable
            onPress={() => {
              setSelectedBrand('All');
              setSelectedCategory('All');
              setSearchQuery('');
            }}
          >
            <Text style={styles.clearFiltersText}>Reset Filters</Text>
          </Pressable>
        )}
      </View>

      {/* Product Grid / List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard part={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="car-battery"
            title="No Matching Spare Parts"
            message="No products match your active search and motorcycle filter. Try selecting 'All Makes' or search with a different keyword."
            actionTitle="Reset All Filters"
            onAction={() => {
              setSelectedBrand('All');
              setSelectedCategory('All');
              setSearchQuery('');
            }}
          />
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
  searchBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  searchInputContainer: {
    marginBottom: 10,
  },
  filterSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  categorySection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  brandPill: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: Radius.full,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  brandPillActive: {
    backgroundColor: Colors.navy,
    borderColor: Colors.navy,
  },
  brandPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  brandPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  catPill: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  catPillActive: {
    backgroundColor: Colors.primaryMuted,
    borderColor: Colors.primary,
  },
  catPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  catPillTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  resultsInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  resultsCount: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  countBold: {
    fontWeight: '700',
    color: Colors.navy,
  },
  clearFiltersText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});
