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

export default function AccountDetailScreen() {
  const { id } = useLocalSearchParams();

  const accounts = useStashStore((state) => state.accounts);
  const transactions = useStashStore((state) => state.transactions);
  const deleteAccount = useStashStore((state) => state.deleteAccount);
  const editAccountName = useStashStore((state) => state.editAccountName);
  const themeColor = useStashStore((state) => state.themeColor);
  const themeMode = useStashStore((state) => state.themeMode);
  const currency = useStashStore((state) => state.currency);

  const theme = getTheme(themeColor, themeMode);

  const [isEditingName, setIsEditingName] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');

  const accountId = typeof id === 'string' ? id : '';

  const account = accounts.find((item) => item.id === accountId);

  const accountTransactions = transactions.filter(
    (transaction) =>
      transaction.accountId === accountId ||
      transaction.fromAccountId === accountId ||
      transaction.toAccountId === accountId
  );

  if (!account) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.text }]}>Account not found</Text>
      </View>
    );
  }

  const getTransactionAmountPrefix = (transaction: (typeof transactions)[number]) => {
    if (transaction.type === 'spend') return '-';
    if (transaction.type === 'transfer' && transaction.fromAccountId === accountId) {
      return '-';
    }

    return '+';
  };

  const getTransactionDescription = (transaction: (typeof transactions)[number]) => {
    if (transaction.type !== 'transfer') {
      return transaction.description;
    }

    const fromAccount = accounts.find(
      (item) => item.id === transaction.fromAccountId
    );
    const toAccount = accounts.find((item) => item.id === transaction.toAccountId);

    if (transaction.fromAccountId === accountId) {
      return `Transfer to ${toAccount?.name ?? 'Account'}`;
    }

    return `Transfer from ${fromAccount?.name ?? 'Account'}`;
  };

  const handleSaveAccountName = () => {
    const cleanedName = newAccountName.trim();

    if (!cleanedName) {
      Alert.alert('Enter an account name');
      return;
    }

    editAccountName(account.id, cleanedName);
    setIsEditingName(false);
    setNewAccountName('');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account?',
      `This will delete ${account.name}. This does not delete your envelopes.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => {
            deleteAccount(account.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {isEditingName ? (
        <View style={[styles.nameEditCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Edit Account Name</Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.soft,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            placeholder="Account name"
            placeholderTextColor={theme.subtext}
            value={newAccountName}
            onChangeText={setNewAccountName}
          />

          <TouchableOpacity
            style={[styles.greenButton, { backgroundColor: theme.button }]}
            onPress={handleSaveAccountName}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>Save Name</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cancelButton, { backgroundColor: theme.soft }]}
            onPress={() => {
              setIsEditingName(false);
              setNewAccountName('');
            }}
          >
            <Text style={[styles.cancelText, { color: theme.text }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={[styles.title, { color: theme.text }]}>🏦 {account.name}</Text>

          <TouchableOpacity
            style={[styles.editNameButton, { backgroundColor: theme.card }]}
            onPress={() => {
              setNewAccountName(account.name);
              setIsEditingName(true);
            }}
          >
            <Text style={[styles.editNameText, { color: theme.text }]}>Edit Name</Text>
          </TouchableOpacity>
        </>
      )}

      <View style={[styles.balanceCard, { backgroundColor: theme.button }]}>
        <Text style={[styles.label, { color: themeMode === 'dark' ? theme.text : '#111111' }]}>
          ACCOUNT BALANCE
        </Text>
        <Text style={[styles.balance, { color: themeMode === 'dark' ? theme.text : '#111111' }]}>
          {formatCurrency(account.balance, currency)}
        </Text>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>History</Text>

      {accountTransactions.length === 0 ? (
        <Text style={[styles.empty, { color: theme.subtext }]}>No account history yet.</Text>
      ) : (
        accountTransactions.map((transaction) => (
          <View
            key={transaction.id}
            style={[styles.transaction, { backgroundColor: theme.card }]}
          >
            <Text style={[styles.transactionText, { color: theme.text }]}>
              {getTransactionDescription(transaction)}
            </Text>
            <Text style={[styles.transactionAmount, { color: theme.text }]}>
              {getTransactionAmountPrefix(transaction)}
              {formatCurrency(transaction.amount, currency)}
            </Text>
          </View>
        ))
      )}

      <View style={[styles.settingsCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Account Settings</Text>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
          <Text style={styles.deleteText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 34, fontWeight: '900', marginTop: 60, marginBottom: 8 },
  editNameButton: {
    padding: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  editNameText: { fontWeight: '900', fontSize: 16 },
  nameEditCard: {
    borderRadius: 18,
    padding: 16,
    marginTop: 60,
    marginBottom: 16,
  },
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
  cancelButton: {
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelText: { fontWeight: '900', fontSize: 16 },
  buttonText: { fontWeight: '900', fontSize: 16 },
  balanceCard: {
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
  },
  label: { fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  balance: { fontSize: 42, fontWeight: '900', marginTop: 6 },
  sectionTitle: { fontSize: 26, fontWeight: '900', marginTop: 10, marginBottom: 12 },
  empty: { fontSize: 16, fontWeight: '700' },
  transaction: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  transactionText: { fontWeight: '800' },
  transactionAmount: { fontSize: 22, fontWeight: '900', marginTop: 6 },
  settingsCard: {
    borderRadius: 18,
    padding: 16,
    marginTop: 14,
    marginBottom: 40,
  },
  cardTitle: { fontSize: 20, fontWeight: '900', marginBottom: 12 },
  deleteButton: {
    backgroundColor: '#FFB3B3',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  deleteText: { fontWeight: '900', fontSize: 16, color: '#7A0000' },
});