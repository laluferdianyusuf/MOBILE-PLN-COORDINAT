import { ThemedView } from "@/components/ThemedView";
import { router, useLocalSearchParams } from "expo-router";
import {
  Text,
  View,
  ScrollView,
  Pressable,
  Alert,
  ToastAndroid,
} from "react-native";
import { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import { useRef } from "react";
import { House, ShareNetwork } from "phosphor-react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const getDetailDataById = (id: string) => {
  if (id === "1") {
    return {
      category: "MCB",
      title: "Perhitungan MCB 3 Phase",
      description: "Hasil kalkulasi daya dan arus",
      data: {
        arus: 25,
        daya: 5000,
        fasa: "3 phase",
        mcb_saran: "C25",
      },
    };
  } else if (id === "2") {
    return {
      category: "Fuse Link",
      title: "Perhitungan Fuse TM",
      description: "Hasil kalkulasi fuse TM",
      data: {
        tipe: "TM",
        arus: 120,
        hasil: "63A",
      },
    };
  } else {
    return {
      category: "Maps",
      title: "Analisa Sudut Koordinat",
      description: "Sudut antar dua titik koordinat",
      data: {
        points: [
          { lat: -6.2, lng: 106.8 },
          { lat: -6.21, lng: 106.81 },
        ],
        angle: "45.7°",
      },
    };
  }
};

const renderData = (data: any): JSX.Element => {
  if (!data || typeof data !== "object") return <></>;

  if (Array.isArray(data)) {
    return (
      <View className="space-y-2 pl-2">
        {data.map((item, index) => (
          <View
            key={index}
            className="p-2 rounded-lg border border-gray-100 bg-gray-50"
          >
            {renderData(item)}
          </View>
        ))}
      </View>
    );
  }

  return (
    <View className="space-y-2">
      {Object.entries(data).map(([key, value]) => (
        <View
          key={key}
          className="flex-row justify-between border-b border-gray-100 pb-1"
        >
          <Text className="text-gray-500 text-sm capitalize font-artegra">
            {key.replace(/_/g, " ")}
          </Text>
          <Text className="text-gray-800 font-artegra-medium text-sm text-right max-w-[60%]">
            {typeof value === "object" ? JSON.stringify(value) : String(value)}
          </Text>
        </View>
      ))}
    </View>
  );
};

const HistoryDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const viewRef = useRef(null);

  const detail = getDetailDataById(id);

  const handleSaveToGallery = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Izin ditolak", "Tidak bisa menyimpan gambar ke galeri");
        return;
      }

      const uri = await captureRef(viewRef, {
        format: "png",
        quality: 1,
      });

      await MediaLibrary.saveToLibraryAsync(uri);
      ToastAndroid.show("Riwayat disimpan ke galeri!", ToastAndroid.SHORT);
    } catch (error) {
      console.error(error);
      ToastAndroid.show(
        "Terjadi kesalahan saat menyimpan gambar.",
        ToastAndroid.SHORT
      );
    }
  };

  const handleShare = async () => {
    try {
      const uri = await captureRef(viewRef, {
        format: "png",
        quality: 1,
      });

      const fileName = `${FileSystem.cacheDirectory}history-${Date.now()}.png`;

      await FileSystem.copyAsync({
        from: uri,
        to: fileName,
      });

      await Sharing.shareAsync(fileName, {
        mimeType: "image/png",
        dialogTitle: "Bagikan hasil perhitungan",
        UTI: "image/png",
      });
    } catch (error) {
      console.error("Gagal membagikan:", error);
      ToastAndroid.show("Gagal membagikan gambar", ToastAndroid.SHORT);
    }
  };

  return (
    <ThemedView className="flex-1 bg-gray-50">
      <View className="pt-16 pb-6 px-6 flex-1">
        <ScrollView className="flex-1 mb-4">
          <View
            ref={viewRef}
            className="bg-white p-6 rounded-2xl border border-gray-200"
          >
            <Text className="text-lg font-artegra-bold text-gray-800 mb-1">
              {detail.title}
            </Text>
            <Text className="text-sm font-artegra text-gray-500 mb-4">
              {detail.description}
            </Text>

            <View className="border-t border-gray-200 pt-4 space-y-3">
              {renderData(detail.data)}
            </View>
          </View>
        </ScrollView>

        <View className="flex-row items-center justify-center gap-3">
          <Pressable
            onPress={handleShare}
            className="border border-blue-600 py-3 rounded-xl px-5 flex-1 flex-row items-center justify-center gap-3"
          >
            <ShareNetwork size={25} color="#2563eb" weight="fill" />
            <Text className="text-center text-blue-600 font-artegra-bold">
              Bagikan
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/(tabs)")}
            className="bg-blue-600 py-3 rounded-xl px-5 flex-1 flex-row items-center gap-3 justify-center"
          >
            <House size={25} color="white" weight="fill" />
            <Text className="text-center text-white font-artegra-bold">
              Home
            </Text>
          </Pressable>
        </View>
      </View>
    </ThemedView>
  );
};

export default HistoryDetail;
