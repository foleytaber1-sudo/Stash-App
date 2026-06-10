import { useStashStore } from '@/store/store';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function AddAccountScreen() {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');

  const addAccount = useStashStore((state) => state.addAccount);

  const handleSave = () => {
    if (!name) return;

    addAccount(name, Number(balance) || 0);

    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Account</Text>

      <Text style={styles.label}>Account Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Checking, Venmo, Cash..."
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Starting Balance</Text>
      <TextInput
        style={styles.input}
        placeholder="0.00"
        keyboardType="numeric"
        value={balance}
        onChangeText={setBalance}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save Account</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.cancel}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FFF4',
    padding: 20,
    paddingTop: 80,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    marginBottom: 40,
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 16,
    marginBottom: 25,
    fontSize: 18,
  },
  saveButton: {
    backgroundColor: '#C8FF9B',
    padding: 20,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 10,
  },
  saveText: {
    fontSize: 22,
    fontWeight: '800',
  },
  cancel: {
    textAlign: 'center',
    marginTop: 25,
    fontSize: 20,
    fontWeight: '600',
  },
});