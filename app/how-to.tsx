import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HowToScreen() {
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>‹ Settings</Text>
      </TouchableOpacity>

      <Text style={styles.title}>How To Use Stash</Text>
      <Text style={styles.subtitle}>
        Stash is a virtual cash stuffing app that helps you plan your money before you spend it.
      </Text>

      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>THE MAIN IDEA</Text>
        <Text style={styles.heroTitle}>Give every dollar a job.</Text>
        <Text style={styles.heroText}>
          Add your money, split it into envelopes, then spend from those envelopes so you always know what your money is meant for.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>How Stash Works</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>1. Add your accounts</Text>
        <Text style={styles.cardText}>
          Accounts are where your money lives, like checking, savings, or cash.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>2. Add income</Text>
        <Text style={styles.cardText}>
          When you get paid, add that income to the account where the money was deposited.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>3. Create envelopes</Text>
        <Text style={styles.cardText}>
          Envelopes are your budget categories, like groceries, gas, rent, bills, fun money, savings, or debt payoff.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>4. Stuff your envelopes</Text>
        <Text style={styles.cardText}>
          Stuffing means assigning available money to an envelope. This tells Stash what that money is for.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>5. Track spending</Text>
        <Text style={styles.cardText}>
          When you spend money, choose the envelope it came from. Stash updates your balance and saves the transaction.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Simple Example</Text>

      <View style={styles.exampleCard}>
        <Text style={styles.exampleTitle}>You get paid $500</Text>

        <View style={styles.exampleRow}>
          <Text style={styles.exampleLabel}>Groceries</Text>
          <Text style={styles.exampleAmount}>$150</Text>
        </View>

        <View style={styles.exampleRow}>
          <Text style={styles.exampleLabel}>Gas</Text>
          <Text style={styles.exampleAmount}>$75</Text>
        </View>

        <View style={styles.exampleRow}>
          <Text style={styles.exampleLabel}>Bills</Text>
          <Text style={styles.exampleAmount}>$200</Text>
        </View>

        <View style={styles.exampleRow}>
          <Text style={styles.exampleLabel}>Fun Money</Text>
          <Text style={styles.exampleAmount}>$75</Text>
        </View>

        <Text style={styles.exampleText}>
          Now every dollar has a purpose before you spend it.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Helpful Tips</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Start simple</Text>
        <Text style={styles.cardText}>
          You do not need twenty envelopes right away. Start with your main categories and add more later.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Check Activity often</Text>
        <Text style={styles.cardText}>
          Activity shows your money in, money out, transfers, stuffing, and spending history.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Use goals for savings</Text>
        <Text style={styles.cardText}>
          Add goals to envelopes when you are saving for something specific, like a trip, emergency fund, or big purchase.
        </Text>
      </View>

      <View style={styles.tipCard}>
        <Text style={styles.tipTitle}>Quick Start</Text>
        <Text style={styles.tipText}>
          Add Account → Add Income → Create Envelopes → Stuff Money → Track Spending
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FFF4',
    padding: 20,
  },

  backButton: {
    marginTop: 60,
    marginBottom: 10,
  },

  backText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111111',
  },

  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#111111',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#555555',
    marginBottom: 18,
    lineHeight: 24,
  },

  heroCard: {
    backgroundColor: '#C8FF9B',
    borderRadius: 26,
    padding: 22,
    marginBottom: 24,
  },

  heroLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: 0.5,
    marginBottom: 8,
  },

  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#111111',
    marginBottom: 8,
  },

  heroText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
    lineHeight: 24,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111111',
    marginBottom: 12,
    marginTop: 4,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
  },

  cardTitle: {
    fontSize: 19,
    fontWeight: '900',
    marginBottom: 8,
    color: '#111111',
  },

  cardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444444',
    lineHeight: 24,
  },

  exampleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    marginBottom: 22,
  },

  exampleTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111111',
    marginBottom: 14,
  },

  exampleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingVertical: 10,
  },

  exampleLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#444444',
  },

  exampleAmount: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111111',
  },

  exampleText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#666666',
    lineHeight: 22,
    marginTop: 14,
  },

  tipCard: {
    backgroundColor: '#111111',
    borderRadius: 22,
    padding: 20,
    marginTop: 6,
    marginBottom: 40,
  },

  tipTitle: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 8,
    color: '#FFFFFF',
  },

  tipText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#C8FF9B',
    lineHeight: 26,
  },
});