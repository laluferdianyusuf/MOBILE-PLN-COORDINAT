import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { BackButton } from "@/components/BackButton";
import { router } from "expo-router";

const mcb = () => {
  function hitungMCB1Phase(daya: number, tegangan: number) {
    return daya / tegangan;
  }

  function hitungMCB3Phase(daya: number, tegangan: number) {
    return daya / (tegangan * Math.sqrt(3));
  }

  const daya = 2200;
  const tegangan1Ph = 220;
  const tegangan3Ph = 380;

  const arus1Phase = hitungMCB1Phase(daya, tegangan1Ph);
  const arus3Phase = hitungMCB3Phase(daya, tegangan3Ph);

  console.log(`MCB 1 Phase: ${arus1Phase.toFixed(2)} A`);
  console.log(`MCB 3 Phase: ${arus3Phase.toFixed(2)} A`);

  return (
    <ThemedView className={`flex-1`}>
      <View className="pt-16 pb-10 px-6 flex-1">
        <View className="flex-row items-center justify-between pb-4">
          <BackButton onBack={() => router.back()} />
          <Text className="font-helvetica-regular text-xl">
            Perhitungan MCB
          </Text>
          <View className="opacity-0" />
        </View>
      </View>
    </ThemedView>
  );
};

export default mcb;

const styles = StyleSheet.create({});
