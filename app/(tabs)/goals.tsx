import { useStashStore } from '@/store/store';
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

export default function GoalsScreen() {
  const envelopes = useStashStore((state) => state.envelopes);
  const editEnvelopeGoal = useStashStore((state) => state.editEnvelopeGoal);

  const [editingGoalId, setEditingGoalId] = useState('');
  const [goalAmountInput, setGoalAmountInput] = useState('');

  const handleSaveGoal = (envelopeId: string) => {
    const goalAmount = Number(goalAmountInput);

    if (!goalAmount || goalAmount < 0) {
      Alert.alert('Enter a valid goal amount');
      return;
    }

    editEnvelopeGoal(envelopeId, goalAmount);
    setEditingGoalId('');
    setGoalAmountInput('');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Goals</Text>

      {envelopes.length === 0 ? (
        <Text style={styles.empty}>
          No envelopes yet. Add envelopes from Home first.
        </Text>
      ) : (
        envelopes.map((envelope) => {
          const goalAmount = envelope.goalAmount ?? 0;
          const hasGoal = goalAmount > 0;
          const progress = hasGoal
            ? Math.min(envelope.balance / goalAmount, 1)
            : 0;
          const percent = Math.round(progress * 100);
          const icon = envelope.icon ?? '💵';

          return (
            <View style={styles.goalCard} key={envelope.id}>
              <View style={styles.goalHeader}>
                <View style={styles.iconBubble}>
                  <Text style={styles.iconText}>{icon}</Text>
                </View>

                <View style={styles.goalHeaderText}>
                  <Text style={styles.goalName}>{envelope.name}</Text>

                  {hasGoal ? (
                    <Text style={styles.goalSubText}>
                      ${envelope.balance.toFixed(2)} / ${goalAmount.toFixed(2)}
                    </Text>
                  ) : (
                    <Text style={styles.goalSubText}>
                      ${envelope.balance.toFixed(2)} saved
                    </Text>
                  )}
                </View>
              </View>

              {hasGoal ? (
                <>
                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${percent}%` },
                      ]}
                    />
                  </View>

                  <Text style={styles.percent}>{percent}% complete</Text>
                </>
              ) : (
                <Text style={styles.goalHint}>No goal set yet</Text>
              )}

              {editingGoalId === envelope.id ? (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Goal amount"
                    keyboardType="decimal-pad"
                    value={goalAmountInput}
                    onChangeText={setGoalAmountInput}
                  />

                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => handleSaveGoal(envelope.id)}
                  >
                    <Text style={styles.buttonText}>Save Goal</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      setEditingGoalId('');
                      setGoalAmountInput('');
                    }}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => {
                    setEditingGoalId(envelope.id);
                    setGoalAmountInput(goalAmount ? goalAmount.toString() : '');
                  }}
                >
                  <Text style={styles.editButtonText}>
                    {hasGoal ? 'Edit Goal' : 'Set Goal'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FFF4', padding: 20 },

  title: {
    fontSize: 34,
    fontWeight: '900',
    marginTop: 60,
    marginBottom: 20,
  },

  empty: {
    fontSize: 16,
    fontWeight: '700',
    color: '#666',
  },

  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
  },

  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconBubble: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#F8FFF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  iconText: {
    fontSize: 28,
  },

  goalHeaderText: {
    flex: 1,
  },

  goalName: {
    fontSize: 22,
    fontWeight: '900',
  },

  goalSubText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#666',
    marginTop: 4,
  },

  goalHint: {
    color: '#666',
    fontWeight: '700',
    marginTop: 10,
  },

  progressTrack: {
    height: 14,
    backgroundColor: '#F0F0F0',
    borderRadius: 999,
    marginTop: 16,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#C8FF9B',
    borderRadius: 999,
  },

  percent: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: '800',
    color: '#666',
  },

  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    padding: 14,
    fontSize: 18,
    marginTop: 14,
    marginBottom: 10,
  },

  editButton: {
    backgroundColor: '#F5F5F5',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 14,
  },

  editButtonText: {
    fontWeight: '900',
    fontSize: 16,
  },

  saveButton: {
    backgroundColor: '#C8FF9B',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
  },

  cancelButton: {
    backgroundColor: '#F5F5F5',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    fontWeight: '900',
    fontSize: 16,
  },

  cancelText: {
    fontWeight: '900',
    fontSize: 16,
  },
});