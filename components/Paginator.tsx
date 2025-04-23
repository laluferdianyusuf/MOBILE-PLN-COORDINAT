import { StyleSheet, View, Animated, useWindowDimensions } from "react-native";
import React from "react";

interface ItemProps {
  id: string;
  image: any;
  title: string;
  description: string;
}

interface PaginatorProps {
  data: ItemProps;
}

const Paginator = ({ data, scrollX }: any) => {
  const { width } = useWindowDimensions();
  return (
    <View className="flex-row">
      {data.map((_: any, i: number) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 20, 10],
          extrapolate: "clamp",
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: "clamp",
        });
        return (
          <Animated.View
            style={[{ height: 10, width: dotWidth, opacity }]}
            className={`rounded-lg mx-1 bg-gray-700`}
            key={i.toString()}
          />
        );
      })}
    </View>
  );
};

export default Paginator;

const styles = StyleSheet.create({});
