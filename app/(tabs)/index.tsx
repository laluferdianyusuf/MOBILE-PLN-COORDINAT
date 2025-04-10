import { FlatList, Pressable, Text, View } from "react-native";
import React from "react";
import {
  BezierCurve,
  CarBattery,
  Compass,
  Intersection,
  Question,
  SubsetOf,
  SupersetOf,
} from "phosphor-react-native";
import { Category } from "@/types/types";
import { ThemedView } from "@/components/ThemedView";
import CategoryItem from "@/components/CategoryItem";
import { router } from "expo-router";

const category: Category[] = [
  {
    id: "maps",
    name: "Peta Interaktif",
    icon: <Compass size={35} color="black" />,
    desc: "More about teacher",
    primary: "bg-custom-info-1",
    color: "bg-[#def3fa]",
    uri: "/(category)/maps",
  },
  {
    id: "fuse_link",
    name: "Fuse Link",
    icon: <SubsetOf size={35} color="black" />,
    desc: "More about student",
    primary: "bg-custom-warning-1",
    color: "bg-[#fafafa]",
    uri: "/(category)/link",
  },
  {
    id: "fuse_link_branch",
    name: "Fuse Link Percabangan",
    icon: <SupersetOf size={35} color="black" />,
    desc: "More about attendance",
    primary: "bg-custom-success-1",
    color: "bg-[#e0f7dc]",
    uri: "/(category)/branch",
  },
  {
    id: "nh_fuse_substation",
    name: "NH Fuse Gardu",
    icon: <Intersection size={35} color="black" />,
    desc: "More about calendar",
    primary: "bg-custom-indigo-1",
    color: "bg-[#fff4bf]",
    uri: "/(category)/substation",
  },
  {
    id: "mcb",
    name: "MCB",
    icon: <CarBattery size={35} color="black" />,
    desc: "More about calendar",
    primary: "bg-custom-indigo-1",
    color: "bg-[#ede4f5]",
    uri: "/(category)/mcb",
  },
  {
    id: "balancer",
    name: "Penyeimbang Beban gardu",
    icon: <BezierCurve size={35} color="black" />,
    desc: "More about calendar",
    primary: "bg-custom-indigo-1",
    color: "bg-custom-error-1",
    uri: "/(category)/balancer",
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
      <View className="pt-16 pb-6 px-6 flex-1 gap-7">
        <View>
          <Pressable className="p-2 rounded-full bg-gray-100 self-start">
            <Question size={32} color="black" />
          </Pressable>
        </View>
        <View className="mt-[65px]">
          <Text className="text-5xl font-helvetica-regular">Hi User, </Text>
          <Text className="text-5xl font-helvetica-regular">
            How can i help you today?{" "}
          </Text>
        </View>
        <View className="flex-1">
          <FlatList
            data={category}
            renderItem={({ item }) => (
              <CategoryItem
                item={item}
                handlePress={() => handlePressItem(item)}
              />
            )}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={{ gap: 5 }}
            contentContainerStyle={{ rowGap: 5 }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </ThemedView>
  );
};

export default index;
