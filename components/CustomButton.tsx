import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { ReactNode } from "react";

interface CustomButtonProps {
  text?: string;
  onPress: () => void;
  className?: string;
  isDisable?: boolean;
  textClass?: string;
  icon?: ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  onPress,
  className,
  isDisable,
  textClass = "text-white",
  icon,
}) => {
  return (
    <Pressable
      disabled={isDisable}
      onPress={onPress}
      className={`${className} p-2 px-4 bg-blue-400 rounded-xl`}
    >
      <Text className={`font-artegra text-center ${textClass}`}>{text}</Text>
    </Pressable>
  );
};

export default CustomButton;
