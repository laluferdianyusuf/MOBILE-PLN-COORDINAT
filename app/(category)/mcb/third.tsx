import {
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { BackButton } from "@/components/BackButton";
import { router } from "expo-router";
import { CustomInput } from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import { useHistoryData } from "@/hooks/useHistoryHooks";
import { useUserData } from "@/hooks/useUserHooks";
import { LoadingWave } from "@/components";

const third = () => {
  const { user, validateUser, isLoading } = useUserData({});
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

  const saveHistory = () => {
    if (result3) {
      generateNewHistory();
    } else {
      ToastAndroid.show("Hitung terlebih dahulu", ToastAndroid.SHORT);
    }
  };
  const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
  return (
    <ThemedView className={`flex-1`}>
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
                    <View className="bg-gray-200 p-4 rounded-lg border border-gray-400 my-6 space-y-3">
                      <Text className="text-gray-800 text-lg mb-2 font-artegra-bold">
                        Hasil MCB 3 Phase:
                      </Text>

                      <Text className="text-gray-700 text-base font-artegra">
                        Arus = Daya / (√3 × Tegangan) = {power3} / (√3 ×{" "}
                        {voltage3}) ={" "}
                        <Text className="font-artegra-bold">
                          {result3.toFixed(2)} A
                        </Text>
                      </Text>

                      <Text className="text-gray-700 text-base font-artegra">
                        Saran MCB = Pembulatan ke atas dari arus ={" "}
                        <Text className="font-artegra-bold">
                          {Math.ceil(result3)} A
                        </Text>
                      </Text>

                      <View className="mt-2">
                        <Text className="text-sm text-gray-700 font-artegra-bold">
                          Penjelasan:
                        </Text>
                        <Text className="text-sm text-gray-600 font-artegra">
                          - Daya listrik yang digunakan: {power3} Watt
                        </Text>
                        <Text className="text-sm text-gray-600 font-artegra">
                          - Tegangan sistem 3 Phase: {voltage3} Volt
                        </Text>
                        <Text className="text-sm text-gray-600 font-artegra">
                          - Rumus: I = P / (√3 × V)
                        </Text>
                        <Text className="text-sm text-gray-600 font-artegra">
                          - √3 (akar 3) ≈ 1.732
                        </Text>
                        <Text className="text-sm text-gray-600 font-artegra">
                          - Maka: I = {power3} / (1.732 × {voltage3}) ={" "}
                          {result3.toFixed(2)} A
                        </Text>
                        <Text className="text-sm text-gray-600 font-artegra">
                          - MCB disarankan ≥ arus, maka pembulatan ke atas ={" "}
                          {Math.ceil(result3)} A
                        </Text>
                      </View>

                      <Text className="text-xs text-gray-500 font-artegra-italic mt-1">
                        Perhitungan ini memastikan MCB yang digunakan cukup kuat
                        untuk melindungi beban 3 phase dari kelebihan arus.
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
                  {user.role !== "guest" && (
                    <CustomButton
                      isDisable={isHistoryLoading}
                      onPress={saveHistory}
                      text={`${isHistoryLoading ? "Loading..." : "Simpan"}`}
                      className="flex-1 items-center justify-center"
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

export default third;
