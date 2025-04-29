import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { BackButton } from "@/components";
import { router } from "expo-router";
import EmptyItem from "@/components/EmptyItem";

const table = () => {
  return (
    <ThemedView className={`flex-1`}>
      <View className="pt-16 pb-6 px-6 flex-1">
        <View className="flex-row items-center justify-between pb-6">
          <BackButton onBack={() => router.back()} />
          <Text className="font-artegra-medium text-xl">Penjelasan</Text>
        </View>
        <EmptyItem
          text="Belum ada penjelasan"
          desc="Silahkan hubungi supervisor untuk membuat penjelasan"
        />
      </View>
    </ThemedView>
  );
};

export default table;
