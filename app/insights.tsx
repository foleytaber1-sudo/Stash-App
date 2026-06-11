import { formatCurrency } from '@/constants/currency';
import { getTheme } from '@/constants/theme';
import { useStashStore } from '@/store/store';
import { router } from 'expo-router';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const chartWidth = Math.min(screenWidth - 116, 300);
const chartHeight = 150;
const dotSize = 10;

const formatShortDate = (date: Date) => {
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
};

const clamp = (value: number, min: number, max: number) => {
  return Math.max(min, Math.min(max, value));
};

const percentChange = (current: number, previous: number) => {
  if (previous === 0 && current === 0) return 0;
  if (previous === 0 && current > 0) return 100;
  return ((current - previous) / previous) * 100;
};

export default function InsightsScreen() {
  const accounts = useStashStore((state) => state.accounts);
  const envelopes = useStashStore((state) => state.envelopes);
  const transactions = useStashStore((state) => state.transactions);
  const themeColor = useStashStore((state) => state.themeColor);
  const themeMode = useStashStore((state) => state.themeMode);
  const currency = useStashStore((state) => state.currency);

  const theme = getTheme(themeColor, themeMode);

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const stuffedTotal = envelopes.reduce((sum, envelope) => sum + envelope.balance, 0);
  const availableToStuff = totalBalance - stuffedTotal;

  const now = new Date();
  const currentStart = new Date();
  currentStart.setDate(now.getDate() - 30);
  currentStart.setHours(0, 0, 0, 0);

  const previousStart = new Date();
  previousStart.setDate(now.getDate() - 60);
  previousStart.setHours(0, 0, 0, 0);

  const currentTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= currentStart;
  });

  const previousTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= previousStart && transactionDate < currentStart;
  });

  const currentIncome = currentTransactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const previousIncome = previousTransactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const currentSpent = currentTransactions
    .filter((transaction) => transaction.type === 'spend')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const previousSpent = previousTransactions
    .filter((transaction) => transaction.type === 'spend')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const currentStuffed = currentTransactions
    .filter((transaction) => transaction.type === 'stuff')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const previousStuffed = previousTransactions
    .filter((transaction) => transaction.type === 'stuff')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const netCash = currentIncome - currentSpent;

  const goalEnvelopes = envelopes.filter((envelope) => envelope.goalAmount > 0);

  const averageGoalProgress =
    goalEnvelopes.length > 0
      ? goalEnvelopes.reduce((sum, envelope) => {
          return sum + clamp(envelope.balance / envelope.goalAmount, 0, 1);
        }, 0) / goalEnvelopes.length
      : 0;

  const spendingRatio =
    currentIncome > 0 ? currentSpent / currentIncome : currentSpent > 0 ? 2 : 0;

  const stuffingRatio =
    currentIncome > 0 ? clamp(currentStuffed / currentIncome, 0, 1) : 0;

  const currentSpendingBreakdown = envelopes
    .map((envelope) => {
      const spent = currentTransactions
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

  const previousSpendingBreakdown = envelopes
    .map((envelope) => {
      const spent = previousTransactions
        .filter(
          (transaction) =>
            transaction.type === 'spend' && transaction.envelopeId === envelope.id
        )
        .reduce((sum, transaction) => sum + transaction.amount, 0);

      return {
        id: envelope.id,
        name: envelope.name,
        spent,
      };
    })
    .filter((item) => item.spent > 0);

  const topCategory = currentSpendingBreakdown[0];
  const previousTopCategory = topCategory
    ? previousSpendingBreakdown.find((item) => item.id === topCategory.id)
    : undefined;

  const topCategoryChange = topCategory
    ? percentChange(topCategory.spent, previousTopCategory?.spent ?? 0)
    : 0;

  const incomeChange = percentChange(currentIncome, previousIncome);
  const spendingChange = percentChange(currentSpent, previousSpent);
  const stuffingChange = percentChange(currentStuffed, previousStuffed);

  let incomeStrengthPoints = 0;
  if (currentIncome >= 500) incomeStrengthPoints = 5;
  if (currentIncome >= 1000) incomeStrengthPoints = 10;
  if (currentIncome >= 2000) incomeStrengthPoints = 15;
  if (currentIncome >= 3000) incomeStrengthPoints = 20;

  let spendingControlPoints = 0;
  if (currentIncome > 0) {
    if (spendingRatio <= 0.4) spendingControlPoints = 20;
    else if (spendingRatio <= 0.6) spendingControlPoints = 15;
    else if (spendingRatio <= 0.8) spendingControlPoints = 10;
    else if (spendingRatio <= 1) spendingControlPoints = 5;
  }

  const envelopeDisciplinePoints = Math.round(stuffingRatio * 20);
  const goalProgressPoints = Math.round(averageGoalProgress * 15);

  let cashCushionPoints = 0;
  if (availableToStuff > 0 && availableToStuff < 100) cashCushionPoints = 3;
  if (availableToStuff >= 100 && availableToStuff < 500) cashCushionPoints = 7;
  if (availableToStuff >= 500 && availableToStuff < 1000) cashCushionPoints = 11;
  if (availableToStuff >= 1000) cashCushionPoints = 15;

  let trendPoints = 0;
  if (incomeChange > 0) trendPoints += 3;
  if (spendingChange < 0) trendPoints += 3;
  if (stuffingChange > 0) trendPoints += 2;
  if (topCategory && topCategoryChange < 0) trendPoints += 2;

  if (spendingChange >= 20) trendPoints -= 5;
  if (incomeChange <= -20) trendPoints -= 5;
  if (topCategory && topCategoryChange >= 25) trendPoints -= 5;

  trendPoints = clamp(trendPoints, -10, 10);

  const healthScore = clamp(
    incomeStrengthPoints +
      spendingControlPoints +
      envelopeDisciplinePoints +
      goalProgressPoints +
      cashCushionPoints +
      trendPoints,
    0,
    100
  );

  const scoreBreakdown = [
    {
      label: 'Income Strength',
      value: incomeStrengthPoints,
      max: 20,
      detail: `${formatCurrency(currentIncome, currency)} income in the last 30 days`,
    },
    {
      label: 'Spending Control',
      value: spendingControlPoints,
      max: 20,
      detail:
        currentIncome > 0
          ? `${Math.round(spendingRatio * 100)}% of income spent`
          : 'Add income to measure spending control',
    },
    {
      label: 'Envelope Discipline',
      value: envelopeDisciplinePoints,
      max: 20,
      detail:
        currentIncome > 0
          ? `${Math.round(stuffingRatio * 100)}% of income assigned to envelopes`
          : 'Stuff envelopes after adding income',
    },
    {
      label: 'Goal Progress',
      value: goalProgressPoints,
      max: 15,
      detail:
        goalEnvelopes.length > 0
          ? `${Math.round(averageGoalProgress * 100)}% average goal progress`
          : 'Set goals to earn progress points',
    },
    {
      label: 'Cash Cushion',
      value: cashCushionPoints,
      max: 15,
      detail: `${formatCurrency(availableToStuff, currency)} available to stuff`,
    },
    {
      label: 'Trend Impact',
      value: trendPoints,
      max: 10,
      detail: 'Based on income, spending, stuffing, and category changes',
    },
  ];

  const activeBreakdown = scoreBreakdown.filter((item) => item.value !== 0);

  const getHealthInfo = () => {
    if (healthScore < 50) {
      return {
        label: 'Needs Attention',
        color: '#FFB3B3',
        message:
          'Your score is being held back by low income, spending pressure, or missing budget activity.',
      };
    }

    if (healthScore < 75) {
      return {
        label: 'Getting There',
        color: '#FFD6A5',
        message:
          'You are building momentum. Keep adding income, stuffing envelopes, and controlling spending.',
      };
    }

    if (healthScore < 85) {
      return {
        label: 'Good',
        color: '#FFF3A6',
        message: 'Your money habits are looking steady and organized.',
      };
    }

    return {
      label: 'Excellent',
      color: '#C8FF9B',
      message: 'Strong cash flow, healthy budgeting, and positive financial momentum.',
    };
  };

  const healthInfo = getHealthInfo();

  const totalSpent = currentSpendingBreakdown.reduce((sum, item) => sum + item.spent, 0);
  const maxSpent = Math.max(...currentSpendingBreakdown.map((item) => item.spent), 1);
  const largestEnvelope = [...envelopes].sort((a, b) => b.balance - a.balance)[0];

  const daysPassed = 30;
  const averageDailySpend = currentSpent / daysPassed;
  const projectedMonthlySpend = averageDailySpend * 30;
  const availableDaysLeft =
    averageDailySpend > 0 ? Math.floor(availableToStuff / averageDailySpend) : 0;

  const budgetInsights = [
    incomeChange > 15
      ? `Income increased ${Math.round(incomeChange)}% compared to the previous 30 days.`
      : incomeChange < -15
        ? `Income decreased ${Math.abs(Math.round(incomeChange))}% compared to the previous 30 days.`
        : '',
    spendingChange > 15
      ? `Spending increased ${Math.round(spendingChange)}% compared to the previous 30 days.`
      : spendingChange < -15
        ? `Spending decreased ${Math.abs(Math.round(spendingChange))}% compared to the previous 30 days.`
        : '',
    stuffingChange > 15
      ? `You stuffed ${Math.round(stuffingChange)}% more money into envelopes.`
      : stuffingChange < -15
        ? `You stuffed ${Math.abs(Math.round(stuffingChange))}% less money into envelopes.`
        : '',
    topCategory && topCategoryChange > 25
      ? `${topCategory.icon} ${topCategory.name} spending jumped ${Math.round(topCategoryChange)}%.`
      : topCategory && topCategoryChange < -25
        ? `${topCategory.icon} ${topCategory.name} spending dropped ${Math.abs(Math.round(topCategoryChange))}%.`
        : '',
    netCash > 0
      ? `You kept ${formatCurrency(netCash, currency)} more than you spent.`
      : currentIncome > 0
        ? `You spent ${formatCurrency(Math.abs(netCash), currency)} more than you earned.`
        : '',
  ].filter(Boolean);

  const smartInsights = [
    `Your Stash Score is built from income, spending control, envelope discipline, goals, cash cushion, and trends.`,
    topCategory
      ? `${topCategory.icon} ${topCategory.name} is your biggest spending category.`
      : 'No spending recorded in the last 30 days yet.',
    largestEnvelope
      ? `${largestEnvelope.icon ?? '💵'} ${largestEnvelope.name} is your largest envelope right now.`
      : 'Create envelopes to start seeing better insights.',
    currentStuffed > 0
      ? `You assigned ${formatCurrency(currentStuffed, currency)} into envelopes in the last 30 days.`
      : 'Stuff money into envelopes to improve your score.',
  ];

  const lastThirtyDays = Array.from({ length: 30 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - index));
    date.setHours(0, 0, 0, 0);

    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);

    const daySpent = transactions
      .filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return (
          transaction.type === 'spend' &&
          transactionDate >= date &&
          transactionDate < nextDate
        );
      })
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    return {
      label: formatShortDate(date),
      spent: daySpent,
    };
  });

  const trendMax = Math.max(...lastThirtyDays.map((item) => item.spent), 1);

  const points = lastThirtyDays.map((item, index) => {
    const usableWidth = chartWidth - dotSize;
    const usableHeight = chartHeight - dotSize;

    const x = index * (usableWidth / (lastThirtyDays.length - 1)) + dotSize / 2;
    const y = usableHeight - (item.spent / trendMax) * usableHeight + dotSize / 2;

    return {
      x,
      y,
      amount: item.spent,
      label: item.label,
    };
  });

  const renderLineSegments = () => {
    return points.slice(0, -1).map((point, index) => {
      const nextPoint = points[index + 1];
      const deltaX = nextPoint.x - point.x;
      const deltaY = nextPoint.y - point.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const angle = Math.atan2(deltaY, deltaX);

      return (
        <View
          key={`${point.label}-${index}`}
          style={[
            styles.lineSegment,
            {
              width: distance,
              left: point.x,
              top: point.y,
              backgroundColor: theme.accent,
              transform: [{ rotateZ: `${angle}rad` }],
            },
          ]}
        />
      );
    });
  };

  const renderDots = () => {
    return points.map((point, index) => {
      if (index % 5 !== 0 && index !== points.length - 1) return null;

      return (
        <View
          key={`${point.label}-dot`}
          style={[
            styles.chartDot,
            {
              left: point.x - dotSize / 2,
              top: point.y - dotSize / 2,
              backgroundColor: theme.button,
              borderColor: theme.accent,
            },
          ]}
        />
      );
    });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: theme.card }]}
          onPress={() => router.back()}
        >
          <Text style={[styles.backButtonText, { color: theme.text }]}>‹</Text>
        </TouchableOpacity>

        <Text style={[styles.title, { color: theme.text }]}>Insights</Text>
      </View>

      <Text style={[styles.subtitle, { color: theme.subtext }]}>
        What your money is telling you this month.
      </Text>

      <View style={[styles.healthCard, { backgroundColor: healthInfo.color }]}>
        <Text style={styles.healthLabel}>STASH SCORE</Text>
        <Text style={styles.healthScore}>{healthScore}</Text>
        <Text style={styles.healthStatus}>{healthInfo.label}</Text>
        <Text style={styles.healthMessage}>{healthInfo.message}</Text>
      </View>

      <View style={[styles.bigCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Score Breakdown</Text>

        {activeBreakdown.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.subtext }]}>
            Add income, stuff envelopes, set goals, or track spending to build your Stash Score.
          </Text>
        ) : (
          activeBreakdown.map((item) => (
            <View
              style={[styles.scoreRow, { borderBottomColor: theme.border }]}
              key={item.label}
            >
              <View style={styles.scoreInfo}>
                <Text style={[styles.scoreLabel, { color: theme.text }]}>{item.label}</Text>
                <Text style={[styles.scoreDetail, { color: theme.subtext }]}>
                  {item.detail}
                </Text>
              </View>

              <Text
                style={[
                  styles.scoreValue,
                  { color: item.value < 0 ? '#FF6B6B' : theme.accent },
                ]}
              >
                {item.value > 0 ? '+' : ''}
                {item.value}/{item.max}
              </Text>
            </View>
          ))
        )}
      </View>

      <View style={[styles.bigCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Budget Insights</Text>

        {budgetInsights.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.subtext }]}>
            Keep using Stash and this section will compare your money habits over time.
          </Text>
        ) : (
          budgetInsights.map((insight) => (
            <View style={styles.insightRow} key={insight}>
              <Text style={[styles.insightBullet, { color: theme.accent }]}>•</Text>
              <Text style={[styles.insightText, { color: theme.subtext }]}>{insight}</Text>
            </View>
          ))
        )}
      </View>

      <View style={[styles.bigCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Smart Insights</Text>

        {smartInsights.map((insight) => (
          <View style={styles.insightRow} key={insight}>
            <Text style={[styles.insightBullet, { color: theme.accent }]}>•</Text>
            <Text style={[styles.insightText, { color: theme.subtext }]}>{insight}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.bigCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>30-Day Snapshot</Text>

        <View style={[styles.snapshotRow, { borderBottomColor: theme.border }]}>
          <Text style={[styles.snapshotLabel, { color: theme.subtext }]}>Income</Text>
          <Text style={[styles.positiveAmount, { color: theme.accent }]}>
            +{formatCurrency(currentIncome, currency)}
          </Text>
        </View>

        <View style={[styles.snapshotRow, { borderBottomColor: theme.border }]}>
          <Text style={[styles.snapshotLabel, { color: theme.subtext }]}>Spent</Text>
          <Text style={styles.negativeAmount}>
            -{formatCurrency(currentSpent, currency)}
          </Text>
        </View>

        <View style={[styles.snapshotRow, { borderBottomColor: theme.border }]}>
          <Text style={[styles.snapshotLabel, { color: theme.subtext }]}>Stuffed</Text>
          <Text style={[styles.snapshotValue, { color: theme.text }]}>
            {formatCurrency(currentStuffed, currency)}
          </Text>
        </View>

        <View style={styles.netRow}>
          <Text style={[styles.netLabel, { color: theme.text }]}>Net Cash</Text>
          <Text style={[styles.netValue, { color: netCash >= 0 ? theme.accent : '#FF6B6B' }]}>
            {netCash >= 0 ? '+' : '-'}
            {formatCurrency(Math.abs(netCash), currency)}
          </Text>
        </View>
      </View>

      <View style={[styles.bigCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Spending Categories</Text>

        {currentSpendingBreakdown.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.subtext }]}>
            No spending in the last 30 days yet. Once you spend from envelopes, your categories will appear here.
          </Text>
        ) : (
          currentSpendingBreakdown.map((item) => {
            const percent = Math.round((item.spent / maxSpent) * 100);
            const share = totalSpent > 0 ? Math.round((item.spent / totalSpent) * 100) : 0;

            return (
              <View style={styles.spendingItem} key={item.id}>
                <View style={styles.graphTopRow}>
                  <Text style={[styles.graphLabel, { color: theme.text }]}>
                    {item.icon} {item.name}
                  </Text>

                  <Text style={[styles.graphAmount, { color: theme.text }]}>
                    {formatCurrency(item.spent, currency)}
                  </Text>
                </View>

                <View style={[styles.graphTrack, { backgroundColor: theme.soft }]}>
                  <View
                    style={[
                      styles.darkGraphFill,
                      { width: `${percent}%`, backgroundColor: theme.accent },
                    ]}
                  />
                </View>

                <Text style={[styles.shareText, { color: theme.subtext }]}>
                  {share}% of 30-day spending
                </Text>
              </View>
            );
          })
        )}
      </View>

      <View style={[styles.bigCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>30-Day Spending Trend</Text>

        <View style={styles.lineChartWrapper}>
          <View style={styles.lineChart}>
            <View style={[styles.chartGridLine, { backgroundColor: theme.border }]} />
            <View
              style={[
                styles.chartGridLine,
                { top: chartHeight / 2, backgroundColor: theme.border },
              ]}
            />
            <View
              style={[
                styles.chartGridLine,
                { top: chartHeight - 1, backgroundColor: theme.border },
              ]}
            />

            {renderLineSegments()}
            {renderDots()}
          </View>

          <View style={styles.dateRow}>
            <Text style={[styles.dateLabel, { color: theme.subtext }]}>
              {lastThirtyDays[0]?.label}
            </Text>
            <Text style={[styles.dateLabel, { color: theme.subtext }]}>
              {lastThirtyDays[14]?.label}
            </Text>
            <Text style={[styles.dateLabel, { color: theme.subtext }]}>
              {lastThirtyDays[29]?.label}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.bigCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Predictions</Text>

        <View style={[styles.predictionBox, { backgroundColor: theme.soft }]}>
          <Text style={[styles.predictionLabel, { color: theme.subtext }]}>
            Average Daily Spend
          </Text>
          <Text style={[styles.predictionValue, { color: theme.text }]}>
            {formatCurrency(averageDailySpend, currency)}
          </Text>
        </View>

        <View style={[styles.predictionBox, { backgroundColor: theme.soft }]}>
          <Text style={[styles.predictionLabel, { color: theme.subtext }]}>
            Projected 30-Day Spend
          </Text>
          <Text style={[styles.predictionValue, { color: theme.text }]}>
            {formatCurrency(projectedMonthlySpend, currency)}
          </Text>
        </View>

        <View style={[styles.predictionBox, { backgroundColor: theme.soft }]}>
          <Text style={[styles.predictionLabel, { color: theme.subtext }]}>
            Available Cash Could Last
          </Text>
          <Text style={[styles.predictionValue, { color: theme.text }]}>
            {availableDaysLeft > 0 ? `${availableDaysLeft} days` : 'Not enough data'}
          </Text>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerRow: { marginTop: 55, flexDirection: 'row', alignItems: 'center' },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  backButtonText: { fontSize: 38, fontWeight: '700', marginTop: -4 },
  title: { fontSize: 34, fontWeight: '900' },
  subtitle: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 20,
  },
  healthCard: { borderRadius: 28, padding: 24, marginBottom: 18 },
  healthLabel: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.7,
    color: '#111111',
  },
  healthScore: {
    fontSize: 76,
    fontWeight: '900',
    color: '#111111',
    marginTop: 8,
  },
  healthStatus: { fontSize: 28, fontWeight: '900', color: '#111111' },
  healthMessage: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
    lineHeight: 23,
    marginTop: 8,
  },
  bigCard: {
    borderRadius: 22,
    padding: 18,
    marginTop: 18,
    overflow: 'hidden',
  },
  cardTitle: { fontSize: 22, fontWeight: '900', marginBottom: 16 },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingVertical: 12,
  },
  scoreInfo: { flex: 1, paddingRight: 12 },
  scoreLabel: { fontSize: 16, fontWeight: '900' },
  scoreDetail: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
    lineHeight: 19,
  },
  scoreValue: { fontSize: 19, fontWeight: '900' },
  insightRow: { flexDirection: 'row', marginBottom: 12 },
  insightBullet: {
    fontSize: 22,
    fontWeight: '900',
    marginRight: 10,
    marginTop: -4,
  },
  insightText: { flex: 1, fontSize: 16, fontWeight: '700', lineHeight: 23 },
  snapshotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingVertical: 12,
  },
  snapshotLabel: { fontSize: 16, fontWeight: '800' },
  snapshotValue: { fontSize: 17, fontWeight: '900' },
  positiveAmount: { fontSize: 17, fontWeight: '900' },
  negativeAmount: { fontSize: 17, fontWeight: '900', color: '#FF6B6B' },
  netRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 14,
    marginTop: 2,
  },
  netLabel: { fontSize: 19, fontWeight: '900' },
  netValue: { fontSize: 22, fontWeight: '900' },
  spendingItem: { marginBottom: 20 },
  graphTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  graphLabel: { fontSize: 15, fontWeight: '900', flex: 1 },
  graphAmount: { fontSize: 15, fontWeight: '900' },
  graphTrack: {
    height: 13,
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 9,
  },
  darkGraphFill: { height: '100%', borderRadius: 999 },
  shareText: { fontSize: 12, fontWeight: '800', marginTop: 6 },
  emptyText: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
    marginBottom: 8,
  },
  lineChartWrapper: { alignItems: 'center' },
  lineChart: {
    width: chartWidth,
    height: chartHeight,
    position: 'relative',
    marginTop: 10,
    overflow: 'hidden',
  },
  chartGridLine: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: chartWidth,
    height: 1,
  },
  lineSegment: {
    position: 'absolute',
    height: 3,
    borderRadius: 999,
    transformOrigin: 'left center',
  },
  chartDot: {
    position: 'absolute',
    width: dotSize,
    height: dotSize,
    borderRadius: 999,
    borderWidth: 2,
  },
  dateRow: {
    width: chartWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  dateLabel: { fontSize: 10, fontWeight: '800', textAlign: 'center' },
  predictionBox: { borderRadius: 18, padding: 16, marginBottom: 10 },
  predictionLabel: { fontSize: 13, fontWeight: '900', marginBottom: 5 },
  predictionValue: { fontSize: 24, fontWeight: '900' },
});