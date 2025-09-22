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

const SAIFIPage = () => {
  const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
  const { user, validateUser, isLoading } = useUserData({});
  const [jumlahGangguan, setJumlahGangguan] = useState("");
  const [totalPelanggan, setTotalPelanggan] = useState("");
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    validateUser();
  }, []);

  const handleCalculate = () => {
    const jml = parseFloat(jumlahGangguan);
    const total = parseFloat(totalPelanggan);

    if (isNaN(jml) || isNaN(total) || total === 0) {
      ToastAndroid.show("Input tidak valid", ToastAndroid.SHORT);
      return;
    }

    const saifi = jml / total;
    setResult(saifi);
  };

  const payload = {
    category: "saifi",
    title: "SAIFI",
    description: `Perhitungan SAIFI`,
    type: "indeks-gangguan",
    value: {
      jumlah_gangguan: jumlahGangguan,
      total_pelanggan: totalPelanggan,
      result: result,
    },
    background: "bg-indigo-100",
  };

  const { generateNewHistory, isLoadingGenerate } = useHistoryData({
    user_id: user.userId,
    value: payload,
  });

  const saveHistory = () => {
    if (result) {
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
                <Text className="font-artegra-bold text-xl">SAIFI</Text>
                <View style={{ width: 32 }} />
              </View>

              <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerClassName="justify-center"
              >
                <View className="flex-1">
                  <View className="mb-4 p-4 bg-indigo-100 rounded-xl border border-indigo-300">
                    <Text className="font-artegra-bold text-indigo-800 text-base mb-1">
                      SAIFI
                    </Text>
                    <Text className="text-indigo-700 font-artegra">
                      Rumus: Jumlah Pelanggan Gangguan / Total Pelanggan
                    </Text>
                  </View>

                  <CustomInput
                    title="Jumlah Pelanggan Gangguan"
                    value={jumlahGangguan}
                    onChange={setJumlahGangguan}
                    placeholder="Contoh: 1300"
                    keyboard="numeric"
                  />

                  <CustomInput
                    title="Total Pelanggan"
                    value={totalPelanggan}
                    onChange={setTotalPelanggan}
                    placeholder="Contoh: 200000"
                    keyboard="numeric"
                  />
                </View>

                {result !== null && (
                  <View className="bg-white p-4 rounded-xl border border-gray-300 my-6 space-y-3">
                    <Text className="text-xl font-artegra-bold text-center text-black">
                      Hasil Perhitungan
                    </Text>

                    <Text className="font-artegra text-black">
                      <Text className="font-bold">Rumus:</Text> Jumlah Pelanggan
                      Padam ÷ Total Pelanggan
                    </Text>

                    <Text className="font-artegra text-black">
                      <Text className="font-bold">Jumlah Gangguan</Text>
                      {"\n"}
                      Jumlah Gangguan: {jumlahGangguan}
                    </Text>

                    <Text className="font-artegra text-black">
                      <Text className="font-bold">Total Pelanggan</Text>
                      {"\n"}
                      Total Pelanggan: {totalPelanggan}
                    </Text>

                    <Text className="font-artegra text-black">
                      <Text className="font-bold">Hasil:</Text>
                      {"\n"}
                      {jumlahGangguan} ÷ {totalPelanggan} ={" "}
                      <Text className="font-bold">{result.toFixed(3)}</Text>
                    </Text>

                    <Text className="font-artegra text-black">
                      <Text className="font-bold">Penjelasan:</Text>
                      {"\n"}
                      Hasil SAIFI menunjukkan rata-rata jumlah gangguan (padam)
                      yang dialami oleh pelanggan selama periode tertentu.
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

export default SAIFIPage;
