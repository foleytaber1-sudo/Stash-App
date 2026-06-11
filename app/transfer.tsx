import { formatCurrency } from '@/constants/currency';
import { getTheme } from '@/constants/theme';
import { useStashStore } from '@/store/store';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function TransferScreen() {
  const accounts = useStashStore((state) => state.accounts);
  const transferBetweenAccounts = useStashStore(
    (state) => state.transferBetweenAccounts
  );
  const themeColor = useStashStore((state) => state.themeColor);
  const themeMode = useStashStore((state) => state.themeMode);
  const currency = useStashStore((state) => state.currency);

  const theme = getTheme(themeColor, themeMode);

  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');

  const handleSave = () => {
    const transferAmount = Number(amount);

    if (!fromAccount || !toAccount || transferAmount <= 0) return;
    if (fromAccount === toAccount) return;

    transferBetweenAccounts(fromAccount, toAccount, transferAmount, note);
    router.back();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Transfer Money</Text>

      <Text style={[styles.label, { color: theme.text }]}>Amount</Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.card,
            color: theme.text,
            borderColor: theme.border,
          },
        ]}
        placeholder="0.00"
        placeholderTextColor={theme.subtext}
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={[styles.label, { color: theme.text }]}>From Account</Text>

      {accounts.map((account) => (
        <TouchableOpacity
          key={account.id}
          style={[
            styles.accountButton,
            { backgroundColor: theme.card },
            fromAccount === account.id && { backgroundColor: theme.button },
          ]}
          onPress={() => setFromAccount(account.id)}
        >
          <View>
            <Text style={[styles.accountText, { color: theme.text }]}>
              {account.name}
            </Text>
            <Text style={[styles.accountBalance, { color: theme.subtext }]}>
              {formatCurrency(account.balance, currency)}
            </Text>
          </View>
        </TouchableOpacity>
      ))}

      <Text style={[styles.label, { color: theme.text }]}>To Account</Text>

      {accounts.map((account) => (
        <TouchableOpacity
          key={account.id}
          style={[
            styles.accountButton,
            { backgroundColor: theme.card },
            toAccount === account.id && { backgroundColor: theme.button },
          ]}
          onPress={() => setToAccount(account.id)}
        >
          <View>
            <Text style={[styles.accountText, { color: theme.text }]}>
              {account.name}
            </Text>
            <Text style={[styles.accountBalance, { color: theme.subtext }]}>
              {formatCurrency(account.balance, currency)}
            </Text>
          </View>
        </TouchableOpacity>
      ))}

      <Text style={[styles.label, { color: theme.text }]}>Note</Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.card,
            color: theme.text,
            borderColor: theme.border,
          },
        ]}
        placeholder="Example: Move to savings"
        placeholderTextColor={theme.subtext}
        value={note}
        onChangeText={setNote}
      />

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: theme.accent }]}
        onPress={handleSave}
      >
        <Text style={styles.saveText}>Transfer</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 34,
    fontWeight: '900',
    marginTop: 70,
    marginBottom: 30,
  },

  label: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
    marginTop: 8,
  },

  input: {
    borderRadius: 16,
    padding: 18,
    fontSize: 18,
    marginBottom: 25,
    borderWidth: 1,
  },

  accountButton: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },

  accountText: {
    fontSize: 18,
    fontWeight: '800',
  },

  accountBalance: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '700',
  },

  saveButton: {
    padding: 18,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 60,
  },

  saveText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
});