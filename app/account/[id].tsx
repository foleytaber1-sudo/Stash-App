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
      <View style={styles.container}>
        <Text style={styles.title}>Account not found</Text>
      </View>
    );
  }

  const getTransactionAmountPrefix = (transaction: (typeof transactions)[number]) => {
    if (transaction.type === 'spend') return '-';
    if (transaction.type === 'transfer' && transaction.fromAccountId === accountId) return '-';
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
    <ScrollView style={styles.container}>
      {isEditingName ? (
        <View style={styles.nameEditCard}>
          <Text style={styles.cardTitle}>Edit Account Name</Text>

          <TextInput
            style={styles.input}
            placeholder="Account name"
            value={newAccountName}
            onChangeText={setNewAccountName}
          />

          <TouchableOpacity style={styles.greenButton} onPress={handleSaveAccountName}>
            <Text style={styles.buttonText}>Save Name</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setIsEditingName(false);
              setNewAccountName('');
            }}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.title}>🏦 {account.name}</Text>

          <TouchableOpacity
            style={styles.editNameButton}
            onPress={() => {
              setNewAccountName(account.name);
              setIsEditingName(true);
            }}
          >
            <Text style={styles.editNameText}>Edit Name</Text>
          </TouchableOpacity>
        </>
      )}

      <View style={styles.balanceCard}>
        <Text style={styles.label}>ACCOUNT BALANCE</Text>
        <Text style={styles.balance}>${account.balance.toFixed(2)}</Text>
      </View>

      <Text style={styles.sectionTitle}>History</Text>

      {accountTransactions.length === 0 ? (
        <Text style={styles.empty}>No account history yet.</Text>
      ) : (
        accountTransactions.map((transaction) => (
          <View key={transaction.id} style={styles.transaction}>
            <Text style={styles.transactionText}>
              {getTransactionDescription(transaction)}
            </Text>
            <Text style={styles.transactionAmount}>
              {getTransactionAmountPrefix(transaction)}
              ${transaction.amount.toFixed(2)}
            </Text>
          </View>
        ))
      )}

      <View style={styles.settingsCard}>
        <Text style={styles.cardTitle}>Account Settings</Text>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
          <Text style={styles.deleteText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FFF4', padding: 20 },
  title: { fontSize: 34, fontWeight: '900', marginTop: 60, marginBottom: 8 },
  editNameButton: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  editNameText: { fontWeight: '900', fontSize: 16 },
  nameEditCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginTop: 60,
    marginBottom: 16,
  },
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
  cancelButton: {
    backgroundColor: '#F5F5F5',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelText: { fontWeight: '900', fontSize: 16 },
  buttonText: { fontWeight: '900', fontSize: 16 },
  balanceCard: {
    backgroundColor: '#C8FF9B',
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
  },
  label: { fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  balance: { fontSize: 42, fontWeight: '900', marginTop: 6 },
  sectionTitle: { fontSize: 26, fontWeight: '900', marginTop: 10, marginBottom: 12 },
  empty: { fontSize: 16, fontWeight: '700', color: '#666' },
  transaction: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  transactionText: { fontWeight: '800' },
  transactionAmount: { fontSize: 22, fontWeight: '900', marginTop: 6 },
  settingsCard: {
    backgroundColor: '#FFFFFF',
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
  deleteText: { fontWeight: '900', fontSize: 16 },
});