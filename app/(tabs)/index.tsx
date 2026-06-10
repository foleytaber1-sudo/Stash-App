import { useStashStore } from '@/store/store';
import { router } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const formatMoney = (amount: number) => {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default function HomeScreen() {
  const accounts = useStashStore((state) => state.accounts);
  const envelopes = useStashStore((state) => state.envelopes);

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const stuffedTotal = envelopes.reduce((sum, envelope) => sum + envelope.balance, 0);
  const availableToStuff = totalBalance - stuffedTotal;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity
        style={styles.totalCard}
        onPress={() => router.push('/activity')}
      >
        <Text style={styles.label}>TOTAL BALANCE</Text>
        <Text style={styles.totalBalance}>${formatMoney(totalBalance)}</Text>

        <View style={styles.availableBox}>
          <Text style={styles.availableLabel}>AVAILABLE TO STUFF</Text>
          <Text style={styles.availableAmount}>
            ${formatMoney(availableToStuff)}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.incomeButton}
        onPress={() => router.push('/add-income')}
      >
        <Text style={styles.incomeText}>+ Income</Text>
      </TouchableOpacity>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Envelopes</Text>

        <TouchableOpacity onPress={() => router.push('/add-envelope')}>
          <Text style={styles.addEnvelope}>+ Envelope</Text>
        </TouchableOpacity>
      </View>

      {envelopes.length === 0 ? (
        <Text style={styles.empty}>No envelopes yet. Add one to start stuffing.</Text>
      ) : (
        envelopes.map((envelope) => {
          const goalAmount = envelope.goalAmount ?? 0;
          const hasGoal = goalAmount > 0;
          const progress = hasGoal ? Math.min(envelope.balance / goalAmount, 1) : 0;
          const percent = Math.round(progress * 100);
          const icon = envelope.icon ?? '💵';
          const goalComplete = hasGoal && envelope.balance >= goalAmount;

          return (
            <TouchableOpacity
              key={envelope.id}
              style={[
                styles.envelopeCard,
                goalComplete && styles.completedEnvelopeCard,
              ]}
              onPress={() => router.push(`/envelope/${envelope.id}`)}
            >
              <View style={styles.iconBubble}>
                <Text style={styles.iconText}>{icon}</Text>
              </View>

              <View style={styles.envelopeInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.envelopeName}>{envelope.name}</Text>

                  {goalComplete && (
                    <View style={styles.completeBadge}>
                      <Text style={styles.completeBadgeText}>Goal Met 🎉</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.envelopeBalance}>
                  ${formatMoney(envelope.balance)}
                </Text>

                {hasGoal && (
                  <View style={styles.goalSection}>
                    <Text style={styles.goalText}>
                      ${formatMoney(envelope.balance)} / ${formatMoney(goalAmount)}
                    </Text>

                    <View style={styles.progressTrack}>
                      <View
                        style={[
                          styles.progressFill,
                          goalComplete && styles.completedProgressFill,
                          { width: `${percent}%` },
                        ]}
                      />
                    </View>

                    <Text
                      style={[
                        styles.percentText,
                        goalComplete && styles.completedPercentText,
                      ]}
                    >
                      {goalComplete ? 'Fully funded!' : `${percent}% complete`}
                    </Text>
                  </View>
                )}
              </View>

              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FFF4' },
  content: { padding: 16, paddingBottom: 50 },

  totalCard: {
    backgroundColor: '#C8FF9B',
    borderRadius: 24,
    padding: 20,
    marginTop: 60,
    marginBottom: 16,
  },

  label: {
    fontWeight: '800',
    fontSize: 13,
  },

  totalBalance: {
    fontSize: 42,
    fontWeight: '900',
    marginVertical: 8,
  },

  availableBox: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 16,
    padding: 14,
  },

  availableLabel: {
    fontSize: 12,
    fontWeight: '800',
  },

  availableAmount: {
    fontSize: 28,
    fontWeight: '900',
  },

  incomeButton: {
    backgroundColor: '#111',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
  },

  incomeText: {
    color: '#FFF',
    fontWeight: '900',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 28,
    fontWeight: '900',
  },

  addEnvelope: {
    fontWeight: '800',
    fontSize: 16,
  },

  empty: {
    fontSize: 16,
    fontWeight: '700',
    color: '#666',
    marginTop: 10,
  },

  envelopeCard: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  completedEnvelopeCard: {
    borderWidth: 2,
    borderColor: '#C8FF9B',
  },

  iconBubble: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#F8FFF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  iconText: {
    fontSize: 26,
  },

  envelopeInfo: {
    flex: 1,
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  envelopeName: {
    fontSize: 18,
    fontWeight: '800',
    marginRight: 8,
  },

  completeBadge: {
    backgroundColor: '#C8FF9B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    marginTop: 4,
  },

  completeBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#111',
  },

  envelopeBalance: {
    fontSize: 24,
    fontWeight: '900',
    marginTop: 4,
  },

  goalSection: {
    marginTop: 10,
  },

  goalText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#666',
    marginBottom: 6,
  },

  progressTrack: {
    height: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 999,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#C8FF9B',
    borderRadius: 999,
  },

  completedProgressFill: {
    backgroundColor: '#111',
  },

  percentText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#666',
    marginTop: 5,
  },

  completedPercentText: {
    color: '#111',
  },

  arrow: {
    fontSize: 34,
    fontWeight: '700',
    color: '#999',
    marginLeft: 10,
  },
});