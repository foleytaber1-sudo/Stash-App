import { formatCurrency } from '@/constants/currency';
import { getTheme } from '@/constants/theme';
import { useStashStore } from '@/store/store';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 54) / 2;

const GoalRing = ({
  percent,
  color,
  textColor,
  trackColor,
  size = 118,
  strokeWidth = 10,
  textSize = 29,
}: {
  percent: number;
  color: string;
  textColor: string;
  trackColor: string;
  size?: number;
  strokeWidth?: number;
  textSize?: number;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (percent / 100) * circumference;

  return (
    <View
      style={[
        styles.ringWrapper,
        {
          width: size,
          height: size,
        },
      ]}
    >
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      <Text style={[styles.ringText, { color: textColor, fontSize: textSize }]}>
        {percent}%
      </Text>
    </View>
  );
};

export default function GoalsScreen() {
  const envelopes = useStashStore((state) => state.envelopes);
  const editEnvelopeGoal = useStashStore((state) => state.editEnvelopeGoal);
  const themeColor = useStashStore((state) => state.themeColor);
  const themeMode = useStashStore((state) => state.themeMode);
  const currency = useStashStore((state) => state.currency);

  const theme = getTheme(themeColor, themeMode);

  const [editingGoalId, setEditingGoalId] = useState('');
  const [goalAmountInput, setGoalAmountInput] = useState('');

  const totalSaved = envelopes.reduce((sum, item) => {
    return sum + item.balance;
  }, 0);

  const totalGoals = envelopes.reduce((sum, item) => {
    return sum + (item.goalAmount ?? 0);
  }, 0);

  const overallPercent =
    totalGoals > 0
      ? Math.round(Math.min(totalSaved / totalGoals, 1) * 100)
      : 0;

  const sortedEnvelopes = [...envelopes].sort((a, b) => {
    const aProgress = a.goalAmount > 0 ? a.balance / a.goalAmount : 0;
    const bProgress = b.goalAmount > 0 ? b.balance / b.goalAmount : 0;

    return bProgress - aProgress;
  });

  const handleSaveGoal = (envelopeId: string) => {
    const goalAmount = Number(goalAmountInput);

    if (!goalAmount || goalAmount <= 0) {
      Alert.alert('Enter a valid goal amount');
      return;
    }

    editEnvelopeGoal(envelopeId, goalAmount);
    setEditingGoalId('');
    setGoalAmountInput('');
  };

  const handleDeleteGoal = (envelopeId: string, envelopeName: string) => {
    Alert.alert('Delete Goal?', `Remove the goal from ${envelopeName}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          editEnvelopeGoal(envelopeId, 0);
          setEditingGoalId('');
          setGoalAmountInput('');
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: theme.text }]}>Goals</Text>

        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.accent }]}
          onPress={() => router.push('/add-envelope')}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.overallCard,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <View style={styles.overallRingSide}>
          <GoalRing
            percent={overallPercent}
            color={theme.accent}
            textColor={theme.text}
            trackColor={themeMode === 'dark' ? theme.soft : '#F3EFE8'}
            size={96}
            strokeWidth={9}
            textSize={24}
          />
        </View>

        <View style={styles.overallInfo}>
          <Text style={[styles.overallLabel, { color: theme.subtext }]}>
            Overall Progress
          </Text>

          <Text style={[styles.overallTitle, { color: theme.text }]}>
            Goals Funded
          </Text>

          <Text style={[styles.overallMoney, { color: theme.text }]}>
            {formatCurrency(totalSaved, currency)} of{' '}
            {formatCurrency(totalGoals, currency)}
          </Text>
        </View>

        <View style={[styles.trophyCircle, { backgroundColor: theme.accent }]}>
          <Text style={styles.trophy}>🏆</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.sortPill, { backgroundColor: theme.card }]}
        activeOpacity={0.8}
      >
        <Text style={[styles.sortText, { color: theme.text }]}>
          Sort: Progress (High to Low)⌄
        </Text>
      </TouchableOpacity>

      {envelopes.length === 0 ? (
        <View style={[styles.emptyCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            No goals yet
          </Text>
          <Text style={[styles.emptyText, { color: theme.subtext }]}>
            Add envelopes from Home first, then set goals for them here.
          </Text>
        </View>
      ) : (
        <View style={styles.grid}>
          {sortedEnvelopes.map((envelope) => {
            const goalAmount = envelope.goalAmount ?? 0;
            const hasGoal = goalAmount > 0;
            const percent = hasGoal
              ? Math.round(Math.min(envelope.balance / goalAmount, 1) * 100)
              : 0;
            const remaining = Math.max(goalAmount - envelope.balance, 0);
            const goalComplete = hasGoal && envelope.balance >= goalAmount;
            const isEditing = editingGoalId === envelope.id;

            return (
              <View
                key={envelope.id}
                style={[
                  styles.goalCard,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => router.push(`/envelope/${envelope.id}`)}
                  style={styles.goalTopTouchable}
                >
                  <View
                    style={[
                      styles.iconCircle,
                      { backgroundColor: envelope.color ?? theme.soft },
                    ]}
                  >
                    <Text style={styles.icon}>{envelope.icon ?? '💵'}</Text>
                  </View>

                  <Text
                    style={[styles.goalName, { color: theme.text }]}
                    numberOfLines={1}
                  >
                    {envelope.name}
                  </Text>

                  <GoalRing
                    percent={percent}
                    color={theme.accent}
                    textColor={theme.text}
                    trackColor={themeMode === 'dark' ? theme.soft : '#F3EFE8'}
                  />

                  {goalComplete && (
                    <View style={styles.goalMetBadge}>
                      <Text style={styles.goalMetText}>Goal Met 🎉</Text>
                    </View>
                  )}

                  {hasGoal ? (
                    <>
                      <Text style={[styles.savedText, { color: theme.text }]}>
                        {formatCurrency(envelope.balance, currency)} of{' '}
                        {formatCurrency(goalAmount, currency)}
                      </Text>

                      {!goalComplete && (
                        <Text
                          style={[styles.remainingText, { color: theme.subtext }]}
                        >
                          {formatCurrency(remaining, currency)} to go
                        </Text>
                      )}
                    </>
                  ) : (
                    <>
                      <Text style={[styles.savedText, { color: theme.text }]}>
                        {formatCurrency(envelope.balance, currency)} saved
                      </Text>

                      <Text style={[styles.remainingText, { color: theme.subtext }]}>
                        No goal set
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

                {isEditing ? (
                  <View style={styles.editorArea}>
                    <TextInput
                      style={[
                        styles.goalInput,
                        {
                          backgroundColor: theme.soft,
                          color: theme.text,
                          borderColor: theme.border,
                        },
                      ]}
                      placeholder="Goal amount"
                      placeholderTextColor={theme.subtext}
                      keyboardType="decimal-pad"
                      value={goalAmountInput}
                      onChangeText={setGoalAmountInput}
                    />

                    <TouchableOpacity
                      style={[styles.saveButton, { backgroundColor: theme.accent }]}
                      onPress={() => handleSaveGoal(envelope.id)}
                    >
                      <Text style={styles.saveButtonText}>Save Goal</Text>
                    </TouchableOpacity>

                    {hasGoal && (
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteGoal(envelope.id, envelope.name)}
                      >
                        <Text style={styles.deleteButtonText}>Delete Goal</Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      style={[styles.cancelButton, { backgroundColor: theme.soft }]}
                      onPress={() => {
                        setEditingGoalId('');
                        setGoalAmountInput('');
                      }}
                    >
                      <Text style={[styles.cancelButtonText, { color: theme.text }]}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[styles.editGoalButton, { backgroundColor: theme.soft }]}
                    onPress={() => {
                      setEditingGoalId(envelope.id);
                      setGoalAmountInput(goalAmount ? goalAmount.toString() : '');
                    }}
                  >
                    <Text style={[styles.editGoalButtonText, { color: theme.text }]}>
                      {hasGoal ? 'Edit Goal' : 'Set Goal'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>
      )}

      <View style={[styles.focusCard, { backgroundColor: theme.soft }]}>
        <Text style={styles.focusIcon}>🎯</Text>

        <View>
          <Text style={[styles.focusTitle, { color: theme.text }]}>
            Stay focused
          </Text>
          <Text style={[styles.focusText, { color: theme.text }]}>
            Small steps today, big wins tomorrow.
          </Text>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  headerRow: {
    marginTop: 60,
    marginBottom: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: { fontSize: 34, fontWeight: '900' },

  addButton: {
    width: 42,
    height: 42,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '500',
    marginTop: -3,
  },

  overallCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },

  overallRingSide: {
    marginRight: 14,
  },

  trophyCircle: {
    width: 52,
    height: 52,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },

  trophy: { fontSize: 24 },

  overallInfo: { flex: 1 },

  overallLabel: { fontSize: 13, fontWeight: '900' },

  overallTitle: {
    fontSize: 24,
    fontWeight: '900',
    marginTop: 3,
  },

  overallMoney: {
    fontSize: 13,
    fontWeight: '900',
    marginTop: 4,
  },

  sortPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
    marginBottom: 18,
  },

  sortText: { fontSize: 14, fontWeight: '900' },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },

  goalCard: {
    width: cardWidth,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    alignItems: 'center',
    marginBottom: 2,
    minHeight: 300,
  },

  goalTopTouchable: {
    alignItems: 'center',
    width: '100%',
  },

  iconCircle: {
    width: 62,
    height: 62,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  icon: { fontSize: 31 },

  goalName: {
    fontSize: 21,
    fontWeight: '900',
    marginBottom: 10,
  },

  ringWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  ringText: {
    position: 'absolute',
    fontWeight: '900',
  },

  goalMetBadge: {
    backgroundColor: '#E9D7FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 10,
  },

  goalMetText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#5E2B8A',
  },

  savedText: {
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 4,
  },

  remainingText: {
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 7,
  },

  editGoalButton: {
    width: '100%',
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    marginTop: 14,
  },

  editGoalButtonText: {
    fontSize: 14,
    fontWeight: '900',
  },

  editorArea: {
    width: '100%',
    marginTop: 14,
  },

  goalInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 11,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 8,
  },

  saveButton: {
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    marginBottom: 8,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },

  deleteButton: {
    backgroundColor: '#FFE5E5',
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    marginBottom: 8,
  },

  deleteButtonText: {
    color: '#B00020',
    fontSize: 14,
    fontWeight: '900',
  },

  cancelButton: {
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
  },

  cancelButtonText: {
    fontSize: 14,
    fontWeight: '900',
  },

  focusCard: {
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 22,
    marginBottom: 10,
  },

  focusIcon: { fontSize: 42 },

  focusTitle: {
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 5,
  },

  focusText: {
    fontSize: 14,
    fontWeight: '700',
  },

  emptyCard: {
    borderRadius: 18,
    padding: 18,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 6,
  },

  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
});