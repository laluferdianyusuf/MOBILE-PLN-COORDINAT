import { FlatList, Text, View } from "react-native";
import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { BackButton } from "@/components/BackButton";
import { router } from "expo-router";
import { Category } from "@/types/types";
import { Lightning } from "phosphor-react-native";
import CategoryItem from "@/components/CategoryItem";

export const category: Category[] = [
  {
    id: "lwbp",
    name: "LWBP \n (Luar waktu Beban Puncak)",
    icon: <Lightning size={35} color="black" />,
    desc: "More about teacher",
    primary: "bg-custom-info-1",
    color: "bg-custom-error-1",
    uri: "/(category)/balancer/lwbp",
  },
  {
    id: "wbp",
    name: "WBP \n (Waktu beban Puncak)",
    icon: <Lightning size={35} color="black" />,
    desc: "More about student",
    primary: "bg-custom-light-purple-1",
    color: "bg-custom-error-1",
    uri: "/(category)/balancer/wbp",
  },
];

const index = () => {
  const handlePressItem = (item: Category) => {
    router.push({
      pathname: item.uri as any,
    });
  };

  return (
    <ThemedView className={`flex-1`}>
      <View className="pt-16 pb-6 px-6 flex-1">
        <View className="flex-row items-center justify-between pb-6">
          <BackButton onBack={() => router.back()} />
          <Text className="font-artegra-medium text-xl">
            Penyeimbang Beban Gardu
          </Text>
          <View className="opacity-0" />
        </View>

        <View className="flex-1">
          <FlatList
            data={category}
            renderItem={({ item, index }) => (
              <CategoryItem
                item={item}
                handlePress={() => handlePressItem(item)}
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              rowGap: 10,
              justifyContent: "center",
            }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </ThemedView>
  );
};

export default index;
