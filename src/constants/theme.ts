/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1A202C',
    textSecondary: '#4A5568',
    textMuted: '#718096',
    background: '#F7FAFC',
    cardBackground: '#FFFFFF',
    backgroundElement: '#EDF2F7',
    backgroundSelected: '#E2E8F0',
    border: '#CBD5E0',
    tint: '#2B6CB0',
    tabIconDefault: '#718096',
    tabIconSelected: '#2B6CB0',
    danger: '#E53E3E',
    dangerBackground: '#FFF5F5',
    success: '#38A169',
    successBackground: '#F0FFF4',
    cardShadow: 'rgba(0, 0, 0, 0.06)',
  },
  dark: {
    text: '#F7FAFC',
    textSecondary: '#CBD5E0',
    textMuted: '#A0AEC0',
    background: '#121214',
    cardBackground: '#1E2024',
    backgroundElement: '#2A2D34',
    backgroundSelected: '#363A42',
    border: '#3B4048',
    tint: '#63B3ED',
    tabIconDefault: '#A0AEC0',
    tabIconSelected: '#63B3ED',
    danger: '#FC8181',
    dangerBackground: '#3C1618',
    success: '#68D391',
    successBackground: '#173623',
    cardShadow: 'rgba(0, 0, 0, 0.4)',
  },
} as const;

export type ThemeColors = (typeof Colors)[keyof typeof Colors];
export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
