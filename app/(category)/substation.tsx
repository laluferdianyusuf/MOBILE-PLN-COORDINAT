import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { BackButton } from "@/components/BackButton";
import { router } from "expo-router";
import { CustomInput } from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import { useUserData } from "@/hooks/useUserHooks";
import { useHistoryData } from "@/hooks/useHistoryHooks";

const substation = () => {
  const { user, validateUser } = useUserData({});
  const [power, setPower] = useState("");
  const [voltage, setVoltage] = useState("");
  const [line, setLine] = useState(""); // jurusan
  const [nhFuse, setNhFuse] = useState<number | null>(null);

  useEffect(() => {
    validateUser();
  }, []);

  const handleCalculate = () => {
    const P = parseFloat(power) || 0;
    const V = parseFloat(voltage) || 0;
    const n = parseInt(line) || 0;

    if (!P || !V || !n || n === 0) {
      setNhFuse(null);
      return;
    }

    const In = P / (V * Math.sqrt(3));
    const arusJurusan = In / n;
    const fuse = arusJurusan * 0.9;

    setNhFuse(fuse);
  };

  const payload = {
    category: "nh_fuse_substation",
    title: "Menentukan NH Fuse Gardu",
    description: `Hasil mengitung NH Fuse Gardu`,
    value: {
      power: power,
      voltage: voltage,
      jurusan: line,
      result: nhFuse,
    },
    background: "bg-custom-light-yellow-1",
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
          <Text className="font-artegra-bold text-xl">NH Fuse Gardu</Text>
          <View className="opacity-0" />
        </View>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerClassName="justify-center"
        >
          <View className="flex-1">
            <View className="mb-4 p-4 bg-amber-50 rounded-lg border border-yellow-400">
              <Text className="text-base font-artegra-bold text-yellow-800 mb-2">
                Rumus NH Fuse Gardu:
              </Text>

              <Text className="text-gray-700 mb-1 font-artegra-italic">
                <Text className="font-artegra-italic">In</Text> = Daya Trafo /
                (Tegangan TR × √3)
              </Text>
              <Text className="text-gray-700 mb-1 font-artegra-italic">
                Arus Tiap Jurusan = In / Jumlah Jurusan
              </Text>
              <Text className="text-gray-700 mb-1 font-artegra-italic">
                NH Fuse = Arus Tiap Jurusan × 0.9
              </Text>

              <Text className="text-gray-700 mt-2 font-artegra">
                <Text className="font-bold">Keterangan:</Text>
              </Text>
              <Text className="text-gray-700 font-artegra">
                - <Text className="font-artegra-bold">Daya Trafo</Text> dalam
                satuan VA (Volt Ampere)
              </Text>
              <Text className="text-gray-700 font-artegra">
                - <Text className="font-artegra-bold">Tegangan TR</Text> adalah
                tegangan sekunder trafo (biasanya 400 V)
              </Text>
              <Text className="text-gray-700 font-artegra">
                - <Text className="font-artegra-bold">Jumlah Jurusan</Text>{" "}
                adalah banyaknya saluran keluar dari gardu
              </Text>
              <Text className="text-gray-700 font-artegra">
                - <Text className="font-artegra-bold">Faktor 0.9</Text> adalah
                asumsi beban 90% dari trafo
              </Text>
            </View>
            <CustomInput
              title="Masukkan Daya"
              value={power}
              onChange={(text) => setPower(text)}
              placeholder="Contoh: 200000"
              keyboard="numeric"
            />
            <CustomInput
              title="Masukkan Tegangan"
              value={voltage}
              onChange={(text) => setVoltage(text)}
              placeholder="Contoh: 400"
              keyboard="numeric"
            />
            <CustomInput
              title="Masukkan Jumlah Jurusan"
              value={line}
              onChange={(text) => setLine(text)}
              placeholder="Contoh: 4"
              keyboard="numeric"
            />

            {nhFuse !== null && (
              <View className="bg-gray-200 p-4 rounded-lg border border-gray-400 my-6 space-y-2">
                <Text className="text-gray-800 text-lg mb-2 font-artegra-bold">
                  Hasil Perhitungan:
                </Text>

                <Text className="text-gray-700 text-base font-artegra">
                  In = P / (V × √3) ={" "}
                  <Text className="font-artegra-bold">
                    {(
                      parseFloat(power) /
                      (parseFloat(voltage) * Math.sqrt(3))
                    ).toFixed(2)}{" "}
                    A
                  </Text>
                </Text>

                <Text className="text-gray-700 text-base font-artegra">
                  Arus Tiap Jurusan = In / Jumlah Jurusan ={" "}
                  <Text className="font-artegra-bold">
                    {(
                      parseFloat(power) /
                      (parseFloat(voltage) * Math.sqrt(3) * parseInt(line))
                    ).toFixed(2)}{" "}
                    A
                  </Text>
                </Text>

                <Text className="text-gray-700 text-base font-artegra">
                  NH Fuse = Arus Tiap Jurusan × 0.9 ={" "}
                  <Text className="font-artegra-bold">
                    {nhFuse.toFixed(2)} A
                  </Text>
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

export default substation;
