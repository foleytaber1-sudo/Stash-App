import { ThemeColor } from '@/store/store';
import { Platform } from 'react-native';

const tintColorLight = '#2F7D32';
const tintColorDark = '#fff';

export const appThemes = {
  green: {
    name: 'Green',
    background: '#F8FFF4',
    accent: '#2F7D32',
    soft: '#EAF8DF',
    button: '#C8FF9B',
  },
  blue: {
    name: 'Blue',
    background: '#F3F8FF',
    accent: '#2563EB',
    soft: '#E5EEFF',
    button: '#BFD7FF',
  },
  purple: {
    name: 'Purple',
    background: '#FAF5FF',
    accent: '#7E22CE',
    soft: '#F1E4FF',
    button: '#DDBBFF',
  },
  orange: {
    name: 'Orange',
    background: '#FFF8EF',
    accent: '#EA580C',
    soft: '#FFE8CC',
    button: '#FFD3A6',
  },
  pink: {
    name: 'Pink',
    background: '#FFF5FA',
    accent: '#DB2777',
    soft: '#FFE1F0',
    button: '#FFC4DF',
  },
  yellow: {
    name: 'Yellow',
    background: '#FFFDF2',
    accent: '#D4A017',
    soft: '#FFF4CC',
    button: '#FFE88A',
  },
};

export const getTheme = (themeColor: ThemeColor) => {
  return appThemes[themeColor] ?? appThemes.green;
};

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono:
      "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});