import { useStashStore } from '@/store/store';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type TimeFrame = 'week' | 'month' | 'year';

export default function BalanceScreen() {
  const accounts = useStashStore((state) => state.accounts);
  const envelopes = useStashStore((state) => state.envelopes);
  const transactions = useStashStore((state) => state.transactions);

  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>('month');

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const stuffedTotal = envelopes.reduce((sum, envelope) => sum + envelope.balance, 0);
  const availableToStuff = totalBalance - stuffedTotal;

  const now = new Date();

  const getStartDate = () => {
    const start = new Date();

    if (selectedTimeFrame === 'week') {
      start.setDate(now.getDate() - 7);
    }

    if (selectedTimeFrame === 'month') {
      start.setMonth(now.getMonth() - 1);
    }

    if (selectedTimeFrame === 'year') {
      start.setFullYear(now.getFullYear() - 1);
    }

    return start;
  };

  const startDate = getStartDate();

  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= startDate;
  });

  const moneyIn = filteredTransactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const moneyOut = filteredTransactions
    .filter((transaction) => transaction.type === 'spend')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const net = moneyIn - moneyOut;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Balance</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.label}>TOTAL BALANCE</Text>
        <Text style={styles.total}>${totalBalance.toFixed(2)}</Text>

        <Text style={styles.sub}>
          Available To Stuff: ${availableToStuff.toFixed(2)}
        </Text>
        <Text style={styles.sub}>
          Stuffed In Envelopes: ${stuffedTotal.toFixed(2)}
        </Text>
      </View>

      <View style={styles.moneyFlowCard}>
        <Text style={styles.cardTitle}>Money Flow</Text>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTimeFrame === 'week' && styles.activeTab,
            ]}
            onPress={() => setSelectedTimeFrame('week')}
          >
            <Text
              style={[
                styles.tabText,
                selectedTimeFrame === 'week' && styles.activeTabText,
              ]}
            >
              Week
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              selectedTimeFrame === 'month' && styles.activeTab,
            ]}
            onPress={() => setSelectedTimeFrame('month')}
          >
            <Text
              style={[
                styles.tabText,
                selectedTimeFrame === 'month' && styles.activeTabText,
              ]}
            >
              Month
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              selectedTimeFrame === 'year' && styles.activeTab,
            ]}
            onPress={() => setSelectedTimeFrame('year')}
          >
            <Text
              style={[
                styles.tabText,
                selectedTimeFrame === 'year' && styles.activeTabText,
              ]}
            >
              Year
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.flowRow}>
          <Text style={styles.flowLabel}>Money In</Text>
          <Text style={styles.moneyIn}>+${moneyIn.toFixed(2)}</Text>
        </View>

        <View style={styles.flowRow}>
          <Text style={styles.flowLabel}>Money Out</Text>
          <Text style={styles.moneyOut}>-${moneyOut.toFixed(2)}</Text>
        </View>

        <View style={styles.netRow}>
          <Text style={styles.netLabel}>Net</Text>
          <Text style={styles.netAmount}>
            {net >= 0 ? '+' : '-'}${Math.abs(net).toFixed(2)}
          </Text>
        </View>
      </View>

      <Text style={styles.section}>Transaction History</Text>

      {transactions.length === 0 ? (
        <Text style={styles.empty}>No transactions yet.</Text>
      ) : (
        transactions.map((transaction) => (
          <View style={styles.transaction} key={transaction.id}>
            <Text style={styles.transactionTitle}>
              {transaction.description}
            </Text>
            <Text style={styles.transactionAmount}>
              {transaction.type === 'spend' ? '-' : '+'}$
              {transaction.amount.toFixed(2)}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FFF4', padding: 20 },
  title: { fontSize: 34, fontWeight: '900', marginTop: 60, marginBottom: 20 },
  summaryCard: { backgroundColor: '#C8FF9B', borderRadius: 22, padding: 20 },
  label: { fontSize: 13, fontWeight: '800' },
  total: { fontSize: 42, fontWeight: '900', marginVertical: 8 },
  sub: { fontSize: 16, fontWeight: '700', marginTop: 6 },

  moneyFlowCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    marginTop: 16,
  },

  cardTitle: { fontSize: 22, fontWeight: '900', marginBottom: 14 },

  tabs: {
    backgroundColor: '#F5F5F5',
    borderRadius: 999,
    padding: 4,
    flexDirection: 'row',
    marginBottom: 18,
  },

  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: 'center',
  },

  activeTab: {
    backgroundColor: '#C8FF9B',
  },

  tabText: {
    fontWeight: '800',
    color: '#666',
  },

  activeTabText: {
    color: '#000',
  },

  flowRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  flowLabel: { fontSize: 17, fontWeight: '800' },
  moneyIn: { fontSize: 20, fontWeight: '900' },
  moneyOut: { fontSize: 20, fontWeight: '900' },

  netRow: {
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 14,
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  netLabel: { fontSize: 20, fontWeight: '900' },
  netAmount: { fontSize: 24, fontWeight: '900' },

  section: {
    fontSize: 26,
    fontWeight: '900',
    marginTop: 30,
    marginBottom: 12,
  },

  empty: { fontSize: 16, fontWeight: '700', color: '#666' },

  transaction: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },

  transactionTitle: { fontSize: 16, fontWeight: '800' },

  transactionAmount: {
    fontSize: 22,
    fontWeight: '900',
    marginTop: 6,
  },
});