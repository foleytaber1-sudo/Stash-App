import { getTheme } from '@/constants/theme';
import { useStashStore } from '@/store/store';
import { router } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const formatMoney = (amount: number) => {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default function AccountsScreen() {
  const accounts = useStashStore((state) => state.accounts);
  const themeColor = useStashStore((state) => state.themeColor);
  const theme = getTheme(themeColor);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Accounts</Text>

        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.button }]}
          onPress={() => router.push('/add-account')}
        >
          <Text style={[styles.addButtonText, { color: theme.accent }]}>
            + Add
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.transferButton, { backgroundColor: theme.accent }]}
        onPress={() => router.push('/transfer')}
      >
        <Text style={styles.transferButtonText}>⇄ Transfer Money</Text>
      </TouchableOpacity>

      {accounts.length === 0 ? (
        <View style={[styles.emptyCard, { backgroundColor: theme.soft }]}>
          <Text style={styles.emptyTitle}>No accounts yet</Text>
          <Text style={styles.empty}>
            Add your first account to start tracking your money.
          </Text>
        </View>
      ) : (
        accounts.map((account) => (
          <TouchableOpacity
            style={[styles.accountCard, { backgroundColor: theme.soft }]}
            key={account.id}
            onPress={() => router.push(`/account/${account.id}`)}
          >
            <View style={styles.accountInfo}>
              <Text style={styles.accountName}>🏦 {account.name}</Text>
              <Text style={styles.accountType}>Tap to view details</Text>
              <Text style={[styles.balance, { color: theme.accent }]}>
                ${formatMoney(account.balance)}
              </Text>
            </View>

            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  header: {
    marginTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  title: {
    fontSize: 34,
    fontWeight: '900',
  },

  addButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
  },

  addButtonText: {
    fontWeight: '900',
    fontSize: 16,
  },

  transferButton: {
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },

  transferButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
  },

  emptyCard: {
    borderRadius: 18,
    padding: 18,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 6,
  },

  empty: {
    fontSize: 16,
    fontWeight: '700',
    color: '#666',
    lineHeight: 22,
  },

  accountCard: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  accountInfo: {
    flex: 1,
  },

  accountName: {
    fontSize: 20,
    fontWeight: '800',
  },

  accountType: {
    marginTop: 4,
    color: '#666',
    fontWeight: '700',
  },

  balance: {
    fontSize: 24,
    fontWeight: '900',
    marginTop: 8,
  },

  chevron: {
    fontSize: 36,
    fontWeight: '300',
    color: '#999',
  },
});