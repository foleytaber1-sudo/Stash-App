import { CurrencyCode, currencies } from '@/constants/currency';
import { getTheme } from '@/constants/theme';
import { useStashStore } from '@/store/store';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function OnboardingScreen() {
  const addAccount = useStashStore((state) => state.addAccount);
  const addEnvelope = useStashStore((state) => state.addEnvelope);
  const setCurrency = useStashStore((state) => state.setCurrency);
  const themeColor = useStashStore((state) => state.themeColor);
  const themeMode = useStashStore((state) => state.themeMode);

  const theme = getTheme(themeColor, themeMode);

  const [step, setStep] = useState(1);
  const [selectedCurrency, setSelectedCurrency] =
    useState<CurrencyCode>('USD');
  const [accountName, setAccountName] = useState('Checking');
  const [accountBalance, setAccountBalance] = useState('');
  const [envelopeName, setEnvelopeName] = useState('Groceries');

  const handleFinish = () => {
    const balance = Number(accountBalance);

    if (!accountName.trim()) {
      Alert.alert('Add an account name');
      return;
    }

    if (!balance || balance <= 0) {
      Alert.alert('Add your starting account balance');
      return;
    }

    if (!envelopeName.trim()) {
      Alert.alert('Add an envelope name');
      return;
    }

    setCurrency(selectedCurrency);
    addAccount(accountName.trim(), balance);
    addEnvelope(envelopeName.trim());

    router.replace('/(tabs)');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.logo, { color: theme.text }]}>💸 Stash</Text>

      {step === 1 && (
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.title, { color: theme.text }]}>Welcome to Stash</Text>
          <Text style={[styles.text, { color: theme.subtext }]}>
            Stash helps you budget using digital cash stuffing. Add money, stuff
            envelopes, and spend from the right category.
          </Text>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.button }]}
            onPress={() => setStep(2)}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>Get Started</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 2 && (
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.title, { color: theme.text }]}>Choose Currency</Text>

          {currencies.map((item) => (
            <TouchableOpacity
              key={item.code}
              style={[
                styles.option,
                { backgroundColor: theme.soft },
                selectedCurrency === item.code && {
                  backgroundColor: theme.button,
                },
              ]}
              onPress={() => setSelectedCurrency(item.code)}
            >
              <Text style={[styles.optionText, { color: theme.text }]}>
                {item.symbol} {item.code} — {item.name}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.button }]}
            onPress={() => setStep(3)}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>Next</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 3 && (
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.title, { color: theme.text }]}>Add First Account</Text>
          <Text style={[styles.text, { color: theme.subtext }]}>
            This is where your money starts before you stuff it into envelopes.
          </Text>

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
            value={accountName}
            onChangeText={setAccountName}
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
            placeholder="Starting balance"
            placeholderTextColor={theme.subtext}
            keyboardType="decimal-pad"
            value={accountBalance}
            onChangeText={setAccountBalance}
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.button }]}
            onPress={() => setStep(4)}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>Next</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 4 && (
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.title, { color: theme.text }]}>Add First Envelope</Text>
          <Text style={[styles.text, { color: theme.subtext }]}>
            Envelopes are your spending categories.
          </Text>

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
            value={envelopeName}
            onChangeText={setEnvelopeName}
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.button }]}
            onPress={() => setStep(5)}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>Next</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 5 && (
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.title, { color: theme.text }]}>How It Works</Text>

          <Text style={[styles.howTo, { color: theme.text }]}>
            1. Add income to an account.
          </Text>
          <Text style={[styles.howTo, { color: theme.text }]}>
            2. Stuff money into envelopes.
          </Text>
          <Text style={[styles.howTo, { color: theme.text }]}>
            3. Spend from envelopes when you buy things.
          </Text>
          <Text style={[styles.howTo, { color: theme.text }]}>
            4. Track your goals and progress.
          </Text>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.button }]}
            onPress={handleFinish}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>Finish Setup</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
  },

  logo: {
    fontSize: 38,
    fontWeight: '900',
    marginTop: 70,
    marginBottom: 24,
  },

  card: {
    borderRadius: 24,
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: '900',
    marginBottom: 12,
  },

  text: {
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 24,
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 15,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },

  option: {
    padding: 15,
    borderRadius: 16,
    marginBottom: 10,
  },

  optionText: {
    fontSize: 16,
    fontWeight: '900',
  },

  howTo: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 12,
  },

  button: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 12,
  },

  buttonText: {
    fontSize: 17,
    fontWeight: '900',
  },
});