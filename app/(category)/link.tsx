import { ScrollView, Text, View } from "react-native";
import React, { useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { BackButton } from "@/components/BackButton";
import { router } from "expo-router";
import { CustomInput } from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";

const link = () => {
  const [power, setPower] = useState<number>(0);
  const [voltage, setVoltage] = useState<number>(0);
  const [result, setResult] = useState<number | null>(null);
  function hitungFuseLinkGardu(dayaTrafo: number, teganganTM: number) {
    const hasil = dayaTrafo / (teganganTM * Math.sqrt(3));
    return hasil;
  }

  const daya = 100000;
  const tegangan = 20000;

  const arusFuse = hitungFuseLinkGardu(daya, tegangan);
  console.log(`Arus Fuse Link Gardu: ${arusFuse.toFixed(2)} A`);

  const handleFuseLink = () => {
    const fuseLinkResult = power / (voltage * Math.sqrt(3));
    setResult(fuseLinkResult);
  };

  const handleSaveToDatabase = () => {};

  return (
    <ThemedView className={`flex-1`}>
      <View className="pt-16 pb-6 px-6 flex-1">
        <View className="flex-row items-center justify-between pb-4">
          <BackButton onBack={() => router.back()} />
          <Text className="font-helvetica-regular text-xl">
            Perhitungan Fuse Link
          </Text>
          <View className="opacity-0" />
        </View>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerClassName="justify-center"
        >
          <View className="flex-1">
            <View className="mb-4 p-4 bg-gray-100 rounded-lg border border-gray-300">
              <Text className="text-base text-gray-800 font-semibold mb-2">
                Rumus Fuse Link Gardu:
              </Text>
              <Text className="text-base text-gray-700">I = P / (√3 × V)</Text>
              <Text className="text-sm text-gray-500 italic mt-1">
                I = Arus, P = Daya (Watt), V = Tegangan (Volt)
              </Text>
            </View>

            <CustomInput
              value=""
              style=""
              placeholder="Masukan Daya"
              title="Masukan Daya"
            />
            <CustomInput
              value=""
              style=""
              placeholder="Masukan Tegangan"
              title="Masukan Tegangan"
            />
            {result !== null && (
              <View className="bg-gray-200 p-4 rounded-lg border border-gray-400 my-6 space-y-2">
                <Text className="text-xl font-bold text-gray-800 mb-2">
                  Hasil Fuse Link Gardu
                </Text>
                <Text className="text-gray-800 text-lg font-bold mb-2">
                  {result.toFixed(2)} A
                </Text>
                <Text className="text-sm text-gray-500 mt-1 italic">
                  Ini adalah arus fuse link berdasarkan daya & tegangan yang
                  Anda masukkan.
                </Text>
              </View>
            )}
          </View>

          <View className="flex flex-row gap-3">
            <CustomButton
              onPress={handleFuseLink}
              text="Hitung"
              className="flex-1"
            />
            <CustomButton
              onPress={handleSaveToDatabase}
              text="Simpan"
              className="flex-1"
            />
          </View>
        </ScrollView>
      </View>
    </ThemedView>
  );
};

export default link;
