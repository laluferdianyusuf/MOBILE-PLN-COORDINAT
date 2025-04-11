import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { BackButton } from "@/components/BackButton";
import { router } from "expo-router";
import { CustomInput } from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";

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

  const [power1, setPower1] = useState("");
  const [voltage1, setVoltage1] = useState("");
  const [result1, setResult1] = useState<number | null>(null);

  const [power3, setPower3] = useState("");
  const [voltage3, setVoltage3] = useState("");
  const [result3, setResult3] = useState<number | null>(null);

  const calculateMCB1 = () => {
    const P = parseFloat(power1);
    const V = parseFloat(voltage1);
    if (P && V) {
      const I = P / V;
      setResult1(I);
    }
  };

  const calculateMCB3 = () => {
    const P = parseFloat(power3);
    const V = parseFloat(voltage3);
    if (P && V) {
      const I = P / (V * Math.sqrt(3));
      setResult3(I);
    }
  };

  const handleSaveToDatabase = () => {};

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
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerClassName="justify-center"
        >
          <View className="flex-1">
            <View className="mb-4 p-4 rounded-xl bg-purple-100">
              <Text className="text-purple-900 font-bold text-lg mb-2">
                MCB 1 Phase
              </Text>
              <Text className="text-base text-gray-700">Rumus: I = P / V</Text>
              <Text className="text-sm text-gray-500 italic mt-1">
                I = Arus (A), P = Daya (Watt), V = Tegangan (Volt)
              </Text>
            </View>
            <CustomInput
              title="Masukkan Daya (Watt)"
              value={power1}
              onChange={setPower1}
              placeholder="Contoh: 1300"
            />
            <CustomInput
              title="Masukkan Tegangan (Volt)"
              value={voltage1}
              onChange={setVoltage1}
              placeholder="Contoh: 220"
            />

            {result1 !== null && (
              <View className="bg-gray-200 p-4 rounded-lg border border-gray-400 my-6 space-y-2">
                <Text className="text-gray-800 text-lg font-bold mb-2">
                  Hasil MCB 1 Phase:
                </Text>
                <Text className="text-gray-700 text-base">
                  Arus = {result1.toFixed(2)} A {"\n"}
                  Saran MCB = {Math.ceil(result1)} A
                </Text>
                <Text className="text-sm text-gray-500 mt-1 italic">
                  Ini adalah hasil perhitungan MCB 1 Phase berdasarkan daya &
                  tegangan yang Anda masukkan.
                </Text>
              </View>
            )}

            <View className="mb-4 mt-3 p-4 rounded-xl bg-purple-100">
              <Text className="text-purple-900 font-bold text-lg mb-2">
                MCB 3 Phase
              </Text>
              <Text className="text-base text-gray-700">
                Rumus: I = P / (√3 × V)
              </Text>
              <Text className="text-sm text-gray-500 italic mt-1">
                I = Arus (A), P = Daya (Watt), V = Tegangan (Volt)
              </Text>
            </View>
            <CustomInput
              title="Masukkan Daya (Watt)"
              value={power3}
              onChange={setPower3}
              placeholder="Contoh: 6600"
            />
            <CustomInput
              title="Masukkan Tegangan (Volt)"
              value={voltage3}
              onChange={setVoltage3}
              placeholder="Contoh: 400"
            />
            {result3 !== null && (
              <View className="bg-gray-200 p-4 rounded-lg border border-gray-400 my-6 space-y-2">
                <Text className="text-gray-800 text-lg font-bold mb-2">
                  Hasil MCB 3 Phase:
                </Text>
                <Text className="text-gray-700 text-base">
                  Arus = {result3.toFixed(2)} A {"\n"}
                  Saran MCB = {Math.ceil(result3)} A
                </Text>
                <Text className="text-sm text-gray-500 mt-1 italic">
                  Ini adalah hasil perhitungan MCB 3 Phase berdasarkan daya &
                  tegangan yang Anda masukkan.
                </Text>
              </View>
            )}
          </View>
          <View className="flex flex-row gap-3">
            <CustomButton
              onPress={calculateMCB1}
              text="Hitung MCB 1 Phase"
              className="flex-1 items-center justify-center"
            />
            <CustomButton
              onPress={calculateMCB3}
              text="Hitung MCB 3 Phase"
              className="flex-1 items-center justify-center"
            />
            <CustomButton
              onPress={handleSaveToDatabase}
              text="Simpan"
              className="flex-1 items-center justify-center"
            />
          </View>
        </ScrollView>
      </View>
    </ThemedView>
  );
};

export default mcb;
