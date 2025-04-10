import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { BackButton } from "@/components/BackButton";
import { router } from "expo-router";

const balancer = () => {
  function hitungWBP(IR: number, IS: number, IT: number) {
    return (IR * IS * IT) / 3;
  }

  function hitungLWBP(wbp: number) {
    return wbp * 0.667;
  }

  function hitungPersentaseSiang(bebanSiang: number) {
    return (bebanSiang * 100) / 66.7;
  }

  const IR = 10;
  const IS = 12;
  const IT = 11;
  const bebanSiang = 40;

  const wbp = hitungWBP(IR, IS, IT);
  const lwbp = hitungLWBP(wbp);
  const persentaseSiang = hitungPersentaseSiang(bebanSiang);

  console.log(`WBP: ${wbp.toFixed(2)} W`);
  console.log(`LWBP: ${lwbp.toFixed(2)} W`);
  console.log(`Pengukuran Siang: ${persentaseSiang.toFixed(2)} %`);

  return (
    <ThemedView className={`flex-1`}>
      <View className="pt-16 pb-10 px-6 flex-1">
        <View className="flex-row items-center justify-between pb-4">
          <BackButton onBack={() => router.back()} />
          <Text className="font-helvetica-regular text-xl">
            Penyeimbang Beban Gardu
          </Text>
          <View className="opacity-0" />
        </View>
      </View>
    </ThemedView>
  );
};

export default balancer;

const styles = StyleSheet.create({});
