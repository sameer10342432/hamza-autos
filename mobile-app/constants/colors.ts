/**
 * Hamza Autos - Mobile Design Tokens and Brand Colors
 * Established brand identity:
 * - Primary Red: #E60012
 * - Navy / Primary Dark: #10182B
 * - White: #FFFFFF
 * - Light Background: #F5F7FA
 * - Secondary Text: #64748B
 */

export const Colors = {
  // Brand Core
  primary: '#E60012',
  primaryDark: '#B8000E',
  primaryLight: '#FF3344',
  primaryMuted: '#FFF1F2',

  // Dark & Neutral Core
  navy: '#10182B',
  navyLight: '#1E293B',
  navyCard: '#162238',
  slateDark: '#0F172A',

  // Surfaces & Backgrounds
  background: '#F5F7FA',
  backgroundSecondary: '#EDF1F7',
  surface: '#FFFFFF',
  surfaceSubtle: '#F8FAFC',
  surfaceElevated: '#FFFFFF',

  // Typography
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',
  textInverseSecondary: '#CBD5E1',

  // Borders & Dividers
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  borderDark: '#334155',

  // Semantic Feedback
  success: '#10B981',
  successLight: '#ECFDF5',
  warning: '#F59E0B',
  warningLight: '#FFFBEB',
  error: '#EF4444',
  errorLight: '#FEF2F2',
  info: '#3B82F6',
  infoLight: '#EFF6FF',

  // Accents
  gold: '#D97706',
  goldLight: '#FEF3C7',
  whatsapp: '#25D366',
  whatsappDark: '#128C7E',
} as const;

export type ColorName = keyof typeof Colors;
