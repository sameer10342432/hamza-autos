import { StyleSheet, Platform } from 'react-native';
import { Colors } from './colors';

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const Radius = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
} as const;

export const Typography = {
  headingXL: {
    fontSize: 26,
    fontWeight: '800' as const,
    color: Colors.navy,
    letterSpacing: -0.5,
  },
  headingLG: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.navy,
    letterSpacing: -0.3,
  },
  headingMD: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.navy,
  },
  headingSM: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.navy,
  },
  bodyLG: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  bodyMD: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  bodySM: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  caption: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: Colors.textMuted,
  },
  badge: {
    fontSize: 10,
    fontWeight: '700' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
} as const;

export const Shadows = StyleSheet.create({
  card: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
    }),
  },
  elevated: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
    }),
  },
  button: {
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
      default: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
    }),
  },
});
