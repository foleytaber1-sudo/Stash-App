import { formatCurrency } from '@/constants/currency';
import { getTheme } from '@/constants/theme';
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

export default function ActivityScreen() {
  const accounts = useStashStore((state) => state.accounts);
  const envelopes = useStashStore((state) => state.envelopes);
  const transactions = useStashStore((state) => state.transactions);
  const deleteTransaction = useStashStore((state) => state.deleteTransaction);
  const themeColor = useStashStore((state) => state.themeColor);
  const themeMode = useStashStore((state) => state.themeMode);
  const currency = useStashStore((state) => state.currency);

  const theme = getTheme(themeColor, themeMode);

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
    if (searchOpen) setSearchText('');
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
    if (type === 'income') {
      return { backgroundColor: themeMode === 'dark' ? '#193321' : '#EAF8EE' };
    }

    if (type === 'spend') {
      return { backgroundColor: themeMode === 'dark' ? '#3A1D1D' : '#FDECEC' };
    }

    if (type === 'stuff') return { backgroundColor: theme.soft };

    if (type === 'transfer') {
      return { backgroundColor: themeMode === 'dark' ? theme.card : '#F2F2F2' };
    }

    if (type === 'delete-envelope') {
      return { backgroundColor: themeMode === 'dark' ? '#3A2B18' : '#FFF4E5' };
    }

    if (type === 'delete-account') {
      return { backgroundColor: themeMode === 'dark' ? '#3A2B18' : '#FFF4E5' };
    }

    return { backgroundColor: theme.card };
  };

  const getAmountText = (type: string, amount: number) => {
    const formattedAmount = formatCurrency(amount, currency);

    if (type === 'income') return `+${formattedAmount}`;
    if (type === 'spend') return `-${formattedAmount}`;
    if (type === 'stuff') return `+${formattedAmount}`;
    if (type === 'transfer') return `${formattedAmount} moved`;
    if (type === 'delete-account') return `-${formattedAmount}`;
    if (type === 'delete-envelope') return `+${formattedAmount}`;

    return formattedAmount;
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
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: theme.text }]}>Activity</Text>

      <View
        style={[
          styles.summaryCard,
          { backgroundColor: theme.button, borderColor: theme.accent },
        ]}
      >
        <Text style={[styles.label, { color: theme.text }]}>ACTIVITY OVERVIEW</Text>
        <Text style={[styles.total, { color: theme.text }]}>
          {formatCurrency(totalBalance, currency)}
        </Text>

        <Text style={[styles.sub, { color: theme.text }]}>
          Available Cash: {formatCurrency(availableToStuff, currency)}
        </Text>
        <Text style={[styles.sub, { color: theme.text }]}>
          Envelope Funds: {formatCurrency(stuffedTotal, currency)}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.insightsButton, { backgroundColor: theme.accent }]}
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

      <TouchableOpacity
        style={[
          styles.brainButton,
          { backgroundColor: theme.soft, borderColor: theme.accent },
        ]}
        onPress={() => router.push('/stash-brain' as any)}
      >
        <View style={styles.brainButtonTextWrap}>
          <Text style={[styles.brainButtonTitle, { color: theme.text }]}>
            🧠 Stash Brain™
          </Text>
          <Text style={[styles.brainButtonSub, { color: theme.subtext }]}>
            Smart budgeting insights powered by your app data
          </Text>
        </View>

        <Text style={[styles.brainArrow, { color: theme.accent }]}>›</Text>
      </TouchableOpacity>

      <View style={[styles.moneyFlowCard, { backgroundColor: theme.soft }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Money Flow</Text>

        <View
          style={[
            styles.tabs,
            {
              backgroundColor:
                themeMode === 'dark'
                  ? 'rgba(255,255,255,0.08)'
                  : 'rgba(255,255,255,0.7)',
            },
          ]}
        >
          {(['week', 'month', 'year'] as TimeFrame[]).map((timeFrame) => (
            <TouchableOpacity
              key={timeFrame}
              style={[
                styles.tab,
                selectedTimeFrame === timeFrame && {
                  backgroundColor: theme.button,
                },
              ]}
              onPress={() => setSelectedTimeFrame(timeFrame)}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: selectedTimeFrame === timeFrame ? theme.accent : theme.subtext },
                ]}
              >
                {timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.flowRow}>
          <Text style={[styles.flowLabel, { color: theme.text }]}>Money In</Text>
          <Text style={[styles.moneyIn, { color: theme.accent }]}>
            +{formatCurrency(moneyIn, currency)}
          </Text>
        </View>

        <View style={styles.flowRow}>
          <Text style={[styles.flowLabel, { color: theme.text }]}>Money Out</Text>
          <Text style={styles.moneyOut}>-{formatCurrency(moneyOut, currency)}</Text>
        </View>

        <View style={[styles.netRow, { borderTopColor: theme.border }]}>
          <Text style={[styles.netLabel, { color: theme.text }]}>Net</Text>
          <Text style={[styles.netAmount, { color: net >= 0 ? theme.accent : '#FF6B6B' }]}>
            {net >= 0 ? '+' : '-'}
            {formatCurrency(Math.abs(net), currency)}
          </Text>
        </View>
      </View>

      <Text style={[styles.section, { color: theme.text }]}>Spending Breakdown</Text>

      <View style={[styles.breakdownCard, { backgroundColor: theme.soft }]}>
        {spendingBreakdown.length === 0 ? (
          <Text style={[styles.breakdownEmpty, { color: theme.subtext }]}>
            No spending for this time period yet.
          </Text>
        ) : (
          <>
            <View style={styles.breakdownTotalRow}>
              <Text style={[styles.breakdownTotalLabel, { color: theme.text }]}>
                Total Spent
              </Text>
              <Text style={[styles.breakdownTotalAmount, { color: theme.text }]}>
                {formatCurrency(totalSpent, currency)}
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
                      <Text style={[styles.breakdownName, { color: theme.text }]}>
                        {item.name}
                      </Text>
                    </View>

                    <Text style={[styles.breakdownAmount, { color: theme.text }]}>
                      {formatCurrency(item.spent, currency)}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.breakdownTrack,
                      {
                        backgroundColor:
                          themeMode === 'dark'
                            ? 'rgba(255,255,255,0.12)'
                            : 'rgba(255,255,255,0.8)',
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.breakdownFill,
                        { width: `${percent}%`, backgroundColor: theme.accent },
                      ]}
                    />
                  </View>

                  <Text style={[styles.breakdownPercent, { color: theme.subtext }]}>
                    {percent}% of spending
                  </Text>
                </View>
              );
            })}
          </>
        )}
      </View>

      <View style={styles.sectionRow}>
        <Text style={[styles.sectionNoMargin, { color: theme.text }]}>
          Transaction History
        </Text>

        <View style={styles.historyActions}>
          <TouchableOpacity
            style={[
              styles.searchButton,
              { backgroundColor: searchOpen ? theme.button : theme.soft },
            ]}
            onPress={handleSearchToggle}
          >
            <Text style={styles.searchButtonText}>🔍</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.moreButton,
              { backgroundColor: deleteMode ? theme.accent : theme.soft },
            ]}
            onPress={() => setDeleteMode((current) => !current)}
          >
            <Text
              style={[
                styles.moreButtonText,
                { color: deleteMode ? '#FFFFFF' : theme.text },
              ]}
            >
              ⋯
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {searchOpen && (
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: theme.soft,
              color: theme.text,
              borderColor: theme.border,
            },
          ]}
          placeholder="Search transactions..."
          placeholderTextColor={theme.subtext}
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

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        {filterOptions.map((option) => {
          const isSelected = selectedFilter === option.value;

          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.filterChip,
                { backgroundColor: isSelected ? theme.accent : theme.soft },
              ]}
              onPress={() => setSelectedFilter(option.value)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  { color: isSelected ? '#FFFFFF' : theme.accent },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {visibleTransactions.length === 0 ? (
        <Text style={[styles.empty, { color: theme.subtext }]}>
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

              <View style={[styles.transaction, getTransactionCardStyle(transaction.type)]}>
                <View style={styles.transactionTopRow}>
                  <View
                    style={[
                      styles.transactionIconBubble,
                      {
                        backgroundColor:
                          themeMode === 'dark'
                            ? 'rgba(255,255,255,0.10)'
                            : 'rgba(255,255,255,0.65)',
                      },
                    ]}
                  >
                    <Text style={styles.transactionIcon}>
                      {getTransactionIcon(transaction.type)}
                    </Text>
                  </View>

                  <View style={styles.transactionInfo}>
                    <Text style={[styles.transactionLabel, { color: theme.subtext }]}>
                      {getTransactionLabel(transaction.type)}
                    </Text>

                    <Text style={[styles.transactionTitle, { color: theme.text }]}>
                      {getTransactionDescription(transaction)}
                    </Text>

                    <Text style={[styles.transactionDate, { color: theme.subtext }]}>
                      {formatDate(transaction.date)}
                    </Text>

                    {transaction.locked && (
                      <Text
                        style={[
                          styles.lockedBadge,
                          {
                            backgroundColor: themeMode === 'dark' ? theme.card : '#F2F2F2',
                            color: theme.subtext,
                          },
                        ]}
                      >
                        Locked transaction
                      </Text>
                    )}
                  </View>

                  <Text style={[styles.transactionAmount, { color: theme.text }]}>
                    {getAmountText(transaction.type, transaction.amount)}
                  </Text>
                </View>
              </View>
            </View>
          );
        })
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 34, fontWeight: '900', marginTop: 60, marginBottom: 20 },
  summaryCard: { borderRadius: 22, padding: 20, borderWidth: 2 },
  label: { fontSize: 13, fontWeight: '900' },
  total: { fontSize: 42, fontWeight: '900', marginVertical: 8 },
  sub: { fontSize: 16, fontWeight: '700', marginTop: 6 },

  insightsButton: {
    borderRadius: 22,
    padding: 18,
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  insightsButtonTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '900' },
  insightsButtonSub: {
    color: '#F2F2F2',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  insightsArrow: { color: '#FFFFFF', fontSize: 42, fontWeight: '300' },

  brainButton: {
    borderRadius: 22,
    padding: 18,
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
  },

  brainButtonTextWrap: { flex: 1, paddingRight: 10 },
  brainButtonTitle: { fontSize: 22, fontWeight: '900' },
  brainButtonSub: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
    lineHeight: 18,
  },
  brainArrow: { fontSize: 42, fontWeight: '300' },

  moneyFlowCard: { borderRadius: 22, padding: 18, marginTop: 16 },
  cardTitle: { fontSize: 22, fontWeight: '900', marginBottom: 14 },

  tabs: {
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

  tabText: { fontWeight: '900' },

  flowRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  flowLabel: { fontSize: 17, fontWeight: '800' },
  moneyIn: { fontSize: 20, fontWeight: '900' },
  moneyOut: { fontSize: 20, fontWeight: '900', color: '#FF6B6B' },

  netRow: {
    borderTopWidth: 1,
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

  sectionNoMargin: { fontSize: 26, fontWeight: '900', flex: 1 },
  historyActions: { flexDirection: 'row', gap: 8 },

  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchButtonText: { fontSize: 18 },

  searchInput: {
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
    borderWidth: 1,
  },

  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },

  moreButtonText: { fontSize: 30, fontWeight: '900', marginTop: -8 },

  deleteModeHint: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FF6B6B',
    marginBottom: 12,
  },

  empty: { fontSize: 16, fontWeight: '700' },

  breakdownCard: { borderRadius: 18, padding: 18 },

  breakdownEmpty: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
  },

  breakdownTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  breakdownTotalLabel: { fontSize: 18, fontWeight: '900' },
  breakdownTotalAmount: { fontSize: 20, fontWeight: '900' },
  breakdownItem: { marginBottom: 18 },

  breakdownTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  breakdownNameRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  breakdownIcon: { fontSize: 22, marginRight: 8 },
  breakdownName: { fontSize: 16, fontWeight: '900' },
  breakdownAmount: { fontSize: 16, fontWeight: '900' },

  breakdownTrack: {
    height: 10,
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 8,
  },

  breakdownFill: { height: '100%', borderRadius: 999 },
  breakdownPercent: { fontSize: 12, fontWeight: '800', marginTop: 5 },

  filterScroll: { marginBottom: 14 },

  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    marginRight: 8,
  },

  filterChipText: { fontWeight: '900' },

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

  lockedIcon: { fontSize: 16 },

  transaction: {
    flex: 1,
    borderRadius: 18,
    padding: 16,
  },

  transactionTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  transactionIconBubble: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  transactionIcon: { fontSize: 22 },
  transactionInfo: { flex: 1 },

  transactionLabel: {
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 3,
  },

  transactionTitle: {
    fontSize: 15,
    fontWeight: '800',
  },

  transactionDate: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },

  lockedBadge: {
    alignSelf: 'flex-start',
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
  },
});