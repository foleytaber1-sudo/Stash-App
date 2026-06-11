import { currencies } from '@/constants/currency';
import { getTheme } from '@/constants/theme';
import { ThemeColor, useStashStore } from '@/store/store';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const themes: {
  id: ThemeColor;
  name: string;
  accent: string;
}[] = [
  { id: 'green', name: 'Green', accent: '#2F7D32' },
  { id: 'blue', name: 'Blue', accent: '#2563EB' },
  { id: 'purple', name: 'Purple', accent: '#7E22CE' },
  { id: 'orange', name: 'Orange', accent: '#EA580C' },
  { id: 'pink', name: 'Pink', accent: '#DB2777' },
  { id: 'yellow', name: 'Yellow', accent: '#D4A017' },
  { id: 'red', name: 'Red', accent: '#DC2626' },
  { id: 'teal', name: 'Teal', accent: '#0F766E' },
  { id: 'mint', name: 'Mint', accent: '#059669' },
  { id: 'navy', name: 'Navy', accent: '#1E3A8A' },
  { id: 'brown', name: 'Brown', accent: '#92400E' },
  { id: 'gray', name: 'Gray', accent: '#4B5563' },
];

export default function SettingsScreen() {
  const [showThemes, setShowThemes] = useState(false);
  const [showCurrencies, setShowCurrencies] = useState(false);

  const resetApp = useStashStore((state) => state.resetApp);
  const themeColor = useStashStore((state) => state.themeColor);
  const themeMode = useStashStore((state) => state.themeMode);
  const currency = useStashStore((state) => state.currency);
  const setThemeColor = useStashStore((state) => state.setThemeColor);
  const setThemeMode = useStashStore((state) => state.setThemeMode);
  const setCurrency = useStashStore((state) => state.setCurrency);

  const theme = getTheme(themeColor, themeMode);
  const activeThemeOption =
    themes.find((themeOption) => themeOption.id === themeColor) ?? themes[0];

  const activeCurrency =
    currencies.find((currencyOption) => currencyOption.code === currency) ??
    currencies[0];

  const handleReset = () => {
    Alert.alert(
      'Reset Stash?',
      'This will permanently delete all accounts, envelopes, goals, and transactions.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset Everything', style: 'destructive', onPress: resetApp },
      ]
    );
  };

  const comingSoon = (feature: string) => {
    Alert.alert('Coming Soon', `${feature} will be added soon.`);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
      <Text style={[styles.subtitle, { color: theme.subtext }]}>
        Customize Stash and manage your app.
      </Text>

      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Customize</Text>

        <TouchableOpacity
          style={[styles.option, { borderTopColor: theme.border }]}
          onPress={() => {
            setShowThemes(!showThemes);
            setShowCurrencies(false);
          }}
        >
          <View style={styles.optionLeft}>
            <View
              style={[styles.smallColorCircle, { backgroundColor: theme.accent }]}
            />
            <Text style={[styles.optionText, { color: theme.text }]}>
              🎨 Theme Color
            </Text>
          </View>

          <Text style={[styles.activeThemeText, { color: theme.accent }]}>
            {activeThemeOption.name} {showThemes ? '⌃' : '⌄'}
          </Text>
        </TouchableOpacity>

        {showThemes && (
          <View style={[styles.dropdown, { borderTopColor: theme.border }]}>
            <View style={styles.themeGrid}>
              {themes.map((themeOption) => {
                const isSelected = themeOption.id === themeColor;
                const previewTheme = getTheme(themeOption.id, themeMode);

                return (
                  <TouchableOpacity
                    key={themeOption.id}
                    style={[
                      styles.themeCircleButton,
                      {
                        backgroundColor: previewTheme.accent,
                        borderColor: isSelected ? theme.text : 'transparent',
                      },
                    ]}
                    onPress={() => {
                      setThemeColor(themeOption.id);
                      setShowThemes(false);
                    }}
                  >
                    {isSelected && <Text style={styles.themeCheck}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[styles.themeNameText, { color: theme.subtext }]}>
              Selected: {activeThemeOption.name}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.option, { borderTopColor: theme.border }]}
          onPress={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
        >
          <View style={styles.optionLeft}>
            <Text style={[styles.optionText, { color: theme.text }]}>
              🌙 Dark Mode
            </Text>
          </View>

          <View
            style={[
              styles.togglePill,
              {
                backgroundColor: themeMode === 'dark' ? theme.accent : theme.soft,
              },
            ]}
          >
            <Text
              style={[
                styles.toggleText,
                { color: themeMode === 'dark' ? '#111111' : theme.subtext },
              ]}
            >
              {themeMode === 'dark' ? 'ON' : 'OFF'}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, { borderTopColor: theme.border }]}
          onPress={() => {
            setShowCurrencies(!showCurrencies);
            setShowThemes(false);
          }}
        >
          <View>
            <Text style={[styles.optionText, { color: theme.text }]}>
              💵 Currency Selection
            </Text>
            <Text style={[styles.optionSubtext, { color: theme.subtext }]}>
              Changes how money displays across Stash
            </Text>
          </View>

          <Text style={[styles.activeThemeText, { color: theme.accent }]}>
            {activeCurrency.flag} {activeCurrency.code} {showCurrencies ? '⌃' : '⌄'}
          </Text>
        </TouchableOpacity>

        {showCurrencies && (
          <View style={[styles.dropdown, { borderTopColor: theme.border }]}>
            {currencies.map((currencyOption) => {
              const isSelected = currencyOption.code === currency;

              return (
                <TouchableOpacity
                  key={currencyOption.code}
                  style={[
                    styles.dropdownOption,
                    {
                      backgroundColor: isSelected ? theme.soft : theme.card,
                    },
                  ]}
                  onPress={() => {
                    setCurrency(currencyOption.code);
                    setShowCurrencies(false);
                  }}
                >
                  <View>
                    <Text style={[styles.dropdownText, { color: theme.text }]}>
                      {currencyOption.flag} {currencyOption.name}
                    </Text>
                    <Text style={[styles.currencySubtext, { color: theme.subtext }]}>
                      {currencyOption.code} • {currencyOption.symbol}
                    </Text>
                  </View>

                  {isSelected && (
                    <Text style={[styles.checkmark, { color: theme.accent }]}>✓</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Notifications</Text>

        <TouchableOpacity
          style={[styles.option, { borderTopColor: theme.border }]}
          onPress={() => router.push('/payday-reminder')}
        >
          <Text style={[styles.optionText, { color: theme.text }]}>
            💸 Payday Reminder
          </Text>
          <Text style={[styles.arrow, { color: theme.subtext }]}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, { borderTopColor: theme.border }]}
          onPress={() => comingSoon('Overspending alerts')}
        >
          <Text style={[styles.optionText, { color: theme.text }]}>
            🚨 Overspending Alerts
          </Text>
          <Text style={[styles.arrow, { color: theme.subtext }]}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Security</Text>

        <TouchableOpacity
          style={[styles.option, { borderTopColor: theme.border }]}
          onPress={() => comingSoon('PIN lock')}
        >
          <Text style={[styles.optionText, { color: theme.text }]}>🔐 PIN Lock</Text>
          <Text style={[styles.arrow, { color: theme.subtext }]}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, { borderTopColor: theme.border }]}
          onPress={() => comingSoon('Face ID')}
        >
          <Text style={[styles.optionText, { color: theme.text }]}>🙂 Face ID</Text>
          <Text style={[styles.arrow, { color: theme.subtext }]}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Data</Text>

        <TouchableOpacity
          style={[styles.option, { borderTopColor: theme.border }]}
          onPress={() => comingSoon('Backup and restore')}
        >
          <Text style={[styles.optionText, { color: theme.text }]}>
            ☁️ Backup / Restore
          </Text>
          <Text style={[styles.arrow, { color: theme.subtext }]}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, { borderTopColor: theme.border }]}
          onPress={() => comingSoon('Transaction export')}
        >
          <Text style={[styles.optionText, { color: theme.text }]}>
            📤 Export Transactions
          </Text>
          <Text style={[styles.arrow, { color: theme.subtext }]}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Help & Support</Text>

        <TouchableOpacity
          style={[styles.option, { borderTopColor: theme.border }]}
          onPress={() => router.push('/help-center')}
        >
          <View>
            <Text style={[styles.optionText, { color: theme.text }]}>
              ❓ FAQ / Help Center
            </Text>
            <Text style={[styles.optionSubtext, { color: theme.subtext }]}>
              Help, bug reports, feature requests, and support
            </Text>
          </View>
          <Text style={[styles.arrow, { color: theme.subtext }]}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>About</Text>

        <TouchableOpacity
          style={[styles.option, { borderTopColor: theme.border }]}
          onPress={() => comingSoon("What's new")}
        >
          <Text style={[styles.optionText, { color: theme.text }]}>🆕 What’s New</Text>
          <Text style={[styles.arrow, { color: theme.subtext }]}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, { borderTopColor: theme.border }]}
          onPress={() => comingSoon('Privacy policy')}
        >
          <Text style={[styles.optionText, { color: theme.text }]}>
            🔒 Privacy Policy
          </Text>
          <Text style={[styles.arrow, { color: theme.subtext }]}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, { borderTopColor: theme.border }]}
          onPress={() => comingSoon('Terms of service')}
        >
          <Text style={[styles.optionText, { color: theme.text }]}>
            📄 Terms of Service
          </Text>
          <Text style={[styles.arrow, { color: theme.subtext }]}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, { borderTopColor: theme.border }]}
          onPress={() => comingSoon('Rate Stash')}
        >
          <Text style={[styles.optionText, { color: theme.text }]}>⭐ Rate Stash</Text>
          <Text style={[styles.arrow, { color: theme.subtext }]}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, { borderTopColor: theme.border }]}
          onPress={() => comingSoon('Share Stash')}
        >
          <Text style={[styles.optionText, { color: theme.text }]}>📲 Share Stash</Text>
          <Text style={[styles.arrow, { color: theme.subtext }]}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.aboutCard, { backgroundColor: theme.soft }]}>
        <Text style={[styles.aboutTitle, { color: theme.text }]}>About Stash</Text>
        <Text style={[styles.aboutText, { color: theme.subtext }]}>
          Stash is a virtual cash-stuffing app built to help you organize money into
          envelopes, track spending, and stay motivated with goals and insights.
        </Text>
        <Text style={[styles.version, { color: theme.accent }]}>Version 1.0.0</Text>
      </View>

      <View style={styles.dangerCard}>
        <Text style={styles.dangerTitle}>Danger Zone</Text>
        <Text style={styles.dangerText}>
          Resetting will erase all local app data. This cannot be undone.
        </Text>

        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetText}>Reset App Data</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  title: {
    fontSize: 34,
    fontWeight: '900',
    marginTop: 60,
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 22,
  },

  card: {
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 8,
  },

  option: {
    paddingVertical: 15,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  optionText: {
    fontSize: 16,
    fontWeight: '800',
  },

  optionSubtext: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
    maxWidth: 260,
  },

  activeThemeText: {
    fontSize: 15,
    fontWeight: '900',
  },

  smallColorCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },

  dropdown: {
    borderTopWidth: 1,
    paddingTop: 8,
    paddingBottom: 8,
  },

  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingTop: 8,
    paddingBottom: 8,
  },

  themeCircleButton: {
    width: 42,
    height: 42,
    borderRadius: 999,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },

  themeCheck: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },

  themeNameText: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 4,
  },

  dropdownOption: {
    padding: 13,
    borderRadius: 14,
    marginBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  dropdownText: {
    fontSize: 15,
    fontWeight: '800',
  },

  currencySubtext: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 3,
  },

  checkmark: {
    fontSize: 18,
    fontWeight: '900',
  },

  togglePill: {
    minWidth: 54,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    alignItems: 'center',
  },

  toggleText: {
    fontSize: 12,
    fontWeight: '900',
  },

  arrow: {
    fontSize: 26,
    fontWeight: '800',
  },

  aboutCard: {
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
  },

  aboutTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 8,
  },

  aboutText: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
  },

  version: {
    fontSize: 14,
    fontWeight: '900',
    marginTop: 12,
  },

  dangerCard: {
    backgroundColor: '#FFF1F1',
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
  },

  dangerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#9B1C1C',
    marginBottom: 6,
  },

  dangerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7A3333',
    marginBottom: 14,
    lineHeight: 20,
  },

  resetButton: {
    backgroundColor: '#FFB3B3',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
  },

  resetText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#7A0000',
  },
});