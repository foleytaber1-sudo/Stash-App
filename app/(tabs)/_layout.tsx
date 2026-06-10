import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{ title: 'Home' }}
      />

      <Tabs.Screen
        name="accounts"
        options={{ title: 'Accounts' }}
      />

      <Tabs.Screen
        name="goals"
        options={{ title: 'Goals' }}
      />

      <Tabs.Screen
        name="activity"
        options={{ title: 'Activity' }}
      />

      <Tabs.Screen
        name="settings"
        options={{ title: 'Settings' }}
      />

      <Tabs.Screen
        name="explore"
        options={{ href: null }}
      />
    </Tabs>
  );
}