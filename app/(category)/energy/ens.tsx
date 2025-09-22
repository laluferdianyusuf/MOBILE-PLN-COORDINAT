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
  const [totalKwh, setTotalKwh] = useState("");
  const [lamaPadamJam, setLamaPadamJam] = useState("");
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    validateUser();
  }, []);

  const handleCalculate = () => {
    const kwh = parseFloat(totalKwh);
    const lama = parseFloat(lamaPadamJam);

    if (isNaN(kwh) || isNaN(lama)) {
      ToastAndroid.show("Input tidak valid", ToastAndroid.SHORT);
      return;
    }

    const ens = (lama * kwh) / 1000;
    setResult(ens);
  };

  const payload = {
    category: "ens",
    title: "ENS",
    description: "Perhitungan Energy Not Supplied (ENS)",
    type: "indeks-gangguan",
    value: {
      lama_padam_jam: lamaPadamJam,
      total_kwh_padam: totalKwh,
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
          behavior={Platform.OS === "ios" ? "padding" : "height"}
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
                      Rumus: (Waktu Padam × Total kWh Padam) ÷ 1000
                    </Text>
                  </View>

                  <CustomInput
                    title="Total kWh Padam"
                    value={totalKwh}
                    onChange={setTotalKwh}
                    placeholder="Contoh: 5000"
                    keyboard="numeric"
                  />

                  <CustomInput
                    title="Waktu Padam (jam)"
                    value={lamaPadamJam}
                    onChange={setLamaPadamJam}
                    placeholder="Contoh: 2"
                    keyboard="numeric"
                  />
                </View>

                {result !== null && (
                  <View className="bg-white p-4 rounded-xl border border-gray-300 my-6 space-y-3">
                    <Text className="text-xl font-artegra-bold text-center text-black">
                      Hasil Perhitungan ENS
                    </Text>

                    <Text className="font-artegra text-black">
                      <Text className="font-bold">Rumus:</Text> (Waktu Padam ×
                      Total kWh Padam) ÷ 1000
                    </Text>

                    <Text className="font-artegra text-black">
                      <Text className="font-bold">Waktu Padam</Text>:{" "}
                      {lamaPadamJam} jam
                    </Text>

                    <Text className="font-artegra text-black">
                      <Text className="font-bold">Total kWh Padam</Text>:{" "}
                      {totalKwh} kWh
                    </Text>

                    <Text className="font-artegra text-black">
                      <Text className="font-bold">Perhitungan:</Text>{" "}
                      {lamaPadamJam} × {totalKwh} ÷ 1000 = {result.toFixed(2)}{" "}
                      MWh
                    </Text>

                    <Text className="font-artegra text-black">
                      <Text className="font-bold">Penjelasan:</Text> Hasil ini
                      menunjukkan total energi (dalam MWh) yang tidak disuplai
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
