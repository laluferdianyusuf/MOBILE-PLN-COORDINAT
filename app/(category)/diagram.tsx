import { FlatList, Pressable, Text, ToastAndroid, View } from "react-native";
import React, { useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { BackButton, CustomInput, LoadingWave } from "@/components";
import { router } from "expo-router";
import { openURL } from "expo-linking";
import CustomButton from "@/components/CustomButton";
import { useUserData } from "@/hooks/useUserHooks";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { updateUrl } from "@/redux/reducers";
import {
  Buildings,
  IdentificationCard,
  LinkSimple,
} from "phosphor-react-native";

const diagram: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, validateUser, isLoading, validateAllUsers, allUsers } =
    useUserData({});
  const [url, setUrl] = useState("");
  const [isAddLoading, setIsAddLoading] = useState<boolean>(false);

  useEffect(() => {
    validateUser();
    validateAllUsers();
  }, []);

  useEffect(() => {
    if (user && user.url) {
      setUrl(user.url);
    } else {
      setUrl("");
    }
  }, [user]);

  const openDiagram = (uri: string) => {
    if (uri && uri.trim() !== "" && uri !== "null") {
      openURL(uri);
    } else {
      ToastAndroid.show("URL tidak tersedia", ToastAndroid.SHORT);
    }
  };

  const saveUrl = async () => {
    if (url.trim() === "") {
      ToastAndroid.show("Masukkan URL terlebih dahulu", ToastAndroid.SHORT);
      return;
    }
    setIsAddLoading(true);
    try {
      const payload = {
        id: String(user.userId),
        url: url,
      };
      await dispatch(updateUrl(payload)).unwrap();

      await validateUser();

      ToastAndroid.show("Berhasil menambah url", ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show("Gagal menambah url", ToastAndroid.SHORT);
    } finally {
      setIsAddLoading(false);
    }
  };

  return (
    <ThemedView className={`flex-1`}>
      {isLoading ? (
        <LoadingWave />
      ) : (
        <View className="pt-16 pb-6 px-6 flex-1">
          <View className="flex-row items-center justify-between pb-6">
            <BackButton onBack={() => router.back()} />
            <Text className="font-artegra-bold text-xl">
              Single Line Diagram
            </Text>
            <View className="opacity-0" />
          </View>

          {user.role !== "guest" && (
            <View className="mb-6">
              <Text className="font-bold mb-2">URL Diagram Anda:</Text>
              {url ? (
                <Pressable onPress={() => openDiagram(url)}>
                  <Text className="text-blue-600 underline">{url}</Text>
                </Pressable>
              ) : (
                <Text className="italic text-gray-500">Tidak ada URL</Text>
              )}
            </View>
          )}

          {user.role !== "guest" ? (
            <View>
              <CustomInput
                placeholder="https://drive.google.com/ABC"
                value={url}
                onChange={(text) => setUrl(text)}
                keyboard="url"
                title="Masukkan Url Diagram"
              />
              <CustomButton
                onPress={saveUrl}
                text={isAddLoading ? "Menyimpan..." : "Simpan Url"}
                isDisable={isAddLoading}
                className="font-artegra-bold py-2"
              />
            </View>
          ) : (
            <FlatList
              data={allUsers!.filter((u) => u.name !== "Guest")}
              keyExtractor={(item) => item!.id!.toString()}
              numColumns={2}
              columnWrapperStyle={{
                justifyContent: "space-between",
                marginBottom: 12,
              }}
              renderItem={({ item }) => (
                <View className="w-[48%] bg-white p-3 rounded-lg shadow-md">
                  {item.name === "Supervisor" ? (
                    <View className="flex-row items-center mb-2">
                      <IdentificationCard size={20} color="#007BFF" />
                      <Text className="ml-2 font-bold">{item.name}</Text>
                    </View>
                  ) : (
                    <View className="flex-row items-center mb-2">
                      <Buildings size={20} color="#007BFF" />
                      <Text className="ml-2 font-bold">{item.name}</Text>
                    </View>
                  )}
                  <View className="flex-row items-center gap-3">
                    <LinkSimple size={18} color="#888" />
                    <Pressable
                      onPress={() => openDiagram(String(item.url))}
                      className=""
                    >
                      <Text className="text-custom-light-blue-2 underline text-center font-artegra-bold">
                        Buka Url
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}
            />
          )}
        </View>
      )}
    </ThemedView>
  );
};

export default diagram;
