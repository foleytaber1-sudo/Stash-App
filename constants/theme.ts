import { ThemeColor, ThemeMode } from '@/store/store';
import { Platform } from 'react-native';

type ThemeSet = Record<ThemeColor, {
  name: string;
  background: string;
  card: string;
  soft: string;
  button: string;
  accent: string;
  text: string;
  subtext: string;
  border: string;
}>;

export const appThemes: {
  light: ThemeSet;
  dark: ThemeSet;
} = {
  light: {
    green: {
      name: 'Green',
      background: '#F8FFF4',
      card: '#FFFFFF',
      soft: '#EAF8DF',
      button: '#C8FF9B',
      accent: '#2F7D32',
      text: '#111111',
      subtext: '#666666',
      border: '#EEEEEE',
    },
    blue: {
      name: 'Blue',
      background: '#F3F8FF',
      card: '#FFFFFF',
      soft: '#E5EEFF',
      button: '#BFD7FF',
      accent: '#2563EB',
      text: '#111111',
      subtext: '#666666',
      border: '#EEEEEE',
    },
    purple: {
      name: 'Purple',
      background: '#FAF5FF',
      card: '#FFFFFF',
      soft: '#F1E4FF',
      button: '#DDBBFF',
      accent: '#7E22CE',
      text: '#111111',
      subtext: '#666666',
      border: '#EEEEEE',
    },
    orange: {
      name: 'Orange',
      background: '#FFF8EF',
      card: '#FFFFFF',
      soft: '#FFE8CC',
      button: '#FFD3A6',
      accent: '#EA580C',
      text: '#111111',
      subtext: '#666666',
      border: '#EEEEEE',
    },
    pink: {
      name: 'Pink',
      background: '#FFF5FA',
      card: '#FFFFFF',
      soft: '#FFE1F0',
      button: '#FFC4DF',
      accent: '#DB2777',
      text: '#111111',
      subtext: '#666666',
      border: '#EEEEEE',
    },
    yellow: {
      name: 'Yellow',
      background: '#FFFDF2',
      card: '#FFFFFF',
      soft: '#FFF4CC',
      button: '#FFE88A',
      accent: '#D4A017',
      text: '#111111',
      subtext: '#666666',
      border: '#EEEEEE',
    },
    red: {
      name: 'Red',
      background: '#FFF5F5',
      card: '#FFFFFF',
      soft: '#FFE1E1',
      button: '#FFC4C4',
      accent: '#DC2626',
      text: '#111111',
      subtext: '#666666',
      border: '#EEEEEE',
    },
    teal: {
      name: 'Teal',
      background: '#F0FDFA',
      card: '#FFFFFF',
      soft: '#CCFBF1',
      button: '#99F6E4',
      accent: '#0F766E',
      text: '#111111',
      subtext: '#666666',
      border: '#EEEEEE',
    },
    mint: {
      name: 'Mint',
      background: '#F0FDF4',
      card: '#FFFFFF',
      soft: '#DCFCE7',
      button: '#BBF7D0',
      accent: '#059669',
      text: '#111111',
      subtext: '#666666',
      border: '#EEEEEE',
    },
    navy: {
      name: 'Navy',
      background: '#F1F5FF',
      card: '#FFFFFF',
      soft: '#DBEAFE',
      button: '#BFDBFE',
      accent: '#1E3A8A',
      text: '#111111',
      subtext: '#666666',
      border: '#EEEEEE',
    },
    brown: {
      name: 'Brown',
      background: '#FFF7ED',
      card: '#FFFFFF',
      soft: '#FED7AA',
      button: '#FDBA74',
      accent: '#92400E',
      text: '#111111',
      subtext: '#666666',
      border: '#EEEEEE',
    },
    gray: {
      name: 'Gray',
      background: '#F9FAFB',
      card: '#FFFFFF',
      soft: '#E5E7EB',
      button: '#D1D5DB',
      accent: '#4B5563',
      text: '#111111',
      subtext: '#666666',
      border: '#EEEEEE',
    },
  },

  dark: {
    green: {
      name: 'Green',
      background: '#101510',
      card: '#181F18',
      soft: '#1F2B1F',
      button: '#2E4F2E',
      accent: '#8FFF90',
      text: '#F5FFF5',
      subtext: '#B8C7B8',
      border: '#2C3A2C',
    },
    blue: {
      name: 'Blue',
      background: '#0F141F',
      card: '#171D2A',
      soft: '#1D2940',
      button: '#243D68',
      accent: '#8BB8FF',
      text: '#F4F8FF',
      subtext: '#B7C4D8',
      border: '#2A3854',
    },
    purple: {
      name: 'Purple',
      background: '#15101B',
      card: '#21182B',
      soft: '#2B1F3A',
      button: '#43275F',
      accent: '#D7A6FF',
      text: '#FCF7FF',
      subtext: '#CDBBD8',
      border: '#3A2A4C',
    },
    orange: {
      name: 'Orange',
      background: '#18120C',
      card: '#241A11',
      soft: '#332415',
      button: '#5A3518',
      accent: '#FFB36B',
      text: '#FFF8EF',
      subtext: '#D8C0A8',
      border: '#46301C',
    },
    pink: {
      name: 'Pink',
      background: '#1A1015',
      card: '#271821',
      soft: '#371F2B',
      button: '#602542',
      accent: '#FF9ACB',
      text: '#FFF7FB',
      subtext: '#D9B7C8',
      border: '#4B2B3A',
    },
    yellow: {
      name: 'Yellow',
      background: '#17150D',
      card: '#222013',
      soft: '#302B16',
      button: '#5C4B17',
      accent: '#FFE27A',
      text: '#FFFDF2',
      subtext: '#D6CDA8',
      border: '#453B1B',
    },
    red: {
      name: 'Red',
      background: '#1A1010',
      card: '#271818',
      soft: '#371F1F',
      button: '#602525',
      accent: '#FF9A9A',
      text: '#FFF7F7',
      subtext: '#D9B7B7',
      border: '#4B2B2B',
    },
    teal: {
      name: 'Teal',
      background: '#0B1716',
      card: '#112321',
      soft: '#17312E',
      button: '#1D4F49',
      accent: '#7FFFEA',
      text: '#F2FFFD',
      subtext: '#A8D8D1',
      border: '#254A45',
    },
    mint: {
      name: 'Mint',
      background: '#0D1711',
      card: '#13231A',
      soft: '#193124',
      button: '#24513A',
      accent: '#86F7B8',
      text: '#F4FFF8',
      subtext: '#AED8BD',
      border: '#294A35',
    },
    navy: {
      name: 'Navy',
      background: '#0D1120',
      card: '#141A2E',
      soft: '#1B2540',
      button: '#263A6B',
      accent: '#9DB7FF',
      text: '#F4F7FF',
      subtext: '#B6C2DA',
      border: '#2A3658',
    },
    brown: {
      name: 'Brown',
      background: '#17110C',
      card: '#241A11',
      soft: '#332315',
      button: '#5A3418',
      accent: '#DFA56C',
      text: '#FFF8F0',
      subtext: '#D8BFA8',
      border: '#46301C',
    },
    gray: {
      name: 'Gray',
      background: '#111315',
      card: '#1A1D20',
      soft: '#24282D',
      button: '#3A4047',
      accent: '#CBD5E1',
      text: '#F8FAFC',
      subtext: '#B8C0CA',
      border: '#343A42',
    },
  },
};

export const getTheme = (
  themeColor: ThemeColor,
  themeMode: ThemeMode = 'light'
) => {
  return appThemes[themeMode]?.[themeColor] ?? appThemes.light.green;
};

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: '#2F7D32',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#2F7D32',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: '#fff',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
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
      "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});