import { Envelope, useStashStore } from '@/store/store';
import { router } from 'expo-router';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';

const formatMoney = (amount: number) => {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const hexToRgba = (hex: string, opacity: number) => {
  const cleanHex = hex.replace('#', '');
  const red = parseInt(cleanHex.substring(0, 2), 16);
  const green = parseInt(cleanHex.substring(2, 4), 16);
  const blue = parseInt(cleanHex.substring(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
};

export default function HomeScreen() {
  const accounts = useStashStore((state) => state.accounts);
  const envelopes = useStashStore((state) => state.envelopes);
  const reorderEnvelopes = useStashStore((state) => state.reorderEnvelopes);

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const stuffedTotal = envelopes.reduce((sum, envelope) => sum + envelope.balance, 0);
  const availableToStuff = totalBalance - stuffedTotal;

  const renderEnvelope = ({ item, drag, isActive }: RenderItemParams<Envelope>) => {
    const goalAmount = item.goalAmount ?? 0;
    const hasGoal = goalAmount > 0;
    const progress = hasGoal ? Math.min(item.balance / goalAmount, 1) : 0;
    const percent = Math.round(progress * 100);
    const icon = item.icon ?? '💵';
    const envelopeColor = item.color ?? '#C8FF9B';
    const envelopeTint = hexToRgba(envelopeColor, 0.18);
    const goalComplete = hasGoal && item.balance >= goalAmount;

    return (
      <TouchableOpacity
        style={[
          styles.envelopeCard,
          { backgroundColor: envelopeTint },
          goalComplete && { borderColor: envelopeColor },
          isActive && styles.activeEnvelopeCard,
        ]}
        onPress={() => router.push(`/envelope/${item.id}`)}
        activeOpacity={0.9}
      >
        <TouchableOpacity
          style={styles.dragHandle}
          onLongPress={drag}
          delayLongPress={150}
        >
          <Text style={styles.dragHandleText}>☰</Text>
        </TouchableOpacity>

        <View
          style={[
            styles.iconBubble,
            { backgroundColor: envelopeColor },
          ]}
        >
          <Text style={styles.iconText}>{icon}</Text>
        </View>

        <View style={styles.envelopeInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.envelopeName}>{item.name}</Text>

            {goalComplete && (
              <View
                style={[
                  styles.completeBadge,
                  { backgroundColor: envelopeColor },
                ]}
              >
                <Text style={styles.completeBadgeText}>Goal Met 🎉</Text>
              </View>
            )}
          </View>

          <Text style={styles.envelopeBalance}>
            ${formatMoney(item.balance)}
          </Text>

          {hasGoal && (
            <View style={styles.goalSection}>
              <Text style={styles.goalText}>
                ${formatMoney(item.balance)} / ${formatMoney(goalAmount)}
              </Text>

              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${percent}%`,
                      backgroundColor: 'rgba(0,0,0,0.75)',
                    },
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
  };

  return (
    <DraggableFlatList
      data={envelopes}
      keyExtractor={(item) => item.id}
      renderItem={renderEnvelope}
      onDragEnd={({ data }) => reorderEnvelopes(data)}
      contentContainerStyle={styles.content}
      ListHeaderComponent={
        <>
          <View style={styles.header}>
            <Text style={styles.logo}>STASH</Text>
            <Text style={styles.tagline}>Virtual cash stuffing made simple</Text>
          </View>

          <TouchableOpacity
            style={styles.totalCard}
            onPress={() => router.push('/activity')}
          >
            <Text style={styles.label}>STASH BALANCE</Text>
            <Text style={styles.totalBalance}>${formatMoney(totalBalance)}</Text>

            <View style={styles.summaryRow}>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryLabel}>Stuffed</Text>
                <Text style={styles.summaryAmount}>${formatMoney(stuffedTotal)}</Text>
              </View>

              <View style={styles.summaryBox}>
                <Text style={styles.summaryLabel}>Available</Text>
                <Text style={styles.summaryAmount}>
                  ${formatMoney(availableToStuff)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push('/add-income')}
            >
              <Text style={styles.primaryButtonText}>+ Income</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.push('/add-envelope')}
            >
              <Text style={styles.secondaryButtonText}>+ Envelope</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Envelopes</Text>
              {envelopes.length > 1 && (
                <Text style={styles.sortHint}>Hold ☰ to reorder</Text>
              )}
            </View>

            <TouchableOpacity onPress={() => router.push('/activity')}>
              <Text style={styles.viewActivity}>Activity</Text>
            </TouchableOpacity>
          </View>

          {envelopes.length === 0 && (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No envelopes yet</Text>
              <Text style={styles.emptyText}>
                Create your first envelope to start organizing your money.
              </Text>

              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => router.push('/add-envelope')}
              >
                <Text style={styles.emptyButtonText}>Create Envelope</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      }
      ListFooterComponent={<View style={{ height: 50 }} />}
    />
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 50, backgroundColor: '#F8FFF4' },

  header: {
    marginTop: 60,
    marginBottom: 16,
  },

  logo: {
    fontSize: 34,
    fontWeight: '900',
    color: '#111111',
  },

  tagline: {
    fontSize: 15,
    fontWeight: '700',
    color: '#666666',
    marginTop: 4,
  },

  totalCard: {
    backgroundColor: '#C8FF9B',
    borderRadius: 28,
    padding: 22,
    marginBottom: 14,
  },

  label: {
    fontWeight: '900',
    fontSize: 13,
    color: '#111111',
    letterSpacing: 0.5,
  },

  totalBalance: {
    fontSize: 44,
    fontWeight: '900',
    marginTop: 8,
    marginBottom: 18,
    color: '#111111',
  },

  summaryRow: {
    flexDirection: 'row',
    gap: 10,
  },

  summaryBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.65)',
    borderRadius: 18,
    padding: 14,
  },

  summaryLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: '#555555',
    marginBottom: 4,
  },

  summaryAmount: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111111',
  },

  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22,
  },

  primaryButton: {
    flex: 1,
    backgroundColor: '#111111',
    padding: 16,
    borderRadius: 18,
    alignItems: 'center',
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
  },

  secondaryButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    alignItems: 'center',
  },

  secondaryButtonText: {
    color: '#111111',
    fontWeight: '900',
    fontSize: 16,
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
    color: '#111111',
  },

  sortHint: {
    fontSize: 13,
    fontWeight: '800',
    color: '#777777',
    marginTop: 3,
  },

  viewActivity: {
    fontWeight: '900',
    fontSize: 16,
    color: '#111111',
  },

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 8,
    color: '#111111',
  },

  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
    lineHeight: 23,
    marginBottom: 16,
  },

  emptyButton: {
    backgroundColor: '#C8FF9B',
    padding: 15,
    borderRadius: 16,
    alignItems: 'center',
  },

  emptyButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111111',
  },

  envelopeCard: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },

  activeEnvelopeCard: {
    transform: [{ scale: 1.02 }],
    opacity: 0.95,
  },

  dragHandle: {
    width: 28,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  dragHandleText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#777777',
  },

  iconBubble: {
    width: 48,
    height: 48,
    borderRadius: 16,
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
    color: '#111111',
  },

  completeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    marginTop: 4,
  },

  completeBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#111111',
  },

  envelopeBalance: {
    fontSize: 24,
    fontWeight: '900',
    marginTop: 4,
    color: '#111111',
  },

  goalSection: {
    marginTop: 10,
  },

  goalText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#666666',
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
    borderRadius: 999,
  },

  percentText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#666666',
    marginTop: 5,
  },

  completedPercentText: {
    color: '#111111',
  },

  arrow: {
    fontSize: 34,
    fontWeight: '700',
    color: '#999999',
    marginLeft: 10,
  },
});