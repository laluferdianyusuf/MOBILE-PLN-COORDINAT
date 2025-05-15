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
  const [trafoValues, setTrafoValues] = useState<string[]>([""]);
  const [voltage, setVoltage] = useState("");
  const [type, setType] = useState("");
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    validateUser();
  }, []);

  const handleAddTrafo = () => {
    setTrafoValues([...trafoValues, ""]);
  };

  const handleTrafoChange = (text: string, index: number) => {
    const newValue = [...trafoValues];
    newValue[index] = text;
    setTrafoValues(newValue);
  };

  const handleCalculate = () => {
    const v = parseFloat(voltage);
    const totalPower = trafoValues.reduce((sum, val) => {
      const num = parseFloat(val);
      return sum + (isNaN(num) ? 0 : num);
    }, 0);

    if (v && totalPower > 0) {
      const fuse = totalPower / (v * 1.73);
      setResult(fuse);
    }
  };

  const payload = {
    category: "fuse_link_branch",
    title: "Menentukan Fuse Link Percabangan",
    description: `Hasil mengitung Fuse Link Percabangan`,
    type: type,
    value: {
      trafo: trafoValues,
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
          <CustomButton
            onPress={handleAddTrafo}
            text="+"
            className="px-2 p-0 bg-transparent"
            textClass="text-black text-2xl"
          />
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

            {trafoValues.map((val, idx) => (
              <CustomInput
                key={idx}
                title={`Kapasitas Trafo ${idx + 1} (VA)`}
                value={val}
                onChange={(text) => handleTrafoChange(text, idx)}
                placeholder="Contoh: 50000"
                keyboard="numeric"
              />
            ))}

            <CustomInput
              title="Tegangan TM (Volt)"
              value={voltage}
              onChange={(text) => setVoltage(text)}
              placeholder="Contoh: 20000"
              keyboard="numeric"
            />
            <CustomInput
              title="Nama Percabangan"
              value={type}
              onChange={(text) => setType(text)}
              placeholder="Contoh: FCO Alas Kota"
              keyboard="default"
            />
            {result !== null && (
              <View className="bg-gray-200 p-4 rounded-lg border border-gray-400 my-6 space-y-3">
                <Text className="text-gray-800 text-lg font-artegra-bold">
                  Hasil Fuse Link Percabangan:
                </Text>
                <Text className="text-gray-700 text-base font-artegra">
                  {result.toFixed(2)} A {"\n"}≈ {Math.round(result)} A
                </Text>
                <View className="mt-2 space-y-1">
                  <Text className="text-sm text-gray-700 font-artegra-bold">
                    Penjelasan Perhitungan:
                  </Text>
                  <Text className="text-sm text-gray-600 font-artegra">
                    1. Total Daya Trafo ={" "}
                    {trafoValues
                      .map((v) => parseFloat(v) || 0)
                      .reduce((a, b) => a + b, 0)}{" "}
                    VA
                  </Text>
                  <Text className="text-sm text-gray-600 font-artegra">
                    2. Tegangan TM = {voltage} V
                  </Text>
                  <Text className="text-sm text-gray-600 font-artegra">
                    3. Rumus: I = Total Daya / (√3 × Tegangan)
                  </Text>
                  <Text className="text-sm text-gray-600 font-artegra">
                    4. I ={" "}
                    {trafoValues
                      .map((v) => parseFloat(v) || 0)
                      .reduce((a, b) => a + b, 0)}{" "}
                    / ({voltage} × 1.73)
                  </Text>
                  <Text className="text-sm text-gray-600 font-artegra">
                    5. I ≈ {result.toFixed(2)} A
                  </Text>
                </View>
                <Text className="text-xs text-gray-500 font-artegra-italic mt-2">
                  Hasil di atas menunjukkan arus fuse link yang dibutuhkan
                  berdasarkan total daya trafo dan tegangan yang dimasukkan.
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

export default FuseLinkPercabangan;
