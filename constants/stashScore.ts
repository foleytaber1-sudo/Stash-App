import { Account, Envelope, Transaction } from '@/store/store';

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const percentChange = (current: number, previous: number) => {
  if (previous === 0 && current === 0) return 0;
  if (previous === 0 && current > 0) return 100;
  return ((current - previous) / previous) * 100;
};

const getScoreLabel = (score: number) => {
  if (score >= 85) return 'Excellent';
  if (score >= 75) return 'Strong';
  if (score >= 50) return 'Building';
  return 'Needs Attention';
};

const getScoreEmoji = (score: number) => {
  if (score >= 85) return '🟢';
  if (score >= 75) return '🟡';
  if (score >= 50) return '🟠';
  return '🔴';
};

const getFactorStatus = (points: number, maxPoints: number) => {
  const percent = maxPoints > 0 ? points / maxPoints : 0;

  if (percent >= 0.8) return 'strong';
  if (percent >= 0.5) return 'okay';
  if (percent > 0) return 'weak';
  return 'none';
};

export const getStashScore = ({
  accounts,
  envelopes,
  transactions,
}: {
  accounts: Account[];
  envelopes: Envelope[];
  transactions: Transaction[];
}) => {
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

  const goalEnvelopes = envelopes.filter((envelope) => envelope.goalAmount > 0);

  const completedGoals = goalEnvelopes.filter(
    (envelope) => envelope.balance >= envelope.goalAmount
  );

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

  const incomeChange = percentChange(currentIncome, previousIncome);
  const spendingChange = percentChange(currentSpent, previousSpent);
  const stuffingChange = percentChange(currentStuffed, previousStuffed);

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

  const scoreLabel = getScoreLabel(healthScore);
  const scoreEmoji = getScoreEmoji(healthScore);

  const scoreFactors = [
    {
      id: 'income',
      title: 'Income Strength',
      points: incomeStrengthPoints,
      maxPoints: 20,
      status: getFactorStatus(incomeStrengthPoints, 20),
      description:
        currentIncome > 0
          ? `You added income in the last 30 days.`
          : `No income has been added in the last 30 days.`,
      detail: currentIncome,
    },
    {
      id: 'spending',
      title: 'Spending Control',
      points: spendingControlPoints,
      maxPoints: 20,
      status: getFactorStatus(spendingControlPoints, 20),
      description:
        currentIncome > 0
          ? `You spent ${Math.round(spendingRatio * 100)}% of your recent income.`
          : currentSpent > 0
            ? `You spent money without recent income logged.`
            : `No spending was logged in the last 30 days.`,
      detail: spendingRatio,
    },
    {
      id: 'stuffing',
      title: 'Envelope Discipline',
      points: envelopeDisciplinePoints,
      maxPoints: 20,
      status: getFactorStatus(envelopeDisciplinePoints, 20),
      description:
        currentIncome > 0
          ? `You stuffed ${Math.round(stuffingRatio * 100)}% of your recent income.`
          : `Add income and stuff envelopes to build this score.`,
      detail: stuffingRatio,
    },
    {
      id: 'goals',
      title: 'Goal Progress',
      points: goalProgressPoints,
      maxPoints: 15,
      status: getFactorStatus(goalProgressPoints, 15),
      description:
        goalEnvelopes.length > 0
          ? `${completedGoals.length} of ${goalEnvelopes.length} goals are fully funded.`
          : `Add goal amounts to your envelopes to build this score.`,
      detail: averageGoalProgress,
    },
    {
      id: 'cash',
      title: 'Cash Cushion',
      points: cashCushionPoints,
      maxPoints: 15,
      status: getFactorStatus(cashCushionPoints, 15),
      description:
        availableToStuff > 0
          ? `You have money available outside your envelopes.`
          : `Most or all of your cash is currently assigned.`,
      detail: availableToStuff,
    },
    {
      id: 'trends',
      title: 'Momentum',
      points: trendPoints,
      maxPoints: 10,
      status: trendPoints > 0 ? 'strong' : trendPoints === 0 ? 'okay' : 'weak',
      description:
        trendPoints > 0
          ? `Your recent trends are helping your score.`
          : trendPoints < 0
            ? `Your recent trends are pulling your score down.`
            : `Your recent trends are mostly neutral.`,
      detail: trendPoints,
    },
  ];

  const scoreExplanation = scoreFactors
    .filter((factor) => factor.points !== 0)
    .map((factor) => {
      const sign = factor.points > 0 ? '+' : '';
      return `${sign}${factor.points} ${factor.title}: ${factor.description}`;
    });

  const strongestFactor = [...scoreFactors].sort((a, b) => b.points - a.points)[0];
  const weakestFactor = [...scoreFactors].sort((a, b) => a.points - b.points)[0];

  return {
    healthScore,
    scoreLabel,
    scoreEmoji,

    incomeStrengthPoints,
    spendingControlPoints,
    envelopeDisciplinePoints,
    goalProgressPoints,
    cashCushionPoints,
    trendPoints,

    scoreFactors,
    scoreExplanation,
    strongestFactor,
    weakestFactor,

    currentIncome,
    previousIncome,
    currentSpent,
    previousSpent,
    currentStuffed,
    previousStuffed,

    incomeChange,
    spendingChange,
    stuffingChange,

    topCategory,
    topCategoryChange,
    currentSpendingBreakdown,

    spendingRatio,
    stuffingRatio,
    averageGoalProgress,
    availableToStuff,
    totalBalance,
    stuffedTotal,

    goalCount: goalEnvelopes.length,
    completedGoalCount: completedGoals.length,
  };
};