import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { BackButton } from "@/components/BackButton";
import { router } from "expo-router";
import { CustomInput } from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import { useUserData } from "@/hooks/useUserHooks";
import { useHistoryData } from "@/hooks/useHistoryHooks";

const balancer = () => {
  const { user, validateUser } = useUserData({});
  const [ir, setIr] = useState("");
  const [is, setIs] = useState("");
  const [it, setIt] = useState("");
  const [wbp, setWbp] = useState<number | null>(null);
  const [lwbp, setLwbp] = useState<number | null>(null);

  useEffect(() => {
    validateUser();
  }, []);

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

  const payload = {
    category: "balancer",
    title: "Menentukan Penyeimbang Beban Gardu",
    description: `Hasil mengitung Penyeimbang Beban Gardu`,
    value: {
      ir: ir,
      is: is,
      it: it,
      wbp: wbp,
      lwbp: lwbp,
      selisih: `${(wbp! - lwbp!).toFixed(2)} A`,
    },
    background: "bg-custom-error-1",
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
          <Text className="font-artegra-bold text-xl">
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
              <Text className="text-red-900 text-lg mb-2 font-artegra-bold">
                Rumus Penyeimbangan Beban Gardu:
              </Text>

              <Text className="text-base text-gray-700 font-artegra">
                Rumus WBP = (IR × IS × IT) / 3
              </Text>
              <Text className="text-base text-gray-700 font-artegra">
                Rumus LWBP = WBP × 66,7%
              </Text>
              <Text className="text-sm text-gray-500 mt-1 font-artegra-italic">
                IR, IS, IT adalah hasil pengukuran arus pada masing-masing fasa
              </Text>
            </View>
            <CustomInput
              title="Masukkan IR"
              value={ir}
              onChange={(text) => setIr(text)}
              placeholder="Contoh: 10"
              keyboard="numeric"
            />
            <CustomInput
              title="Masukkan IS"
              value={is}
              onChange={(text) => setIs(text)}
              placeholder="Contoh: 12"
              keyboard="numeric"
            />
            <CustomInput
              title="Masukkan IT"
              value={it}
              onChange={(text) => setIt(text)}
              placeholder="Contoh: 11"
              keyboard="numeric"
            />
            {wbp !== null && lwbp !== null && (
              <View className="bg-gray-200 p-4 rounded-lg border border-gray-400 my-6 space-y-2">
                <Text className="text-gray-800 text-lg mb-2 font-artegra-bold">
                  Hasil Perhitungan:
                </Text>

                <Text className="text-gray-700 text-base font-artegra">
                  WBP = {wbp.toFixed(2)} A
                </Text>

                <Text className="text-gray-700 text-base font-artegra">
                  LWBP = {lwbp.toFixed(2)} A
                </Text>

                <Text className="text-gray-700 text-base font-artegra">
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

export default balancer;
