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
import { useUserData } from "@/hooks/useUserHooks";
import { useHistoryData } from "@/hooks/useHistoryHooks";
import { LoadingWave } from "@/components";

const wbp = () => {
  const { user, validateUser, isLoading } = useUserData({});
  const [lwbp, setLwbp] = useState("");
  const [wbp, setWbp] = useState<number | null>(null);
  const [type, setType] = useState<string>("");

  useEffect(() => {
    validateUser();
  }, []);

  const calculate = () => {
    const WBP = parseFloat(lwbp) * 1.667;

    setWbp(WBP);
  };

  const payload = {
    category: "wbp",
    title: "Menentukan WBP (Waktu Beban Puncak)",
    description: `Hasil mengitung WBP (waktu Beban Puncak)`,
    type: type,
    value: {
      lwbp: lwbp,
      wbp: wbp,
      selisih: `${(parseFloat(lwbp!) - wbp!).toFixed(2)} A`,
    },
    background: "bg-custom-error-3",
  };

  const { generateNewHistory, isLoadingGenerate: isHistoryLoading } =
    useHistoryData({
      user_id: user.userId,
      value: payload,
    });

  const saveHistory = () => {
    if (wbp) {
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
              <View className="flex-row items-center justify-between pb-6">
                <BackButton onBack={() => router.back()} />
                <Text className="font-artegra-bold text-xl">
                  WBP (Waktu Beban Puncak)
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
                      Rumus WBP:
                    </Text>
                    <Text className="text-base text-gray-700 font-artegra">
                      Rumus WBP = LWBP (Luar Beban Waktu Puncak) × 166,7%
                    </Text>
                  </View>
                  <CustomInput
                    title="Masukkan LWBP"
                    value={lwbp}
                    onChange={(text) => setLwbp(text)}
                    placeholder="Contoh: 10"
                    keyboard="numeric"
                  />
                  <CustomInput
                    title="Kode Gardu"
                    value={type}
                    onChange={(text) => setType(text)}
                    placeholder="Contoh: AL001"
                    keyboard="default"
                  />
                  {wbp !== null && (
                    <View className="bg-gray-200 p-4 rounded-lg border border-gray-400 my-6 space-y-2">
                      <Text className="text-gray-800 text-lg mb-2 font-artegra-bold">
                        Hasil Perhitungan:
                      </Text>

                      <Text className="text-gray-700 text-base font-artegra">
                        • LWBP = {parseFloat(lwbp)} A
                      </Text>

                      <Text className="text-gray-700 text-base font-artegra">
                        • WBP = {wbp.toFixed(2)} A {"\n"}• Selisih ={" "}
                        {(parseFloat(lwbp) - wbp).toFixed(2)} A
                      </Text>

                      <Text className="text-sm text-gray-500 mt-2 font-artegra-italic">
                        Penjelasan Hasil:
                      </Text>

                      <Text className="text-sm text-gray-600 font-artegra">
                        • WBP adalah nilai arus pada waktu beban puncak,
                        dihitung dari LWBP dengan mengalikannya sebesar 166,7%.{" "}
                        {"\n"}• Nilai WBP digunakan untuk memperkirakan
                        kapasitas arus maksimum saat sistem berada pada kondisi
                        beban puncak. {"\n"}• Selisih antara LWBP dan WBP
                        menunjukkan berapa besar peningkatan arus yang terjadi
                        saat beban puncak dibandingkan dengan kondisi normal
                        (luar beban puncak).
                        {"\n"}• Nilai WBP yang jauh lebih tinggi dari LWBP
                        menandakan sistem mengalami lonjakan arus saat puncak,
                        yang perlu diperhatikan untuk menjaga kestabilan dan
                        mencegah overloading pada gardu.
                      </Text>
                    </View>
                  )}
                </View>
                <View className="flex flex-row gap-3">
                  <CustomButton
                    onPress={calculate}
                    text="Hitung"
                    className="flex-1"
                  />
                  {user.role !== "guest" && (
                    <CustomButton
                      isDisable={isHistoryLoading}
                      onPress={saveHistory}
                      text={`${isHistoryLoading ? "Loading..." : "Simpan"}`}
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

export default wbp;
