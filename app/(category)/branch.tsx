import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { BackButton } from "@/components/BackButton";
import { router } from "expo-router";
import { CustomInput } from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import { useUserData } from "@/hooks/useUserHooks";
import { useHistoryData } from "@/hooks/useHistoryHooks";

const FuseLinkPercabangan = () => {
  const { user, validateUser } = useUserData({});
  const [trafo1, setTrafo1] = useState("");
  const [trafo2, setTrafo2] = useState("");
  const [trafo3, setTrafo3] = useState("");
  const [trafo4, setTrafo4] = useState("");
  const [voltage, setVoltage] = useState("");
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    validateUser();
  }, []);

  const handleCalculate = () => {
    const t1 = parseFloat(trafo1) || 0;
    const t2 = parseFloat(trafo2) || 0;
    const t3 = parseFloat(trafo3) || 0;
    const t4 = parseFloat(trafo4) || 0;
    const v = parseFloat(voltage);

    if (v && (t1 || t2 || t3 || t4)) {
      const totalPower = t1 + t2 + t3 + t4;
      const fuse = totalPower / (v * 1.73);
      setResult(fuse);
    }
  };

  const payload = {
    category: "fuse_link_branch",
    title: "Menentukan Fuse Link Percabangan",
    description: `Hasil mengitung Fuse Link Percabangan`,
    value: {
      trafo_1: trafo1,
      trafo_2: trafo2,
      trafo_3: trafo3,
      trafo_4: trafo4,
      voltage: voltage,
      result: result,
    },
    background: "bg-custom-light-green-1",
  };

  const { generateNewHistory, isLoadingGenerate: isHistoryLoading } =
    useHistoryData({
      user_id: user.userId,
      value: payload,
    });

  return (
    <ThemedView className="flex-1">
      <View className="pt-16 pb-6 px-6 flex-1">
        <View className="flex-row items-center justify-between pb-6">
          <BackButton onBack={() => router.back()} />
          <Text className="font-artegra-bold text-xl">
            Fuse Link Percabangan
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
            <View className="mb-4 p-4 bg-lime-100 rounded-lg border border-lime-300">
              <Text className="text-base font-artegra-bold text-lime-800 mb-2">
                Rumus Fuse Link Percabangan:
              </Text>
              <Text className="text-lime-700 mb-1 font-artegra">
                <Text className="font-artegra-bold">Fuse Link</Text> = Jumlah
                Daya Trafo Percabangan / (Tegangan TM × √3)
              </Text>
              <Text className="text-lime-700 mt-2 font-artegra">
                Daya trafo dijumlahkan dalam satuan VA (Volt Ampere), kemudian
                dibagi dengan hasil perkalian Tegangan TM (Volt) dan akar 3
                (1.73).
              </Text>
              <Text className="text-lime-700 mt-1 font-artegra">
                Hasil akhir akan didapatkan dalam satuan{" "}
                <Text className="font-artegra-bold">Ampere (A)</Text>.
              </Text>
            </View>

            <CustomInput
              title="Kapasitas Trafo 1 (VA)"
              value={trafo1}
              onChange={(text) => setTrafo1(text)}
              placeholder="Contoh: 50000"
              keyboard="numeric"
            />
            <CustomInput
              title="Kapasitas Trafo 2 (VA)"
              value={trafo2}
              onChange={(text) => setTrafo2(text)}
              placeholder="Contoh: 100000"
              keyboard="numeric"
            />
            <CustomInput
              title="Kapasitas Trafo 3 (VA)"
              value={trafo3}
              onChange={(text) => setTrafo3(text)}
              placeholder="Contoh: 160000"
              keyboard="numeric"
            />
            <CustomInput
              title="Kapasitas Trafo 4 (VA)"
              value={trafo4}
              onChange={(text) => setTrafo4(text)}
              placeholder="Contoh: 200000"
              keyboard="numeric"
            />
            <CustomInput
              title="Tegangan TM (Volt)"
              value={voltage}
              onChange={(text) => setVoltage(text)}
              placeholder="Contoh: 20000"
              keyboard="numeric"
            />
            {result !== null && (
              <View className="bg-gray-200 p-4 rounded-lg border border-gray-400 my-6 space-y-2">
                <Text className="text-gray-800 text-lg mb-2 font-artegra-bold">
                  Hasil Fuse Link Percabangan:
                </Text>
                <Text className="text-gray-700 text-base font-artegra">
                  {result.toFixed(2)} A {"\n"}≈ {Math.round(result)} A
                </Text>
                <Text className="text-sm text-gray-500 mt-1 font-artegra-italic">
                  Ini adalah arus fuse link percabangan berdasarkan nilai Trafo
                  1 - 4 & tegangan yang Anda masukkan.
                </Text>
              </View>
            )}
          </View>

          <View className="flex flex-row gap-3">
            <CustomButton
              onPress={handleCalculate}
              text="Hitung"
              className="flex-1"
            />
            <CustomButton
              isDisable={isHistoryLoading}
              onPress={generateNewHistory}
              text={`${isHistoryLoading ? "Loading..." : "Simpan"}`}
              className="flex-1"
            />
          </View>
        </ScrollView>
      </View>
    </ThemedView>
  );
};

export default FuseLinkPercabangan;
