export const COLORS = {
  navy:       '#0A1931',   // App bars, headers, splash
  blue:       '#1565C0',   // Primary buttons, active states, user chat bubbles
  teal:       '#00897B',   // AI responses, success, agent indicators
  cyan:       '#00BCD4',   // Complaint ID badge, icons, highlights
  amber:      '#F59E0B',   // Warnings, L2 escalation, offline banner
  red:        '#E53935',   // Fraud, errors, L3, card block
  bgLight:    '#F5F7FA',   // All screen backgrounds
  bgGrey:     '#E8EDF5',   // Input backgrounds, dividers
  white:      '#FFFFFF',   // Card surfaces
  textPrimary:'#0A1931',
  textMuted:  '#6B7280',
  textLight:  '#9CA3AF',
  success:    '#00897B',
  blueLight:  '#B5D4F4',
  navyLight:  '#1A237E',
  shadow: {
    elevation: 2,
    shadowColor: '#0A1931',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
};

export const FONTS = {
  regular:    { fontFamily: 'System',   fontWeight: '400' as const },
  medium:     { fontFamily: 'System',   fontWeight: '500' as const },
  semibold:   { fontFamily: 'System',   fontWeight: '600' as const },
  mono:       { fontFamily: 'monospace', fontWeight: '400' as const },
};

export const RADIUS = { sm: 6, md: 8, lg: 12, xl: 16, full: 999 };

export const SHADOW = {
  card: {
    elevation: 2,
    shadowColor: '#0A1931',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
};
