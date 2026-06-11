import { formatCurrency } from '@/constants/currency';
import { getTheme } from '@/constants/theme';
import { Envelope, useStashStore } from '@/store/store';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';

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
  const themeColor = useStashStore((state) => state.themeColor);
  const themeMode = useStashStore((state) => state.themeMode);
  const currency = useStashStore((state) => state.currency);

  const theme = getTheme(themeColor, themeMode);

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const stuffedTotal = envelopes.reduce((sum, envelope) => sum + envelope.balance, 0);
  const availableToStuff = totalBalance - stuffedTotal;

  const renderEnvelope = ({ item, drag, isActive }: RenderItemParams<Envelope>) => {
    const goalAmount = item.goalAmount ?? 0;
    const hasGoal = goalAmount > 0;
    const progress = hasGoal ? Math.min(item.balance / goalAmount, 1) : 0;
    const percent = Math.round(progress * 100);
    const icon = item.icon ?? '💵';
    const envelopeColor = item.color ?? theme.button;
    const envelopeTint = hexToRgba(envelopeColor, themeMode === 'dark' ? 0.28 : 0.18);
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
          <Text style={[styles.dragHandleText, { color: theme.subtext }]}>☰</Text>
        </TouchableOpacity>

        <View style={[styles.iconBubble, { backgroundColor: envelopeColor }]}>
          <Text style={styles.iconText}>{icon}</Text>
        </View>

        <View style={styles.envelopeInfo}>
          <View style={styles.nameRow}>
            <Text style={[styles.envelopeName, { color: theme.text }]}>{item.name}</Text>

            {goalComplete && (
              <View style={[styles.completeBadge, { backgroundColor: envelopeColor }]}>
                <Text style={styles.completeBadgeText}>Goal Met 🎉</Text>
              </View>
            )}
          </View>

          <Text style={[styles.envelopeBalance, { color: theme.text }]}>
            {formatCurrency(item.balance, currency)}
          </Text>

          {hasGoal && (
            <View style={styles.goalSection}>
              <Text style={[styles.goalText, { color: theme.subtext }]}>
                {formatCurrency(item.balance, currency)} /{' '}
                {formatCurrency(goalAmount, currency)}
              </Text>

              <View
                style={[
                  styles.progressTrack,
                  { backgroundColor: themeMode === 'dark' ? theme.card : '#F0F0F0' },
                ]}
              >
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${percent}%`,
                      backgroundColor: theme.accent,
                    },
                  ]}
                />
              </View>

              <Text
                style={[
                  styles.percentText,
                  { color: theme.subtext },
                  goalComplete && { color: theme.accent },
                ]}
              >
                {goalComplete ? 'Fully funded!' : `${percent}% complete`}
              </Text>
            </View>
          )}
        </View>

        <Text style={[styles.arrow, { color: theme.subtext }]}>›</Text>
      </TouchableOpacity>
    );
  };

  return (
    <DraggableFlatList
      data={envelopes}
      keyExtractor={(item) => item.id}
      renderItem={renderEnvelope}
      onDragEnd={({ data }) => reorderEnvelopes(data)}
      contentContainerStyle={[styles.content, { backgroundColor: theme.background }]}
      ListHeaderComponent={
        <>
          <View style={styles.header}>
            <Text style={[styles.logo, { color: theme.text }]}>STASH</Text>
            <Text style={[styles.tagline, { color: theme.subtext }]}>
              Virtual cash stuffing made simple
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.totalCard,
              {
                backgroundColor: theme.button,
                borderColor: theme.accent,
              },
            ]}
            onPress={() => router.push('/activity')}
          >
            <Text style={[styles.label, { color: themeMode === 'dark' ? theme.text : '#111111' }]}>
              STASH BALANCE
            </Text>
            <Text
              style={[
                styles.totalBalance,
                { color: themeMode === 'dark' ? theme.text : '#111111' },
              ]}
            >
              {formatCurrency(totalBalance, currency)}
            </Text>

            <View style={styles.summaryRow}>
              <View
                style={[
                  styles.summaryBox,
                  {
                    backgroundColor:
                      themeMode === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.65)',
                  },
                ]}
              >
                <Text style={[styles.summaryLabel, { color: theme.subtext }]}>Stuffed</Text>
                <Text style={[styles.summaryAmount, { color: theme.text }]}>
                  {formatCurrency(stuffedTotal, currency)}
                </Text>
              </View>

              <View
                style={[
                  styles.summaryBox,
                  {
                    backgroundColor:
                      themeMode === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.65)',
                  },
                ]}
              >
                <Text style={[styles.summaryLabel, { color: theme.subtext }]}>Available</Text>
                <Text style={[styles.summaryAmount, { color: theme.text }]}>
                  {formatCurrency(availableToStuff, currency)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: theme.accent }]}
              onPress={() => router.push('/add-income')}
            >
              <Text style={styles.primaryButtonText}>+ Income</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryButton, { backgroundColor: theme.soft }]}
              onPress={() => router.push('/add-envelope')}
            >
              <Text style={[styles.secondaryButtonText, { color: theme.accent }]}>
                + Envelope
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Envelopes</Text>
              {envelopes.length > 1 && (
                <Text style={[styles.sortHint, { color: theme.subtext }]}>
                  Hold ☰ to reorder
                </Text>
              )}
            </View>

            <TouchableOpacity onPress={() => router.push('/activity')}>
              <Text style={[styles.viewActivity, { color: theme.accent }]}>Activity</Text>
            </TouchableOpacity>
          </View>

          {envelopes.length === 0 && (
            <View style={[styles.emptyCard, { backgroundColor: theme.soft }]}>
              <Text style={[styles.emptyTitle, { color: theme.text }]}>No envelopes yet</Text>
              <Text style={[styles.emptyText, { color: theme.subtext }]}>
                Create your first envelope to start organizing your money.
              </Text>

              <TouchableOpacity
                style={[styles.emptyButton, { backgroundColor: theme.button }]}
                onPress={() => router.push('/add-envelope')}
              >
                <Text style={[styles.emptyButtonText, { color: theme.text }]}>
                  Create Envelope
                </Text>
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
  content: { padding: 16, paddingBottom: 50 },
  header: { marginTop: 60, marginBottom: 16 },
  logo: { fontSize: 34, fontWeight: '900' },
  tagline: { fontSize: 15, fontWeight: '700', marginTop: 4 },
  totalCard: { borderRadius: 28, padding: 22, marginBottom: 14, borderWidth: 2 },
  label: { fontWeight: '900', fontSize: 13, letterSpacing: 0.5 },
  totalBalance: { fontSize: 44, fontWeight: '900', marginTop: 8, marginBottom: 18 },
  summaryRow: { flexDirection: 'row', gap: 10 },
  summaryBox: { flex: 1, borderRadius: 18, padding: 14 },
  summaryLabel: { fontSize: 12, fontWeight: '900', marginBottom: 4 },
  summaryAmount: { fontSize: 20, fontWeight: '900' },
  actionRow: { flexDirection: 'row', gap: 10, marginBottom: 22 },
  primaryButton: { flex: 1, padding: 16, borderRadius: 18, alignItems: 'center' },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '900', fontSize: 16 },
  secondaryButton: { flex: 1, padding: 16, borderRadius: 18, alignItems: 'center' },
  secondaryButtonText: { fontWeight: '900', fontSize: 16 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
  },
  sectionTitle: { fontSize: 28, fontWeight: '900' },
  sortHint: { fontSize: 13, fontWeight: '800', marginTop: 3 },
  viewActivity: { fontWeight: '900', fontSize: 16 },
  emptyCard: { borderRadius: 22, padding: 20 },
  emptyTitle: { fontSize: 22, fontWeight: '900', marginBottom: 8 },
  emptyText: { fontSize: 16, fontWeight: '600', lineHeight: 23, marginBottom: 16 },
  emptyButton: { padding: 15, borderRadius: 16, alignItems: 'center' },
  emptyButtonText: { fontSize: 16, fontWeight: '900' },
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
  activeEnvelopeCard: { transform: [{ scale: 1.02 }], opacity: 0.95 },
  dragHandle: {
    width: 28,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  dragHandleText: { fontSize: 24, fontWeight: '900' },
  iconBubble: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: { fontSize: 26 },
  envelopeInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  envelopeName: { fontSize: 18, fontWeight: '800', marginRight: 8 },
  completeBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, marginTop: 4 },
  completeBadgeText: { fontSize: 12, fontWeight: '900', color: '#111111' },
  envelopeBalance: { fontSize: 24, fontWeight: '900', marginTop: 4 },
  goalSection: { marginTop: 10 },
  goalText: { fontSize: 13, fontWeight: '800', marginBottom: 6 },
  progressTrack: { height: 10, borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 999 },
  percentText: { fontSize: 12, fontWeight: '800', marginTop: 5 },
  arrow: { fontSize: 34, fontWeight: '700', marginLeft: 10 },
});