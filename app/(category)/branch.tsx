import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { BackButton } from "@/components/BackButton";
import { router } from "expo-router";

const branch = () => {
  function hitungFuseLinkPercabangan(
    jumlahDayaTrafo: number,
    teganganTM: number
  ) {
    const hasil = jumlahDayaTrafo / (teganganTM * Math.sqrt(3));
    return hasil;
  }

  const totalDaya = 200000;
  const tegangan = 20000;

  const arusFuse = hitungFuseLinkPercabangan(totalDaya, tegangan);
  console.log(`Arus Fuse Link Percabangan: ${arusFuse.toFixed(2)} A`);

  return (
    <ThemedView className={`flex-1`}>
      <View className="pt-16 pb-10 px-6 flex-1">
        <View className="flex-row items-center justify-between pb-4">
          <BackButton onBack={() => router.back()} />
          <Text className="font-helvetica-regular text-xl">
            Fuse Link Percabangan
          </Text>
          <View className="opacity-0" />
        </View>
      </View>
    </ThemedView>
  );
};

export default branch;

const styles = StyleSheet.create({});
