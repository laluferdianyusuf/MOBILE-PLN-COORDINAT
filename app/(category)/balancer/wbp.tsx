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
import React, { useEffect, useMemo, useState } from "react";
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
  const [ir, setIr] = useState("");
  const [is, setIs] = useState("");
  const [it, setIt] = useState("");
  const [lwbp, setLwbp] = useState<string>("");
  const [wbp, setWbp] = useState<null | any>(null);

  const [type, setType] = useState<string>("");

  useEffect(() => {
    validateUser();
  }, []);

  const calculate = () => {
    const parsedIr = parseFloat(ir);
    const parsedIs = parseFloat(is);
    const parsedIt = parseFloat(it);

    const irLwbp = parsedIr * 0.667;
    const isLwbp = parsedIs * 0.667;
    const itLwbp = parsedIt * 0.667;

    const avg = (irLwbp + isLwbp + itLwbp) / 3;

    const irCorrection = avg - irLwbp;
    const isCorrection = avg - isLwbp;
    const itCorrection = avg - itLwbp;

    const hasil = {
      lwbp: irLwbp.toFixed(2),
      wbp: parsedIr.toFixed(2),
      perFasa: {
        ir: irLwbp.toFixed(2),
        is: isLwbp.toFixed(2),
        it: itLwbp.toFixed(2),
      },
      rataRata: avg.toFixed(2),
      koreksi: {
        ir: irCorrection.toFixed(2),
        is: isCorrection.toFixed(2),
        it: itCorrection.toFixed(2),
      },
    };

    setWbp(hasil);
  };

  const payload = useMemo(() => {
    if (!wbp) return null;

    return {
      category: "wbp",
      title: "Menentukan WBP (Waktu Beban Puncak)",
      description: `Hasil menghitung WBP (Waktu Beban Puncak)`,
      type: type,
      value: {
        "LWBP per fasa": {
          Ir: `${wbp.perFasa.ir}`,
          Is: `${wbp.perFasa.is}`,
          It: `${wbp.perFasa.it}`,
        },
        "Rata-rata Arus per fasa": `${wbp.rataRata} A`,
        Penjelasan: [
          "• Faktor kali 66,7% digunakan untuk menghitung Penurunan Arus Per Phasa dari Waktu Beban Puncak (WBP) ke Arus Luar Waktu Beban Puncak (LWBP)",
          "• Pemerataan dilakukan berdasarkan Arus yang sudah dikonversi dari WBP ke LWBP",
          "• Maka yang harus dilakukan:",
          `${
            wbp.koreksi.ir > 0
              ? "Ir dinaikkan"
              : wbp.koreksi.ir < 0
              ? "Ir diturunkan"
              : "Ir tidak perlu diubah"
          } sebesar ${Math.abs(wbp.koreksi.ir)} A → menjadi ${wbp.rataRata} A`,
          `${
            wbp.koreksi.is > 0
              ? "Is dinaikkan"
              : wbp.koreksi.is < 0
              ? "Is diturunkan"
              : "Is tidak perlu diubah"
          } sebesar ${Math.abs(wbp.koreksi.is)} A → menjadi ${wbp.rataRata} A`,
          `${
            wbp.koreksi.it > 0
              ? "It dinaikkan"
              : wbp.koreksi.it < 0
              ? "It diturunkan"
              : "It tidak perlu diubah"
          } sebesar ${Math.abs(wbp.koreksi.it)} A → menjadi ${wbp.rataRata} A`,
        ],
      },
      background: "bg-custom-error-3",
    };
  }, [wbp, type]);

  const { generateNewHistory, isLoadingGenerate: isHistoryLoading } =
    useHistoryData({
      user_id: user.userId,
      value: payload,
    });

  const saveHistory = () => {
    if (!wbp || !payload) {
      ToastAndroid.show("Hitung terlebih dahulu", ToastAndroid.SHORT);
      return;
    }

    generateNewHistory();
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
                      Rata - rata pemerataan gardu = (Ir+Is+It)/3
                    </Text>
                    <Text className="text-base text-gray-700 font-artegra">
                      Penjelasannya : Ir Is It adalah hasil pengukuran arus pada
                      masing masing fasa yang terecord pada Amg
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
                  {wbp && (
                    <View className="bg-gray-200 p-4 rounded-lg border border-gray-400 my-6 space-y-2">
                      <Text className="text-gray-800 text-lg mb-2 font-artegra-bold">
                        Hasil Perhitungan:
                      </Text>

                      <Text className="text-gray-700 text-base font-artegra">
                        * LWBP PER PHASA:{"\n"}
                        IR = {wbp.wbp} x 66,7% = {wbp.perFasa.ir}
                        {"\n"}
                        IS = {is} x 66,7% = {wbp.perFasa.is}
                        {"\n"}
                        IT = {it} x 66,7% = {wbp.perFasa.it}
                      </Text>

                      <Text className="text-gray-700 text-base font-artegra mt-2">
                        * Rata-Rata Arus per fasa = ({wbp.perFasa.ir} +{" "}
                        {wbp.perFasa.is} + {wbp.perFasa.it}) / 3 ={" "}
                        {wbp.rataRata}
                      </Text>

                      <Text className="text-gray-700 text-base font-artegra mt-2">
                        * Faktor kali 66,7% digunakan untuk menghitung Penurunan
                        Arus Per Phasa dari WBP ke LWBP
                      </Text>

                      <Text className="text-gray-700 text-base font-artegra mt-2">
                        * Pemerataan dilakukan berdasarkan Arus yang sudah
                        dikonversi dari WBP ke LWBP
                      </Text>

                      <Text className="text-gray-700 text-base font-artegra mt-2">
                        * Jadi yang harus dilakukan:{"\n"}
                        IR{" "}
                        {wbp.koreksi.ir > 0
                          ? "dinaikkan"
                          : wbp.koreksi.ir < 0
                          ? "diturunkan"
                          : "dinaikkan"}{" "}
                        {Math.abs(wbp.koreksi.ir)} menjadi {wbp.rataRata}
                        {"\n"}
                        IS{" "}
                        {wbp.koreksi.is > 0
                          ? "dinaikkan"
                          : wbp.koreksi.is < 0
                          ? "diturunkan"
                          : "dinaikkan"}{" "}
                        {Math.abs(wbp.koreksi.is)} menjadi {wbp.rataRata}
                        {"\n"}
                        IT{" "}
                        {wbp.koreksi.it > 0
                          ? "dinaikkan"
                          : wbp.koreksi.it < 0
                          ? "diturunkan"
                          : "dinaikkan"}{" "}
                        {Math.abs(wbp.koreksi.it)} menjadi {wbp.rataRata}
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
