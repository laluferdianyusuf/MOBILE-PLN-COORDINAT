import { Text, View } from "react-native";
import React from "react";
import { Empty } from "phosphor-react-native";

interface EmptyItemProps {
  text: string;
  desc: string;
}

const EmptyItem: React.FC<EmptyItemProps> = ({ text, desc }) => {
  return (
    <View className="flex-1 gap-3 justify-center items-center">
      <Empty size={100} weight="light" />
      <View className="px-8">
        <Text className="font-artegra-medium text-center">{text}</Text>
        <Text className="font-artegra text-xs text-center text-gray-400">
          {desc}
        </Text>
      </View>
    </View>
  );
};

export default EmptyItem;
