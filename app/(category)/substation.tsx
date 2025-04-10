import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { BackButton } from "@/components/BackButton";
import { router } from "expo-router";

const substation = () => {
  function hitungNHFuseGardu(
    dayaTrafo: number,
    teganganTR: number,
    jumlahJurusan: number
  ) {
    const In = dayaTrafo / (teganganTR * Math.sqrt(3));
    const arusTiapJurusan = In / jumlahJurusan;
    const NHFuse = arusTiapJurusan * 0.9;

    return {
      arusTotal: In,
      arusTiapJurusan,
      NHFuse,
    };
  }

  const daya = 160000;
  const tegangan = 400;
  const jurusan = 3;

  const hasil = hitungNHFuseGardu(daya, tegangan, jurusan);
  console.log(`Arus Total: ${hasil.arusTotal.toFixed(2)} A`);
  console.log(`Arus Tiap Jurusan: ${hasil.arusTiapJurusan.toFixed(2)} A`);
  console.log(`NH Fuse (90%): ${hasil.NHFuse.toFixed(2)} A`);

  return (
    <ThemedView className={`flex-1`}>
      <View className="pt-16 pb-10 px-6 flex-1">
        <View className="flex-row items-center justify-between pb-4">
          <BackButton onBack={() => router.back()} />
          <Text className="font-helvetica-regular text-xl">NH Fuse Gardu</Text>
          <View className="opacity-0" />
        </View>
      </View>
    </ThemedView>
  );
};

export default substation;

const styles = StyleSheet.create({});
