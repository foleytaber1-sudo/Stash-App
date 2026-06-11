import { getTheme } from '@/constants/theme';
import { useStashStore } from '@/store/store';
import { Stack, router } from 'expo-router';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function HelpCenterScreen() {
  const themeColor = useStashStore((state) => state.themeColor);
  const themeMode = useStashStore((state) => state.themeMode);
  const theme = getTheme(themeColor, themeMode);

  const comingSoon = (feature: string) => {
    Alert.alert('Coming Soon', `${feature} will be added soon.`);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={() => router.push('/(tabs)/settings')}>
          <Text style={[styles.backText, { color: theme.accent }]}>‹ Settings</Text>
        </TouchableOpacity>

        <Text style={[styles.title, { color: theme.text }]}>Help Center</Text>

        <Text style={[styles.subtitle, { color: theme.subtext }]}>
          Get help using Stash, report issues, or send feedback.
        </Text>

        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Help</Text>

          <TouchableOpacity
            style={[styles.option, { borderTopColor: theme.border }]}
            onPress={() => router.push('/how-to')}
          >
            <Text style={[styles.optionText, { color: theme.text }]}>
              📘 How To Use Stash
            </Text>
            <Text style={[styles.arrow, { color: theme.subtext }]}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, { borderTopColor: theme.border }]}
            onPress={() => comingSoon('Budget tips')}
          >
            <Text style={[styles.optionText, { color: theme.text }]}>
              💡 Budget Tips
            </Text>
            <Text style={[styles.arrow, { color: theme.subtext }]}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Support</Text>

          <TouchableOpacity
            style={[styles.option, { borderTopColor: theme.border }]}
            onPress={() => router.push('/report-bug')}
          >
            <Text style={[styles.optionText, { color: theme.text }]}>
              🐛 Report a Bug
            </Text>
            <Text style={[styles.arrow, { color: theme.subtext }]}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, { borderTopColor: theme.border }]}
            onPress={() => comingSoon('Feature requests')}
          >
            <Text style={[styles.optionText, { color: theme.text }]}>
              ✨ Request a Feature
            </Text>
            <Text style={[styles.arrow, { color: theme.subtext }]}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, { borderTopColor: theme.border }]}
            onPress={() => comingSoon('Contact support')}
          >
            <Text style={[styles.optionText, { color: theme.text }]}>
              📩 Contact Support
            </Text>
            <Text style={[styles.arrow, { color: theme.subtext }]}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>FAQ</Text>

          <View style={[styles.faqItem, { borderTopColor: theme.border }]}>
            <Text style={[styles.faqQuestion, { color: theme.text }]}>
              What is virtual cash stuffing?
            </Text>
            <Text style={[styles.faqAnswer, { color: theme.subtext }]}>
              It is a digital version of putting money into envelopes for different
              spending categories.
            </Text>
          </View>

          <View style={[styles.faqItem, { borderTopColor: theme.border }]}>
            <Text style={[styles.faqQuestion, { color: theme.text }]}>
              Is my data stored online?
            </Text>
            <Text style={[styles.faqAnswer, { color: theme.subtext }]}>
              Right now, Stash stores your data locally on your device.
            </Text>
          </View>

          <View style={[styles.faqItem, { borderTopColor: theme.border }]}>
            <Text style={[styles.faqQuestion, { color: theme.text }]}>
              Can I delete a transaction?
            </Text>
            <Text style={[styles.faqAnswer, { color: theme.subtext }]}>
              Yes. Go to Activity, tap the menu button, then delete eligible
              transactions.
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  backText: {
    fontSize: 18,
    fontWeight: '900',
    marginTop: 55,
    marginBottom: 16,
  },

  title: {
    fontSize: 34,
    fontWeight: '900',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 20,
    lineHeight: 22,
  },

  card: {
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 8,
  },

  option: {
    paddingVertical: 15,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  optionText: {
    fontSize: 16,
    fontWeight: '800',
  },

  arrow: {
    fontSize: 26,
    fontWeight: '800',
  },

  faqItem: {
    borderTopWidth: 1,
    paddingVertical: 15,
  },

  faqQuestion: {
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 5,
  },

  faqAnswer: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 21,
  },
});