/**
 * CueFinder Theme Configuration
 * Unified color palette and design tokens for consistency across platforms
 */

export const colors = {
  // Primary brand colors - matching iOS system colors
  primary: {
    DEFAULT: '#007AFF', // iOS system blue
    50: '#E5F2FF',
    100: '#CCE5FF',
    200: '#99CCFF',
    300: '#66B2FF',
    400: '#3399FF',
    500: '#007AFF',
    600: '#0062CC',
    700: '#004A99',
    800: '#003166',
    900: '#001933',
  },
  
  // Semantic colors for consistent meaning across platforms
  success: {
    DEFAULT: '#34C759', // iOS system green
    light: '#D1F2D9',
    dark: '#248A3D',
  },
  
  warning: {
    DEFAULT: '#FF9500', // iOS system orange
    light: '#FFE5CC',
    dark: '#C77400',
  },
  
  error: {
    DEFAULT: '#FF3B30', // iOS system red
    light: '#FFD4D1',
    dark: '#D70015',
  },
  
  info: {
    DEFAULT: '#5856D6', // iOS system purple
    light: '#E5E5F7',
    dark: '#3634A3',
  },
  
  // Neutral colors
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Background colors matching iOS systemGray6
  background: {
    primary: '#FFFFFF',
    secondary: '#F2F2F7', // iOS systemGray6 equivalent
    tertiary: '#E5E5EA',
  },
};

export const spacing = {
  xs: '0.5rem',   // 8px
  sm: '0.75rem',  // 12px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
};

export const borderRadius = {
  sm: '0.375rem',  // 6px - small buttons
  md: '0.5rem',    // 8px - buttons
  lg: '0.75rem',   // 12px - cards (matching iOS)
  xl: '1rem',      // 16px
  full: '9999px',  // Pills
};

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
};

// Status colors for bookings
export const bookingStatus = {
  pending: {
    bg: colors.warning.light,
    text: colors.warning.dark,
    label: 'Pending',
  },
  confirmed: {
    bg: colors.success.light,
    text: colors.success.dark,
    label: 'Confirmed',
  },
  checked_in: {
    bg: '#CCE5FF',
    text: '#0062CC',
    label: 'Checked In',
  },
  cancelled: {
    bg: colors.error.light,
    text: colors.error.dark,
    label: 'Cancelled',
  },
  completed: {
    bg: colors.gray[100],
    text: colors.gray[700],
    label: 'Completed',
  },
  no_show: {
    bg: colors.error.light,
    text: colors.error.dark,
    label: 'No Show',
  },
};

// Table status colors
export const tableStatus = {
  available: {
    bg: colors.success.light,
    text: colors.success.dark,
    icon: 'check-circle',
  },
  occupied: {
    bg: colors.warning.light,
    text: colors.warning.dark,
    icon: 'clock',
  },
  reserved: {
    bg: '#CCE5FF',
    text: '#0062CC',
    icon: 'calendar',
  },
  maintenance: {
    bg: colors.gray[100],
    text: colors.gray[700],
    icon: 'wrench',
  },
};

// Typography scales
export const typography = {
  // Headings
  h1: 'text-4xl font-bold',
  h2: 'text-3xl font-bold',
  h3: 'text-2xl font-semibold',
  h4: 'text-xl font-semibold',
  h5: 'text-lg font-medium',
  h6: 'text-base font-medium',
  
  // Body
  body: 'text-base',
  bodySmall: 'text-sm',
  caption: 'text-xs',
  
  // Special
  label: 'text-sm font-medium',
  button: 'text-sm font-semibold',
};

// Component styles for consistency
export const components = {
  card: `bg-white rounded-xl shadow-sm border border-gray-100`,
  button: {
    primary: `bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors`,
    secondary: `bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors`,
    danger: `bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors`,
    success: `bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors`,
  },
  input: `w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`,
  label: `block text-sm font-medium text-gray-700 mb-1`,
};

export default {
  colors,
  spacing,
  borderRadius,
  shadows,
  bookingStatus,
  tableStatus,
  typography,
  components,
};