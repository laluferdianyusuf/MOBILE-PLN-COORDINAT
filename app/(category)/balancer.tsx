import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { BackButton } from "@/components/BackButton";
import { router } from "expo-router";
import { CustomInput } from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";

const balancer = () => {
  // function hitungWBP(IR: number, IS: number, IT: number) {
  //   return (IR * IS * IT) / 3;
  // }

  // function hitungLWBP(wbp: number) {
  //   return wbp * 0.667;
  // }

  // function hitungPersentaseSiang(bebanSiang: number) {
  //   return (bebanSiang * 100) / 66.7;
  // }

  // const IR = 10;
  // const IS = 12;
  // const IT = 11;
  // const bebanSiang = 40;

  // const wbp = hitungWBP(IR, IS, IT);
  // const lwbp = hitungLWBP(wbp);
  // const persentaseSiang = hitungPersentaseSiang(bebanSiang);

  // console.log(`WBP: ${wbp.toFixed(2)} W`);
  // console.log(`LWBP: ${lwbp.toFixed(2)} W`);
  // console.log(`Pengukuran Siang: ${persentaseSiang.toFixed(2)} %`);

  const [ir, setIr] = useState("");
  const [is, setIs] = useState("");
  const [it, setIt] = useState("");
  const [wbp, setWbp] = useState<number | null>(null);
  const [lwbp, setLwbp] = useState<number | null>(null);

  const hitungWBP = () => {
    const IR = parseFloat(ir) || 0;
    const IS = parseFloat(is) || 0;
    const IT = parseFloat(it) || 0;
    if (IR && IS && IT) {
      const WBP = (IR * IS * IT) / 3;
      const LWBP = WBP * 0.667;
      setWbp(WBP);
      setLwbp(LWBP);
    }
  };

  const handleSaveToDatabase = () => {};

  return (
    <ThemedView className={`flex-1`}>
      <View className="pt-16 pb-6 px-6 flex-1">
        <View className="flex-row items-center justify-between pb-4">
          <BackButton onBack={() => router.back()} />
          <Text className="font-helvetica-regular text-xl">
            Penyeimbang Beban Gardu
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
            <View className="mb-4 p-4 rounded-xl bg-red-100 border border-red-300">
              <Text className="text-red-900 font-bold text-lg mb-2">
                Rumus Penyeimbangan Beban Gardu:
              </Text>

              <Text className="text-base text-gray-700">
                Rumus WBP = (IR × IS × IT) / 3
              </Text>
              <Text className="text-base text-gray-700">
                Rumus LWBP = WBP × 66,7%
              </Text>
              <Text className="text-sm text-gray-500 italic mt-1">
                IR, IS, IT adalah hasil pengukuran arus pada masing-masing fasa
              </Text>
            </View>
            <CustomInput
              title="Masukkan IR"
              value={ir}
              onChange={(text) => setIr(text)}
              placeholder="Contoh: 10"
            />
            <CustomInput
              title="Masukkan IS"
              value={is}
              onChange={(text) => setIs(text)}
              placeholder="Contoh: 12"
            />
            <CustomInput
              title="Masukkan IT"
              value={it}
              onChange={(text) => setIt(text)}
              placeholder="Contoh: 11"
            />
            {wbp !== null && lwbp !== null && (
              <View className="bg-gray-200 p-4 rounded-lg border border-gray-400 my-6 space-y-2">
                <Text className="text-gray-800 text-lg font-bold mb-2">
                  Hasil Perhitungan:
                </Text>

                <Text className="text-gray-700 text-base">
                  WBP = {wbp.toFixed(2)} A
                </Text>

                <Text className="text-gray-700 text-base">
                  LWBP = {lwbp.toFixed(2)} A
                </Text>

                <Text className="text-gray-700 text-base">
                  Selisih = {(wbp - lwbp).toFixed(2)} A
                </Text>
              </View>
            )}
          </View>
          <View className="flex flex-row gap-3">
            <CustomButton
              onPress={hitungWBP}
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

export default balancer;
