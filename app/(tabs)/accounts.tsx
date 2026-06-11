import { formatCurrency } from '@/constants/currency';
import { getTheme } from '@/constants/theme';
import { useStashStore } from '@/store/store';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const cardColors = ['#D9A400', '#A98BE6', '#83BE78', '#D78B57', '#6F9DE8'];

function getCardColor(index: number) {
  return cardColors[index % cardColors.length];
}

function getGradientColors(color: string): [string, string, string] {
  return [color, color, '#000000'];
}

function getLastFour(index: number) {
  const endings = ['4242', '1234', '5678', '9012', '7788'];
  return endings[index % endings.length];
}

export default function AccountsScreen() {
  const accounts = useStashStore((state) => state.accounts);
  const themeColor = useStashStore((state) => state.themeColor);
  const themeMode = useStashStore((state) => state.themeMode);
  const currency = useStashStore((state) => state.currency);

  const theme = getTheme(themeColor, themeMode);
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Accounts</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/add-account')}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {accounts.length === 0 ? (
        <View style={[styles.emptyCard, { backgroundColor: theme.soft }]}>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>No accounts yet</Text>
          <Text style={[styles.emptyText, { color: theme.subtext }]}>
            Add your first account to start tracking your money.
          </Text>
        </View>
      ) : (
        accounts.map((account, index) => {
          const percent =
            totalBalance > 0 ? Math.round((account.balance / totalBalance) * 100) : 0;

          const cardColor = account.cardColor || getCardColor(index);

          return (
            <TouchableOpacity
              key={account.id}
              activeOpacity={0.9}
              onPress={() => router.push(`/account/${account.id}`)}
            >
              <LinearGradient
                colors={getGradientColors(cardColor)}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                locations={[0, 0.55, 1]}
                style={styles.debitCard}
              >
                <View style={styles.cardLightOverlay} />
                <View style={styles.cardDarkOverlay} />
                <View style={styles.cardEdgeHighlight} />

                <View style={styles.cardTopRow}>
                  <View style={styles.cardNameRow}>
                    <Ionicons
                      name={(account.icon || 'card') as any}
                      size={25}
                      color="#FFFFFF"
                    />

                    <Text style={styles.cardName} numberOfLines={1}>
                      {account.name}
                    </Text>
                  </View>

                  <MaterialCommunityIcons
                    name="contactless-payment"
                    size={44}
                    color="#FFFFFF"
                    style={styles.contactlessIcon}
                  />
                </View>

                <Text style={styles.cardBalance} numberOfLines={1}>
                  {formatCurrency(account.balance, currency)}
                </Text>

                <View style={styles.floatingChip}>
                  <View style={styles.chipLine} />
                  <View style={styles.chipLine} />
                  <View style={styles.chipLine} />
                </View>

                <View style={styles.cardBottomRow}>
                  <View>
                    <Text style={styles.cardSmallText}>{percent}% of total</Text>
                    <Text style={styles.cardNumber}>•••• {getLastFour(index)}</Text>
                  </View>

                  <Text style={styles.cardBrand}>STASH</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          );
        })
      )}

      <TouchableOpacity
        style={styles.transferButton}
        onPress={() => router.push('/transfer')}
      >
        <Ionicons name="swap-horizontal" size={22} color="#FFFFFF" />
        <Text style={styles.transferButtonText}>Transfer Money</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 30,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 34,
  },

  title: {
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: -1.3,
  },

  addButton: {
    backgroundColor: '#FFE78B',
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 999,
  },

  addButtonText: {
    color: '#B88300',
    fontSize: 17,
    fontWeight: '900',
  },

  debitCard: {
    height: 265,
    borderRadius: 24,
    padding: 30,
    marginBottom: 22,
    justifyContent: 'space-between',
    overflow: 'hidden',

    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 9 },
    elevation: 7,
  },

  cardLightOverlay: {
    position: 'absolute',
    top: -70,
    left: -60,
    right: -60,
    height: 170,
    backgroundColor: 'rgba(255,255,255,0.10)',
    transform: [{ rotate: '-8deg' }],
  },

  cardDarkOverlay: {
    position: 'absolute',
    bottom: -70,
    left: -60,
    right: -60,
    height: 150,
    backgroundColor: 'rgba(0,0,0,0.08)',
    transform: [{ rotate: '-8deg' }],
  },

  cardEdgeHighlight: {
    position: 'absolute',
    top: 1,
    left: 18,
    right: 18,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.28)',
  },

  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  cardNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 14,
    gap: 12,
  },

  floatingChip: {
    position: 'absolute',
    right: 40,
    top: 115,
    width: 44,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#EAD28A',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
    justifyContent: 'space-evenly',
    paddingHorizontal: 8,
  },

  chipLine: {
    height: 1,
    backgroundColor: 'rgba(90,70,20,0.45)',
  },

  cardName: {
    color: '#FFFFFF',
    fontSize: 29,
    fontWeight: '600',
    flex: 1,
  },

  contactlessIcon: {
    opacity: 0.92,
    marginTop: 2,
  },

  cardBalance: {
    color: '#FFFFFF',
    fontSize: 50,
    fontWeight: '600',
    letterSpacing: -1.2,
  },

  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },

  cardSmallText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    opacity: 0.76,
  },

  cardNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    opacity: 0.76,
    marginTop: 6,
  },

  cardBrand: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: 1.5,
    opacity: 0.9,
  },

  transferButton: {
    marginTop: 70,
    backgroundColor: '#D9A400',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,

    shadowColor: '#000',
    shadowOpacity: 0.13,
    shadowRadius: 11,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },

  transferButtonText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '900',
  },

  emptyCard: {
    borderRadius: 22,
    padding: 22,
    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 23,
  },
});