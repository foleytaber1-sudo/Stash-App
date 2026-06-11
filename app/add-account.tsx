import { useStashStore } from '@/store/store';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const cardColors = [
  '#D9A400',
  '#A98BE6',
  '#83BE78',
  '#D78B57',
  '#6F9DE8',
  '#E66D8C',
];

const accountIcons = [
  'card',
  'cash',
  'phone-portrait',
  'wallet',
  'trending-up',
  'business',
];

export default function AddAccountScreen() {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [cardColor, setCardColor] = useState('#D9A400');
  const [icon, setIcon] = useState('card');

  const addAccount = useStashStore((state) => state.addAccount);

  const handleSave = () => {
    if (!name) return;

    Keyboard.dismiss();
    addAccount(name, Number(balance) || 0, cardColor, icon);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Add Account</Text>

          <Text style={styles.label}>Account Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Checking, Venmo, Cash..."
            value={name}
            onChangeText={setName}
            returnKeyType="next"
          />

          <Text style={styles.label}>Starting Balance</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            keyboardType="decimal-pad"
            value={balance}
            onChangeText={setBalance}
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
          />

          <Text style={styles.label}>Account Icon</Text>

          <View style={styles.iconRow}>
            {accountIcons.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.iconButton,
                  icon === item && styles.selectedIcon,
                ]}
                onPress={() => setIcon(item)}
              >
                <Ionicons name={item as any} size={25} color="#222222" />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Card Color</Text>

          <View style={styles.colorRow}>
            {cardColors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color },
                  cardColor === color && styles.selectedColor,
                ]}
                onPress={() => setCardColor(color)}
              />
            ))}
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveText}>Save Account</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: '#F8FFF4',
  },

  container: {
    flex: 1,
    backgroundColor: '#F8FFF4',
  },

  content: {
    padding: 20,
    paddingTop: 80,
    paddingBottom: 50,
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

  iconRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 30,
  },

  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectedIcon: {
    borderWidth: 4,
    borderColor: '#000',
  },

  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 30,
  },

  colorCircle: {
    width: 46,
    height: 46,
    borderRadius: 999,
  },

  selectedColor: {
    borderWidth: 4,
    borderColor: '#000',
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