import { ThemedView } from "@/components/ThemedView";
import { router, useLocalSearchParams } from "expo-router";
import { Text, View, ScrollView, Pressable, ToastAndroid } from "react-native";
import { captureRef } from "react-native-view-shot";
import { useEffect, useRef } from "react";
import { House, ShareNetwork } from "phosphor-react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useHistoryData } from "@/hooks/useHistoryHooks";
import { LoadingWave } from "@/components";

const renderData = (data: any, level = 0): JSX.Element => {
  if (!data || typeof data !== "object") return <></>;

  const paddingLeft = level * 12;

  if (Array.isArray(data)) {
    return (
      <View style={{ paddingLeft }} className="space-y-2">
        {data.map((item, index) =>
          typeof item === "object" && item !== null ? (
            <View
              key={index}
              className="p-2 rounded-lg border border-gray-100 bg-gray-50"
            >
              {renderData(item, level + 1)}
            </View>
          ) : (
            <Text
              key={index}
              className="text-gray-800 font-artegra-medium text-sm"
            >
              Trafo {index + 1}: {String(item)}
            </Text>
          )
        )}
      </View>
    );
  }

  return (
    <View style={{ paddingLeft }} className="space-y-2">
      {Object.entries(data).map(([key, value]) => (
        <View key={key} className="space-y-1">
          <Text className="text-gray-500 text-sm capitalize font-artegra">
            {key.replace(/_/g, " ")}
          </Text>

          {typeof value === "object" && value !== null ? (
            <View className="ml-2 border-l-2 border-gray-200 pl-2">
              {renderData(value, level + 1)}
            </View>
          ) : (
            <Text className="text-gray-800 font-artegra-medium text-sm">
              {typeof value === "number"
                ? Number(value).toFixed(4)
                : String(value)}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
};

const HistoryDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { validateHistoryByHistoryId, historyDetail, isLoading } =
    useHistoryData({
      historyId: String(id),
    });

  useEffect(() => {
    validateHistoryByHistoryId();
  }, [id]);

  const viewRef = useRef(null);

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
      {isLoading ? (
        <LoadingWave />
      ) : (
        <View className="pt-16 pb-6 px-6 flex-1">
          <ScrollView className="flex-1 mb-4">
            <View
              ref={viewRef}
              className="bg-white p-6 rounded-2xl border border-gray-200"
            >
              <Text className="text-lg text-center font-artegra-bold text-gray-800 mb-1">
                {historyDetail?.title}
              </Text>
              <Text className=" text-center text-sm font-artegra text-gray-500 mb-4">
                {historyDetail?.description}
              </Text>

              <View className="border-t border-gray-200 pt-4 space-y-3">
                {renderData(historyDetail?.value)}
              </View>
              {historyDetail?.type && (
                <Text className="font-artegra text-xs self-end">
                  {historyDetail?.type}{" "}
                </Text>
              )}
            </View>
          </ScrollView>

          <View className="flex-row items-center justify-center gap-3">
            <Pressable
              onPress={handleShare}
              className="border border-custom-light-blue-2 py-3 rounded-xl px-5 flex-1 flex-row items-center justify-center gap-3"
            >
              <ShareNetwork size={25} color="#2fabe0" weight="fill" />
              <Text className="text-center text-custom-light-blue-2 font-artegra-bold">
                Bagikan
              </Text>
            </Pressable>
            <Pressable
              onPress={() => router.push("/(tabs)")}
              className="bg-custom-light-blue-2 py-3 rounded-xl px-5 flex-1 flex-row items-center gap-3 justify-center"
            >
              <House size={25} color="white" weight="fill" />
              <Text className="text-center text-white font-artegra-bold">
                Home
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </ThemedView>
  );
};

export default HistoryDetail;
