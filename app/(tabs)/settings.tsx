import { useStashStore } from '@/store/store';
import { router } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const resetApp = useStashStore((state) => state.resetApp);

  const handleReset = () => {
    Alert.alert('Reset App Data?', 'This will delete all accounts and envelopes for testing.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: resetApp },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Appearance</Text>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>🌞 Light Mode / 🌙 Dark Mode</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Security</Text>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>🔐 PIN Lock</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>🙂 Face ID</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Data</Text>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>☁️ Backup / Restore</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>📤 Export Transactions</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Budget Help</Text>
        <TouchableOpacity style={styles.option}>
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
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>ERASE ALL DATA ❌</Text>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetText}>TERMINATE</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FFF4', padding: 20 },
  title: { fontSize: 34, fontWeight: '900', marginTop: 60, marginBottom: 20 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 18, marginBottom: 14 },
  cardTitle: { fontSize: 18, fontWeight: '900', marginBottom: 10 },
  option: {
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionText: { fontSize: 16, fontWeight: '700' },
  arrow: { fontSize: 24, fontWeight: '700' },
  resetButton: {
    backgroundColor: '#FFB3B3',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  resetText: { fontSize: 18, fontWeight: '900' },
});