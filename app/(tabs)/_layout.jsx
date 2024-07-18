import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'index') {
            iconName = focused ? 'briefcase' : 'briefcase-outline';
          } else if (route.name === 'bookmark') {
            iconName = focused ? 'bookmark' : 'bookmark-outline';
          }

          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 80, 
          paddingBottom: 20,
        },
        tabBarLabelStyle: {
          fontSize: 14,
        },
        tabBarIconStyle: {
          marginBottom: -10, 
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Jobs',
        }}
      />
      <Tabs.Screen
        name="bookmark"
        options={{
          title: 'Bookmarks',
        }}
      />
    </Tabs>
  );
}
