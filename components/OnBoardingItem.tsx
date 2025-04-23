import {
  Text,
  View,
  Image,
  useWindowDimensions,
  ImageProps,
} from "react-native";
import React from "react";

interface ItemProps {
  id: string;
  image: ImageProps;
  title: string;
  description: string;
}

interface OnBoardingItemProps {
  item: ItemProps;
}

const OnBoardingItem = ({ item }: OnBoardingItemProps) => {
  const { width } = useWindowDimensions();
  return (
    <View className="items-center justify-center" style={[{ width }]}>
      <Image
        source={item.image}
        style={[{ width, resizeMode: "contain" }]}
        className="flex-[0.7] justify-center"
      />

      <View className="flex-[0.3]">
        <Text className="text-2xl px-3 font-artegra-bold mb-2 text-center">
          {item.title}
        </Text>
        <Text className="text-center text-gray-400 px-4 font-artegra text-sm">
          {item.description}
        </Text>
      </View>
    </View>
  );
};

export default OnBoardingItem;
