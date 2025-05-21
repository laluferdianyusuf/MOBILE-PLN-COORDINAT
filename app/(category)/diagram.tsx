import { Pressable, Text, ToastAndroid, View } from "react-native";
import React, { useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { BackButton, CustomInput, LoadingWave } from "@/components";
import { router } from "expo-router";
import { openURL } from "expo-linking";
import CustomButton from "@/components/CustomButton";
import { useUserData } from "@/hooks/useUserHooks";

const diagram: any = () => {
  const { user, validateUser, isLoading } = useUserData({});
  const [url, setUrl] = useState("https://bit.ly/SLD_ALAS");
  const [title, setTitle] = useState("");
  const openDiagram = () => {
    openURL(url);
  };

  useEffect(() => {
    validateUser();
  }, []);

  const saveUrl = () => {
    console.log(url);
    ToastAndroid.show("Under Construction", ToastAndroid.SHORT);
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
          <View className="gap-5 flex-1 justify-center">
            {user.role !== "guest" && (
              <View>
                <CustomInput
                  placeholder="ULP ALAS"
                  value={title}
                  onChange={(text) => setTitle(text)}
                  keyboard="default"
                  title="Masukkan ULP"
                />
                <CustomInput
                  placeholder="https://drive.google.com/ABC"
                  value={url}
                  onChange={(text) => setUrl(text)}
                  keyboard="url"
                  title="Masukkan Url Diagram"
                />
                <CustomButton
                  onPress={saveUrl}
                  text="Simpan Url"
                  className="font-artegra-bold py-2"
                />
              </View>
            )}
            <Pressable onPress={openDiagram} className="">
              <Text className="text-custom-light-blue-2 underline text-center font-artegra font-bold">
                https://bit.ly/SLD_ALAS
              </Text>
            </Pressable>
            <View className="flex-row gap-3 items-center px-4">
              <View className="flex-1 h-[1px] bg-gray-300" />
              <Text className="text-gray-300 font-artegra-bold">atau</Text>
              <View className="flex-1 h-[1px] bg-gray-300" />
            </View>
            <Pressable
              onPress={openDiagram}
              className="bg-custom-light-blue-2 px-4 py-3 rounded-lg items-center"
            >
              <Text className="text-white font-bold text-center">
                Buka Diagram
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </ThemedView>
  );
};

export default diagram;
