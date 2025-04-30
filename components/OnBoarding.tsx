import { Animated, FlatList, Text, View, ViewToken } from "react-native";
import type { FlatList as FlatListType } from "react-native";
import React, { useState, useRef } from "react";
import { slides } from "@/utils/category";
import OnBoardingItem from "./OnBoardingItem";
import Paginator from "./Paginator";
import { ThemedView } from "./ThemedView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NextButton from "./NextButton";
import PrevButton from "./PrevButton";

const OnBoarding: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatListType<any>>(null);

  const viewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      setCurrentIndex(viewableItems[0]?.index ?? 0);
    }
  ).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef!.current!.scrollToIndex({ index: currentIndex + 1 });
    } else {
      AsyncStorage.setItem("hasSeenStartScreen", "true");
      onComplete();
    }
  };

  const prevTo = () => {
    if (currentIndex > 0) {
      slidesRef!.current!.scrollToIndex({ index: currentIndex - 1 });
    }
  };

  return (
    <ThemedView className="flex-1">
      <View className="pt-16 pb-6 flex-1 gap-10 justify-center items-center">
        <View className="flex-row items-center justify-center pb-4">
          <Text className="font-artegra-bold text-xl">Ampere Pro</Text>
        </View>
        <View className="flex-1">
          <FlatList
            data={slides}
            renderItem={({ item }) => <OnBoardingItem item={item} />}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            bounces={false}
            keyExtractor={(item) => item.id}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              {
                useNativeDriver: false,
              }
            )}
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={viewConfig}
            scrollEventThrottle={32}
            ref={slidesRef}
          />
        </View>
        <Paginator data={slides} scrollX={scrollX} />
        <View className="flex-row justify-between w-full px-8 items-center gap-3">
          <PrevButton
            currentIndex={currentIndex}
            prevTo={prevTo}
            slidesLength={slides.length}
          />
          <NextButton
            slidesLength={slides.length}
            scrollTo={scrollTo}
            currentIndex={currentIndex}
          />
        </View>
      </View>
    </ThemedView>
  );
};

export default OnBoarding;
