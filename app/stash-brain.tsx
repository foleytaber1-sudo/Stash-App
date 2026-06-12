import { formatCurrency } from '@/constants/currency';
import {
    BrainInsightCard,
    BrainPriority,
    BrainToolPreview,
    BrainWin,
    getStashBrainSummary,
} from '@/constants/stashBrain';
import { getTheme } from '@/constants/theme';
import { useStashStore } from '@/store/store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function StashBrainScreen() {
  const accounts = useStashStore((state) => state.accounts);
  const envelopes = useStashStore((state) => state.envelopes);
  const transactions = useStashStore((state) => state.transactions);
  const monthlyScoreHistory = useStashStore((state) => state.monthlyScoreHistory);
  const themeColor = useStashStore((state) => state.themeColor);
  const themeMode = useStashStore((state) => state.themeMode);
  const currency = useStashStore((state) => state.currency);

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const theme = getTheme(themeColor, themeMode);

  const heroBackground =
    themeMode === 'dark'
      ? theme.soft
      : themeColor === 'green'
        ? '#ECF8EA'
        : themeColor === 'blue'
          ? '#EEF4FF'
          : themeColor === 'purple'
            ? '#F3ECFF'
            : themeColor === 'orange'
              ? '#FFF1E8'
              : themeColor === 'pink'
                ? '#FFF0F6'
                : themeColor === 'yellow'
                  ? '#FFF8D9'
                  : themeColor === 'red'
                    ? '#FFEDED'
                    : themeColor === 'teal'
                      ? '#E8FAF7'
                      : themeColor === 'mint'
                        ? '#E9FFF4'
                        : themeColor === 'navy'
                          ? '#EEF2FF'
                          : themeColor === 'brown'
                            ? '#F7EFE8'
                            : '#F3F3F3';

  const brain = getStashBrainSummary({
    accounts,
    envelopes,
    transactions,
    monthlyScoreHistory,
  });

  const topInsight =
    brain.priorityInsight?.body ??
    (brain.availableToStuff > 0
      ? `You have ${formatCurrency(brain.availableToStuff, currency)} ready to stuff.`
      : brain.availableToStuff < 0
        ? `Your envelopes are overstuffed by ${formatCurrency(
            Math.abs(brain.availableToStuff),
            currency
          )}.`
        : 'Every dollar currently has a job.');

  const handleAsk = (preset?: string) => {
    const askText = preset ?? question;
    if (!askText.trim()) return;

    setAnswer(brain.ask(askText));
    setQuestion(askText);
  };

  const openBrainTool = (toolId: BrainToolPreview['id']) => {
    if (toolId === 'stuff-income') {
      router.push('/brain-stuff-income' as any);
      return;
    }

    if (toolId === 'afford-this') {
      router.push('/brain-afford-this' as any);
      return;
    }

    if (toolId === 'analyze-spending') {
      router.push('/brain-analyze-spending' as any);
      return;
    }

    if (toolId === 'goal-strategy') {
      router.push('/brain-goal-strategy' as any);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.heroSection, { backgroundColor: heroBackground }]}>
        <MaterialCommunityIcons
          name="brain"
          size={148}
          color={theme.accent}
          style={styles.heroBrain}
        />

        <View style={styles.header}>
          <View>
            <View style={styles.titleRow}>
              <View
                style={[
                  styles.titleIcon,
                  {
                    backgroundColor:
                      themeMode === 'dark' ? theme.card : 'rgba(255,255,255,0.75)',
                  },
                ]}
              >
                <MaterialCommunityIcons name="brain" size={25} color={theme.accent} />
              </View>

              <Text style={[styles.title, { color: theme.text }]}>Ask Stash</Text>
            </View>

            <Text style={[styles.subtitle, { color: theme.subtext }]}>
              Your personal cash stuffing coach.
            </Text>

            <Text style={[styles.liveInsight, { color: theme.accent }]}>
              {topInsight}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.askCard,
            {
              backgroundColor: themeMode === 'dark' ? theme.card : '#FFFFFF',
            },
          ]}
        >
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            What do you want to know?
          </Text>

          <View
            style={[
              styles.askInputRow,
              {
                borderColor: theme.border,
                backgroundColor: themeMode === 'dark' ? theme.soft : '#FFFFFF',
              },
            ]}
          >
            <MaterialCommunityIcons name="creation" size={18} color={theme.subtext} />

            <TextInput
              style={[styles.askInput, { color: theme.text }]}
              placeholder="Ask Stash anything..."
              placeholderTextColor={theme.subtext}
              value={question}
              onChangeText={setQuestion}
            />

            <TouchableOpacity
              style={[styles.askButton, { backgroundColor: theme.accent }]}
              onPress={() => handleAsk()}
            >
              <MaterialCommunityIcons name="creation" size={14} color="#FFFFFF" />
              <Text style={styles.askButtonText}>Ask</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.quickGrid}>
            <QuickAsk
              icon="cart-outline"
              label="Can I afford this?"
              theme={theme}
              onPress={() => handleAsk('Can I afford this?')}
            />
            <QuickAsk
              icon="wallet-outline"
              label="What should I stuff next?"
              theme={theme}
              onPress={() => handleAsk('What should I stuff next?')}
            />
            <QuickAsk
              icon="chart-bar"
              label="How am I doing?"
              theme={theme}
              onPress={() => handleAsk('How am I doing?')}
            />
            <QuickAsk
              icon="chart-line"
              label="Why did my score change?"
              theme={theme}
              onPress={() => handleAsk('Why did my score change?')}
            />
          </View>

          {answer ? (
            <View style={[styles.answerBox, { backgroundColor: theme.soft }]}>
              <Text style={[styles.answerText, { color: theme.text }]}>{answer}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Based On Your Finances
        </Text>
        <Text style={[styles.seeAll, { color: theme.accent }]}>
          {brain.basedOnFinances.length} live
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {brain.basedOnFinances.length === 0 ? (
          <FinanceCard
            insight={{
              id: 'empty',
              title: 'Start tracking',
              body: 'Add income, envelopes, and spending to unlock Stash Brain insights.',
              type: 'neutral',
              icon: 'brain',
              scoreImpact: 0,
            }}
            theme={theme}
            themeMode={themeMode}
          />
        ) : (
          brain.basedOnFinances.map((insight) => (
            <FinanceCard
              key={insight.id}
              insight={insight}
              theme={theme}
              themeMode={themeMode}
            />
          ))
        )}
      </ScrollView>

      <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 22 }]}>
        Brain Tools
      </Text>

      <View style={styles.actionsList}>
        {brain.brainTools.map((tool) => (
          <ActionRow
            key={tool.id}
            tool={tool}
            theme={theme}
            themeMode={themeMode}
            onPress={() => openBrainTool(tool.id)}
          />
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Wins</Text>
        <Text style={[styles.seeAll, { color: theme.accent }]}>
          {brain.unlockedWins.length}/{brain.wins.length}
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {brain.unlockedWins.length === 0 ? (
          <WinCard
            win={{
              id: 'no-wins-yet',
              title: 'No wins yet',
              subtitle: 'Start using Stash to unlock milestones.',
              unlocked: false,
              icon: 'star-outline',
            }}
            accent="#999999"
            theme={theme}
            themeMode={themeMode}
          />
        ) : (
          brain.unlockedWins.slice(0, 6).map((win, index) => (
            <WinCard
              key={win.id}
              win={win}
              accent={getWinAccent(index)}
              theme={theme}
              themeMode={themeMode}
            />
          ))
        )}
      </ScrollView>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const getPriorityAccent = (priority: BrainPriority) => {
  if (priority === 'critical') return '#FF3B30';
  if (priority === 'warning') return '#F2B84B';
  if (priority === 'opportunity') return '#8B5CF6';
  if (priority === 'positive') return '#35B86B';
  return '#4A90E2';
};

const getToolIcon = (id: BrainToolPreview['id']) => {
  if (id === 'stuff-income') return 'cash-multiple';
  if (id === 'afford-this') return 'cart-outline';
  if (id === 'analyze-spending') return 'chart-pie';
  return 'target';
};

const getWinAccent = (index: number) => {
  const colors = ['#F4B000', '#8B5CF6', '#35B86B', '#4A90E2', '#EF5D93'];
  return colors[index % colors.length];
};

function QuickAsk({ icon, label, theme, onPress }: any) {
  return (
    <TouchableOpacity
      style={[styles.quickAsk, { backgroundColor: theme.soft }]}
      onPress={onPress}
    >
      <View style={[styles.quickIcon, { backgroundColor: theme.button }]}>
        <MaterialCommunityIcons name={icon} size={22} color={theme.accent} />
      </View>
      <Text style={[styles.quickLabel, { color: theme.text }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function FinanceCard({
  insight,
  theme,
  themeMode,
}: {
  insight: BrainInsightCard;
  theme: ReturnType<typeof getTheme>;
  themeMode: 'light' | 'dark';
}) {
  const accent = getPriorityAccent(insight.type);

  return (
    <View
      style={[
        styles.financeCard,
        {
          backgroundColor: themeMode === 'dark' ? theme.card : '#FFFFFF',
          borderColor: `${accent}55`,
        },
      ]}
    >
      <View style={[styles.financeIcon, { backgroundColor: `${accent}22` }]}>
        <MaterialCommunityIcons name={insight.icon as any} size={25} color={accent} />
      </View>
      <Text style={[styles.financeTitle, { color: accent }]}>{insight.title}</Text>
      <Text style={[styles.financeBody, { color: theme.text }]}>{insight.body}</Text>
    </View>
  );
}

function ActionRow({
  tool,
  theme,
  themeMode,
  onPress,
}: {
  tool: BrainToolPreview;
  theme: ReturnType<typeof getTheme>;
  themeMode: 'light' | 'dark';
  onPress: () => void;
}) {
  const accent = getPriorityAccent(tool.priority);

  return (
    <TouchableOpacity
      style={[
        styles.actionRow,
        { backgroundColor: themeMode === 'dark' ? theme.card : '#FFFFFF' },
      ]}
      onPress={onPress}
    >
      <View style={[styles.actionIcon, { backgroundColor: accent }]}>
        <MaterialCommunityIcons name={getToolIcon(tool.id) as any} size={22} color="#FFFFFF" />
      </View>

      <View style={styles.actionTextWrap}>
        <Text style={[styles.actionTitle, { color: accent }]}>{tool.title}</Text>
        <Text style={[styles.actionSubtitle, { color: theme.subtext }]}>
          {tool.subtitle}
        </Text>
        <Text style={[styles.actionStatus, { color: theme.text }]}>
          {tool.status}
        </Text>
      </View>

      <MaterialCommunityIcons name="chevron-right" size={26} color={theme.subtext} />
    </TouchableOpacity>
  );
}

function WinCard({
  win,
  accent,
  theme,
  themeMode,
}: {
  win: BrainWin;
  accent: string;
  theme: ReturnType<typeof getTheme>;
  themeMode: 'light' | 'dark';
}) {
  return (
    <View
      style={[
        styles.winCard,
        { backgroundColor: themeMode === 'dark' ? theme.card : '#FFFFFF' },
      ]}
    >
      <View style={[styles.winIcon, { backgroundColor: `${accent}20` }]}>
        <MaterialCommunityIcons name={win.icon as any} size={24} color={accent} />
      </View>

      <Text style={[styles.winTitle, { color: theme.text }]}>{win.title}</Text>
      <Text style={[styles.winSubtitle, { color: theme.text }]}>{win.subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  heroSection: {
    borderRadius: 30,
    padding: 16,
    marginTop: 16,
    marginBottom: 22,
    overflow: 'hidden',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  titleRow: { flexDirection: 'row', alignItems: 'center' },

  titleIcon: {
    width: 34,
    height: 34,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },

  title: { fontSize: 30, fontWeight: '900' },
  subtitle: { fontSize: 14, fontWeight: '700', marginTop: 4 },
  liveInsight: { fontSize: 13, fontWeight: '900', marginTop: 8 },

  heroBrain: {
    opacity: 0.13,
    position: 'absolute',
    right: -16,
    top: -10,
  },

  askCard: {
    borderRadius: 22,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },

  cardTitle: { fontSize: 17, fontWeight: '900', marginBottom: 12 },

  askInputRow: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
  },

  askInput: { flex: 1, fontSize: 13, fontWeight: '700', paddingHorizontal: 8 },

  askButton: {
    height: 38,
    borderRadius: 9,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginRight: 5,
  },

  askButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '900' },

  quickGrid: { flexDirection: 'row', gap: 10, marginTop: 14 },

  quickAsk: {
    flex: 1,
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
    minHeight: 86,
  },

  quickIcon: {
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  quickLabel: {
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 13,
  },

  answerBox: { borderRadius: 14, padding: 14, marginTop: 14 },
  answerText: { fontSize: 14, fontWeight: '800', lineHeight: 21 },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionTitle: { fontSize: 18, fontWeight: '900' },
  seeAll: { fontSize: 12, fontWeight: '900' },

  financeCard: {
    width: 170,
    minHeight: 150,
    borderRadius: 18,
    padding: 13,
    borderWidth: 1,
    marginRight: 10,
  },

  financeIcon: {
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  financeTitle: { fontSize: 15, fontWeight: '900' },
  financeBody: { fontSize: 12, fontWeight: '800', lineHeight: 17, marginTop: 4 },

  actionsList: { gap: 9, marginTop: 10 },

  actionRow: {
    borderRadius: 16,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
  },

  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  actionTextWrap: { flex: 1 },
  actionTitle: { fontSize: 15, fontWeight: '900' },
  actionSubtitle: { fontSize: 12, fontWeight: '700', marginTop: 2 },
  actionStatus: { fontSize: 12, fontWeight: '900', marginTop: 5 },

  winCard: {
    width: 132,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    minHeight: 122,
    marginRight: 10,
  },

  winIcon: {
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  winTitle: { fontSize: 12, fontWeight: '900', textAlign: 'center' },
  winSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 3,
    lineHeight: 14,
  },
});