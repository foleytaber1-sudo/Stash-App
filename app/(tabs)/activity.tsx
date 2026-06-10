import { useStashStore } from '@/store/store';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type TimeFrame = 'week' | 'month' | 'year';
type TransactionFilter = 'all' | 'income' | 'spend' | 'stuff' | 'transfer';

const formatMoney = (amount: number) => {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default function ActivityScreen() {
  const accounts = useStashStore((state) => state.accounts);
  const envelopes = useStashStore((state) => state.envelopes);
  const transactions = useStashStore((state) => state.transactions);
  const deleteTransaction = useStashStore((state) => state.deleteTransaction);

  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>('month');
  const [selectedFilter, setSelectedFilter] = useState<TransactionFilter>('all');
  const [deleteMode, setDeleteMode] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

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

  const visibleTransactions = filteredTransactions
    .filter((transaction) => {
      if (selectedFilter === 'all') return true;
      return transaction.type === selectedFilter;
    })
    .filter((transaction) => {
      const query = searchText.trim().toLowerCase();

      if (!query) return true;

      const envelope = envelopes.find((item) => item.id === transaction.envelopeId);
      const account = accounts.find((item) => item.id === transaction.accountId);

      const description = transaction.description?.toLowerCase() ?? '';
      const envelopeName = envelope?.name.toLowerCase() ?? '';
      const accountName = account?.name.toLowerCase() ?? '';
      const type = transaction.type.toLowerCase();

      return (
        description.includes(query) ||
        envelopeName.includes(query) ||
        accountName.includes(query) ||
        type.includes(query)
      );
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

  const canDeleteTransaction = (transaction: (typeof transactions)[number]) => {
    return (
      !transaction.locked &&
      transaction.type !== 'delete-envelope' &&
      transaction.type !== 'delete-account'
    );
  };

  const handleDeleteTransaction = (id: string) => {
    Alert.alert(
      'Delete transaction?',
      'This will reverse the balance changes from this transaction.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTransaction(id),
        },
      ]
    );
  };

  const handleSearchToggle = () => {
    if (searchOpen) {
      setSearchText('');
    }

    setSearchOpen((current) => !current);
  };

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
    if (type === 'income') return `+$${formatMoney(amount)}`;
    if (type === 'spend') return `-$${formatMoney(amount)}`;
    if (type === 'stuff') return `+$${formatMoney(amount)}`;
    if (type === 'transfer') return `$${formatMoney(amount)} moved`;
    if (type === 'delete-account') return `-$${formatMoney(amount)}`;
    if (type === 'delete-envelope') return `+$${formatMoney(amount)}`;
    return `$${formatMoney(amount)}`;
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
      <Text style={styles.title}>Activity</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.label}>ACTIVITY OVERVIEW</Text>
        <Text style={styles.total}>${formatMoney(totalBalance)}</Text>

        <Text style={styles.sub}>
          Available Cash: ${formatMoney(availableToStuff)}
        </Text>
        <Text style={styles.sub}>
          Envelope Funds: ${formatMoney(stuffedTotal)}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.insightsButton}
        onPress={() => router.push('/insights')}
      >
        <View>
          <Text style={styles.insightsButtonTitle}>View Insights</Text>
          <Text style={styles.insightsButtonSub}>
            Top spending, money flow, graphs, and trends
          </Text>
        </View>

        <Text style={styles.insightsArrow}>›</Text>
      </TouchableOpacity>

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
          <Text style={styles.moneyIn}>+${formatMoney(moneyIn)}</Text>
        </View>

        <View style={styles.flowRow}>
          <Text style={styles.flowLabel}>Money Out</Text>
          <Text style={styles.moneyOut}>-${formatMoney(moneyOut)}</Text>
        </View>

        <View style={styles.netRow}>
          <Text style={styles.netLabel}>Net</Text>
          <Text style={styles.netAmount}>
            {net >= 0 ? '+' : '-'}${formatMoney(Math.abs(net))}
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
                ${formatMoney(totalSpent)}
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
                      ${formatMoney(item.spent)}
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

      <View style={styles.sectionRow}>
        <Text style={styles.sectionNoMargin}>Transaction History</Text>

        <View style={styles.historyActions}>
          <TouchableOpacity
            style={[styles.searchButton, searchOpen && styles.searchButtonActive]}
            onPress={handleSearchToggle}
          >
            <Text
              style={[
                styles.searchButtonText,
                searchOpen && styles.searchButtonTextActive,
              ]}
            >
              🔍
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.moreButton, deleteMode && styles.moreButtonActive]}
            onPress={() => setDeleteMode((current) => !current)}
          >
            <Text
              style={[
                styles.moreButtonText,
                deleteMode && styles.moreButtonTextActive,
              ]}
            >
              ⋯
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {searchOpen && (
        <TextInput
          style={styles.searchInput}
          placeholder="Search transactions..."
          placeholderTextColor="#888888"
          value={searchText}
          onChangeText={setSearchText}
          autoCapitalize="none"
          autoCorrect={false}
        />
      )}

      {deleteMode && (
        <Text style={styles.deleteModeHint}>
          Tap the red minus to delete a transaction.
        </Text>
      )}

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
        <Text style={styles.empty}>
          {searchText.trim()
            ? 'No transactions match your search.'
            : 'No transactions found for this filter.'}
        </Text>
      ) : (
        visibleTransactions.map((transaction) => {
          const canDelete = canDeleteTransaction(transaction);

          return (
            <View style={styles.transactionRow} key={transaction.id}>
              {deleteMode && canDelete && (
                <TouchableOpacity
                  style={styles.minusButton}
                  onPress={() => handleDeleteTransaction(transaction.id)}
                >
                  <Text style={styles.minusButtonText}>−</Text>
                </TouchableOpacity>
              )}

              {deleteMode && !canDelete && (
                <View style={styles.lockedSpace}>
                  <Text style={styles.lockedIcon}>🔒</Text>
                </View>
              )}

              <View
                style={[
                  styles.transaction,
                  getTransactionCardStyle(transaction.type),
                ]}
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

                    {transaction.locked && (
                      <Text style={styles.lockedBadge}>Locked transaction</Text>
                    )}
                  </View>

                  <Text style={styles.transactionAmount}>
                    {getAmountText(transaction.type, transaction.amount)}
                  </Text>
                </View>
              </View>
            </View>
          );
        })
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

  insightsButton: {
    backgroundColor: '#111111',
    borderRadius: 22,
    padding: 18,
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  insightsButtonTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },

  insightsButtonSub: {
    color: '#D7D7D7',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },

  insightsArrow: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: '300',
  },

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

  sectionRow: {
    marginTop: 30,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionNoMargin: {
    fontSize: 26,
    fontWeight: '900',
    flex: 1,
  },

  historyActions: {
    flexDirection: 'row',
    gap: 8,
  },

  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchButtonActive: {
    backgroundColor: '#C8FF9B',
  },

  searchButtonText: {
    fontSize: 18,
  },

  searchButtonTextActive: {
    color: '#111111',
  },

  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
    color: '#111111',
  },

  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  moreButtonActive: {
    backgroundColor: '#111111',
  },

  moreButtonText: {
    fontSize: 30,
    fontWeight: '900',
    color: '#111111',
    marginTop: -8,
  },

  moreButtonTextActive: {
    color: '#FFFFFF',
  },

  deleteModeHint: {
    fontSize: 13,
    fontWeight: '800',
    color: '#B00020',
    marginBottom: 12,
  },

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

  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  minusButton: {
    width: 30,
    height: 30,
    borderRadius: 999,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  minusButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    marginTop: -3,
  },

  lockedSpace: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  lockedIcon: {
    fontSize: 16,
  },

  transaction: {
    flex: 1,
    borderRadius: 18,
    padding: 16,
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

  lockedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F2F2F2',
    color: '#666666',
    fontSize: 11,
    fontWeight: '900',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    marginTop: 8,
  },

  transactionAmount: {
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'right',
    maxWidth: 95,
    color: '#111111',
  },
});