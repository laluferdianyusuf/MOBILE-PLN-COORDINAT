import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";

interface CustomButtonProps {
  text: string;
  onPress: () => void;
  className?: string;
  isDisable?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  onPress,
  className,
  isDisable,
}) => {
  return (
    <Pressable
      disabled={isDisable}
      onPress={onPress}
      className={`${className} p-2 px-4 bg-blue-400 rounded-xl`}
    >
      <Text className="font-artegra text-center text-white">{text}</Text>
    </Pressable>
  );
};

export default CustomButton;

const styles = StyleSheet.create({});
