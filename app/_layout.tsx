import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="insights"
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="how-to"
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="add-envelope"
            options={{
              title: 'Add Envelope',
              headerBackTitle: 'Home',
            }}
          />

          <Stack.Screen
            name="add-income"
            options={{
              title: 'Add Income',
              headerBackTitle: 'Home',
            }}
          />

          <Stack.Screen
            name="add-account"
            options={{
              title: 'Add Account',
              headerBackTitle: 'Accounts',
            }}
          />

          <Stack.Screen
            name="envelope/[id]"
            options={{
              title: 'Envelope',
              headerBackTitle: 'Home',
            }}
          />

          <Stack.Screen
            name="account/[id]"
            options={{
              title: 'Account',
              headerBackTitle: 'Accounts',
            }}
          />

          <Stack.Screen
            name="transfer"
            options={{
              title: 'Transfer',
              headerBackTitle: 'Home',
            }}
          />

          <Stack.Screen
            name="report-bug"
            options={{
              title: 'Report a Bug',
              headerBackTitle: 'Settings',
            }}
          />

          <Stack.Screen
            name="modal"
            options={{
              presentation: 'modal',
              title: 'Modal',
            }}
          />
        </Stack>

        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}