import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../constants/colors';
import { Radius } from '../constants/theme';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'primary' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  style,
  textStyle,
  size = 'md',
}) => {
  const getBadgeStyle = () => {
    switch (variant) {
      case 'success':
        return { bg: Colors.successLight, text: Colors.success, border: '#A7F3D0' };
      case 'warning':
        return { bg: Colors.warningLight, text: Colors.gold, border: '#FDE68A' };
      case 'error':
        return { bg: Colors.errorLight, text: Colors.error, border: '#FECACA' };
      case 'info':
        return { bg: Colors.infoLight, text: Colors.info, border: '#BFDBFE' };
      case 'primary':
        return { bg: Colors.primaryMuted, text: Colors.primary, border: '#FECDD3' };
      default:
        return { bg: '#F1F5F9', text: Colors.textSecondary, border: '#E2E8F0' };
    }
  };

  const current = getBadgeStyle();

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: current.bg, borderColor: current.border },
        size === 'sm' && styles.badgeSm,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: current.text },
          size === 'sm' && styles.textSm,
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  textSm: {
    fontSize: 9,
    fontWeight: '800',
  },
});
