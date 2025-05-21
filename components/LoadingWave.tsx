import React from "react";
import { View, StyleSheet } from "react-native";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  Easing,
} from "react-native-reanimated";

export const LoadingWave = () => {
  const wave1 = useSharedValue(0);
  const wave2 = useSharedValue(0);
  const wave3 = useSharedValue(0);
  const wave4 = useSharedValue(0);

  React.useEffect(() => {
    wave1.value = withRepeat(
      withTiming(-10, {
        duration: 400,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
    wave2.value = withDelay(
      100,
      withRepeat(
        withTiming(-10, {
          duration: 400,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      )
    );
    wave3.value = withDelay(
      200,
      withRepeat(
        withTiming(-10, {
          duration: 400,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      )
    );
    wave4.value = withDelay(
      300,
      withRepeat(
        withTiming(-10, {
          duration: 400,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      )
    );
  }, []);

  const circleStyle1 = useAnimatedStyle(() => ({
    transform: [{ translateY: wave1.value }],
  }));

  const circleStyle2 = useAnimatedStyle(() => ({
    transform: [{ translateY: wave2.value }],
  }));

  const circleStyle3 = useAnimatedStyle(() => ({
    transform: [{ translateY: wave3.value }],
  }));
  const circleStyle4 = useAnimatedStyle(() => ({
    transform: [{ translateY: wave4.value }],
  }));

  return (
    <View className="flex-1 flex-row justify-center items-center bg-white/90">
      <Animated.View
        style={circleStyle1}
        className={"w-4 h-4 bg-custom-light-blue-2 rounded-full mx-2"}
      />
      <Animated.View
        style={circleStyle2}
        className={"w-4 h-4 bg-custom-light-blue-2 rounded-full mx-2"}
      />
      <Animated.View
        style={circleStyle3}
        className={"w-4 h-4 bg-custom-light-blue-2 rounded-full mx-2"}
      />
      <Animated.View
        style={circleStyle4}
        className={"w-4 h-4 bg-custom-light-blue-2 rounded-full mx-2"}
      />
    </View>
  );
};
