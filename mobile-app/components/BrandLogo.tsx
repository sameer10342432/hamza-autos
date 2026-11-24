import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

interface BrandLogoProps {
  variant?: 'light' | 'dark' | 'compact';
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'light',
  showSubtitle = true,
}) => {
  const isDark = variant === 'dark';
  const textColor = isDark ? Colors.navy : Colors.textInverse;
  const subtextColor = isDark ? Colors.textSecondary : Colors.textInverseSecondary;

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <View style={styles.gearIcon}>
          <MaterialCommunityIcons name="cog-outline" size={26} color={Colors.primary} />
          <View style={styles.innerBadge}>
            <Text style={styles.hLetter}>H</Text>
          </View>
        </View>
        <View style={styles.liveDot} />
      </View>

      <View style={styles.textContainer}>
        <View style={styles.titleRow}>
          <Text style={[styles.titleMain, { color: textColor }]}>HAMZA </Text>
          <Text style={styles.titleHighlight}>AUTOS</Text>
        </View>
        {showSubtitle && (
          <Text style={[styles.subtitle, { color: subtextColor }]}>
            MOTORCYCLE REPAIR · BADAMI BAGH
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconContainer: {
    position: 'relative',
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.navyLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  gearIcon: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerBadge: {
    position: 'absolute',
  },
  hLetter: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: -0.5,
  },
  liveDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: Colors.navy,
  },
  textContainer: {
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  titleMain: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  titleHighlight: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: 1,
  },
});
