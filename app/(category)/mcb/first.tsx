import { ScrollView, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { BackButton } from "@/components/BackButton";
import { router } from "expo-router";
import { CustomInput } from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import { useHistoryData } from "@/hooks/useHistoryHooks";
import { useUserData } from "@/hooks/useUserHooks";

const first = () => {
  const { user, validateUser } = useUserData({});
  const [power1, setPower1] = useState("");
  const [voltage1, setVoltage1] = useState("");
  const [result1, setResult1] = useState<number | null>(null);

  useEffect(() => {
    validateUser();
  }, []);

  const calculateMCB1 = () => {
    const P = parseFloat(power1);
    const V = parseFloat(voltage1);
    if (P && V) {
      const I = P / V;
      setResult1(I);
    }
  };

  const payload = {
    category: "mcb_1_phase",
    title: "MCB 1 Phase",
    description: `Hasil mengitung MCB 1 Phase`,
    value: {
      power: power1,
      voltage: voltage1,
      result: result1,
    },
    background: "bg-custom-light-purple-1",
  };

  const { generateNewHistory, isLoadingGenerate: isHistoryLoading } =
    useHistoryData({
      user_id: user.userId,
      value: payload,
    });

  return (
    <ThemedView className={`flex-1`}>
      <View className="pt-16 pb-6 px-6 flex-1">
        <View className="flex-row items-center justify-between pb-4">
          <BackButton onBack={() => router.back()} />
          <Text className="font-artegra text-xl">MCB 1 Phase</Text>
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
              <Text className="text-purple-900 text-lg mb-2 font-artegra-bold">
                MCB 1 Phase
              </Text>
              <Text className="text-base text-gray-700 font-artegra">
                Rumus: I = P / V
              </Text>
              <Text className="text-sm font-artegra-italic text-gray-500 mt-1">
                I = Arus (A), P = Daya (Watt), V = Tegangan (Volt)
              </Text>
            </View>
            <CustomInput
              title="Masukkan Daya (Watt)"
              value={power1}
              onChange={(text) => setPower1(text)}
              placeholder="Contoh: 1300"
              keyboard="numeric"
            />
            <CustomInput
              title="Masukkan Tegangan (Volt)"
              value={voltage1}
              onChange={(text) => setVoltage1(text)}
              placeholder="Contoh: 220"
              keyboard="numeric"
            />

            {result1 !== null && (
              <View className="bg-gray-200 p-4 rounded-lg border border-gray-400 my-6 space-y-3">
                <Text className="font-artegra-bold text-gray-800 text-lg mb-2">
                  Hasil MCB 1 Phase:
                </Text>

                <Text className="text-gray-700 text-base font-artegra">
                  Arus = Daya / Tegangan = {power1} / {voltage1} ={" "}
                  <Text className="font-artegra-bold">
                    {result1.toFixed(2)} A
                  </Text>
                </Text>

                <Text className="text-gray-700 text-sm font-artegra">
                  Saran MCB = Pembulatan ke atas dari arus ={" "}
                  <Text className="font-artegra-bold">
                    {Math.ceil(result1)} A
                  </Text>
                </Text>

                <View className="mt-2">
                  <Text className="text-sm text-gray-700 font-artegra-bold">
                    Penjelasan Perhitungan:
                  </Text>
                  <Text className="text-sm text-gray-600 font-artegra">
                    - Daya listrik yang digunakan: {power1} Watt
                  </Text>
                  <Text className="text-sm text-gray-600 font-artegra">
                    - Tegangan sistem: {voltage1} Volt
                  </Text>
                  <Text className="text-sm text-gray-600 font-artegra">
                    - Maka, Arus = P / V = {power1} / {voltage1} ={" "}
                    {result1.toFixed(2)} A
                  </Text>
                  <Text className="text-sm text-gray-600 font-artegra">
                    - Untuk keamanan, MCB dipilih dengan nilai lebih besar atau
                    sama dengan arus.
                  </Text>
                </View>

                <Text className="text-xs text-gray-500 font-artegra-italic mt-1">
                  Perhitungan ini penting agar MCB mampu memutus arus saat
                  terjadi kelebihan beban.
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
            {user.role === "supervisor" && (
              <CustomButton
                isDisable={isHistoryLoading}
                onPress={generateNewHistory}
                text={`${isHistoryLoading ? "Loading..." : "Simpan"}`}
                className="flex-1 items-center justify-center"
              />
            )}
          </View>
        </ScrollView>
      </View>
    </ThemedView>
  );
};

export default first;
