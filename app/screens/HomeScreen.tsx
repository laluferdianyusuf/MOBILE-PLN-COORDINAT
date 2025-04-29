import {
  Image,
  Pressable,
  Text,
  View,
  FlatList,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
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
  const [loading, setLoading] = useState<string | null>(null);

  const handlePressItem = async (item: Home) => {
    if (loading) return;
    setLoading(item.id);

    if (item.id === "supervisor") {
      router.push(item.uri);
      setLoading(null);
    } else {
      try {
        const payload = {
          username: "guest",
          password: "guest",
        };
        await dispatch(login(payload)).unwrap();
        router.push("/(tabs)");
      } catch (error) {
        ToastAndroid.show("Coba lagi nanti", ToastAndroid.SHORT);
      } finally {
        setLoading(null);
      }
    }
  };

  const renderItem = ({ item, index }: { item: Home; index: number }) => {
    const isLoading = loading === item.id;
    console.log(loading);

    return (
      <MotiView
        from={{ opacity: 0, translateY: 30 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: index * 200, type: "timing" }}
        className="w-full"
      >
        <Pressable
          className={`bg-white rounded-3xl border border-gray-200 items-center justify-center px-6 py-6`}
          onPress={() => handlePressItem(item)}
          disabled={!!loading}
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
        {isLoading && (
          <View className="absolute inset-0 bg-gray-200/20 h-full justify-center items-center rounded-3xl w-full flex-1">
            <ActivityIndicator size="large" color="#6B7280" />
          </View>
        )}
      </MotiView>
    );
  };

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
