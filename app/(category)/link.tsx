import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { BackButton } from "@/components/BackButton";
import { router } from "expo-router";

const link = () => {
  function hitungFuseLinkGardu(dayaTrafo: number, teganganTM: number) {
    const hasil = dayaTrafo / (teganganTM * Math.sqrt(3));
    return hasil;
  }

  const daya = 100000;
  const tegangan = 20000;

  const arusFuse = hitungFuseLinkGardu(daya, tegangan);
  console.log(`Arus Fuse Link Gardu: ${arusFuse.toFixed(2)} A`);

  return (
    <ThemedView className={`flex-1`}>
      <View className="pt-16 pb-10 px-6 flex-1">
        <View className="flex-row items-center justify-between pb-4">
          <BackButton onBack={() => router.back()} />
          <Text className="font-helvetica-regular text-xl">Fuse Link</Text>
          <View className="opacity-0" />
        </View>
      </View>
    </ThemedView>
  );
};

export default link;

const styles = StyleSheet.create({});
