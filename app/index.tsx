// import React, { useEffect, useState } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { router } from "expo-router";
// import { LoadingWave } from "@/components";
// import OnBoarding from "@/components/OnBoarding";
// import HomeScreen from "./screens/home";

// export default function App() {
//   const [showStartScreen, setShowStartScreen] = useState<boolean>(false);
//   const [showHomeScreen, setHomeScreen] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

//   useEffect(() => {
//     const checkIfFirstTime = async () => {
//       const hasSeenStartScreen = await AsyncStorage.getItem(
//         "hasSeenStartScreen"
//       );
//       setShowStartScreen(!hasSeenStartScreen);

//       const userToken = await AsyncStorage.getItem("token");
//       if (userToken) {
//         setIsLoggedIn(true);
//       }

//       setIsLoading(false);
//     };
//     checkIfFirstTime();
//   }, []);

//   useEffect(() => {
//     if (isLoggedIn) {
//       router.push("/(tabs)");
//     }
//   }, [isLoggedIn]);

//   if (isLoading) {
//     return <LoadingWave />;
//   }

//   if (showStartScreen) {
//     return (
//       <OnBoarding
//         onComplete={async () => {
//           await AsyncStorage.setItem("hasSeenStartScreen", "true");
//           setShowStartScreen(false);
//           setHomeScreen(true);
//         }}
//       />
//     );
//   }

//   if (showHomeScreen) {
//     return <HomeScreen />;
//   }

//   return <HomeScreen />;
// }
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { LoadingWave } from "@/components";
import OnBoarding from "@/components/OnBoarding";
import HomeScreen from "./screens/home";

type AppState = "loading" | "onboarding" | "auth" | "guest";

export default function App() {
  const [appState, setAppState] = useState<AppState>("loading");

  useEffect(() => {
    const initApp = async () => {
      try {
        const hasSeenStartScreen = await AsyncStorage.getItem(
          "hasSeenStartScreen"
        );
        const userToken = await AsyncStorage.getItem("token");

        if (!hasSeenStartScreen) {
          setAppState("onboarding");
        } else if (userToken) {
          setAppState("auth");
        } else {
          setAppState("guest");
        }
      } catch (error) {
        console.error("Init error:", error);
        setAppState("guest");
      }
    };

    initApp();
  }, []);

  useEffect(() => {
    if (appState === "auth") {
      router.replace("/(tabs)");
    }
  }, [appState]);

  if (appState === "loading") {
    return <LoadingWave />;
  }

  if (appState === "onboarding") {
    return (
      <OnBoarding
        onComplete={async () => {
          await AsyncStorage.setItem("hasSeenStartScreen", "true");
          setAppState("guest");
        }}
      />
    );
  }

  if (appState === "guest") {
    return <HomeScreen />;
  }

  return <LoadingWave />;
}
