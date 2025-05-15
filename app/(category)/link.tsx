import { ScrollView, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { BackButton } from "@/components/BackButton";
import { router } from "expo-router";
import { CustomInput } from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import { useUserData } from "@/hooks/useUserHooks";
import { useHistoryData } from "@/hooks/useHistoryHooks";

const link = () => {
  const { user, validateUser } = useUserData({});
  const [power, setPower] = useState<string>("");
  const [voltage, setVoltage] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    validateUser();
  }, []);

  const handleFuseLink = () => {
    const POWER = parseFloat(power) || 0;
    const VOLTAGE = parseFloat(voltage) || 0;
    const fuseLinkResult = POWER / (VOLTAGE * Math.sqrt(3));
    setResult(fuseLinkResult);
  };

  const payload = {
    category: "fuse_link",
    title: "Menghitung Fuse Link Gardu",
    description: `Hasil perhitungan Fuse Link Gardu`,
    type: type,
    value: {
      power: power,
      voltage: voltage,
      result: result,
    },
    background: "bg-custom-grey-5",
  };

  const { generateNewHistory, isLoadingGenerate: isHistoryLoading } =
    useHistoryData({
      user_id: user.userId,
      value: payload,
    });

  return (
    <ThemedView className={`flex-1`}>
      <View className="pt-16 pb-6 px-6 flex-1">
        <View className="flex-row items-center justify-between pb-6">
          <BackButton onBack={() => router.back()} />
          <Text className="font-artegra text-xl">Perhitungan Fuse Link</Text>
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
              <Text className="text-base font-artegra text-gray-800 font-semibold mb-2">
                Rumus Fuse Link Gardu:
              </Text>
              <Text className="text-base font-artegra text-gray-700">
                I = P / (√3 × V)
              </Text>
              <Text className="text-sm font-artegra-italic text-gray-500 mt-1">
                I = Arus, P = Daya (Watt), V = Tegangan (Volt)
              </Text>
            </View>

            <CustomInput
              value={power}
              style=""
              placeholder="Contoh : 100000"
              title="Masukan Daya"
              onChange={(text) => setPower(text)}
              keyboard="numeric"
            />
            <CustomInput
              value={voltage}
              style=""
              placeholder="Contoh : 20000"
              title="Masukan Tegangan"
              onChange={(text) => setVoltage(text)}
              keyboard="numeric"
            />
            <CustomInput
              value={type}
              style=""
              placeholder="Contoh : AL001"
              title="Nama gardu"
              onChange={(text) => setType(text)}
              keyboard="default"
            />
            {result !== null && (
              <View className="bg-gray-200 p-4 rounded-lg border border-gray-400 my-6 space-y-2">
                <Text className="text-xl font-artegra-bold text-gray-800 mb-2">
                  Hasil Fuse Link Gardu
                </Text>
                <Text className="text-gray-800 font-artegra-bold text-lg mb-2">
                  {result.toFixed(2)} A
                </Text>
                <Text className="text-sm text-gray-700">
                  Perhitungan: I = P / (√3 × V) = {power} / (√3 × {voltage}) ={" "}
                  {(
                    parseFloat(power) /
                    (Math.sqrt(3) * parseFloat(voltage) || 1)
                  ).toFixed(2)}{" "}
                  A
                </Text>
                <Text className="text-sm text-gray-500 mt-1 font-artegra-italic">
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
            {user.role === "supervisor" && (
              <CustomButton
                isDisable={isHistoryLoading}
                onPress={generateNewHistory}
                text={`${isHistoryLoading ? "Loading..." : "Simpan"}`}
                className="flex-1"
              />
            )}
          </View>
        </ScrollView>
      </View>
    </ThemedView>
  );
};

export default link;
