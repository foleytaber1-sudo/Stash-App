import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="(tabs)"
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
          name="modal"
          options={{
            presentation: 'modal',
            title: 'Modal',
          }}
        />
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}