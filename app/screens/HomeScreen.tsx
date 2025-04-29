import {
  Image,
  Pressable,
  Text,
  View,
  FlatList,
  ToastAndroid,
} from "react-native";
import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { Home } from "@/types/types";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { login } from "@/redux/reducers";
import { MotiView } from "moti";

const category: Home[] = [
  {
    id: "supervisor",
    title: "Supervisor",
    desc: "Masuk sebagai supervisor dan kelola semua data penting.",
    image: require("@/assets/images/supervisor.png"),
    uri: "/(auth)/login",
  },
  {
    id: "guest",
    title: "Tamu",
    desc: "Masuk sebagai tamu untuk melihat fitur secara terbatas.",
    image: require("@/assets/images/guest.png"),
    uri: "/(tabs)",
  },
];

const HomeScreen = () => {
  const dispatch: AppDispatch = useDispatch();

  const loginGuest = async () => {
    try {
      const payload = {
        username: "guest",
        password: "guest",
      };
      await dispatch(login(payload)).unwrap();
      router.push("/(tabs)");
    } catch (error) {
      ToastAndroid.show("Coba lagi nanti", ToastAndroid.SHORT);
    }
  };

  const handlePressItem = (item: Home) => {
    if (item.id === "supervisor") {
      router.push(item.uri);
    } else {
      loginGuest();
    }
  };

  const renderItem = ({ item, index }: { item: Home; index: number }) => (
    <MotiView
      from={{ opacity: 0, translateY: 30 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: index * 200, type: "timing" }}
      className="w-full"
    >
      <Pressable
        className="rounded-3xl bg-white border border-gray-200 items-center justify-center px-6 py-6"
        onPress={() => handlePressItem(item)}
      >
        <View className="flex-row justify-between items-center w-full">
          <View className="flex-1 pr-4">
            <Text className="font-artegra-bold text-xl text-gray-900 mb-1">
              {item.title}
            </Text>
            <Text className="font-artegra text-xs text-gray-400">
              {item.desc}
            </Text>
          </View>
          <Image
            source={item.image}
            style={{ width: 120, height: 120, resizeMode: "contain" }}
          />
        </View>
      </Pressable>
    </MotiView>
  );

  return (
    <ThemedView className="flex-1">
      <View className="pt-20 pb-6 px-6 flex-1">
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500 }}
          className="items-center justify-center mb-10"
        >
          <Text className="font-artegra-bold text-2xl text-gray-900 mb-2">
            Selamat Datang
          </Text>
          <Text className="font-artegra text-sm text-gray-600 text-center px-8">
            Silakan pilih peran Anda untuk mulai menggunakan aplikasi.
          </Text>
        </MotiView>
        <FlatList
          data={category}
          renderItem={({ item, index }) => renderItem({ item, index })}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            gap: 14,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ThemedView>
  );
};

export default HomeScreen;
