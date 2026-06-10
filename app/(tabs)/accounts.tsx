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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Accounts</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/add-account')}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.transferButton}
        onPress={() => router.push('/transfer')}
      >
        <Text style={styles.transferButtonText}>⇄ Transfer Money</Text>
      </TouchableOpacity>

      {accounts.length === 0 ? (
        <Text style={styles.empty}>No accounts yet.</Text>
      ) : (
        accounts.map((account) => (
          <TouchableOpacity
            style={styles.accountCard}
            key={account.id}
            onPress={() => router.push(`/account/${account.id}`)}
          >
            <View style={styles.accountInfo}>
              <Text style={styles.accountName}>🏦 {account.name}</Text>
              <Text style={styles.accountType}>Tap to view details</Text>
              <Text style={styles.balance}>${formatMoney(account.balance)}</Text>
            </View>

            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FFF4',
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
    backgroundColor: '#C8FF9B',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
  },

  addButtonText: {
    fontWeight: '800',
    fontSize: 16,
  },

  transferButton: {
    backgroundColor: '#111',
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

  empty: {
    fontSize: 16,
    fontWeight: '700',
    color: '#666',
  },

  accountCard: {
    backgroundColor: '#FFFFFF',
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