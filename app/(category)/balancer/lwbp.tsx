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

const lwbp = () => {
  const { user, validateUser, isLoading } = useUserData({});
  const [ir, setIr] = useState("");
  const [is, setIs] = useState("");
  const [it, setIt] = useState("");
  const [lwbp, setLwbp] = useState<number | null>(null);
  const [type, setType] = useState<string>("");

  useEffect(() => {
    validateUser();
  }, []);

  const calculate = () => {
    const IR = parseFloat(ir) || 0;
    const IS = parseFloat(is) || 0;
    const IT = parseFloat(it) || 0;
    if (IR && IS && IT) {
      const LWBP = (IR + IS + IT) / 3;
      setLwbp(LWBP);
    }
  };

  const payload = {
    category: "lwbp",
    title: "Menentukan LWBP (Luar Beban Waktu Puncak)",
    description: `Hasil mengitung LWBP (Luar Beban Waktu Puncak)`,
    type: type,
    value: {
      ir: ir,
      is: is,
      it: it,
      lwbp: lwbp,
    },
    background: "bg-custom-error-1",
  };

  const { generateNewHistory, isLoadingGenerate: isHistoryLoading } =
    useHistoryData({
      user_id: user.userId,
      value: payload,
    });

  const saveHistory = () => {
    if (lwbp) {
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
                <Text className="font-artegra-bold text-md">
                  LWBP (Luar Waktu Beban Puncak)
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
                      Rumus Pemerataan Beban Gardu:
                    </Text>

                    <Text className="text-base text-gray-700 font-artegra">
                      Rata - rata beban = (IR + IS + IT) / 3
                    </Text>
                    <Text className="text-sm text-gray-500 mt-1 font-artegra-italic">
                      IR, IS, IT adalah hasil pengukuran arus pada masing-masing
                      fasa
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
                  <CustomInput
                    title="Kode Gardu"
                    value={type}
                    onChange={(text) => setType(text)}
                    placeholder="Contoh: AL001"
                    keyboard="default"
                  />
                  {lwbp !== null && (
                    <View className="bg-gray-200 p-4 rounded-lg border border-gray-400 my-6 space-y-2">
                      <Text className="text-gray-800 text-lg mb-2 font-artegra-bold">
                        Hasil Perhitungan:
                      </Text>

                      <Text className="text-gray-700 text-base font-artegra">
                        • IR = {ir} A {"\n"}• IS = {is} A {"\n"}• IT = {it} A{" "}
                        {"\n"}
                      </Text>

                      <Text className="text-gray-700 text-base font-artegra">
                        • Rata - rata beban = {lwbp.toFixed(2)} A {"\n"}
                      </Text>

                      <Text className="text-sm text-gray-500 mt-2 font-artegra-italic">
                        Penjelasan Hasil:
                      </Text>
                      <Text className="text-sm text-gray-600 font-artegra">
                        • IR, IS, dan IT adalah nilai arus yang diukur pada
                        masing-masing fasa gardu yang Anda masukkan. {"\n"}•
                        Jika terjadi perbedaan besar antar fasa, beban perlu
                        disesuaikan agar distribusi arus lebih merata.
                      </Text>

                      <Text className="text-sm text-gray-600 font-artegra mt-4">
                        <Text className="font-artegra-bold">
                          Contoh Penyesuaian:
                        </Text>{" "}
                        {"\n"}
                        Misalkan nilai input Anda adalah: {"\n"}- IR ={" "}
                        {parseFloat(ir)} A {"\n"}- IS = {parseFloat(is)} A{" "}
                        {"\n"}- IT = {parseFloat(it)} A {"\n"}
                        Maka rata-rata arus (LWBP) adalah {lwbp.toFixed(
                          2
                        )} A. {"\n"}
                        Agar fasa menjadi seimbang, sesuaikan arus fasa menjadi
                        mendekati nilai tersebut: {"\n"}
                        {parseFloat(ir) !== lwbp &&
                          `• IR ${
                            parseFloat(ir) > lwbp ? "turunkan" : "naikkan"
                          } ${Math.abs(parseFloat(ir) - lwbp).toFixed(
                            2
                          )} A → ${lwbp.toFixed(2)} A\n`}
                        {parseFloat(is) !== lwbp &&
                          `• IS ${
                            parseFloat(is) > lwbp ? "turunkan" : "naikkan"
                          } ${Math.abs(parseFloat(is) - lwbp).toFixed(
                            2
                          )} A → ${lwbp.toFixed(2)} A\n`}
                        {parseFloat(it) !== lwbp &&
                          `• IT ${
                            parseFloat(it) > lwbp ? "turunkan" : "naikkan"
                          } ${Math.abs(parseFloat(it) - lwbp).toFixed(
                            2
                          )} A → ${lwbp.toFixed(2)} A\n`}
                        Penyesuaian ini bertujuan agar seluruh fasa memiliki
                        nilai arus yang mendekati rata-rata dan tercapai
                        keseimbangan beban gardu.
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

export default lwbp;
