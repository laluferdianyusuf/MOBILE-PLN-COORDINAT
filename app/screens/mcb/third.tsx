import { ScrollView, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { BackButton } from "@/components/BackButton";
import { router } from "expo-router";
import { CustomInput } from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import { useHistoryData } from "@/hooks/useHistoryHooks";
import { useUserData } from "@/hooks/useUserHooks";

const third = () => {
  const { user, validateUser } = useUserData({});
  const [power3, setPower3] = useState("");
  const [voltage3, setVoltage3] = useState("");
  const [result3, setResult3] = useState<number | null>(null);

  useEffect(() => {
    validateUser();
  }, []);

  const calculateMCB3 = () => {
    const P = parseFloat(power3);
    const V = parseFloat(voltage3);
    if (P && V) {
      const I = P / (V * Math.sqrt(3));
      setResult3(I);
    }
  };

  const payload = {
    category: "mcb_3_phase",
    title: "MCB 3 Phase",
    description: `Hasil mengitung MCB 3 Phase`,
    value: {
      power: power3,
      voltage: voltage3,
      result: result3,
    },
    background: "bg-custom-light-purple-2",
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
          <Text className="font-artegra text-xl">MCB 3 Phase</Text>
          <View className="opacity-0" />
        </View>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerClassName="justify-center"
        >
          <View className="flex-1">
            <View className="mb-4 mt-3 p-4 rounded-xl bg-purple-100">
              <Text className="text-purple-900 text-lg mb-2 font-artegra-bold">
                MCB 3 Phase
              </Text>
              <Text className="text-base text-gray-700 font-artegra">
                Rumus: I = P / (√3 × V)
              </Text>
              <Text className="text-sm text-gray-500 mt-1 font-artegra-italic">
                I = Arus (A), P = Daya (Watt), V = Tegangan (Volt)
              </Text>
            </View>
            <CustomInput
              title="Masukkan Daya (Watt)"
              value={power3}
              onChange={(text) => setPower3(text)}
              placeholder="Contoh: 6600"
              keyboard="numeric"
            />
            <CustomInput
              title="Masukkan Tegangan (Volt)"
              value={voltage3}
              onChange={(text) => setVoltage3(text)}
              placeholder="Contoh: 400"
              keyboard="numeric"
            />
            {result3 !== null && (
              <View className="bg-gray-200 p-4 rounded-lg border border-gray-400 my-6 space-y-2">
                <Text className="text-gray-800 text-lg mb-2 font-artegra-bold">
                  Hasil MCB 3 Phase:
                </Text>
                <Text className="text-gray-700 text-base font-artegra">
                  Arus = {result3.toFixed(2)} A {"\n"}
                  Saran MCB = {Math.ceil(result3)} A
                </Text>
                <Text className="text-sm text-gray-500 mt-1 font-artegra-italic">
                  Ini adalah hasil perhitungan MCB 3 Phase berdasarkan daya &
                  tegangan yang Anda masukkan.
                </Text>
              </View>
            )}
          </View>
          <View className="flex flex-row gap-3">
            <CustomButton
              onPress={calculateMCB3}
              text="Hitung MCB 3 Phase"
              className="flex-1 items-center justify-center"
            />
            <CustomButton
              isDisable={isHistoryLoading}
              onPress={generateNewHistory}
              text={`${isHistoryLoading ? "Loading..." : "Simpan"}`}
              className="flex-1 items-center justify-center"
            />
          </View>
        </ScrollView>
      </View>
    </ThemedView>
  );
};

export default third;
