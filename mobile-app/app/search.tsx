import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../components/Input';
import { ProductCard } from '../components/ProductCard';
import { ServiceCard } from '../components/ServiceCard';
import { EmptyState } from '../components/EmptyState';
import { Colors } from '../constants/colors';
import { Radius } from '../constants/theme';
import { INITIAL_SPARE_PARTS, WORKSHOP_SERVICES } from '../data/initialData';

const POPULAR_SEARCHES = [
  'CD 70',
  'CG 125',
  'Engine Oil',
  'Brake Shoe',
  'Tuning',
  'Clutch Plate',
  'Piston',
  'YBR 125',
  'Air Filter',
];

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'parts' | 'services'>('all');

  const matchingParts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return INITIAL_SPARE_PARTS.filter(
      (p) =>
        p.partName.toLowerCase().includes(q) ||
        p.partNumber.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.compatibleBrands.some((b) => b.toLowerCase().includes(q)) ||
        p.compatibleModels.some((m) => m.toLowerCase().includes(q))
    );
  }, [query]);

  const matchingServices = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return WORKSHOP_SERVICES.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.shortDescription.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <View style={styles.container}>
      {/* Search Header Input */}
      <View style={styles.searchHeader}>
        <Input
          placeholder="Search spare parts, SKUs, or workshop services..."
          value={query}
          onChangeText={setQuery}
          autoFocus
          leftIcon={<Ionicons name="search" size={20} color={Colors.primary} />}
          rightIcon={
            query ? (
              <Pressable onPress={() => setQuery('')}>
                <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
              </Pressable>
            ) : null
          }
          containerStyle={styles.searchInputWrap}
        />
      </View>

      {/* Suggested Quick Searches */}
      {!query.trim() && (
        <View style={styles.suggestionsSection}>
          <Text style={styles.suggestionsTitle}>Popular Searches</Text>
          <View style={styles.suggestionsChips}>
            {POPULAR_SEARCHES.map((keyword) => (
              <Pressable
                key={keyword}
                onPress={() => setQuery(keyword)}
                style={({ pressed }) => [
                  styles.suggestionChip,
                  pressed && styles.chipPressed,
                ]}
              >
                <Ionicons name="trending-up" size={13} color={Colors.primary} />
                <Text style={styles.suggestionText}>{keyword}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* Results Filter Tabs */}
      {query.trim().length > 0 && (
        <View style={styles.tabsRow}>
          <Pressable
            onPress={() => setActiveTab('all')}
            style={[styles.tabBtn, activeTab === 'all' && styles.tabBtnActive]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'all' && styles.tabTextActive,
              ]}
            >
              All ({matchingParts.length + matchingServices.length})
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab('parts')}
            style={[styles.tabBtn, activeTab === 'parts' && styles.tabBtnActive]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'parts' && styles.tabTextActive,
              ]}
            >
              Spare Parts ({matchingParts.length})
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab('services')}
            style={[styles.tabBtn, activeTab === 'services' && styles.tabBtnActive]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'services' && styles.tabTextActive,
              ]}
            >
              Services ({matchingServices.length})
            </Text>
          </Pressable>
        </View>
      )}

      {/* Results Scroll List */}
      {query.trim().length > 0 && (
        <FlatList
          data={[
            ...(activeTab === 'all' || activeTab === 'parts' ? matchingParts : []),
            ...(activeTab === 'all' || activeTab === 'services' ? matchingServices : []),
          ]}
          keyExtractor={(item, index) => ('partNumber' in item ? item.id : `srv-${item.id}`)}
          renderItem={({ item }) =>
            'partNumber' in item ? (
              <ProductCard part={item} />
            ) : (
              <ServiceCard service={item} />
            )
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              icon="magnify-remove-outline"
              title="No Results Found"
              message={`We couldn't find any parts or services matching "${query}". Try searching by bike model (e.g. CD70, CG125) or part name.`}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  searchInputWrap: {
    marginBottom: 10,
  },
  suggestionsSection: {
    padding: 18,
  },
  suggestionsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  suggestionsChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: Radius.full,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  suggestionText: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  chipPressed: {
    opacity: 0.7,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 8,
  },
  tabBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
    backgroundColor: '#F1F5F9',
  },
  tabBtnActive: {
    backgroundColor: Colors.navy,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
});
