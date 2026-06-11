import { useStashStore } from '@/store/store';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

export default function AddIncomeScreen() {
  const accounts = useStashStore((state) => state.accounts);
  const addIncome = useStashStore((state) => state.addIncome);

  const [amount, setAmount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');

  const handleSave = () => {
    const incomeAmount = Number(amount);

    if (!selectedAccount || incomeAmount <= 0) return;

    addIncome(selectedAccount, incomeAmount);

    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add Income</Text>

      <Text style={styles.label}>Amount</Text>

      <TextInput
        style={styles.input}
        placeholder="0.00"
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>Choose Account</Text>

      {accounts.map((account) => (
        <TouchableOpacity
          key={account.id}
          style={[
            styles.accountButton,
            selectedAccount === account.id && styles.selectedAccount,
          ]}
          onPress={() => setSelectedAccount(account.id)}
        >
          <Text style={styles.accountText}>
            {account.name}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Add Income</Text>
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
    fontWeight: '700',
  },

  saveButton: {
    backgroundColor: '#111111',
    padding: 18,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 30,
  },

  saveText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
});