/**
 * Design System Tokens
 * 
 * This file contains the design system tokens that should be used
 * throughout the application to maintain visual consistency.
 */

export const designTokens = {
  // Cosmic Violet Color Palette
  cosmicViolet: {
    darkAmethyst: '#240046', // Background
    indigoInk: '#3c096c', // Surface / Cards
    indigoVelvet: '#5a189a', // Secondary Actions
    royalViolet: '#7b2cbf', // Primary Highlights
    lavenderPurple: '#9d4edd', // Accents
  },

  // Color Palette
  colors: {
    // Primary colors (Cosmic Violet theme)
    primary: {
      background: '#240046', // Dark Amethyst - Deep purple background
      button: '#3c096c', // Indigo Ink - Slightly lighter purple for buttons
      accent: '#7b2cbf', // Royal Violet - Primary accent color
    },

    // Secondary colors
    secondary: {
      surface: '#3c096c', // Indigo Ink - Surface / Cards
      action: '#5a189a', // Indigo Velvet - Secondary actions
      accent: '#9d4edd', // Lavender Purple - Accents
    },

    // Text colors
    text: {
      primary: '#ffffff', // White for headings
      secondary: '#000000', // Black for body text
      muted: '#767676', // Gray for muted text
      dark: '#242323', // Dark gray
    },

    // Background colors
    background: {
      primary: '#240046', // Dark Amethyst - Main background
      secondary: '#3c096c', // Indigo Ink - Secondary background
      light: '#f7f2ff', // Light purple tint
      white: '#ffffff',
      card: 'rgba(255, 255, 255, 0.1)', // Semi-transparent white
    },

    // Border colors
    border: {
      primary: '#7b2cbf', // Royal Violet
      secondary: '#efefef',
      muted: '#bdbdbd',
    },

    // Success colors
    success: {
      primary: '#a9f1cb', // Green tint
    },
  },
  
  // Typography
  typography: {
    // Font families
    fontFamily: {
      sans: 'Geist, "Geist Placeholder", sans-serif',
      secondary: 'Inter, "Inter Placeholder", sans-serif',
      mono: '"Geist Mono", monospace',
    },
    
    // Font sizes
    fontSize: {
      h1: '48px',
      h2: '22px',
      h3: '20px',
      h4: '16px',
      h5: '14px',
      h6: '12px',
      body: '12px',
      small: '11px',
    },
    
    // Font weights
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    
    // Line heights
    lineHeight: {
      h1: '57.6px', // 1.2
      h2: '28px', // 1.27
      h4: '24px', // 1.5
      h6: '16px', // 1.33
      body: 'normal',
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
    
    // Letter spacing
    letterSpacing: {
      h1: '-0.96px', // Tight for large headings
      normal: 'normal',
      wide: '0.5px',
    },
  },
  
  // Spacing
  spacing: {
    // Base spacing unit (4px)
    unit: '4px',
    
    // Padding
    padding: {
      xs: '8px',
      sm: '12px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      '2xl': '48px',
      '3xl': '64px',
      '4xl': '80px',
      '5xl': '96px',
    },
    
    // Button padding
    button: {
      sm: '8px 12px',
      md: '10px 16px',
      lg: '12px 20px',
    },
    
    // Section padding
    section: {
      sm: '32px 16px',
      md: '64px 16px',
      lg: '80px 16px',
      xl: '96px 32px',
    },
    
    // Margin
    margin: {
      xs: '8px',
      sm: '12px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      '2xl': '48px',
      '3xl': '64px',
    },
  },
  
  // Border radius
  borderRadius: {
    none: '0',
    sm: '2px',
    md: '4px', // Default for buttons
    lg: '8px',
    xl: '12px',
    '2xl': '16px',
    full: '9999px',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  
  // Transitions
  transitions: {
    fast: '150ms ease-in-out',
    base: '200ms ease-in-out',
    slow: '300ms ease-in-out',
  },
  
  // Z-index
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
} as const;

export type DesignTokens = typeof designTokens;
