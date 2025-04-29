import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { LoadingWave } from "@/components";
import OnBoarding from "@/components/OnBoarding";
import HomeScreen from "./screens/HomeScreen";

export default function App() {
  const [showStartScreen, setShowStartScreen] = useState<boolean>(false);
  const [showHomeScreen, setHomeScreen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const checkIfFirstTime = async () => {
      const hasSeenStartScreen = await AsyncStorage.getItem(
        "hasSeenStartScreen"
      );
      setShowStartScreen(!hasSeenStartScreen);

      const userToken = await AsyncStorage.getItem("token");
      if (userToken) {
        setIsLoggedIn(true);
      }

      setIsLoading(false);
    };
    checkIfFirstTime();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/(tabs)");
    }
  }, [isLoggedIn]);

  if (isLoading) {
    return <LoadingWave />;
  }

  if (showStartScreen) {
    return (
      <OnBoarding
        onComplete={async () => {
          await AsyncStorage.setItem("hasSeenStartScreen", "true");
          setShowStartScreen(false);
          setHomeScreen(true);
        }}
      />
    );
  }

  if (showHomeScreen) {
    return <HomeScreen />;
  }

  return <HomeScreen />;
}
