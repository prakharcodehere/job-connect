import React, { useEffect } from "react";
import { ImageBackground, StyleSheet, StatusBar } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import { useColorScheme } from "@/hooks/useColorScheme";

// Import your image
import BackgroundImage from "../assets/images/Background_Abstract.jpg";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "light" ? DarkTheme : DefaultTheme}>
      <ImageBackground source={BackgroundImage} style={styles.background}>
        <StatusBar
          barStyle={colorScheme === "light" ? "dark-content" : "light-content"}
          backgroundColor="tomato"
          translucent
        />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false,
          
           }} />
          <Stack.Screen
            name="jobDetails"
            options={{ 
              headerShown: true,
              title: 'Job Details', 
              headerStyle: {
                backgroundColor: colorScheme === 'light' ? 'gray' : 'tomato', 
              },
              headerTintColor: colorScheme === 'light' ? '#000000' : '#ffffff', 
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ImageBackground>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
});
