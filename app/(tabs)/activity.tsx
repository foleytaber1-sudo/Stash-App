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
type TransactionFilter = 'all' | 'income' | 'spend' | 'stuff' | 'transfer';

export default function BalanceScreen() {
  const accounts = useStashStore((state) => state.accounts);
  const envelopes = useStashStore((state) => state.envelopes);
  const transactions = useStashStore((state) => state.transactions);

  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>('month');
  const [selectedFilter, setSelectedFilter] = useState<TransactionFilter>('all');

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const stuffedTotal = envelopes.reduce((sum, envelope) => sum + envelope.balance, 0);
  const availableToStuff = totalBalance - stuffedTotal;

  const now = new Date();

  const getStartDate = () => {
    const start = new Date();

    if (selectedTimeFrame === 'week') start.setDate(now.getDate() - 7);
    if (selectedTimeFrame === 'month') start.setMonth(now.getMonth() - 1);
    if (selectedTimeFrame === 'year') start.setFullYear(now.getFullYear() - 1);

    return start;
  };

  const startDate = getStartDate();

  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= startDate;
  });

  const visibleTransactions = filteredTransactions.filter((transaction) => {
    if (selectedFilter === 'all') return true;
    return transaction.type === selectedFilter;
  });

  const spendingBreakdown = envelopes
    .map((envelope) => {
      const spent = filteredTransactions
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

  const totalSpent = spendingBreakdown.reduce((sum, item) => sum + item.spent, 0);

  const moneyIn = filteredTransactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const moneyOut = filteredTransactions
    .filter((transaction) => transaction.type === 'spend')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const net = moneyIn - moneyOut;

  const getTransactionIcon = (type: string) => {
    if (type === 'income') return '💰';
    if (type === 'spend') return '🛒';
    if (type === 'stuff') return '✉️';
    if (type === 'transfer') return '⇄';
    if (type === 'delete-envelope') return '🗑️';
    if (type === 'delete-account') return '🏦';
    return '•';
  };

  const getTransactionLabel = (type: string) => {
    if (type === 'income') return 'Income';
    if (type === 'spend') return 'Spending';
    if (type === 'stuff') return 'Stuffed Envelope';
    if (type === 'transfer') return 'Account Transfer';
    if (type === 'delete-envelope') return 'Deleted Envelope';
    if (type === 'delete-account') return 'Deleted Account';
    return 'Transaction';
  };

  const getTransactionDescription = (transaction: (typeof transactions)[number]) => {
    if (transaction.type === 'stuff') {
      const envelope = envelopes.find((item) => item.id === transaction.envelopeId);
      return `Stuffed ${envelope?.name ?? 'Envelope'}`;
    }

    return transaction.description;
  };

  const getTransactionCardStyle = (type: string) => {
    if (type === 'income') return styles.incomeCard;
    if (type === 'spend') return styles.spendCard;
    if (type === 'stuff') return styles.stuffCard;
    if (type === 'transfer') return styles.transferCard;
    if (type === 'delete-envelope') return styles.deleteCard;
    if (type === 'delete-account') return styles.deleteCard;
    return styles.defaultCard;
  };

  const getAmountText = (type: string, amount: number) => {
    if (type === 'income') return `+$${amount.toFixed(2)}`;
    if (type === 'spend') return `-$${amount.toFixed(2)}`;
    if (type === 'stuff') return `+$${amount.toFixed(2)}`;
    if (type === 'transfer') return `$${amount.toFixed(2)} moved`;
    if (type === 'delete-account') return `-$${amount.toFixed(2)}`;
    if (type === 'delete-envelope') return `+$${amount.toFixed(2)}`;
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const filterOptions: { label: string; value: TransactionFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Income', value: 'income' },
    { label: 'Spending', value: 'spend' },
    { label: 'Stuffing', value: 'stuff' },
    { label: 'Transfers', value: 'transfer' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Balance</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.label}>TOTAL BALANCE</Text>
        <Text style={styles.total}>${totalBalance.toFixed(2)}</Text>

        <Text style={styles.sub}>Available To Stuff: ${availableToStuff.toFixed(2)}</Text>
        <Text style={styles.sub}>Stuffed In Envelopes: ${stuffedTotal.toFixed(2)}</Text>
      </View>

      <View style={styles.moneyFlowCard}>
        <Text style={styles.cardTitle}>Money Flow</Text>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, selectedTimeFrame === 'week' && styles.activeTab]}
            onPress={() => setSelectedTimeFrame('week')}
          >
            <Text style={[styles.tabText, selectedTimeFrame === 'week' && styles.activeTabText]}>
              Week
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, selectedTimeFrame === 'month' && styles.activeTab]}
            onPress={() => setSelectedTimeFrame('month')}
          >
            <Text style={[styles.tabText, selectedTimeFrame === 'month' && styles.activeTabText]}>
              Month
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, selectedTimeFrame === 'year' && styles.activeTab]}
            onPress={() => setSelectedTimeFrame('year')}
          >
            <Text style={[styles.tabText, selectedTimeFrame === 'year' && styles.activeTabText]}>
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

      <Text style={styles.section}>Spending Breakdown</Text>

      <View style={styles.breakdownCard}>
        {spendingBreakdown.length === 0 ? (
          <Text style={styles.breakdownEmpty}>
            No spending for this time period yet.
          </Text>
        ) : (
          <>
            <View style={styles.breakdownTotalRow}>
              <Text style={styles.breakdownTotalLabel}>Total Spent</Text>
              <Text style={styles.breakdownTotalAmount}>
                ${totalSpent.toFixed(2)}
              </Text>
            </View>

            {spendingBreakdown.map((item) => {
              const percent =
                totalSpent > 0 ? Math.round((item.spent / totalSpent) * 100) : 0;

              return (
                <View style={styles.breakdownItem} key={item.id}>
                  <View style={styles.breakdownTopRow}>
                    <View style={styles.breakdownNameRow}>
                      <Text style={styles.breakdownIcon}>{item.icon}</Text>
                      <Text style={styles.breakdownName}>{item.name}</Text>
                    </View>

                    <Text style={styles.breakdownAmount}>
                      ${item.spent.toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.breakdownTrack}>
                    <View
                      style={[
                        styles.breakdownFill,
                        { width: `${percent}%` },
                      ]}
                    />
                  </View>

                  <Text style={styles.breakdownPercent}>
                    {percent}% of spending
                  </Text>
                </View>
              );
            })}
          </>
        )}
      </View>

      <Text style={styles.section}>Transaction History</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
      >
        {filterOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.filterChip,
              selectedFilter === option.value && styles.activeFilterChip,
            ]}
            onPress={() => setSelectedFilter(option.value)}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === option.value && styles.activeFilterChipText,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {visibleTransactions.length === 0 ? (
        <Text style={styles.empty}>No transactions found for this filter.</Text>
      ) : (
        visibleTransactions.map((transaction) => (
          <View
            style={[styles.transaction, getTransactionCardStyle(transaction.type)]}
            key={transaction.id}
          >
            <View style={styles.transactionTopRow}>
              <View style={styles.transactionIconBubble}>
                <Text style={styles.transactionIcon}>
                  {getTransactionIcon(transaction.type)}
                </Text>
              </View>

              <View style={styles.transactionInfo}>
                <Text style={styles.transactionLabel}>
                  {getTransactionLabel(transaction.type)}
                </Text>

                <Text style={styles.transactionTitle}>
                  {getTransactionDescription(transaction)}
                </Text>

                <Text style={styles.transactionDate}>
                  {formatDate(transaction.date)}
                </Text>
              </View>

              <Text style={styles.transactionAmount}>
                {getAmountText(transaction.type, transaction.amount)}
              </Text>
            </View>
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

  activeTab: { backgroundColor: '#C8FF9B' },
  tabText: { fontWeight: '800', color: '#666' },
  activeTabText: { color: '#000' },

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

  section: { fontSize: 26, fontWeight: '900', marginTop: 30, marginBottom: 12 },
  empty: { fontSize: 16, fontWeight: '700', color: '#666' },

  breakdownCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
  },

  breakdownEmpty: {
    fontSize: 15,
    fontWeight: '700',
    color: '#666',
    lineHeight: 22,
  },

  breakdownTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  breakdownTotalLabel: {
    fontSize: 18,
    fontWeight: '900',
  },

  breakdownTotalAmount: {
    fontSize: 20,
    fontWeight: '900',
  },

  breakdownItem: {
    marginBottom: 18,
  },

  breakdownTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  breakdownNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  breakdownIcon: {
    fontSize: 22,
    marginRight: 8,
  },

  breakdownName: {
    fontSize: 16,
    fontWeight: '900',
  },

  breakdownAmount: {
    fontSize: 16,
    fontWeight: '900',
  },

  breakdownTrack: {
    height: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 8,
  },

  breakdownFill: {
    height: '100%',
    backgroundColor: '#111',
    borderRadius: 999,
  },

  breakdownPercent: {
    fontSize: 12,
    fontWeight: '800',
    color: '#666',
    marginTop: 5,
  },

  filterScroll: {
    marginBottom: 14,
  },

  filterChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    marginRight: 8,
  },

  activeFilterChip: {
    backgroundColor: '#111111',
  },

  filterChipText: {
    fontWeight: '900',
    color: '#666666',
  },

  activeFilterChipText: {
    color: '#FFFFFF',
  },

  transaction: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
  },

  defaultCard: {
    backgroundColor: '#FFFFFF',
  },

  incomeCard: {
    backgroundColor: '#EAF8EE',
  },

  spendCard: {
    backgroundColor: '#FDECEC',
  },

  stuffCard: {
    backgroundColor: '#EDF3FF',
  },

  transferCard: {
    backgroundColor: '#F2F2F2',
  },

  deleteCard: {
    backgroundColor: '#FFF4E5',
  },

  transactionTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  transactionIconBubble: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  transactionIcon: { fontSize: 22 },
  transactionInfo: { flex: 1 },

  transactionLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: '#666',
    marginBottom: 3,
  },

  transactionTitle: {
    fontSize: 15,
    fontWeight: '800',
  },

  transactionDate: {
    fontSize: 12,
    fontWeight: '700',
    color: '#777',
    marginTop: 4,
  },

  transactionAmount: {
    fontSize: 16,
    fontWeight: '900',
    marginLeft: 10,
    textAlign: 'right',
    maxWidth: 95,
    color: '#111111',
  },
});