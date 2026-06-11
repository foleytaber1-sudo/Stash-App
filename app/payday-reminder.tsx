import { getTheme } from '@/constants/theme';
import { useStashStore } from '@/store/store';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const weekdays = [
  { label: 'Sun', value: 0 },
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
];

const times = [
  { label: '8:00 AM', hour: 8, minute: 0 },
  { label: '9:00 AM', hour: 9, minute: 0 },
  { label: '12:00 PM', hour: 12, minute: 0 },
  { label: '5:00 PM', hour: 17, minute: 0 },
  { label: '6:00 PM', hour: 18, minute: 0 },
];

const getNextPaydayDates = (
  frequency: 'weekly' | 'biweekly' | 'monthly',
  dayOfWeek: number,
  dayOfMonth: number,
  hour: number,
  minute: number
) => {
  const dates: Date[] = [];
  const today = new Date();

  if (frequency === 'monthly') {
    for (let i = 0; i < 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() + i, dayOfMonth);
      date.setHours(hour, minute, 0, 0);

      if (date <= today) {
        date.setMonth(date.getMonth() + 1);
      }

      dates.push(date);
    }

    return dates;
  }

  const firstDate = new Date();
  firstDate.setHours(hour, minute, 0, 0);

  const daysUntilTarget = (dayOfWeek - firstDate.getDay() + 7) % 7;
  firstDate.setDate(firstDate.getDate() + daysUntilTarget);

  if (firstDate <= today) {
    firstDate.setDate(firstDate.getDate() + 7);
  }

  const intervalDays = frequency === 'weekly' ? 7 : 14;

  for (let i = 0; i < 12; i++) {
    const date = new Date(firstDate);
    date.setDate(firstDate.getDate() + i * intervalDays);
    dates.push(date);
  }

  return dates;
};

export default function PaydayReminderScreen() {
  const themeColor = useStashStore((state) => state.themeColor);
  const themeMode = useStashStore((state) => state.themeMode);
  const paydayReminder = useStashStore((state) => state.paydayReminder);
  const setPaydayReminder = useStashStore((state) => state.setPaydayReminder);

  const theme = getTheme(themeColor, themeMode);

  const [isSaving, setIsSaving] = useState(false);

  const scheduleReminders = async () => {
    setIsSaving(true);

    try {
      const permission = await Notifications.requestPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Notifications are off',
          'Turn on notifications to receive payday reminders.'
        );
        setPaydayReminder({ enabled: false, notificationIds: [] });
        return;
      }

      for (const id of paydayReminder.notificationIds) {
        await Notifications.cancelScheduledNotificationAsync(id);
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('payday-reminders', {
          name: 'Payday Reminders',
          importance: Notifications.AndroidImportance.HIGH,
          sound: 'default',
        });
      }

      if (!paydayReminder.enabled) {
        setPaydayReminder({ notificationIds: [] });
        Alert.alert('Reminder turned off');
        return;
      }

      const dates = getNextPaydayDates(
        paydayReminder.frequency,
        paydayReminder.dayOfWeek,
        paydayReminder.dayOfMonth,
        paydayReminder.hour,
        paydayReminder.minute
      );

      const ids: string[] = [];

      for (const date of dates) {
        const id = await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Payday reminder 💸',
            body: 'It’s payday! Add your income and stuff your envelopes.',
            sound: 'default',
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date,
            channelId: Platform.OS === 'android' ? 'payday-reminders' : undefined,
          },
        });

        ids.push(id);
      }

      setPaydayReminder({ notificationIds: ids });
      Alert.alert('Payday reminder saved');
    } catch {
      Alert.alert('Something went wrong', 'Could not schedule your payday reminder.');
    } finally {
      setIsSaving(false);
    }
  };

  const cancelReminders = async () => {
    for (const id of paydayReminder.notificationIds) {
      await Notifications.cancelScheduledNotificationAsync(id);
    }

    setPaydayReminder({
      enabled: false,
      notificationIds: [],
    });

    Alert.alert('Payday reminder turned off');
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: theme.card }]}
          onPress={() => router.push('/(tabs)/settings')}
        >
          <Text style={[styles.backButtonText, { color: theme.text }]}>‹</Text>
        </TouchableOpacity>

        <Text style={[styles.title, { color: theme.text }]}>Payday Reminder</Text>
      </View>

      <Text style={[styles.subtitle, { color: theme.subtext }]}>
        Get a reminder when it is time to add income and stuff your envelopes.
      </Text>

      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Reminder</Text>
            <Text style={[styles.cardText, { color: theme.subtext }]}>
              Turn on payday notifications.
            </Text>
          </View>

          <Switch
            value={paydayReminder.enabled}
            onValueChange={(value) => setPaydayReminder({ enabled: value })}
            trackColor={{ false: theme.border, true: theme.accent }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>How Often?</Text>

        <View style={styles.optionGrid}>
          {(['weekly', 'biweekly', 'monthly'] as const).map((frequency) => {
            const isSelected = paydayReminder.frequency === frequency;

            return (
              <TouchableOpacity
                key={frequency}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: isSelected ? theme.accent : theme.soft,
                  },
                ]}
                onPress={() => setPaydayReminder({ frequency })}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: isSelected ? '#111111' : theme.text },
                  ]}
                >
                  {frequency === 'weekly'
                    ? 'Weekly'
                    : frequency === 'biweekly'
                      ? 'Every 2 Weeks'
                      : 'Monthly'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {paydayReminder.frequency === 'monthly' ? (
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Day of Month</Text>

          <View style={styles.dayGrid}>
            {[1, 5, 10, 15, 20, 25, 28].map((day) => {
              const isSelected = paydayReminder.dayOfMonth === day;

              return (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayButton,
                    { backgroundColor: isSelected ? theme.accent : theme.soft },
                  ]}
                  onPress={() => setPaydayReminder({ dayOfMonth: day })}
                >
                  <Text
                    style={[
                      styles.dayText,
                      { color: isSelected ? '#111111' : theme.text },
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ) : (
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Payday</Text>

          <View style={styles.dayGrid}>
            {weekdays.map((day) => {
              const isSelected = paydayReminder.dayOfWeek === day.value;

              return (
                <TouchableOpacity
                  key={day.value}
                  style={[
                    styles.dayButton,
                    { backgroundColor: isSelected ? theme.accent : theme.soft },
                  ]}
                  onPress={() => setPaydayReminder({ dayOfWeek: day.value })}
                >
                  <Text
                    style={[
                      styles.dayText,
                      { color: isSelected ? '#111111' : theme.text },
                    ]}
                  >
                    {day.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Reminder Time</Text>

        <View style={styles.optionGrid}>
          {times.map((time) => {
            const isSelected =
              paydayReminder.hour === time.hour && paydayReminder.minute === time.minute;

            return (
              <TouchableOpacity
                key={time.label}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: isSelected ? theme.accent : theme.soft,
                  },
                ]}
                onPress={() =>
                  setPaydayReminder({ hour: time.hour, minute: time.minute })
                }
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: isSelected ? '#111111' : theme.text },
                  ]}
                >
                  {time.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: theme.button }]}
        onPress={scheduleReminders}
        disabled={isSaving}
      >
        <Text style={[styles.saveButtonText, { color: '#FFFFFF' }]}>
          {isSaving ? 'Saving...' : 'Save Payday Reminder'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={cancelReminders}>
        <Text style={styles.cancelButtonText}>Turn Reminder Off</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerRow: { marginTop: 55, flexDirection: 'row', alignItems: 'center' },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  backButtonText: { fontSize: 38, fontWeight: '700', marginTop: -4 },
  title: { flex: 1, fontSize: 31, fontWeight: '900' },
  subtitle: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 20,
    lineHeight: 22,
  },
  card: {
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
  },
  cardTitle: { fontSize: 21, fontWeight: '900', marginBottom: 8 },
  cardText: { fontSize: 15, fontWeight: '700', lineHeight: 22 },
  switchRow: { flexDirection: 'row', alignItems: 'center' },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionText: { fontSize: 14, fontWeight: '900' },
  dayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  dayButton: {
    width: 58,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: { fontSize: 15, fontWeight: '900' },
  saveButton: {
    borderRadius: 20,
    padding: 17,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: { fontSize: 17, fontWeight: '900' },
  cancelButton: {
    alignItems: 'center',
    padding: 18,
  },
  cancelButtonText: {
    color: '#FF6B6B',
    fontSize: 15,
    fontWeight: '900',
  },
});