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
  emoji: string;
  background: string;
  accent: string;
  soft: string;
}[] = [
  { id: 'green', name: 'Green', emoji: '🌿', background: '#F8FFF4', accent: '#2F7D32', soft: '#EAF8DF' },
  { id: 'blue', name: 'Blue', emoji: '💧', background: '#F3F8FF', accent: '#2563EB', soft: '#E5EEFF' },
  { id: 'purple', name: 'Purple', emoji: '🔮', background: '#FAF5FF', accent: '#7E22CE', soft: '#F1E4FF' },
  { id: 'orange', name: 'Orange', emoji: '🍊', background: '#FFF8EF', accent: '#EA580C', soft: '#FFE8CC' },
  { id: 'pink', name: 'Pink', emoji: '🌸', background: '#FFF5FA', accent: '#DB2777', soft: '#FFE1F0' },
  { id: 'yellow', name: 'Yellow', emoji: '🌻', background: '#FFFDF2', accent: '#D4A017', soft: '#FFF4CC' },
];

export default function SettingsScreen() {
  const [showThemes, setShowThemes] = useState(false);

  const resetApp = useStashStore((state) => state.resetApp);
  const themeColor = useStashStore((state) => state.themeColor);
  const setThemeColor = useStashStore((state) => state.setThemeColor);

  const activeTheme = themes.find((theme) => theme.id === themeColor) ?? themes[0];

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
      style={[styles.container, { backgroundColor: activeTheme.background }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Customize Stash and manage your app.</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Customize</Text>

        <TouchableOpacity
          style={styles.option}
          onPress={() => setShowThemes(!showThemes)}
        >
          <View style={styles.optionLeft}>
            <View style={[styles.smallColorCircle, { backgroundColor: activeTheme.accent }]} />
            <Text style={styles.optionText}>🎨 Theme Color</Text>
          </View>

          <Text style={[styles.activeThemeText, { color: activeTheme.accent }]}>
            {activeTheme.name} {showThemes ? '⌃' : '⌄'}
          </Text>
        </TouchableOpacity>

        {showThemes && (
          <View style={styles.dropdown}>
            {themes.map((theme) => {
              const isSelected = theme.id === themeColor;

              return (
                <TouchableOpacity
                  key={theme.id}
                  style={[
                    styles.dropdownOption,
                    { backgroundColor: isSelected ? theme.soft : '#FFFFFF' },
                  ]}
                  onPress={() => {
                    setThemeColor(theme.id);
                    setShowThemes(false);
                  }}
                >
                  <View style={styles.optionLeft}>
                    <View style={[styles.smallColorCircle, { backgroundColor: theme.accent }]} />
                    <Text style={styles.dropdownText}>
                      {theme.emoji} {theme.name}
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

        <TouchableOpacity style={styles.option} onPress={() => comingSoon('Dark mode')}>
          <Text style={styles.optionText}>🌙 Dark Mode</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Budget Help</Text>

        <TouchableOpacity style={styles.option} onPress={() => router.push('/how-to')}>
          <Text style={styles.optionText}>📘 How To Use Stash</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={() => comingSoon('Budget tips')}>
          <Text style={styles.optionText}>💡 Budget Tips</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Support</Text>

        <TouchableOpacity style={styles.option} onPress={() => router.push('/report-bug')}>
          <Text style={styles.optionText}>🐛 Report a Bug</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={() => comingSoon('Feature requests')}>
          <Text style={styles.optionText}>✨ Request a Feature</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Security</Text>

        <TouchableOpacity style={styles.option} onPress={() => comingSoon('PIN lock')}>
          <Text style={styles.optionText}>🔐 PIN Lock</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={() => comingSoon('Face ID')}>
          <Text style={styles.optionText}>🙂 Face ID</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Data</Text>

        <TouchableOpacity style={styles.option} onPress={() => comingSoon('Backup and restore')}>
          <Text style={styles.optionText}>☁️ Backup / Restore</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={() => comingSoon('Transaction export')}>
          <Text style={styles.optionText}>📤 Export Transactions</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.aboutCard, { backgroundColor: activeTheme.soft }]}>
        <Text style={styles.aboutTitle}>About Stash</Text>
        <Text style={styles.aboutText}>
          Stash is a virtual cash-stuffing app built to help you organize money into
          envelopes, track spending, and stay motivated with goals and insights.
        </Text>
        <Text style={[styles.version, { color: activeTheme.accent }]}>
          Version 1.0.0
        </Text>
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
    color: '#111111',
  },

  subtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#666666',
    marginBottom: 22,
  },

  card: {
    backgroundColor: '#FFFFFF',
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
    color: '#111111',
  },

  option: {
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
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
    color: '#111111',
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
    borderTopColor: '#EEEEEE',
    paddingTop: 8,
    paddingBottom: 8,
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
    color: '#111111',
  },

  checkmark: {
    fontSize: 18,
    fontWeight: '900',
  },

  arrow: {
    fontSize: 26,
    fontWeight: '800',
    color: '#777777',
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
    color: '#111111',
  },

  aboutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#444444',
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