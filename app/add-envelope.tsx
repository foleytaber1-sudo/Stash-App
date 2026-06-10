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

const ICONS = [
  '💵',
  '🛒',
  '⛽',
  '🍔',
  '🏠',
  '🚗',
  '✈️',
  '🎄',
  '🐶',
  '🎮',
  '🎁',
  '❤️',
  '📱',
  '🛠️',
  '📚',
  '💍',
];

export default function AddEnvelopeScreen() {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('💵');

  const addEnvelope = useStashStore((state) => state.addEnvelope);

  const handleSave = () => {
    if (!name.trim()) return;

    addEnvelope(name.trim(), icon);
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add Envelope</Text>

      <Text style={styles.label}>Envelope Name</Text>

      <TextInput
        style={styles.input}
        placeholder="Rent, Groceries, Vacation..."
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Choose an Icon</Text>

      <View style={styles.iconGrid}>
        {ICONS.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.iconButton,
              icon === item && styles.selectedIcon,
            ]}
            onPress={() => setIcon(item)}
          >
            <Text style={styles.icon}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save Envelope</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.cancel}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
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
    marginBottom: 30,
  },

  label: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },

  input: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 16,
    marginBottom: 25,
    fontSize: 18,
  },

  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 30,
  },

  iconButton: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
  },

  selectedIcon: {
    backgroundColor: '#C8FF9B',
  },

  icon: {
    fontSize: 28,
  },

  saveButton: {
    backgroundColor: '#C8FF9B',
    padding: 20,
    borderRadius: 18,
    alignItems: 'center',
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