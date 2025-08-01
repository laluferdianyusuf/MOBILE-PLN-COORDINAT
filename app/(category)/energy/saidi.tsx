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

const SAIDIPage = () => {
  const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
  const { user, validateUser, isLoading } = useUserData({});
  const [jumlahTerdampak, setJumlahTerdampak] = useState("");
  const [lamaPadamJam, setLamaPadamJam] = useState("");
  const [totalPelanggan, setTotalPelanggan] = useState("");
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    validateUser();
  }, []);

  const handleCalculate = () => {
    const terdampak = parseFloat(jumlahTerdampak);
    const lama = parseFloat(lamaPadamJam);
    const total = parseFloat(totalPelanggan);

    if (isNaN(terdampak) || isNaN(lama) || isNaN(total) || total === 0) {
      ToastAndroid.show("Input tidak valid", ToastAndroid.SHORT);
      return;
    }

    const saidi = (terdampak * lama) / total;
    setResult(saidi);
  };

  const payload = {
    category: "saidi",
    title: "SAIDI",
    description: `Perhitungan SAIDI`,
    type: "indeks-gangguan",
    value: {
      jumlah_terdampak: jumlahTerdampak,
      lama_padam_jam: lamaPadamJam,
      total_pelanggan: totalPelanggan,
      result: result,
    },
    background: "bg-violet-100",
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
              <View className="flex-row items-center justify-between pb-4">
                <BackButton onBack={() => router.back()} />
                <Text className="font-artegra-bold text-xl">SAIDI</Text>
                <View style={{ width: 32 }} />
              </View>

              <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerClassName="justify-center"
              >
                <View className="flex-1">
                  <View className="mb-4 p-4 bg-violet-100 rounded-xl border border-violet-300">
                    <Text className="font-artegra-bold text-violet-800 text-base mb-1">
                      SAIDI
                    </Text>
                    <Text className="text-violet-700 font-artegra">
                      Rumus: (Jumlah Pelanggan Terdampak × Lama Padam) / Total
                      Pelanggan
                    </Text>
                  </View>

                  <CustomInput
                    title="Jumlah Pelanggan Terdampak"
                    value={jumlahTerdampak}
                    onChange={setJumlahTerdampak}
                    placeholder="Contoh: 1300"
                    keyboard="numeric"
                  />

                  <CustomInput
                    title="Lama Padam (jam)"
                    value={lamaPadamJam}
                    onChange={setLamaPadamJam}
                    placeholder="Contoh: 4"
                    keyboard="numeric"
                  />

                  <CustomInput
                    title="Total Pelanggan"
                    value={totalPelanggan}
                    onChange={setTotalPelanggan}
                    placeholder="Contoh: 200000"
                    keyboard="numeric"
                  />

                  {result !== null && (
                    <View className="bg-white p-4 rounded-xl border border-gray-300 my-6 space-y-3">
                      <Text className="text-xl font-artegra-bold text-center text-black">
                        Hasil Perhitungan SAIDI
                      </Text>

                      <Text className="font-artegra text-black">
                        <Text className="font-bold">Rumus:</Text> (Jumlah
                        Pelanggan Terdampak × Lama Padam) ÷ Total Pelanggan
                      </Text>

                      <Text className="font-artegra text-black">
                        <Text className="font-bold">
                          Jumlah Pelanggan Terdampak
                        </Text>
                        {"\n"}
                        Diinput: {jumlahTerdampak}
                      </Text>

                      <Text className="font-artegra text-black">
                        <Text className="font-bold">Lama Padam (jam)</Text>
                        {"\n"}
                        Diinput: {lamaPadamJam}
                      </Text>

                      <Text className="font-artegra text-black">
                        <Text className="font-bold">Total Pelanggan</Text>
                        {"\n"}
                        Diinput: {totalPelanggan}
                      </Text>

                      <Text className="font-artegra text-black">
                        <Text className="font-bold">Hasil:</Text>
                        {"\n"}({jumlahTerdampak} × {lamaPadamJam}) ÷{" "}
                        {totalPelanggan} ={" "}
                        <Text className="font-bold">
                          {result.toFixed(2)} jam/pelanggan
                        </Text>
                      </Text>

                      <Text className="font-artegra text-black">
                        <Text className="font-bold">Penjelasan:</Text>
                        {"\n"}
                        Hasil SAIDI menggambarkan rata-rata durasi padam per
                        pelanggan dalam satuan jam. Semakin tinggi nilai SAIDI,
                        semakin lama rata-rata pelanggan mengalami gangguan
                        listrik.
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

export default SAIDIPage;
