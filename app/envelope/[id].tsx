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
  '💰',
  '🏦',
  '🏠',
  '🏡',
  '🚗',
  '⛽',
  '✈️',
  '🛫',
  '🎄',
  '🎁',
  '🎂',
  '🐶',
  '👶',
  '💍',
  '🎓',
  '💻',
  '📱',
  '🎮',
  '🍕',
  '🛒',
  '☕',
  '🎟️',
  '🏋️',
  '🩺',
  '👕',
  '🔧',
  '💸',
  '🚤',
  '📦',
  '📈',
];

const formatMoney = (amount: number) => {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

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

  const [stuffAmount, setStuffAmount] = useState('');
  const [spendAmount, setSpendAmount] = useState('');
  const [spendNote, setSpendNote] = useState('');
  const [selectedSpendAccount, setSelectedSpendAccount] = useState('');
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
      <View style={styles.container}>
        <Text style={styles.title}>Envelope not found</Text>
      </View>
    );
  }

  const goalAmount = envelope.goalAmount ?? 0;
  const hasGoal = goalAmount > 0;
  const progress = hasGoal ? Math.min(envelope.balance / goalAmount, 1) : 0;
  const percent = Math.round(progress * 100);
  const icon = envelope.icon ?? '💰';
  const envelopeColor = envelope.color ?? '#C8FF9B';

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
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Envelope?',
      `This will delete ${envelope.name} and return $${formatMoney(
        envelope.balance
      )} to Available To Stuff.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Return Money & Delete',
          style: 'destructive',
          onPress: () => {
            deleteEnvelope(envelope.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>
          {icon} {envelope.name}
        </Text>

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => {
            setShowSettings(!showSettings);
            setIsEditingName(false);
            setShowIconPicker(false);
            setShowColorPicker(false);
            setNewEnvelopeName('');
          }}
        >
          <Text style={styles.settingsDots}>⋯</Text>
        </TouchableOpacity>
      </View>

      {showSettings && (
        <View style={styles.settingsCard}>
          <Text style={styles.cardTitle}>Envelope Settings</Text>

          {!isEditingName ? (
            <TouchableOpacity
              style={styles.settingOption}
              onPress={() => {
                setNewEnvelopeName(envelope.name);
                setIsEditingName(true);
                setShowIconPicker(false);
                setShowColorPicker(false);
              }}
            >
              <Text style={styles.settingOptionText}>Edit Name</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="Envelope name"
                value={newEnvelopeName}
                onChangeText={setNewEnvelopeName}
              />

              <TouchableOpacity
                style={styles.greenButton}
                onPress={handleSaveEnvelopeName}
              >
                <Text style={styles.buttonText}>Save Name</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setIsEditingName(false);
                  setNewEnvelopeName('');
                }}
              >
                <Text style={styles.cancelText}>Cancel Edit</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={styles.settingOption}
            onPress={() => {
              setShowIconPicker(!showIconPicker);
              setShowColorPicker(false);
              setIsEditingName(false);
              setNewEnvelopeName('');
            }}
          >
            <Text style={styles.settingOptionText}>Change Icon</Text>
          </TouchableOpacity>

          {showIconPicker && (
            <View style={styles.iconGrid}>
              {ICONS.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.iconButton,
                    icon === item && {
                      backgroundColor: envelopeColor,
                      borderColor: '#111',
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
            style={styles.settingOption}
            onPress={() => {
              setShowColorPicker(!showColorPicker);
              setShowIconPicker(false);
              setIsEditingName(false);
              setNewEnvelopeName('');
            }}
          >
            <Text style={styles.settingOptionText}>Change Color</Text>
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
        <Text style={styles.balance}>${formatMoney(envelope.balance)}</Text>
        <Text style={styles.available}>
          Available to Stuff: ${formatMoney(availableToStuff)}
        </Text>

        {hasGoal && (
          <View style={styles.goalSection}>
            <Text style={styles.goalText}>
              Goal: ${formatMoney(envelope.balance)} / ${formatMoney(goalAmount)}
            </Text>

            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${percent}%` }]} />
            </View>

            <Text style={styles.percentText}>{percent}% complete</Text>
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Stuff Money</Text>

        <TextInput
          style={styles.input}
          placeholder="0.00"
          keyboardType="decimal-pad"
          value={stuffAmount}
          onChangeText={setStuffAmount}
        />

        <TouchableOpacity style={styles.greenButton} onPress={handleStuff}>
          <Text style={styles.buttonText}>Stuff Envelope</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Spend Money</Text>

        <TextInput
          style={styles.input}
          placeholder="0.00"
          keyboardType="decimal-pad"
          value={spendAmount}
          onChangeText={setSpendAmount}
        />

        <TextInput
          style={styles.input}
          placeholder="Note, like Walmart or Costco"
          value={spendNote}
          onChangeText={setSpendNote}
        />

        <Text style={styles.smallLabel}>Paid From</Text>

        {accounts.map((account) => (
          <TouchableOpacity
            key={account.id}
            style={[
              styles.accountButton,
              selectedSpendAccount === account.id && styles.selectedAccount,
            ]}
            onPress={() => setSelectedSpendAccount(account.id)}
          >
            <Text style={styles.accountText}>{account.name}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.redButton} onPress={handleSpend}>
          <Text style={styles.buttonText}>Spend Money</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>History</Text>

      {envelopeTransactions.length === 0 ? (
        <Text style={styles.empty}>No envelope history yet.</Text>
      ) : (
        envelopeTransactions.map((transaction) => (
          <View key={transaction.id} style={styles.transaction}>
            <Text style={styles.transactionText}>{transaction.description}</Text>
            <Text style={styles.transactionAmount}>
              {transaction.type === 'spend' ? '-' : '+'}
              ${formatMoney(transaction.amount)}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FFF4', padding: 20 },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
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
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },

  settingOption: {
    backgroundColor: '#F5F5F5',
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

  label: { fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  balance: { fontSize: 42, fontWeight: '900', marginTop: 6 },
  available: { fontSize: 16, fontWeight: '700', marginTop: 8 },

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
    color: '#333',
    marginTop: 6,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },

  cardTitle: { fontSize: 20, fontWeight: '900', marginBottom: 12 },

  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    padding: 14,
    fontSize: 18,
    marginBottom: 12,
  },

  greenButton: {
    backgroundColor: '#C8FF9B',
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
    backgroundColor: '#F5F5F5',
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

  deleteText: { fontWeight: '900', fontSize: 16 },

  buttonText: { fontWeight: '900', fontSize: 16 },

  smallLabel: { fontSize: 15, fontWeight: '900', marginBottom: 8 },

  accountButton: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },

  selectedAccount: { backgroundColor: '#C8FF9B' },

  accountText: { fontWeight: '800' },

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
    backgroundColor: '#F5F5F5',
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

  empty: { fontSize: 16, fontWeight: '700', color: '#666' },

  transaction: {
    backgroundColor: '#FFFFFF',
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