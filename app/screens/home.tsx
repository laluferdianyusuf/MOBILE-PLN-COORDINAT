import {
  Image,
  Pressable,
  Text,
  View,
  FlatList,
  ToastAndroid,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { Home } from "@/types/types";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { login } from "@/redux/reducers";
import { useIsFocused } from "@react-navigation/native";

const category: Home[] = [
  {
    id: "supervisor",
    title: "Super Admin",
    desc: "Masuk sebagai supervisor dan kelola semua data penting.",
    image: require("@/assets/images/supervisor.png"),
    uri: "/screens/signin",
    role: "supervisor",
  },
  {
    id: "ulp_1",
    title: "ULP ALAS",
    desc: "Masuk sebagai ULP ALAS dan kelola semua data penting.",
    image: require("@/assets/images/ulp.png"),
    uri: "/screens/signin",
    role: "ulp_1",
  },
  {
    id: "ulp_2",
    title: "ULP TALIWANG",
    desc: "Masuk sebagai ULP TALIWANG dan kelola semua data penting.",
    image: require("@/assets/images/ulp.png"),
    uri: "/screens/signin",
    role: "ulp_2",
  },
  {
    id: "ulp_3",
    title: "ULP SAMAWAREA",
    desc: "Masuk sebagai ULP SAMAWAREA dan kelola semua data penting.",
    image: require("@/assets/images/ulp.png"),
    uri: "/screens/signin",
    role: "ulp_3",
  },
  {
    id: "ulp_4",
    title: "ULP EMPANG",
    desc: "Masuk sebagai ULP EMPANG dan kelola semua data penting.",
    image: require("@/assets/images/ulp.png"),
    uri: "/screens/signin",
    role: "ulp_4",
  },
  {
    id: "guest",
    title: "Umum",
    desc: "Masuk sebagai umum untuk melihat fitur secara terbatas.",
    image: require("@/assets/images/guest.png"),
    uri: "/(tabs)",
    role: "guest",
  },
];

const home = () => {
  const dispatch: AppDispatch = useDispatch();
  const backPressCount = useRef(0);
  const backPressTimer = useRef<NodeJS.Timeout | null>(null);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    const handleBackPress = () => {
      if (backPressCount.current === 0) {
        backPressCount.current += 1;
        ToastAndroid.show("Tekan sekali lagi untuk keluar", ToastAndroid.SHORT);

        backPressTimer.current = setTimeout(() => {
          backPressCount.current = 0;
        }, 3000);

        return true;
      } else {
        clearTimeout(backPressTimer.current as NodeJS.Timeout);
        BackHandler.exitApp();
        return true;
      }
    };

    if (isFocused) {
      backPressCount.current = 0;
      BackHandler.addEventListener("hardwareBackPress", handleBackPress);
    } else {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
      clearTimeout(backPressTimer.current as NodeJS.Timeout);
    }

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
      clearTimeout(backPressTimer.current as NodeJS.Timeout);
    };
  }, [isFocused]);

  const handlePressItem = async (item: Home) => {
    if (loading) return;
    setLoading(item.id);

    if (
      item.id === "supervisor" ||
      item.id === "ulp_1" ||
      item.id === "ulp_2" ||
      item.id === "ulp_3" ||
      item.id === "ulp_4"
    ) {
      router.push({ pathname: item.uri, params: { role: item.role } });
      setLoading(null);
    } else {
      try {
        const payload = {
          username: "guest",
          password: "guest",
          role: "guest",
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

    return (
      <View className="w-full">
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
      </View>
    );
  };

  return (
    <ThemedView className="flex-1">
      <View className="pt-20 pb-6 px-6 flex-1">
        <View className="items-center justify-center mb-10">
          <Text className="font-artegra-bold text-2xl text-gray-900 mb-2">
            Selamat Datang
          </Text>
          <Text className="font-artegra text-sm text-gray-600 text-center px-8">
            Silakan pilih untuk mulai menggunakan aplikasi.
          </Text>
        </View>
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

export default home;
