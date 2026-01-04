export const COLORS = {
  // Spiritual, calming palette
  background: '#FFF9F5',      // Warm cream
  card: '#FFFFFF',
  primary: '#8B7355',         // Earth brown
  secondary: '#A0937D',       // Soft taupe
  accent: '#6B8E23',          // Olive green
  text: '#2C2C2C',
  textLight: '#6B6B6B',
  border: '#E8E0D5',
  success: '#6B8E23',
  error: '#C14A39',
  shadow: 'rgba(139, 115, 85, 0.15)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const TYPOGRAPHY = {
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: COLORS.text,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  body: {
    fontSize: 16,
    color: COLORS.text,
  },
  caption: {
    fontSize: 14,
    color: COLORS.textLight,
  },
};

export const SHADOWS = {
  small: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
};
