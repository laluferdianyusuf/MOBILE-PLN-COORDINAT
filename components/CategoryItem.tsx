import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { Category } from "@/types/types";

interface CategoryItemProps {
  item: Category;
  handlePress: () => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ item, handlePress }) => {
  const { colors } = useTheme();

  return (
    <Pressable
      className={`rounded-3xl items-center justify-center flex-1 ${
        item.color
      } px-3 py-6 ${item.id === "fuse_link" ? "border border-gray-100" : ""}`}
      onPress={handlePress}
    >
      <View className={`flex justify-center items-center gap-5 w-full`}>
        <View
          className={`rounded-full ${
            item.id === "fuse_link" ? "" : "bg-white"
          } items-center justify-center p-2`}
        >
          {item.icon}
        </View>
        <View className="text-center items-center">
          <Text className="font-helvetica-regular text-xl text-center">
            {item.name}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default CategoryItem;
