import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import "../global.css";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { CopilotProvider } from "react-native-copilot";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Josefin: require("../assets/fonts/JosefinSans-Regular.ttf"),
    JosefinBold: require("../assets/fonts/JosefinSans-Bold.ttf"),
    Helvetica: require("../assets/fonts/helvetica-now.ttf"),
    HelveticaBold: require("../assets/fonts/helvetica-now-bold.ttf"),
    Inter: require("../assets/fonts/Inter-Regular.ttf"),
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
    <Provider store={store}>
      <ThemeProvider
        value={colorScheme === "dark" ? DefaultTheme : DefaultTheme}
      >
        <CopilotProvider tooltipStyle={{}} arrowColor="red" arrowSize={0}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="dark" />
        </CopilotProvider>
      </ThemeProvider>
    </Provider>
  );
}
