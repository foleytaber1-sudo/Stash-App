import { useStashStore } from '@/store/store';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const formatMoney = (amount: number) => {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default function InsightsScreen() {
  const accounts = useStashStore((state) => state.accounts);
  const envelopes = useStashStore((state) => state.envelopes);
  const transactions = useStashStore((state) => state.transactions);

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const stuffedTotal = envelopes.reduce((sum, envelope) => sum + envelope.balance, 0);

  const moneyIn = transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const moneyOut = transactions
    .filter((transaction) => transaction.type === 'spend')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const netFlow = moneyIn - moneyOut;

  const spendingBreakdown = envelopes
    .map((envelope) => {
      const spent = transactions
        .filter(
          (transaction) =>
            transaction.type === 'spend' && transaction.envelopeId === envelope.id
        )
        .reduce((sum, transaction) => sum + transaction.amount, 0);

      return {
        id: envelope.id,
        name: envelope.name,
        icon: envelope.icon ?? '💵',
        spent,
      };
    })
    .filter((item) => item.spent > 0)
    .sort((a, b) => b.spent - a.spent);

  const topSpending = spendingBreakdown[0];
  const totalSpent = spendingBreakdown.reduce((sum, item) => sum + item.spent, 0);

  const maxSpent = Math.max(...spendingBreakdown.map((item) => item.spent), 1);

  const moneyFlowMax = Math.max(moneyIn, moneyOut, stuffedTotal, 1);

  const moneyFlowItems = [
    { label: 'Money In', amount: moneyIn, emoji: '💰' },
    { label: 'Spent', amount: moneyOut, emoji: '💸' },
    { label: 'Stuffed', amount: stuffedTotal, emoji: '✉️' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Insights</Text>
      </View>

      <Text style={styles.subtitle}>
        A deeper look at where your money is going.
      </Text>

      <View style={styles.grid}>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>🔥</Text>
          <Text style={styles.statLabel}>Top Spending</Text>
          <Text style={styles.statValue}>{topSpending?.name ?? 'None yet'}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>💸</Text>
          <Text style={styles.statLabel}>Spent</Text>
          <Text style={styles.statValue}>${formatMoney(totalSpent)}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>📈</Text>
          <Text style={styles.statLabel}>Net Flow</Text>
          <Text style={styles.statValue}>
            {netFlow >= 0 ? '+' : '-'}${formatMoney(Math.abs(netFlow))}
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>✉️</Text>
          <Text style={styles.statLabel}>Stuffed</Text>
          <Text style={styles.statValue}>${formatMoney(stuffedTotal)}</Text>
        </View>
      </View>

      <View style={styles.bigCard}>
        <Text style={styles.cardTitle}>Money Flow</Text>

        {moneyFlowItems.map((item) => {
          const percent = Math.round((item.amount / moneyFlowMax) * 100);

          return (
            <View style={styles.graphItem} key={item.label}>
              <View style={styles.graphTopRow}>
                <Text style={styles.graphLabel}>
                  {item.emoji} {item.label}
                </Text>

                <Text style={styles.graphAmount}>${formatMoney(item.amount)}</Text>
              </View>

              <View style={styles.graphTrack}>
                <View style={[styles.graphFill, { width: `${percent}%` }]} />
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.bigCard}>
        <Text style={styles.cardTitle}>Spending By Envelope</Text>

        {spendingBreakdown.length === 0 ? (
          <Text style={styles.emptyText}>
            No spending yet. Once you spend from envelopes, your graphs will show here.
          </Text>
        ) : (
          spendingBreakdown.map((item) => {
            const percent = Math.round((item.spent / maxSpent) * 100);
            const share = totalSpent > 0 ? Math.round((item.spent / totalSpent) * 100) : 0;

            return (
              <View style={styles.spendingItem} key={item.id}>
                <View style={styles.graphTopRow}>
                  <Text style={styles.graphLabel}>
                    {item.icon} {item.name}
                  </Text>

                  <Text style={styles.graphAmount}>${formatMoney(item.spent)}</Text>
                </View>

                <View style={styles.graphTrack}>
                  <View style={[styles.darkGraphFill, { width: `${percent}%` }]} />
                </View>

                <Text style={styles.shareText}>{share}% of total spending</Text>
              </View>
            );
          })
        )}
      </View>

      <View style={styles.bigCard}>
        <Text style={styles.cardTitle}>Balance Snapshot</Text>

        <View style={styles.snapshotRow}>
          <Text style={styles.snapshotLabel}>Total Balance</Text>
          <Text style={styles.snapshotValue}>${formatMoney(totalBalance)}</Text>
        </View>

        <View style={styles.snapshotRow}>
          <Text style={styles.snapshotLabel}>Stuffed Total</Text>
          <Text style={styles.snapshotValue}>${formatMoney(stuffedTotal)}</Text>
        </View>

        <View style={styles.snapshotRow}>
          <Text style={styles.snapshotLabel}>Unstuffed Cash</Text>
          <Text style={styles.snapshotValue}>
            ${formatMoney(totalBalance - stuffedTotal)}
          </Text>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FFF4',
    padding: 20,
  },

  headerRow: {
    marginTop: 55,
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  backButtonText: {
    fontSize: 38,
    fontWeight: '700',
    marginTop: -4,
  },

  title: {
    fontSize: 34,
    fontWeight: '900',
  },

  subtitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#666666',
    marginTop: 8,
    marginBottom: 20,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    width: '48%',
  },

  statEmoji: {
    fontSize: 26,
    marginBottom: 8,
  },

  statLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: '#666666',
    marginBottom: 6,
  },

  statValue: {
    fontSize: 18,
    fontWeight: '900',
  },

  bigCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    marginTop: 18,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 16,
  },

  graphItem: {
    marginBottom: 18,
  },

  spendingItem: {
    marginBottom: 20,
  },

  graphTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  graphLabel: {
    fontSize: 15,
    fontWeight: '900',
    flex: 1,
  },

  graphAmount: {
    fontSize: 15,
    fontWeight: '900',
  },

  graphTrack: {
    height: 13,
    backgroundColor: '#F0F0F0',
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 9,
  },

  graphFill: {
    height: '100%',
    backgroundColor: '#C8FF9B',
    borderRadius: 999,
  },

  darkGraphFill: {
    height: '100%',
    backgroundColor: '#111111',
    borderRadius: 999,
  },

  shareText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#666666',
    marginTop: 6,
  },

  emptyText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#666666',
    lineHeight: 22,
  },

  snapshotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingVertical: 12,
  },

  snapshotLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#666666',
  },

  snapshotValue: {
    fontSize: 16,
    fontWeight: '900',
  },
});