import { getStashScore } from '@/constants/stashScore';
import { Account, Envelope, MonthlyScoreHistory, Transaction } from '@/store/store';

export type StashBrainData = {
  accounts: Account[];
  envelopes: Envelope[];
  transactions: Transaction[];
  monthlyScoreHistory: MonthlyScoreHistory[];
};

export type BrainPriority = 'critical' | 'warning' | 'opportunity' | 'positive' | 'neutral';

export type BrainInsightCard = {
  id: string;
  title: string;
  body: string;
  type: BrainPriority;
  icon: string;
  scoreImpact: number;
};

export type BrainWin = {
  id: string;
  title: string;
  subtitle: string;
  unlocked: boolean;
  icon: string;
};

export type BrainToolPreview = {
  id: 'stuff-income' | 'afford-this' | 'analyze-spending' | 'goal-strategy';
  title: string;
  subtitle: string;
  status: string;
  priority: BrainPriority;
};

type GoalStatsEnvelope = Envelope & {
  hasGoal: boolean;
  goalAmount: number;
  remaining: number;
  percent: number;
  isComplete: boolean;
};

type EnvelopeSpending = Envelope & {
  spentThisMonth: number;
  spentLastMonth: number;
  changeAmount: number;
  changePercent: number | null;
};

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  dining: [
    'dinner',
    'lunch',
    'breakfast',
    'brunch',
    'restaurant',
    'restaurants',
    'dining',
    'dine',
    'eat out',
    'eating out',
    'fast food',
    'burger',
    'pizza',
    'taco',
    'tacos',
    'coffee',
    'cafe',
    'starbucks',
    'dutch bros',
    'doordash',
    'door dash',
    'uber eats',
    'ubereats',
    'grubhub',
    'takeout',
    'take out',
    'meal',
    'snack',
    'smoothie',
    'boba',
    'sushi',
    'sandwich',
    'chipotle',
    'mcdonalds',
    'wendys',
    'taco bell',
    'kfc',
    'subway',
  ],
  groceries: [
    'groceries',
    'grocery',
    'food',
    'walmart',
    'target',
    'costco',
    'safeway',
    'kroger',
    'fred meyer',
    'trader joes',
    'aldi',
    'market',
    'supermarket',
    'winco',
    'whole foods',
    'pantry',
    'milk',
    'eggs',
    'bread',
    'meat',
    'produce',
    'fruit',
    'vegetables',
  ],
  gas: [
    'gas',
    'fuel',
    'chevron',
    'shell',
    'exxon',
    'arco',
    'mobil',
    '76',
    'fill up',
    'gas station',
    'gasoline',
  ],
  car: [
    'car',
    'auto',
    'vehicle',
    'oil change',
    'tires',
    'tire',
    'repair',
    'maintenance',
    'registration',
    'parking',
    'dmv',
    'mechanic',
    'brakes',
    'battery',
    'car wash',
  ],
  rent: ['rent', 'mortgage', 'housing', 'apartment', 'lease', 'landlord', 'house payment'],
  utilities: [
    'electric',
    'water',
    'utility',
    'utilities',
    'internet',
    'wifi',
    'phone bill',
    'power',
    'gas bill',
    'trash',
    'sewer',
    'electricity',
    'cable',
  ],
  fun: [
    'fun',
    'entertainment',
    'movie',
    'movies',
    'game',
    'games',
    'concert',
    'bar',
    'drinks',
    'hobby',
    'date night',
    'bowling',
    'arcade',
    'spotify',
    'netflix',
    'hulu',
    'disney',
  ],
  shopping: [
    'shopping',
    'clothes',
    'clothing',
    'amazon',
    'mall',
    'shoes',
    'shirt',
    'pants',
    'target run',
    'makeup',
    'beauty',
    'skincare',
    'hair',
    'outfit',
    'jacket',
    'costco run',
  ],
  pets: [
    'dog',
    'dogs',
    'pet',
    'pets',
    'cat',
    'cats',
    'vet',
    'treats',
    'pet food',
    'chewy',
    'grooming',
    'litter',
    'toys',
    'puppy',
  ],
  travel: [
    'travel',
    'trip',
    'vacation',
    'hotel',
    'flight',
    'airbnb',
    'airport',
    'rental car',
    'resort',
    'hawaii',
    'vegas',
    'disneyland',
    'road trip',
    'cruise',
  ],
  savings: ['save', 'savings', 'emergency', 'fund', 'rainy day', 'backup', 'buffer', 'cushion'],
  emergency: [
    'emergency',
    'unexpected',
    'urgent',
    'crisis',
    'backup',
    'rainy day',
    'medical',
    'hospital',
    'repair',
    'broken',
  ],
  bills: [
    'bill',
    'bills',
    'subscription',
    'subscriptions',
    'netflix',
    'spotify',
    'hulu',
    'insurance',
    'payment',
    'monthly payment',
    'due',
  ],
  christmas: [
    'christmas',
    'xmas',
    'holiday',
    'holidays',
    'gift',
    'gifts',
    'present',
    'presents',
    'stocking',
    'santa',
  ],
  health: [
    'health',
    'doctor',
    'dentist',
    'medical',
    'medicine',
    'prescription',
    'pharmacy',
    'therapy',
    'urgent care',
  ],
  debt: ['debt', 'credit card', 'loan', 'payoff', 'payment', 'interest', 'minimum payment'],
};

const CATEGORY_LABELS: Record<string, string> = {
  dining: 'Dining',
  groceries: 'Groceries',
  gas: 'Gas',
  car: 'Car',
  rent: 'Rent',
  utilities: 'Utilities',
  fun: 'Fun Money',
  shopping: 'Shopping',
  pets: 'Pets',
  travel: 'Travel',
  savings: 'Savings',
  emergency: 'Emergency Fund',
  bills: 'Bills',
  christmas: 'Christmas',
  health: 'Health',
  debt: 'Debt',
};

const INTENTS = {
  afford: [
    'afford',
    'can i spend',
    'can i buy',
    'should i spend',
    'purchase',
    'buy',
    'safe to spend',
    'do i have enough',
    'is it okay if i buy',
    'is it okay to spend',
    'can we afford',
    'can i get',
    'should i buy',
    'worth buying',
    'is this safe',
  ],
  stuff: [
    'stuff',
    'paycheck',
    'income',
    'allocate',
    'assign',
    'where should my money go',
    'what should i fund',
    'next dollars',
    'split my money',
    'split income',
    'budget my paycheck',
    'distribute',
    'put money',
    'where should i put',
    'fund first',
  ],
  spending: [
    'spend',
    'spending',
    'money going',
    'leak',
    'category',
    'analyze',
    'waste',
    'overspending',
    'biggest expense',
    'most money',
    'where did my money go',
    'where is my money going',
    'what am i spending on',
    'spending leak',
    'bad spending',
    'cut back',
    'too much',
  ],
  goals: [
    'goal',
    'goals',
    'strategy',
    'finish',
    'complete',
    'funded',
    'priority',
    'behind',
    'ahead',
    'how close',
    'progress',
    'target',
    'saving for',
    'which goal',
    'goal next',
  ],
  score: [
    'score',
    'why did my score',
    'why score',
    'change',
    'points',
    'health',
    'rating',
    'why is my score',
    'improve score',
    'score low',
    'score high',
  ],
  runway: [
    'runway',
    'how long',
    'last',
    'survive',
    'cash last',
    'days left',
    'future',
    'forecast',
    'predict',
    'next month',
    'next week',
    'will i run out',
  ],
  accounts: [
    'account',
    'accounts',
    'balance',
    'cash',
    'total money',
    'how much money',
    'available',
    'how much cash',
    'unassigned',
    'assigned',
    'stuffed',
  ],
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const roundMoney = (value: number) => Math.round(value * 100) / 100;

const money = (value: number) => `$${Math.abs(roundMoney(value)).toFixed(2)}`;

const signedMoney = (value: number) => `${value >= 0 ? '+' : '-'}${money(value)}`;

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const uniqueWords = (value: string) =>
  Array.from(new Set(normalize(value).split(' ').filter(Boolean)));

const includesAny = (text: string, words: string[]) =>
  words.some((word) => normalize(text).includes(normalize(word)));

const wordSimilarity = (a: string, b: string) => {
  const left = normalize(a);
  const right = normalize(b);

  if (!left || !right) return 0;
  if (left === right) return 1;
  if (left.includes(right) || right.includes(left)) return 0.85;

  const leftWords = uniqueWords(left);
  const rightWords = uniqueWords(right);
  const overlap = leftWords.filter((word) => rightWords.includes(word)).length;

  return overlap / Math.max(leftWords.length, rightWords.length, 1);
};

const daysBetween = (dateA: Date, dateB: Date) => {
  const diff = Math.abs(dateA.getTime() - dateB.getTime());
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const startOfMonth = () => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const startOfPreviousMonth = () => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth() - 1, 1);
};

const endOfPreviousMonth = () => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), 0, 23, 59, 59);
};

const getTransactionsBetween = (
  transactions: Transaction[],
  startDate: Date,
  endDate: Date
) => {
  return transactions.filter((transaction) => {
    const date = new Date(transaction.date);
    return date >= startDate && date <= endDate;
  });
};

const getMonthlyTransactions = (transactions: Transaction[]) =>
  getTransactionsBetween(transactions, startOfMonth(), new Date());

const getPreviousMonthlyTransactions = (transactions: Transaction[]) =>
  getTransactionsBetween(transactions, startOfPreviousMonth(), endOfPreviousMonth());

const getTransactionsLastDays = (transactions: Transaction[], days: number) => {
  const start = new Date();
  start.setDate(start.getDate() - days);
  start.setHours(0, 0, 0, 0);
  return getTransactionsBetween(transactions, start, new Date());
};

const sumTransactions = (transactions: Transaction[], type: Transaction['type']) =>
  transactions
    .filter((transaction) => transaction.type === type)
    .reduce((sum, transaction) => sum + transaction.amount, 0);

const extractAmount = (question: string) => {
  const cleaned = question.replace(/,/g, '');
  const dollarMatch = cleaned.match(/\$?\s*(\d+(\.\d{1,2})?)/);
  if (!dollarMatch) return null;

  const amount = Number(dollarMatch[1]);
  return Number.isFinite(amount) && amount > 0 ? amount : null;
};

const detectCategory = (question: string) => {
  const lower = normalize(question);
  const lowerWords = uniqueWords(lower);
  let bestCategory = '';
  let bestScore = 0;

  Object.entries(CATEGORY_KEYWORDS).forEach(([category, keywords]) => {
    let score = 0;

    keywords.forEach((keyword) => {
      const normalizedKeyword = normalize(keyword);

      if (lower.includes(normalizedKeyword)) {
        score += normalizedKeyword.split(' ').length >= 2 ? 8 : 5;
      }

      lowerWords.forEach((word) => {
        if (word.length >= 4 && wordSimilarity(word, normalizedKeyword) >= 0.8) {
          score += 2;
        }
      });
    });

    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  });

  return bestCategory
    ? {
        category: bestCategory,
        label: CATEGORY_LABELS[bestCategory] ?? bestCategory,
        confidence: clamp(bestScore * 8, 0, 100),
      }
    : null;
};

const scoreEnvelopeMatch = (
  envelope: Envelope,
  question: string,
  categoryMatch: ReturnType<typeof detectCategory>
) => {
  const envelopeName = normalize(envelope.name);
  const cleanQuestion = normalize(question);
  const questionWords = uniqueWords(question);

  let score = 0;
  let realMatchFound = false;

  if (envelopeName.length >= 3 && cleanQuestion.includes(envelopeName)) {
    score += 90;
    realMatchFound = true;
  }

  questionWords.forEach((word) => {
    if (word.length >= 3 && envelopeName.includes(word)) {
      score += 12;
      realMatchFound = true;
    }

    if (word.length >= 4 && wordSimilarity(word, envelopeName) >= 0.8) {
      score += 8;
      realMatchFound = true;
    }
  });

  if (categoryMatch) {
    const category = categoryMatch.category;
    const categoryLabel = normalize(categoryMatch.label);
    const keywords = CATEGORY_KEYWORDS[category] ?? [];

    if (envelopeName.includes(category)) {
      score += 60;
      realMatchFound = true;
    }

    if (envelopeName.includes(categoryLabel)) {
      score += 60;
      realMatchFound = true;
    }

    const aliasGroups: Record<string, string[]> = {
      dining: ['dining', 'food out', 'eating out', 'restaurants', 'takeout', 'coffee'],
      groceries: ['groceries', 'grocery', 'food', 'house food', 'market'],
      gas: ['gas', 'fuel'],
      car: ['car', 'auto', 'vehicle'],
      savings: ['savings', 'save'],
      emergency: ['emergency', 'rainy day', 'buffer'],
      christmas: ['christmas', 'holiday', 'gifts', 'presents'],
      travel: ['travel', 'trip', 'vacation'],
      bills: ['bills', 'subscriptions', 'monthly bills'],
      fun: ['fun', 'entertainment'],
      shopping: ['shopping', 'clothes'],
      pets: ['pets', 'dog', 'cat'],
      health: ['health', 'medical', 'doctor'],
      debt: ['debt', 'credit card', 'loan'],
    };

    (aliasGroups[category] ?? []).forEach((alias) => {
      if (envelopeName.includes(normalize(alias))) {
        score += 50;
        realMatchFound = true;
      }
    });

    keywords.forEach((keyword) => {
      const normalizedKeyword = normalize(keyword);

      if (envelopeName.includes(normalizedKeyword)) {
        score += 18;
        realMatchFound = true;
      }
    });
  }

  if (!realMatchFound) return 0;

  if ((envelope.goalAmount ?? 0) > 0) score += 2;
  if (envelope.balance > 0) score += 2;

  return score;
};

const findBestEnvelopeForQuestion = (question: string, envelopes: Envelope[]) => {
  const categoryMatch = detectCategory(question);

  const ranked = envelopes
    .map((envelope) => ({
      envelope,
      score: scoreEnvelopeMatch(envelope, question, categoryMatch),
    }))
    .sort((a, b) => b.score - a.score);

  const best = ranked[0];

  if (!best || best.score < 10) {
    return {
      envelope: null,
      categoryMatch,
      confidence: 0,
      alternatives: ranked
        .filter((item) => item.score > 0)
        .slice(0, 4)
        .map((item) => item.envelope),
    };
  }

  return {
    envelope: best.envelope,
    categoryMatch,
    confidence: clamp(best.score, 0, 100),
    alternatives: ranked
      .filter((item) => item.score > 0)
      .slice(1, 5)
      .map((item) => item.envelope),
  };
};

const getGoalStats = (envelope: Envelope): GoalStatsEnvelope => {
  const goalAmount = envelope.goalAmount ?? 0;
  const hasGoal = goalAmount > 0;
  const remaining = hasGoal ? Math.max(0, goalAmount - envelope.balance) : 0;
  const percent = hasGoal
    ? clamp(Math.round((envelope.balance / goalAmount) * 100), 0, 100)
    : 0;

  return {
    ...envelope,
    hasGoal,
    goalAmount,
    remaining,
    percent,
    isComplete: hasGoal && envelope.balance >= goalAmount,
  };
};

const getEnvelopeSpending = (
  envelope: Envelope,
  transactions: Transaction[],
  previousTransactions: Transaction[]
): EnvelopeSpending => {
  const spentThisMonth = transactions
    .filter(
      (transaction) =>
        transaction.type === 'spend' && transaction.envelopeId === envelope.id
    )
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const spentLastMonth = previousTransactions
    .filter(
      (transaction) =>
        transaction.type === 'spend' && transaction.envelopeId === envelope.id
    )
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const changeAmount = spentThisMonth - spentLastMonth;
  const changePercent =
    spentLastMonth > 0 ? Math.round((changeAmount / spentLastMonth) * 100) : null;

  return {
    ...envelope,
    spentThisMonth,
    spentLastMonth,
    changeAmount,
    changePercent,
  };
};

const getBiggestTransaction = (transactions: Transaction[], type?: Transaction['type']) => {
  return transactions
    .filter((transaction) => (type ? transaction.type === type : true))
    .sort((a, b) => b.amount - a.amount)[0];
};

const getRecentActivity = (transactions: Transaction[]) => {
  if (transactions.length === 0) return null;

  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const latest = sorted[0];
  const daysAgo = daysBetween(new Date(latest.date), new Date());

  return {
    latest,
    daysAgo,
  };
};

const buildStuffingPlanPreview = (
  availableToStuff: number,
  goalEnvelopes: GoalStatsEnvelope[]
) => {
  if (availableToStuff <= 0 || goalEnvelopes.length === 0) return [];

  const incompleteGoals = goalEnvelopes
    .filter((envelope) => !envelope.isComplete && envelope.remaining > 0)
    .sort((a, b) => {
      if (a.percent !== b.percent) return a.percent - b.percent;
      return b.remaining - a.remaining;
    });

  let remainingCash = availableToStuff;

  return incompleteGoals
    .slice(0, 5)
    .map((envelope, index) => {
      const weight = index === 0 ? 0.35 : index === 1 ? 0.25 : index === 2 ? 0.18 : index === 3 ? 0.12 : 0.1;
      const recommended = roundMoney(
        Math.min(envelope.remaining, availableToStuff * weight, remainingCash)
      );

      remainingCash -= recommended;

      return {
        envelopeId: envelope.id,
        envelopeName: envelope.name,
        amount: Math.max(0, recommended),
        remainingAfter: Math.max(0, envelope.remaining - recommended),
      };
    })
    .filter((item) => item.amount > 0);
};

const buildAffordabilityResponse = ({
  question,
  envelopes,
  availableToStuff,
  monthlyIncome,
  monthlySpending,
}: {
  question: string;
  envelopes: Envelope[];
  availableToStuff: number;
  monthlyIncome: number;
  monthlySpending: number;
}) => {
  const amount = extractAmount(question);
  const match = findBestEnvelopeForQuestion(question, envelopes);

  if (!amount) {
    if (match.envelope) {
      return `I matched this to ${match.envelope.name} with ${match.confidence}% confidence.\n\nThat envelope currently has ${money(
        match.envelope.balance
      )}. Add a dollar amount and I can tell you if it is safe.`;
    }

    return 'I need a dollar amount to check this properly. Try: “Can I spend $25 on dinner?”';
  }

  const monthlySpendingRatio =
    monthlyIncome > 0 ? Math.round((monthlySpending / monthlyIncome) * 100) : null;

  if (match.envelope) {
    const envelope = match.envelope;
    const afterEnvelope = roundMoney(envelope.balance - amount);
    const percentUsed =
      envelope.balance > 0 ? Math.round((amount / envelope.balance) * 100) : 100;
    const confidence =
      match.confidence >= 75 ? 'High confidence' : match.confidence >= 40 ? 'Medium confidence' : 'Low confidence';

    const categoryText = match.categoryMatch
      ? `${confidence}: I matched “${match.categoryMatch.label}” to your ${envelope.name} envelope.`
      : `${confidence}: I matched this to your ${envelope.name} envelope.`;

    const alternatives =
      match.alternatives.length > 0
        ? `\n\nOther possible envelopes: ${match.alternatives
            .slice(0, 3)
            .map((item) => item.name)
            .join(', ')}.`
        : '';

    if (afterEnvelope >= 0) {
      const tone =
        percentUsed >= 75
          ? 'Yes, but this uses most of that envelope.'
          : percentUsed >= 40
            ? 'Yes, but keep an eye on it.'
            : 'Yes — this looks safe.';

      const impact =
        monthlySpendingRatio !== null
          ? `\n\nCurrent spending is using about ${monthlySpendingRatio}% of your monthly income.`
          : '';

      return `${tone}\n\n${categoryText}\n\n${envelope.name} has ${money(
        envelope.balance
      )}. After spending ${money(amount)}, you would have ${money(
        afterEnvelope
      )} left.${impact}${alternatives}`;
    }

    const shortBy = Math.abs(afterEnvelope);

    if (availableToStuff >= shortBy) {
      return `Caution.\n\n${categoryText}\n\n${envelope.name} only has ${money(
        envelope.balance
      )}, so this purchase is short by ${money(
        shortBy
      )}. You could cover it with available-to-stuff cash, but that means stealing from future plans.${alternatives}`;
    }

    return `I would not recommend it.\n\n${categoryText}\n\n${envelope.name} has ${money(
      envelope.balance
    )}. A ${money(amount)} purchase would put it negative by ${money(shortBy)}.${alternatives}`;
  }

  if (availableToStuff >= amount) {
    return `Maybe.\n\nI could not confidently match this to an envelope, but you have ${money(
      availableToStuff
    )} available to stuff. I would create or fund the correct envelope first, then make the purchase.`;
  }

  return `I would be careful.\n\nI could not confidently match this to an envelope, and your available-to-stuff cash is only ${money(
    availableToStuff
  )}.`;
};

const buildStuffingResponse = ({
  availableToStuff,
  weakestGoal,
  closestGoal,
  largestGoalGap,
  stuffingPlanPreview,
  goalEnvelopes,
  envelopes,
}: {
  availableToStuff: number;
  weakestGoal?: GoalStatsEnvelope;
  closestGoal?: GoalStatsEnvelope;
  largestGoalGap?: GoalStatsEnvelope;
  stuffingPlanPreview: ReturnType<typeof buildStuffingPlanPreview>;
  goalEnvelopes: GoalStatsEnvelope[];
  envelopes: Envelope[];
}) => {
  if (envelopes.length === 0) {
    return 'Create your first envelopes first. Once you have envelopes, I can tell you exactly where your next dollars should go.';
  }

  if (goalEnvelopes.length === 0) {
    return 'You have envelopes, but no goal amounts yet. Add goals to your envelopes and I can rank where your income should go first.';
  }

  if (availableToStuff <= 0) {
    if (weakestGoal) {
      return `Right now I do not see extra available cash to stuff. When income comes in, I would start with ${weakestGoal.name} because it is only ${weakestGoal.percent}% funded and needs ${money(
        weakestGoal.remaining
      )} more.`;
    }

    return 'Right now I do not see extra available cash to stuff. When income comes in, I can build a stuffing plan.';
  }

  if (stuffingPlanPreview.length > 0) {
    const plan = stuffingPlanPreview
      .map((item) => `• ${item.envelopeName}: ${money(item.amount)} → ${money(item.remainingAfter)} left`)
      .join('\n');

    const mainReason = weakestGoal
      ? `${weakestGoal.name} is your weakest funded goal at ${weakestGoal.percent}%.`
      : largestGoalGap
        ? `${largestGoalGap.name} has the largest remaining gap.`
        : 'This plan spreads money across your active goals.';

    return `Here is the smartest stuffing move right now:\n\n${plan}\n\nWhy: ${mainReason}`;
  }

  if (closestGoal) {
    return `I would focus on ${closestGoal.name}. It is already ${closestGoal.percent}% funded, so finishing it could give you a quick win.`;
  }

  return 'I would stuff your most important envelope first, then split the rest between your lowest-funded goals.';
};

const buildSpendingResponse = ({
  topSpendingEnvelope,
  fastestGrowingSpending,
  biggestSpend,
  monthlySpending,
  monthlyIncome,
  envelopeSpending,
}: {
  topSpendingEnvelope?: EnvelopeSpending;
  fastestGrowingSpending?: EnvelopeSpending;
  biggestSpend?: Transaction;
  monthlySpending: number;
  monthlyIncome: number;
  envelopeSpending: EnvelopeSpending[];
}) => {
  if (!topSpendingEnvelope) {
    return 'No spending pattern yet. Once you log spending, I can show your biggest categories, leaks, jumps, and month-over-month changes.';
  }

  const topThree = envelopeSpending
    .filter((item) => item.spentThisMonth > 0)
    .slice(0, 3)
    .map((item) => `• ${item.name}: ${money(item.spentThisMonth)}`)
    .join('\n');

  const incomeShare =
    monthlyIncome > 0
      ? `That is ${Math.round((topSpendingEnvelope.spentThisMonth / monthlyIncome) * 100)}% of your monthly income.`
      : '';

  const growthLine = fastestGrowingSpending
    ? `\n\nFastest growing area: ${fastestGrowingSpending.name}, up ${money(
        fastestGrowingSpending.changeAmount
      )} from last month.`
    : '';

  const biggestLine = biggestSpend
    ? `\n\nLargest single spend this month: ${money(biggestSpend.amount)}.`
    : '';

  return `Your top spending area is ${topSpendingEnvelope.name} at ${money(
    topSpendingEnvelope.spentThisMonth
  )}. ${incomeShare}\n\nTop categories:\n${topThree}\n\nTotal spending this month is ${money(
    monthlySpending
  )}.${growthLine}${biggestLine}`;
};

const buildGoalResponse = ({
  goalPercent,
  completedGoals,
  closestGoal,
  weakestGoal,
  largestGoalGap,
  goalEnvelopes,
  monthlyStuffed,
}: {
  goalPercent: number;
  completedGoals: GoalStatsEnvelope[];
  closestGoal?: GoalStatsEnvelope;
  weakestGoal?: GoalStatsEnvelope;
  largestGoalGap?: GoalStatsEnvelope;
  goalEnvelopes: GoalStatsEnvelope[];
  monthlyStuffed: number;
}) => {
  if (goalEnvelopes.length === 0) {
    return 'You do not have goal amounts set yet. Add goals to your envelopes and I can forecast priorities, gaps, and completion strategy.';
  }

  const lines = [`Your goals are ${goalPercent}% funded overall.`];

  if (completedGoals.length > 0) {
    lines.push(`${completedGoals.length} goal${completedGoals.length === 1 ? ' is' : 's are'} complete.`);
  }

  if (closestGoal) {
    lines.push(`${closestGoal.name} is closest to completion at ${closestGoal.percent}%.`);
  }

  if (weakestGoal) {
    const months =
      monthlyStuffed > 0 ? Math.ceil(weakestGoal.remaining / Math.max(monthlyStuffed, 1)) : null;

    lines.push(`${weakestGoal.name} needs the most attention at ${weakestGoal.percent}% with ${money(weakestGoal.remaining)} left.`);

    if (months) {
      lines.push(`At your current monthly stuffing pace, that gap is roughly ${months} month${months === 1 ? '' : 's'} of total stuffing.`);
    }
  }

  if (largestGoalGap) {
    lines.push(`${largestGoalGap.name} has the largest remaining gap: ${money(largestGoalGap.remaining)}.`);
  }

  return lines.join('\n\n');
};

const buildRunwayResponse = ({
  availableToStuff,
  totalCash,
  monthlySpending,
}: {
  availableToStuff: number;
  totalCash: number;
  monthlySpending: number;
}) => {
  const dailySpend = monthlySpending / 30;

  if (monthlySpending <= 0) {
    return `I do not have enough spending data to calculate runway yet. You currently have ${money(
      totalCash
    )} total cash and ${money(availableToStuff)} available to stuff.`;
  }

  const totalCashDays = Math.floor(totalCash / dailySpend);
  const availableDays = Math.floor(Math.max(availableToStuff, 0) / dailySpend);

  return `Based on your current spending pace, your total cash could last about ${totalCashDays} days.\n\nYour available-to-stuff cash alone could last about ${availableDays} days.\n\nThis is a forecast based only on what you have logged in Stash.`;
};

const buildAccountResponse = ({
  accounts,
  totalCash,
  stuffedTotal,
  availableToStuff,
}: {
  accounts: Account[];
  totalCash: number;
  stuffedTotal: number;
  availableToStuff: number;
}) => {
  if (accounts.length === 0) return 'You do not have any accounts set up yet. Add an account so Stash can track your real cash base.';

  const largest = [...accounts].sort((a, b) => b.balance - a.balance)[0];

  return `You have ${money(totalCash)} across ${accounts.length} account${
    accounts.length === 1 ? '' : 's'
  }.\n\n${largest.name} is your largest account at ${money(
    largest.balance
  )}.\n\nYour envelopes hold ${money(stuffedTotal)}, leaving ${money(
    availableToStuff
  )} available to stuff.`;
};

const buildDoingResponse = ({
  totalCash,
  stuffedTotal,
  availableToStuff,
  monthlyIncome,
  monthlySpending,
  netFlow,
  savingsRate,
  goalPercent,
  completedGoals,
  warnings,
  recommendations,
  priorityInsight,
  sharedScore,
}: {
  totalCash: number;
  stuffedTotal: number;
  availableToStuff: number;
  monthlyIncome: number;
  monthlySpending: number;
  netFlow: number;
  savingsRate: number;
  goalPercent: number;
  completedGoals: GoalStatsEnvelope[];
  warnings: string[];
  recommendations: string[];
  priorityInsight?: BrainInsightCard;
  sharedScore: ReturnType<typeof getStashScore>;
}) => {
  const flowLine =
    monthlyIncome <= 0
      ? 'I do not see income logged this month yet.'
      : netFlow >= 0
        ? `You are positive by ${money(netFlow)} this month.`
        : `You are negative by ${money(netFlow)} this month.`;

  const warningLine =
    warnings.length > 0
      ? `Main thing to watch: ${warnings[0]}`
      : priorityInsight
        ? `Main thing I notice: ${priorityInsight.body}`
        : 'No major red flags are showing right now.';

  const nextMove =
    recommendations.length > 0
      ? `Recommended next move: ${recommendations[0]}`
      : 'Recommended next move: keep logging income, spending, and stuffing activity.';

  return `Here is your Stash check-in:\n\nScore: ${sharedScore.healthScore} — ${sharedScore.scoreLabel}.\n\n${flowLine}\nYou have ${money(
    totalCash
  )} total cash, ${money(stuffedTotal)} stuffed, and ${money(
    availableToStuff
  )} available to stuff.\nGoals are ${goalPercent}% funded overall.\nCompleted goals: ${
    completedGoals.length
  }.\nSavings rate this month: ${savingsRate}%.\n\n${warningLine}\n\n${nextMove}`;
};

const buildScoreResponse = ({
  sharedScore,
  netFlow,
}: {
  sharedScore: ReturnType<typeof getStashScore>;
  netFlow: number;
}) => {
  const reasons = sharedScore.scoreExplanation.slice(0, 6);

  return `Your current Stash Score is ${sharedScore.healthScore} — ${sharedScore.scoreLabel}.\n\nWhy it looks this way:\n${reasons
    .map((reason) => `• ${reason}`)
    .join('\n')}\n\nStrongest factor: ${
    sharedScore.strongestFactor?.title ?? 'Not enough data yet'
  }.\nBiggest opportunity: ${
    sharedScore.weakestFactor?.title ?? 'Not enough data yet'
  }.\n\nYour current month cash flow is ${signedMoney(netFlow)}.`;
};

const buildAskResponse = ({
  question,
  envelopes,
  accounts,
  availableToStuff,
  monthlyIncome,
  monthlySpending,
  monthlyStuffed,
  netFlow,
  topSpendingEnvelope,
  fastestGrowingSpending,
  weakestGoal,
  closestGoal,
  largestGoalGap,
  biggestSpend,
  goalPercent,
  totalCash,
  stuffedTotal,
  savingsRate,
  completedGoals,
  warnings,
  recommendations,
  priorityInsight,
  stuffingPlanPreview,
  goalEnvelopes,
  sharedScore,
  envelopeSpending,
}: {
  question: string;
  envelopes: Envelope[];
  accounts: Account[];
  availableToStuff: number;
  monthlyIncome: number;
  monthlySpending: number;
  monthlyStuffed: number;
  netFlow: number;
  topSpendingEnvelope?: EnvelopeSpending;
  fastestGrowingSpending?: EnvelopeSpending;
  weakestGoal?: GoalStatsEnvelope;
  closestGoal?: GoalStatsEnvelope;
  largestGoalGap?: GoalStatsEnvelope;
  biggestSpend?: Transaction;
  goalPercent: number;
  totalCash: number;
  stuffedTotal: number;
  savingsRate: number;
  completedGoals: GoalStatsEnvelope[];
  warnings: string[];
  recommendations: string[];
  priorityInsight?: BrainInsightCard;
  stuffingPlanPreview: ReturnType<typeof buildStuffingPlanPreview>;
  goalEnvelopes: GoalStatsEnvelope[];
  sharedScore: ReturnType<typeof getStashScore>;
  envelopeSpending: EnvelopeSpending[];
}) => {
  const lower = normalize(question);

  if (!question.trim()) return '';

  if (includesAny(lower, INTENTS.afford)) {
    return buildAffordabilityResponse({
      question,
      envelopes,
      availableToStuff,
      monthlyIncome,
      monthlySpending,
    });
  }

  if (includesAny(lower, INTENTS.stuff)) {
    return buildStuffingResponse({
      availableToStuff,
      weakestGoal,
      closestGoal,
      largestGoalGap,
      stuffingPlanPreview,
      goalEnvelopes,
      envelopes,
    });
  }

  if (includesAny(lower, INTENTS.spending)) {
    return buildSpendingResponse({
      topSpendingEnvelope,
      fastestGrowingSpending,
      biggestSpend,
      monthlySpending,
      monthlyIncome,
      envelopeSpending,
    });
  }

  if (includesAny(lower, INTENTS.goals)) {
    return buildGoalResponse({
      goalPercent,
      completedGoals,
      closestGoal,
      weakestGoal,
      largestGoalGap,
      goalEnvelopes,
      monthlyStuffed,
    });
  }

  if (includesAny(lower, INTENTS.score)) {
    return buildScoreResponse({
      sharedScore,
      netFlow,
    });
  }

  if (includesAny(lower, INTENTS.runway)) {
    return buildRunwayResponse({
      availableToStuff,
      totalCash,
      monthlySpending,
    });
  }

  if (includesAny(lower, INTENTS.accounts)) {
    return buildAccountResponse({
      accounts,
      totalCash,
      stuffedTotal,
      availableToStuff,
    });
  }

  return buildDoingResponse({
    totalCash,
    stuffedTotal,
    availableToStuff,
    monthlyIncome,
    monthlySpending,
    netFlow,
    savingsRate,
    goalPercent,
    completedGoals,
    warnings,
    recommendations,
    priorityInsight,
    sharedScore,
  });
};

export const getStashBrainSummary = ({
  accounts,
  envelopes,
  transactions,
  monthlyScoreHistory,
}: StashBrainData) => {
  const sharedScore = getStashScore({
    accounts,
    envelopes,
    transactions,
  });

  const totalCash = roundMoney(accounts.reduce((sum, account) => sum + account.balance, 0));
  const stuffedTotal = roundMoney(envelopes.reduce((sum, envelope) => sum + envelope.balance, 0));
  const availableToStuff = roundMoney(totalCash - stuffedTotal);

  const monthlyTransactions = getMonthlyTransactions(transactions);
  const previousMonthlyTransactions = getPreviousMonthlyTransactions(transactions);

  const monthlyIncome = roundMoney(sumTransactions(monthlyTransactions, 'income'));
  const monthlySpending = roundMoney(sumTransactions(monthlyTransactions, 'spend'));
  const monthlyStuffed = roundMoney(sumTransactions(monthlyTransactions, 'stuff'));
  const previousMonthlyIncome = roundMoney(sumTransactions(previousMonthlyTransactions, 'income'));
  const previousMonthlySpending = roundMoney(sumTransactions(previousMonthlyTransactions, 'spend'));

  const netFlow = roundMoney(monthlyIncome - monthlySpending);
  const previousNetFlow = roundMoney(previousMonthlyIncome - previousMonthlySpending);

  const spendingChangeAmount = roundMoney(monthlySpending - previousMonthlySpending);
  const spendingChangePercent =
    previousMonthlySpending > 0
      ? Math.round((spendingChangeAmount / previousMonthlySpending) * 100)
      : null;

  const incomeChangeAmount = roundMoney(monthlyIncome - previousMonthlyIncome);
  const incomeChangePercent =
    previousMonthlyIncome > 0
      ? Math.round((incomeChangeAmount / previousMonthlyIncome) * 100)
      : null;

  const goalEnvelopes = envelopes.filter((envelope) => envelope.goalAmount > 0).map(getGoalStats);
  const envelopesWithGoalStats = envelopes.map(getGoalStats);

  const completedGoals = goalEnvelopes.filter((envelope) => envelope.isComplete);
  const incompleteGoals = goalEnvelopes.filter((envelope) => !envelope.isComplete);

  const totalGoals = roundMoney(goalEnvelopes.reduce((sum, envelope) => sum + envelope.goalAmount, 0));
  const totalGoalProgress = roundMoney(
    goalEnvelopes.reduce(
      (sum, envelope) => sum + Math.min(envelope.balance, envelope.goalAmount),
      0
    )
  );

  const goalPercent =
    totalGoals > 0 ? clamp(Math.round((totalGoalProgress / totalGoals) * 100), 0, 100) : 0;

  const closestGoal = [...incompleteGoals].sort((a, b) => b.percent - a.percent)[0];
  const weakestGoal = [...incompleteGoals].sort((a, b) => a.percent - b.percent)[0];
  const largestGoalGap = [...incompleteGoals].sort((a, b) => b.remaining - a.remaining)[0];

  const envelopeSpending = envelopes
    .map((envelope) =>
      getEnvelopeSpending(envelope, monthlyTransactions, previousMonthlyTransactions)
    )
    .sort((a, b) => b.spentThisMonth - a.spentThisMonth);

  const topSpendingEnvelope = envelopeSpending.find((envelope) => envelope.spentThisMonth > 0);
  const fastestGrowingSpending = envelopeSpending
    .filter((envelope) => envelope.changeAmount > 0 && envelope.spentThisMonth > 0)
    .sort((a, b) => b.changeAmount - a.changeAmount)[0];

  const biggestSpend = getBiggestTransaction(monthlyTransactions, 'spend');
  const biggestIncome = getBiggestTransaction(monthlyTransactions, 'income');
  const recentActivity = getRecentActivity(transactions);

  const last7Transactions = getTransactionsLastDays(transactions, 7);
  const last7Spending = roundMoney(sumTransactions(last7Transactions, 'spend'));

  const stuffingPlanPreview = buildStuffingPlanPreview(availableToStuff, goalEnvelopes);

  const savingsRate =
    monthlyIncome > 0 ? clamp(Math.round((netFlow / monthlyIncome) * 100), -100, 100) : 0;

  const accountCount = accounts.length;
  const envelopeCount = envelopes.length;
  const transactionCount = transactions.length;

  const score = sharedScore.healthScore;
  const scoreReasons = sharedScore.scoreExplanation;

  const latestHistory = monthlyScoreHistory[0];

  const insightCards: BrainInsightCard[] = [];

  if (availableToStuff < 0) {
    insightCards.push({
      id: 'overstuffed',
      title: 'Envelope mismatch',
      body: `Your envelopes are overstuffed by ${money(Math.abs(availableToStuff))}.`,
      type: 'critical',
      icon: 'alert-circle-outline',
      scoreImpact: -18,
    });
  }

  if (availableToStuff > 0) {
    insightCards.push({
      id: 'available-to-stuff',
      title: 'Ready to stuff',
      body: `${money(availableToStuff)} is available to assign into envelopes.`,
      type: 'opportunity',
      icon: 'wallet-outline',
      scoreImpact: 6,
    });
  }

  if (topSpendingEnvelope) {
    insightCards.push({
      id: 'top-spending',
      title: 'Top spending area',
      body: `${topSpendingEnvelope.name} leads this month at ${money(topSpendingEnvelope.spentThisMonth)}.`,
      type: 'neutral',
      icon: 'chart-pie',
      scoreImpact: 0,
    });
  }

  if (fastestGrowingSpending) {
    insightCards.push({
      id: 'growing-spending',
      title: 'Spending jump',
      body: `${fastestGrowingSpending.name} is up ${money(fastestGrowingSpending.changeAmount)} from last month.`,
      type: 'warning',
      icon: 'trending-up',
      scoreImpact: -5,
    });
  }

  if (weakestGoal) {
    insightCards.push({
      id: 'weakest-goal',
      title: 'Goal needs attention',
      body: `${weakestGoal.name} is ${weakestGoal.percent}% funded with ${money(weakestGoal.remaining)} left.`,
      type: 'opportunity',
      icon: 'target',
      scoreImpact: 4,
    });
  }

  if (closestGoal) {
    insightCards.push({
      id: 'closest-goal',
      title: 'Closest goal',
      body: `${closestGoal.name} is ${closestGoal.percent}% complete.`,
      type: 'positive',
      icon: 'flag-checkered',
      scoreImpact: 4,
    });
  }

  if (netFlow > 0 && monthlyIncome > 0) {
    insightCards.push({
      id: 'positive-flow',
      title: 'Positive money flow',
      body: `You are ahead by ${money(netFlow)} this month.`,
      type: 'positive',
      icon: 'trending-up',
      scoreImpact: 10,
    });
  }

  if (netFlow < 0 && monthlyIncome > 0) {
    insightCards.push({
      id: 'negative-flow',
      title: 'Money flow warning',
      body: `You are behind by ${money(netFlow)} this month.`,
      type: 'warning',
      icon: 'trending-down',
      scoreImpact: -14,
    });
  }

  if (last7Spending > 0 && monthlySpending > 0 && last7Spending > monthlySpending * 0.5) {
    insightCards.push({
      id: 'recent-spending-surge',
      title: 'Recent spending surge',
      body: `${money(last7Spending)} of your monthly spending happened in the last 7 days.`,
      type: 'warning',
      icon: 'flash-outline',
      scoreImpact: -4,
    });
  }

  const priorityInsight =
    insightCards.find((item) => item.type === 'critical') ??
    insightCards.find((item) => item.type === 'warning') ??
    insightCards.find((item) => item.type === 'opportunity') ??
    insightCards[0];

  const basedOnFinances = insightCards.slice(0, 5);

  const brainTools: BrainToolPreview[] = [
    {
      id: 'stuff-income',
      title: 'Stuff My Income',
      subtitle: 'Build a smart stuffing plan.',
      status:
        availableToStuff > 0
          ? `${money(availableToStuff)} available right now`
          : weakestGoal
            ? `${weakestGoal.name} needs attention`
            : 'Ready when income arrives',
      priority: availableToStuff > 0 ? 'opportunity' : 'neutral',
    },
    {
      id: 'afford-this',
      title: 'Can I Afford This?',
      subtitle: 'Check purchase safety.',
      status:
        availableToStuff > 0
          ? `${money(availableToStuff)} unassigned cushion`
          : topSpendingEnvelope
            ? `${topSpendingEnvelope.name} leads spending`
            : 'Checks envelopes first',
      priority: availableToStuff > 0 ? 'positive' : 'warning',
    },
    {
      id: 'analyze-spending',
      title: 'Analyze Spending',
      subtitle: 'Find leaks and patterns.',
      status: topSpendingEnvelope
        ? `${topSpendingEnvelope.name} leads this month`
        : 'No spending yet this month',
      priority: fastestGrowingSpending ? 'warning' : 'neutral',
    },
    {
      id: 'goal-strategy',
      title: 'Goal Strategy',
      subtitle: 'Plan your next goal move.',
      status: weakestGoal
        ? `${weakestGoal.name} is ${weakestGoal.percent}% funded`
        : completedGoals.length > 0
          ? `${completedGoals.length} goal complete`
          : 'Add goals to unlock strategy',
      priority: weakestGoal ? 'opportunity' : 'neutral',
    },
  ];

  const wins: BrainWin[] = [
    {
      id: 'first-account',
      title: 'Account created',
      subtitle: 'Your cash has a home.',
      unlocked: accountCount > 0,
      icon: 'bank-outline',
    },
    {
      id: 'first-envelope',
      title: 'Envelope created',
      subtitle: 'Budget categories started.',
      unlocked: envelopeCount > 0,
      icon: 'folder-outline',
    },
    {
      id: 'first-transaction',
      title: 'First transaction',
      subtitle: 'Activity tracking started.',
      unlocked: transactionCount > 0,
      icon: 'receipt-text-outline',
    },
    {
      id: 'goal-tracking',
      title: 'Goal tracking',
      subtitle: 'At least one goal is active.',
      unlocked: goalEnvelopes.length > 0,
      icon: 'target',
    },
    {
      id: 'first-goal-complete',
      title: 'Goal completed',
      subtitle: 'One envelope is fully funded.',
      unlocked: completedGoals.length > 0,
      icon: 'trophy-outline',
    },
    {
      id: 'stuffed-100',
      title: '$100 stuffed',
      subtitle: 'You crossed your first milestone.',
      unlocked: stuffedTotal >= 100,
      icon: 'cash',
    },
    {
      id: 'stuffed-500',
      title: '$500 stuffed',
      subtitle: 'Your envelopes are growing.',
      unlocked: stuffedTotal >= 500,
      icon: 'cash-multiple',
    },
    {
      id: 'positive-flow',
      title: 'Positive flow',
      subtitle: 'Income is beating spending.',
      unlocked: monthlyIncome > 0 && netFlow > 0,
      icon: 'trending-up',
    },
    {
      id: 'strong-score',
      title: 'Strong Stash Score',
      subtitle: 'Your score reached 75+.',
      unlocked: score >= 75,
      icon: 'brain',
    },
    {
      id: 'elite-score',
      title: 'Elite Stash Score',
      subtitle: 'Your score reached 85+.',
      unlocked: score >= 85,
      icon: 'shield-check-outline',
    },
  ];

  const unlockedWins = wins.filter((win) => win.unlocked);
  const lockedWins = wins.filter((win) => !win.unlocked);

  const insights = insightCards.map((item) => item.body);

  const recommendations: string[] = [];

  if (availableToStuff > 0) {
    recommendations.push(`Assign ${money(availableToStuff)} into envelopes instead of leaving it unplanned.`);
  }

  if (weakestGoal && availableToStuff > 0) {
    const suggestedAmount = Math.min(availableToStuff, Math.max(10, weakestGoal.remaining * 0.25));
    recommendations.push(
      `Put about ${money(suggestedAmount)} into ${weakestGoal.name} to improve your weakest goal.`
    );
  }

  if (fastestGrowingSpending) {
    recommendations.push(
      `Review ${fastestGrowingSpending.name}; it increased by ${money(fastestGrowingSpending.changeAmount)} from last month.`
    );
  }

  if (monthlyIncome > 0 && monthlySpending > monthlyIncome * 0.8) {
    recommendations.push('Spending is using most of your income. Consider lowering flexible categories this month.');
  }

  if (goalEnvelopes.length === 0 && envelopes.length > 0) {
    recommendations.push('Add goal amounts to envelopes so Stash Brain can build real goal strategies.');
  }

  const warnings: string[] = [];

  if (availableToStuff < 0) {
    warnings.push('Your envelopes are holding more money than your accounts show.');
  }

  if (monthlyIncome > 0 && monthlySpending > monthlyIncome) {
    warnings.push('Your spending is higher than your income this month.');
  }

  if (topSpendingEnvelope && monthlyIncome > 0 && topSpendingEnvelope.spentThisMonth > monthlyIncome * 0.35) {
    warnings.push(`${topSpendingEnvelope.name} is taking up a large part of monthly income.`);
  }

  if (spendingChangePercent !== null && spendingChangePercent > 25) {
    warnings.push(`Spending is up ${spendingChangePercent}% from last month.`);
  }

  return {
    score,
    scoreReasons,
    sharedScore,

    totalCash,
    stuffedTotal,
    availableToStuff,

    monthlyIncome,
    monthlySpending,
    monthlyStuffed,
    previousMonthlyIncome,
    previousMonthlySpending,
    netFlow,
    previousNetFlow,

    spendingChangeAmount,
    spendingChangePercent,
    incomeChangeAmount,
    incomeChangePercent,
    savingsRate,

    goalPercent,
    totalGoals,
    totalGoalProgress,
    completedGoals,
    incompleteGoals,
    closestGoal,
    weakestGoal,
    largestGoalGap,
    envelopesWithGoalStats,

    topSpendingEnvelope,
    fastestGrowingSpending,
    envelopeSpending,
    biggestSpend,
    biggestIncome,
    recentActivity,

    priorityInsight,
    basedOnFinances,
    brainTools,
    wins,
    unlockedWins,
    lockedWins,
    stuffingPlanPreview,

    latestHistory,
    insights,
    recommendations,
    warnings,

    achievements: unlockedWins.map((win) => win.title),

    ask: (question: string) =>
      buildAskResponse({
        question,
        envelopes,
        accounts,
        availableToStuff,
        monthlyIncome,
        monthlySpending,
        monthlyStuffed,
        netFlow,
        topSpendingEnvelope,
        fastestGrowingSpending,
        weakestGoal,
        closestGoal,
        largestGoalGap,
        biggestSpend,
        goalPercent,
        totalCash,
        stuffedTotal,
        savingsRate,
        completedGoals,
        warnings,
        recommendations,
        priorityInsight,
        stuffingPlanPreview,
        goalEnvelopes,
        sharedScore,
        envelopeSpending,
      }),
  };
};