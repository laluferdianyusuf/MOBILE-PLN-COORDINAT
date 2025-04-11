import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { BackButton } from "@/components/BackButton";
import { router } from "expo-router";
import { CustomInput } from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";

const substation = () => {
  const [power, setPower] = useState("");
  const [voltage, setVoltage] = useState("");
  const [line, setLine] = useState(""); // jurusan
  const [nhFuse, setNhFuse] = useState<number | null>(null);

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

  const handleSaveToDatabase = () => {};

  function hitungNHFuseGardu(
    dayaTrafo: number,
    teganganTR: number,
    jumlahJurusan: number
  ) {
    const In = dayaTrafo / (teganganTR * Math.sqrt(3));
    const arusTiapJurusan = In / jumlahJurusan;
    const NHFuse = arusTiapJurusan * 0.9;

    return {
      arusTotal: In,
      arusTiapJurusan,
      NHFuse,
    };
  }

  const daya = 160000;
  const tegangan = 400;
  const jurusan = 3;

  const hasil = hitungNHFuseGardu(daya, tegangan, jurusan);
  console.log(`Arus Total: ${hasil.arusTotal.toFixed(2)} A`);
  console.log(`Arus Tiap Jurusan: ${hasil.arusTiapJurusan.toFixed(2)} A`);
  console.log(`NH Fuse (90%): ${hasil.NHFuse.toFixed(2)} A`);

  return (
    <ThemedView className={`flex-1`}>
      <View className="pt-16 pb-6 px-6 flex-1">
        <View className="flex-row items-center justify-between pb-4">
          <BackButton onBack={() => router.back()} />
          <Text className="font-helvetica-regular text-xl">NH Fuse Gardu</Text>
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
              <Text className="text-base text-yellow-800 font-semibold mb-2">
                Rumus NH Fuse Gardu:
              </Text>

              <Text className="text-gray-700 mb-1 italic">
                <Text className="italic">In</Text> = Daya Trafo / (Tegangan TR ×
                √3)
              </Text>
              <Text className="text-gray-700 mb-1 italic">
                Arus Tiap Jurusan = In / Jumlah Jurusan
              </Text>
              <Text className="text-gray-700 mb-1 italic">
                NH Fuse = Arus Tiap Jurusan × 0.9
              </Text>

              <Text className="text-gray-700 mt-2">
                <Text className="font-bold">Keterangan:</Text>
              </Text>
              <Text className="text-gray-700">
                - <Text className="font-semibold">Daya Trafo</Text> dalam satuan
                VA (Volt Ampere)
              </Text>
              <Text className="text-gray-700">
                - <Text className="font-semibold">Tegangan TR</Text> adalah
                tegangan sekunder trafo (biasanya 400 V)
              </Text>
              <Text className="text-gray-700">
                - <Text className="font-semibold">Jumlah Jurusan</Text> adalah
                banyaknya saluran keluar dari gardu
              </Text>
              <Text className="text-gray-700">
                - <Text className="font-semibold">Faktor 0.9</Text> adalah
                asumsi beban 90% dari trafo
              </Text>
            </View>
            <CustomInput
              title="Masukkan Daya"
              value={power}
              onChange={(text) => setPower(text)}
              placeholder="Contoh: 200000"
            />
            <CustomInput
              title="Masukkan Tegangan"
              value={voltage}
              onChange={(text) => setVoltage(text)}
              placeholder="Contoh: 400"
            />
            <CustomInput
              title="Masukkan Jumlah Jurusan"
              value={line}
              onChange={(text) => setLine(text)}
              placeholder="Contoh: 4"
            />

            {nhFuse !== null && (
              <View className="bg-gray-200 p-4 rounded-lg border border-gray-400 my-6 space-y-2">
                <Text className="text-gray-800 text-lg font-bold mb-2">
                  Hasil Perhitungan:
                </Text>

                <Text className="text-gray-700 text-base">
                  In = P / (V × √3) ={" "}
                  <Text className="font-bold">
                    {(
                      parseFloat(power) /
                      (parseFloat(voltage) * Math.sqrt(3))
                    ).toFixed(2)}{" "}
                    A
                  </Text>
                </Text>

                <Text className="text-gray-700 text-base">
                  Arus Tiap Jurusan = In / Jumlah Jurusan ={" "}
                  <Text className="font-bold">
                    {(
                      parseFloat(power) /
                      (parseFloat(voltage) * Math.sqrt(3) * parseInt(line))
                    ).toFixed(2)}{" "}
                    A
                  </Text>
                </Text>

                <Text className="text-gray-700 text-base">
                  NH Fuse = Arus Tiap Jurusan × 0.9 ={" "}
                  <Text className="font-bold">{nhFuse.toFixed(2)} A</Text>
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
              onPress={handleSaveToDatabase}
              text="Simpan"
              className="flex-1"
            />
          </View>
        </ScrollView>
      </View>
    </ThemedView>
  );
};

export default substation;
