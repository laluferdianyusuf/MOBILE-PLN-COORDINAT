import { Text, View, ScrollView } from "react-native";
import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { BackButton } from "@/components";
import { router } from "expo-router";
import TableSection from "@/components/TableSection";

const table = () => {
  return (
    <ThemedView className="flex-1">
      <View className="pt-16 pb-6 px-6 flex-1">
        <View className="flex-row items-center justify-between pb-6">
          <BackButton onBack={() => router.back()} />
          <Text className="font-artegra-bold text-xl">KHA Tabel</Text>
          <View className="opacity-0" />
        </View>

        <ScrollView
          className="space-y-8"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerClassName="justify-center"
        >
          <TableSection
            title="KABEL TM, TR, SR"
            headers={[
              "LUAS PENAMPANG (mm²)",
              "JENIS KONDUKTOR",
              "NILAI KHA (A)",
            ]}
            rows={[
              ["10", "AL", "54"],
              ["16", "AL", "105"],
              ["25", "AL", "135"],
              ["35", "AL", "170"],
              ["50", "AL", "210"],
              ["70", "AL", "255"],
              ["95", "AL", "320"],
              ["120", "AL", "365"],
              ["150", "AL", "425"],
              ["185", "AL", "490"],
              ["240", "AL", "585"],
              ["300", "AL", "670"],
              ["400", "AL", "810"],
            ]}
          />

          <TableSection
            title="Kabel Tanah TR & TM"
            headers={["Jenis Kabel", "LUAS PENAMPANG (mm²)", "NILAI KHA (A)"]}
            rows={[
              ["", "35", "127"],
              ["", "50", "148"],
              ["", "70", "179"],
              ["", "95", "214"],
              ["NA2XSEYBY", "120", "246"],
              ["NA2XSEYFGby", "150", "272"],
              ["NA2XSEYRGby", "185", "308"],
              ["", "240", "358"],
              ["", "300", "398"],
            ]}
          />

          <View className="border border-gray-300 rounded-md overflow-hidden">
            <View className="bg-gray-200 p-2 items-center border-b border-gray-300">
              <Text className="font-bold">KABEL INSTALASI</Text>
            </View>

            <View className="flex-row border-gray-300">
              <View className="w-24 border-gray-300 p-2 bg-gray-200">
                <Text className="text-xs font-bold text-center">
                  TIPE KABEL
                </Text>
              </View>
              <View className="w-36 border-gray-300 p-2 bg-gray-200 border-r">
                <Text className="text-xs font-bold text-center">
                  LUAS PENAMPANG (mm²)
                </Text>
              </View>
              <View className="flex-1 p-2 bg-gray-200 border-b border-gray-300">
                <Text className="text-xs font-bold text-center">
                  KHA (Ampere)
                </Text>
              </View>
            </View>

            <View className="flex-row border-b border-gray-300">
              <View className="w-24 bg-gray-200 border-gray-300" />
              <View className="w-36 bg-gray-200 border-r border-gray-300" />
              <View className="flex-1 flex-row">
                <View className="flex-1 border-r border-gray-300 p-2 bg-gray-50">
                  <Text className="text-xs font-bold text-center">
                    Dalam Tanah (30°C)
                  </Text>
                </View>
                <View className="flex-1 p-2 bg-gray-50">
                  <Text className="text-xs font-bold text-center">
                    Jaringan Udara (40°C)
                  </Text>
                </View>
              </View>
            </View>

            {[
              // NYM
              ["NYM", "1.5", "19", "16"],
              ["", "2.5", "25", "22"],
              ["", "4", "34", "30"],
              ["", "6", "44", "39"],
              ["", "10", "61", "53"],
              ["", "16", "82", "71"],
              ["", "25", "108", "94"],
              ["", "35", "134", "117"],

              // NYY
              ["", "", "", ""],
              ["NYY", "1.5", "24", "18"],
              ["", "2.5", "32", "25"],
              ["", "4", "41", "34"],
              ["", "6", "52", "44"],
              ["", "10", "69", "60"],
              ["", "16", "89", "80"],
              ["", "25", "116", "105"],
              ["", "35", "138", "130"],
              ["", "50", "165", "160"],
              ["", "70", "205", "200"],
              ["", "95", "245", "245"],
              ["", "120", "280", "285"],
              ["", "150", "315", "325"],
              ["", "185", "355", "370"],
              ["", "240", "415", "435"],
              ["", "300", "465", "500"],

              // NYA
              ["", "", "", ""],
              ["NYA", "1.5", "15", "24"],
              ["", "2.5", "19", "32"],
              ["", "4", "25", "43"],
              ["", "6", "33", "54"],
              ["", "10", "45", "73"],
              ["", "16", "61", "98"],
              ["", "25", "83", "129"],
              ["", "35", "103", "158"],
              ["", "50", "132", "197"],
              ["", "70", "165", "245"],
              ["", "95", "207", "290"],
              ["", "120", "", "345"],
              ["", "150", "", "390"],
              ["", "185", "", "445"],
              ["", "240", "", "525"],
              ["", "300", "", "605"],
              ["", "400", "", "725"],
            ].map(([tipe, luas, tanah, udara], i) => (
              <View key={i} className="flex-row border-b border-gray-200">
                <View className="w-24  border-gray-300 p-2">
                  <Text className="text-xs text-center">{tipe}</Text>
                </View>
                <View className="w-36  border-gray-300 p-2">
                  <Text className="text-xs text-center">{luas}</Text>
                </View>
                <View className="flex-1 flex-row">
                  <View className="flex-1 border-gray-300 p-2">
                    <Text className="text-xs text-center">{tanah}</Text>
                  </View>
                  <View className="flex-1 p-2">
                    <Text className="text-xs text-center">{udara}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </ThemedView>
  );
};

export default table;
