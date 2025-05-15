import { Pressable, Text, View } from "react-native";
import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { BackButton } from "@/components";
import { router } from "expo-router";
import * as Linking from "expo-linking";

const diagram = () => {
  const openDiagram = () => {
    Linking.openURL("https://bit.ly/SLD_ALAS");
  };

  return (
    <ThemedView className={`flex-1`}>
      <View className="pt-16 pb-6 px-6 flex-1">
        <View className="flex-row items-center justify-between pb-6">
          <BackButton onBack={() => router.back()} />
          <Text className="font-artegra-bold text-xl">Single Line Diagram</Text>
          <View className="opacity-0" />
        </View>
        <View className="gap-5 flex-1 justify-center">
          <Pressable onPress={openDiagram} className="">
            <Text className="text-custom-light-blue-2 underline text-center font-artegra font-bold">
              https://bit.ly/SLD_ALAS
            </Text>
          </Pressable>
          <View className="flex-row gap-3 items-center px-4">
            <View className="flex-1 h-[1px] bg-gray-300" />
            <Text className="text-gray-300 font-artegra-bold">atau</Text>
            <View className="flex-1 h-[1px] bg-gray-300" />
          </View>
          <Pressable
            onPress={openDiagram}
            className="bg-custom-light-blue-2 px-4 py-3 rounded-lg items-center"
          >
            <Text className="text-white font-bold text-center">
              Buka Diagram
            </Text>
          </Pressable>
        </View>
      </View>
    </ThemedView>
  );
};

export default diagram;
