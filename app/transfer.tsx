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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Transfer Money</Text>

      <Text style={styles.label}>Amount</Text>

      <TextInput
        style={styles.input}
        placeholder="0.00"
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>From Account</Text>

      {accounts.map((account) => (
        <TouchableOpacity
          key={account.id}
          style={[
            styles.accountButton,
            fromAccount === account.id && styles.selectedAccount,
          ]}
          onPress={() => setFromAccount(account.id)}
        >
          <View>
            <Text style={styles.accountText}>{account.name}</Text>
            <Text style={styles.accountBalance}>
              ${account.balance.toFixed(2)}
            </Text>
          </View>
        </TouchableOpacity>
      ))}

      <Text style={styles.label}>To Account</Text>

      {accounts.map((account) => (
        <TouchableOpacity
          key={account.id}
          style={[
            styles.accountButton,
            toAccount === account.id && styles.selectedAccount,
          ]}
          onPress={() => setToAccount(account.id)}
        >
          <View>
            <Text style={styles.accountText}>{account.name}</Text>
            <Text style={styles.accountBalance}>
              ${account.balance.toFixed(2)}
            </Text>
          </View>
        </TouchableOpacity>
      ))}

      <Text style={styles.label}>Note</Text>

      <TextInput
        style={styles.input}
        placeholder="Example: Move to savings"
        value={note}
        onChangeText={setNote}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Transfer</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FFF4',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    fontSize: 18,
    marginBottom: 25,
  },

  accountButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },

  selectedAccount: {
    backgroundColor: '#C8FF9B',
  },

  accountText: {
    fontSize: 18,
    fontWeight: '800',
  },

  accountBalance: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '700',
    color: '#666',
  },

  saveButton: {
    backgroundColor: '#111111',
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