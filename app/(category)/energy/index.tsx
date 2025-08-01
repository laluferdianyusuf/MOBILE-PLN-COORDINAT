import { FlatList, Text, View } from "react-native";
import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { BackButton } from "@/components/BackButton";
import { router } from "expo-router";
import { Category } from "@/types/types";
import CategoryItem from "@/components/CategoryItem";

export const category: Category[] = [
  {
    id: "saidi",
    name: "System Average Interruption Duration Index",
    icon: (
      <View className="flex-row items-center gap-2">
        <Text className="font-artegra-bold">SAIDI</Text>
      </View>
    ),
    desc: "More about saidi",
    primary: "bg-custom-info-1",
    color: "bg-blue-100",
    uri: "/(category)/energy/saidi",
  },
  {
    id: "saifi",
    name: "System Average Interruption Frequency Index",
    icon: (
      <View className="flex-row items-center gap-2">
        <Text className="font-artegra-bold">SAIFI</Text>
      </View>
    ),
    desc: "More about saifi",
    primary: "bg-custom-light-purple-1",
    color: "bg-blue-100",
    uri: "/(category)/energy/saifi",
  },
  {
    id: "ens",
    name: "Energy Not Served",
    icon: (
      <View className="flex-row items-center gap-2">
        <Text className="font-artegra-bold">ENS</Text>
      </View>
    ),
    desc: "More about saifi",
    primary: "bg-custom-light-purple-1",
    color: "bg-blue-100",
    uri: "/(category)/energy/ens",
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
            Perhitungan SAIDI & SAIFI
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
