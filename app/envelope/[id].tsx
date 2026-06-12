import { formatCurrency } from '@/constants/currency';
import { getTheme } from '@/constants/theme';
import { useStashStore } from '@/store/store';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const ENVELOPE_COLORS = [
  '#C8FF9B',
  '#A7D8FF',
  '#D9B8FF',
  '#FFC1C1',
  '#FFD6A5',
  '#FFF3A6',
  '#FFB5E8',
  '#B8F2E6',
  '#D3D3D3',
  '#BDE0FE',
  '#E9C46A',
  '#CDB4DB',
];

const ICONS = [
  '💰', '🏦', '🏠', '🏡', '🚗', '⛽', '✈️', '🛫', '🎄', '🎁',
  '🎂', '🐶', '👶', '💍', '🎓', '💻', '📱', '🎮', '🍕', '🛒',
  '☕', '🎟️', '🏋️', '🩺', '👕', '🔧', '💸', '🚤', '📦', '📈',
];

export default function EnvelopeScreen() {
  const { id } = useLocalSearchParams();

  const accounts = useStashStore((state) => state.accounts);
  const envelopes = useStashStore((state) => state.envelopes);
  const transactions = useStashStore((state) => state.transactions);
  const stuffEnvelope = useStashStore((state) => state.stuffEnvelope);
  const spendFromEnvelope = useStashStore((state) => state.spendFromEnvelope);
  const deleteEnvelope = useStashStore((state) => state.deleteEnvelope);
  const editEnvelopeName = useStashStore((state) => state.editEnvelopeName);
  const editEnvelopeColor = useStashStore((state) => state.editEnvelopeColor);
  const editEnvelopeIcon = useStashStore((state) => state.editEnvelopeIcon);
  const themeColor = useStashStore((state) => state.themeColor);
  const themeMode = useStashStore((state) => state.themeMode);
  const currency = useStashStore((state) => state.currency);

  const theme = getTheme(themeColor, themeMode);

  const [stuffAmount, setStuffAmount] = useState('');
  const [spendAmount, setSpendAmount] = useState('');
  const [spendNote, setSpendNote] = useState('');
  const [selectedSpendAccount, setSelectedSpendAccount] = useState('');
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newEnvelopeName, setNewEnvelopeName] = useState('');

  const envelope = envelopes.find((item) => item.id === id);
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const stuffedTotal = envelopes.reduce((sum, item) => sum + item.balance, 0);
  const availableToStuff = totalBalance - stuffedTotal;

  const envelopeTransactions = transactions.filter(
    (transaction) => transaction.envelopeId === id
  );

  if (!envelope) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: theme.card }]}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={[styles.backText, { color: theme.text }]}>← Home</Text>
        </TouchableOpacity>

        <Text style={[styles.title, { color: theme.text }]}>Envelope not found</Text>
      </View>
    );
  }

  const goalAmount = envelope.goalAmount ?? 0;
  const hasGoal = goalAmount > 0;
  const progress = hasGoal ? Math.min(envelope.balance / goalAmount, 1) : 0;
  const percent = Math.round(progress * 100);
  const icon = envelope.icon ?? '💰';
  const envelopeColor = envelope.color ?? '#C8FF9B';
  const selectedAccount = accounts.find(
    (account) => account.id === selectedSpendAccount
  );

  const handleSaveEnvelopeName = () => {
    const cleanedName = newEnvelopeName.trim();

    if (!cleanedName) {
      Alert.alert('Enter an envelope name');
      return;
    }

    editEnvelopeName(envelope.id, cleanedName);
    setIsEditingName(false);
    setShowSettings(false);
    setNewEnvelopeName('');
  };

  const handleStuff = () => {
    const amount = Number(stuffAmount);

    if (!amount || amount <= 0) {
      Alert.alert('Enter a valid amount');
      return;
    }

    if (amount > availableToStuff) {
      Alert.alert('Not enough available to stuff');
      return;
    }

    stuffEnvelope(envelope.id, amount);
    setStuffAmount('');
  };

  const handleSpend = () => {
    const amount = Number(spendAmount);

    if (!selectedSpendAccount || !amount || amount <= 0) {
      Alert.alert('Complete all fields');
      return;
    }

    if (amount > envelope.balance) {
      Alert.alert('Not enough money in envelope');
      return;
    }

    spendFromEnvelope(envelope.id, selectedSpendAccount, amount, spendNote);
    setSpendAmount('');
    setSpendNote('');
    setSelectedSpendAccount('');
    setShowAccountDropdown(false);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Envelope?',
      `This will delete ${envelope.name} and return ${formatCurrency(
        envelope.balance,
        currency
      )} to Available To Stuff.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Return Money & Delete',
          style: 'destructive',
          onPress: () => {
            deleteEnvelope(envelope.id);
            router.replace('/(tabs)');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: theme.card }]}
        onPress={() => router.replace('/(tabs)')}
      >
        <Text style={[styles.backText, { color: theme.text }]}>← Home</Text>
      </TouchableOpacity>

      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: theme.text }]}>
          {icon} {envelope.name}
        </Text>

        <TouchableOpacity
          style={[styles.settingsButton, { backgroundColor: theme.card }]}
          onPress={() => {
            setShowSettings(!showSettings);
            setIsEditingName(false);
            setShowIconPicker(false);
            setShowColorPicker(false);
            setNewEnvelopeName('');
          }}
        >
          <Text style={[styles.settingsDots, { color: theme.text }]}>⋯</Text>
        </TouchableOpacity>
      </View>

      {showSettings && (
        <View style={[styles.settingsCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Envelope Settings</Text>

          {!isEditingName ? (
            <TouchableOpacity
              style={[styles.settingOption, { backgroundColor: theme.soft }]}
              onPress={() => {
                setNewEnvelopeName(envelope.name);
                setIsEditingName(true);
                setShowIconPicker(false);
                setShowColorPicker(false);
              }}
            >
              <Text style={[styles.settingOptionText, { color: theme.text }]}>Edit Name</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.soft,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="Envelope name"
                placeholderTextColor={theme.subtext}
                value={newEnvelopeName}
                onChangeText={setNewEnvelopeName}
              />

              <TouchableOpacity
                style={[styles.greenButton, { backgroundColor: theme.button }]}
                onPress={handleSaveEnvelopeName}
              >
                <Text style={[styles.buttonText, { color: theme.text }]}>Save Name</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: theme.soft }]}
                onPress={() => {
                  setIsEditingName(false);
                  setNewEnvelopeName('');
                }}
              >
                <Text style={[styles.cancelText, { color: theme.text }]}>Cancel Edit</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={[styles.settingOption, { backgroundColor: theme.soft }]}
            onPress={() => {
              setShowIconPicker(!showIconPicker);
              setShowColorPicker(false);
              setIsEditingName(false);
              setNewEnvelopeName('');
            }}
          >
            <Text style={[styles.settingOptionText, { color: theme.text }]}>Change Icon</Text>
          </TouchableOpacity>

          {showIconPicker && (
            <View style={styles.iconGrid}>
              {ICONS.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.iconButton,
                    { backgroundColor: theme.soft },
                    icon === item && {
                      backgroundColor: envelopeColor,
                      borderColor: theme.text,
                    },
                  ]}
                  onPress={() => editEnvelopeIcon(envelope.id, item)}
                >
                  <Text style={styles.iconText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={[styles.settingOption, { backgroundColor: theme.soft }]}
            onPress={() => {
              setShowColorPicker(!showColorPicker);
              setShowIconPicker(false);
              setIsEditingName(false);
              setNewEnvelopeName('');
            }}
          >
            <Text style={[styles.settingOptionText, { color: theme.text }]}>Change Color</Text>
          </TouchableOpacity>

          {showColorPicker && (
            <View style={styles.colorGrid}>
              {ENVELOPE_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: color },
                    envelopeColor === color && styles.selectedColorCircle,
                  ]}
                  onPress={() => editEnvelopeColor(envelope.id, color)}
                />
              ))}
            </View>
          )}

          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteText}>Delete Envelope</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={[styles.balanceCard, { backgroundColor: envelopeColor }]}>
        <Text style={styles.label}>ENVELOPE BALANCE</Text>
        <Text style={styles.balance}>
          {formatCurrency(envelope.balance, currency)}
        </Text>
        <Text style={styles.available}>
          Available to Stuff: {formatCurrency(availableToStuff, currency)}
        </Text>

        {hasGoal && (
          <View style={styles.goalSection}>
            <Text style={styles.goalText}>
              Goal: {formatCurrency(envelope.balance, currency)} /{' '}
              {formatCurrency(goalAmount, currency)}
            </Text>

            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${percent}%` }]} />
            </View>

            <Text style={styles.percentText}>{percent}% complete</Text>
          </View>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Stuff Money</Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.soft,
              color: theme.text,
              borderColor: theme.border,
            },
          ]}
          placeholder="0.00"
          placeholderTextColor={theme.subtext}
          keyboardType="decimal-pad"
          value={stuffAmount}
          onChangeText={setStuffAmount}
        />

        <TouchableOpacity
          style={[styles.greenButton, { backgroundColor: theme.button }]}
          onPress={handleStuff}
        >
          <Text style={[styles.buttonText, { color: theme.text }]}>Stuff Envelope</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Spend Money</Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.soft,
              color: theme.text,
              borderColor: theme.border,
            },
          ]}
          placeholder="0.00"
          placeholderTextColor={theme.subtext}
          keyboardType="decimal-pad"
          value={spendAmount}
          onChangeText={setSpendAmount}
        />

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.soft,
              color: theme.text,
              borderColor: theme.border,
            },
          ]}
          placeholder="Note, like Walmart or Costco"
          placeholderTextColor={theme.subtext}
          value={spendNote}
          onChangeText={setSpendNote}
        />

        <Text style={[styles.smallLabel, { color: theme.text }]}>Paid From</Text>

        <TouchableOpacity
          style={[styles.dropdownButton, { backgroundColor: theme.soft }]}
          onPress={() => setShowAccountDropdown(!showAccountDropdown)}
        >
          <Text style={[styles.dropdownText, { color: theme.text }]}>
            {selectedAccount
              ? `${selectedAccount.name} • ${formatCurrency(
                  selectedAccount.balance,
                  currency
                )}`
              : 'Choose account'}
          </Text>

          <Text style={[styles.dropdownArrow, { color: theme.text }]}>
            {showAccountDropdown ? '⌃' : '⌄'}
          </Text>
        </TouchableOpacity>

        {showAccountDropdown && (
          <View style={[styles.dropdownList, { backgroundColor: theme.soft }]}>
            {accounts.length === 0 ? (
              <Text style={[styles.emptyDropdownText, { color: theme.subtext }]}>
                No accounts yet.
              </Text>
            ) : (
              accounts.map((account) => (
                <TouchableOpacity
                  key={account.id}
                  style={[
                    styles.dropdownItem,
                    { backgroundColor: theme.card },
                    selectedSpendAccount === account.id && {
                      backgroundColor: theme.button,
                    },
                  ]}
                  onPress={() => {
                    setSelectedSpendAccount(account.id);
                    setShowAccountDropdown(false);
                  }}
                >
                  <Text style={[styles.dropdownItemName, { color: theme.text }]}>
                    {account.name}
                  </Text>
                  <Text style={[styles.dropdownItemBalance, { color: theme.subtext }]}>
                    {formatCurrency(account.balance, currency)}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        <TouchableOpacity style={styles.redButton} onPress={handleSpend}>
          <Text style={styles.buttonText}>Spend Money</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>History</Text>

      {envelopeTransactions.length === 0 ? (
        <Text style={[styles.empty, { color: theme.subtext }]}>
          No envelope history yet.
        </Text>
      ) : (
        envelopeTransactions.map((transaction) => (
          <View
            key={transaction.id}
            style={[styles.transaction, { backgroundColor: theme.card }]}
          >
            <Text style={[styles.transactionText, { color: theme.text }]}>
              {transaction.description}
            </Text>
            <Text style={[styles.transactionAmount, { color: theme.text }]}>
              {transaction.type === 'spend' ? '-' : '+'}
              {formatCurrency(transaction.amount, currency)}
            </Text>
          </View>
        ))
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginTop: 10,
    marginBottom: 4,
  },

  backText: {
    fontSize: 16,
    fontWeight: '900',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
  },

  title: {
    flex: 1,
    fontSize: 34,
    fontWeight: '900',
  },

  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },

  settingsDots: {
    fontSize: 30,
    fontWeight: '900',
    marginTop: -12,
  },

  settingsCard: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },

  settingOption: {
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },

  settingOptionText: {
    fontWeight: '900',
    fontSize: 16,
  },

  balanceCard: {
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
  },

  label: { fontSize: 12, fontWeight: '900', letterSpacing: 1, color: '#111111' },
  balance: { fontSize: 42, fontWeight: '900', marginTop: 6, color: '#111111' },
  available: { fontSize: 16, fontWeight: '700', marginTop: 8, color: '#333333' },

  goalSection: {
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: 14,
    padding: 12,
    marginTop: 14,
  },

  goalText: {
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 8,
    color: '#111111',
  },

  progressTrack: {
    height: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 999,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: 999,
  },

  percentText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#333333',
    marginTop: 6,
  },

  card: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },

  cardTitle: { fontSize: 20, fontWeight: '900', marginBottom: 12 },

  input: {
    borderRadius: 14,
    padding: 14,
    fontSize: 18,
    marginBottom: 12,
    borderWidth: 1,
  },

  greenButton: {
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
  },

  redButton: {
    backgroundColor: '#FFB3B3',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },

  cancelButton: {
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },

  cancelText: { fontWeight: '900', fontSize: 16 },

  deleteButton: {
    backgroundColor: '#FFB3B3',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 4,
  },

  deleteText: { fontWeight: '900', fontSize: 16, color: '#7A0000' },

  buttonText: { fontWeight: '900', fontSize: 16 },

  smallLabel: { fontSize: 15, fontWeight: '900', marginBottom: 8 },

  dropdownButton: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  dropdownText: {
    fontSize: 16,
    fontWeight: '800',
  },

  dropdownArrow: {
    fontSize: 22,
    fontWeight: '900',
  },

  dropdownList: {
    borderRadius: 14,
    padding: 8,
    marginBottom: 10,
  },

  dropdownItem: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  dropdownItemName: {
    fontSize: 16,
    fontWeight: '900',
  },

  dropdownItemBalance: {
    fontSize: 15,
    fontWeight: '800',
  },

  emptyDropdownText: {
    fontWeight: '800',
    padding: 10,
  },

  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  iconButton: {
    width: '15%',
    aspectRatio: 1,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },

  iconText: {
    fontSize: 24,
  },

  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 2,
    marginBottom: 12,
  },

  colorCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: 'transparent',
  },

  selectedColorCircle: {
    borderColor: '#111',
  },

  sectionTitle: {
    fontSize: 26,
    fontWeight: '900',
    marginTop: 10,
    marginBottom: 12,
  },

  empty: { fontSize: 16, fontWeight: '700' },

  transaction: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },

  transactionText: { fontWeight: '800' },

  transactionAmount: {
    fontSize: 22,
    fontWeight: '900',
    marginTop: 6,
  },
});