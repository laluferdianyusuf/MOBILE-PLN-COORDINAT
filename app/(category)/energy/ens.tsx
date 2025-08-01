import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ToastAndroid,
  ScrollView,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { BackButton } from "@/components/BackButton";
import { CustomInput } from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import { useUserData } from "@/hooks/useUserHooks";
import { useHistoryData } from "@/hooks/useHistoryHooks";
import { router } from "expo-router";
import { LoadingWave } from "@/components";

const ENSPage = () => {
  const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
  const { user, validateUser, isLoading } = useUserData({});
  const [dayaPadam, setDayaPadam] = useState("");
  const [lamaPadam, setLamaPadam] = useState("");
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    validateUser();
  }, []);

  const handleCalculate = () => {
    const daya = parseFloat(dayaPadam);
    const lama = parseFloat(lamaPadam);

    if (isNaN(daya) || isNaN(lama)) {
      ToastAndroid.show("Input tidak valid", ToastAndroid.SHORT);
      return;
    }

    const ens = (daya * lama) / 60;
    setResult(ens);
  };

  const payload = {
    category: "ens",
    title: "ENS",
    description: "Perhitungan Energy Not Supplied (ENS)",
    type: "indeks-gangguan",
    value: {
      daya_padam_kw: dayaPadam,
      lama_padam_menit: lamaPadam,
      hasil_ens_mwh: result,
    },
    background: "bg-blue-100",
  };

  const { generateNewHistory, isLoadingGenerate } = useHistoryData({
    user_id: user.userId,
    value: payload,
  });

  const saveHistory = () => {
    if (result !== null) {
      generateNewHistory();
    } else {
      ToastAndroid.show("Hitung terlebih dahulu", ToastAndroid.SHORT);
    }
  };

  return (
    <ThemedView className="flex-1">
      <ImageBackground
        source={require("@/assets/images/form-bg.png")}
        resizeMode="cover"
        style={[StyleSheet.absoluteFill, { width: SCREEN_W, height: SCREEN_H }]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
          {isLoading ? (
            <LoadingWave />
          ) : (
            <View className="pt-16 pb-6 px-6 flex-1 bg-white/90">
              <View className="flex-row items-center justify-between pb-6">
                <BackButton onBack={() => router.back()} />
                <Text className="font-artegra-bold text-xl">ENS</Text>
                <View style={{ width: 32 }} />
              </View>

              <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerClassName="justify-center"
              >
                <View className="flex-1">
                  <View className="mb-4 p-4 bg-blue-100 rounded-xl border border-blue-300">
                    <Text className="font-artegra-bold text-blue-800 text-base mb-1">
                      Energy Not Supplied (ENS)
                    </Text>
                    <Text className="text-blue-700 font-artegra">
                      Rumus: (Daya Padam × Lama Padam) ÷ 60
                    </Text>
                  </View>

                  <CustomInput
                    title="Daya Padam (kW)"
                    value={dayaPadam}
                    onChange={setDayaPadam}
                    placeholder="Contoh: 1000"
                    keyboard="numeric"
                  />

                  <CustomInput
                    title="Lama Padam (menit)"
                    value={lamaPadam}
                    onChange={setLamaPadam}
                    placeholder="Contoh: 120"
                    keyboard="numeric"
                  />
                </View>

                {result !== null && (
                  <View className="bg-white p-4 rounded-xl border border-gray-300 my-6 space-y-3">
                    <Text className="text-xl font-artegra-bold text-center text-black">
                      Hasil Perhitungan ENS
                    </Text>

                    <Text className="font-artegra text-black">
                      <Text className="font-bold">Rumus:</Text> (Daya Padam ×
                      Lama Padam) ÷ 60
                    </Text>

                    <Text className="font-artegra text-black">
                      <Text className="font-bold">Daya Padam</Text>: {dayaPadam}{" "}
                      kW
                    </Text>

                    <Text className="font-artegra text-black">
                      <Text className="font-bold">Lama Padam</Text>: {lamaPadam}{" "}
                      menit
                    </Text>

                    <Text className="font-artegra text-black">
                      <Text className="font-bold">Perhitungan:</Text>{" "}
                      {dayaPadam} × {lamaPadam} ÷ 60 = {result.toFixed(2)} kWh
                    </Text>

                    <Text className="font-artegra text-black">
                      <Text className="font-bold">Penjelasan:</Text> Hasil ini
                      menunjukkan total energi (dalam kWh) yang tidak disuplai
                      akibat gangguan listrik. Nilai ini penting untuk
                      mengevaluasi dampak terhadap konsumen.
                    </Text>
                  </View>
                )}

                <View className="flex flex-row gap-3">
                  <CustomButton
                    onPress={handleCalculate}
                    text="Hitung"
                    className="flex-1"
                  />
                  {user.role !== "guest" && (
                    <CustomButton
                      isDisable={isLoadingGenerate}
                      onPress={saveHistory}
                      text={isLoadingGenerate ? "Loading..." : "Simpan"}
                      className="flex-1"
                    />
                  )}
                </View>
              </ScrollView>
            </View>
          )}
        </KeyboardAvoidingView>
      </ImageBackground>
    </ThemedView>
  );
};

export default ENSPage;
