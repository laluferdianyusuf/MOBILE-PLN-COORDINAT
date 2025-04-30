import { ScrollView, Text, View } from "react-native";
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
  const [lwbp, setLwbp] = useState<number | null>(null);
  const [wbp, setWbp] = useState<number | null>(null);
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
      const WBP = LWBP * 1.667;
      setLwbp(LWBP);
      setWbp(WBP);
    }
  };

  const payload = {
    category: "balancer",
    title: "Menentukan Penyeimbang Beban Gardu",
    description: `Hasil mengitung Penyeimbang Beban Gardu`,
    type: type,
    value: {
      ir: ir,
      is: is,
      it: it,
      lwbp: lwbp,
      wbp: wbp,
      selisih: `${(lwbp! - wbp!).toFixed(2)} A`,
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
        <View className="flex-row items-center justify-between pb-6">
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
                Rumus LWBP = (IR + IS + IT) / 3
              </Text>
              <Text className="text-base text-gray-700 font-artegra">
                Rumus WBP = LWBP × 166,7%
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
            <CustomInput
              title="Masukkan Jenis Gardu (optional)"
              value={type}
              onChange={(text) => setType(text)}
              placeholder="Contoh: Gardu tiang besi"
              keyboard="default"
            />
            {wbp !== null && lwbp !== null && (
              <View className="bg-gray-200 p-4 rounded-lg border border-gray-400 my-6 space-y-2">
                <Text className="text-gray-800 text-lg mb-2 font-artegra-bold">
                  Hasil Perhitungan:
                </Text>

                <Text className="text-gray-700 text-base font-artegra">
                  • IR = {ir} A {"\n"}• IS = {is} A {"\n"}• IT = {it} A {"\n"}
                </Text>

                <Text className="text-gray-700 text-base font-artegra">
                  • LWBP = {lwbp.toFixed(2)} A {"\n"}• WBP = {wbp.toFixed(2)} A{" "}
                  {"\n"}• Selisih = {(lwbp - wbp).toFixed(2)} A
                </Text>

                <Text className="text-sm text-gray-500 mt-2 font-artegra-italic">
                  Penjelasan Hasil:
                </Text>
                <Text className="text-sm text-gray-600 font-artegra">
                  • IR, IS, dan IT adalah nilai arus yang diukur pada
                  masing-masing fasa gardu yang Anda masukkan. {"\n"}• Langkah
                  pertama adalah menghitung **LWBP (Load Without Balance
                  Penalty)**. LWBP dihitung sebagai rata-rata dari nilai IR, IS,
                  dan IT. {"\n"}• Langkah kedua adalah menghitung **WBP (With
                  Balance Penalty)**. WBP adalah hasil dari LWBP × 1.667. {"\n"}
                  • Selisih antara LWBP dan WBP menunjukkan seberapa besar
                  ketidakseimbangan beban. Semakin kecil selisih, semakin
                  seimbang arus antar fasa. {"\n"}• Jika terjadi perbedaan besar
                  antar fasa, beban perlu disesuaikan agar distribusi arus lebih
                  merata.
                </Text>

                <Text className="text-sm text-gray-600 font-artegra mt-4">
                  <Text className="font-artegra-bold">Contoh Penyesuaian:</Text>{" "}
                  {"\n"}
                  Misalkan nilai input Anda adalah: {"\n"}- IR ={" "}
                  {parseFloat(ir)} A {"\n"}- IS = {parseFloat(is)} A {"\n"}- IT
                  = {parseFloat(it)} A {"\n"}
                  Maka rata-rata arus (LWBP) adalah {lwbp.toFixed(2)} A. {"\n"}
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
                  Penyesuaian ini bertujuan agar seluruh fasa memiliki nilai
                  arus yang mendekati rata-rata dan tercapai keseimbangan beban
                  gardu.
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

export default balancer;
