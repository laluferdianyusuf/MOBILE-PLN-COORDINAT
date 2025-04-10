import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ArrowLeft } from "phosphor-react-native";
import React from "react";
import { Pressable, View } from "react-native";

interface BackButtonProps {
  onBack: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({ onBack }) => {
  return (
    <Pressable onPress={onBack} className="">
      <ArrowLeft size={25} color="black" />
    </Pressable>
  );
};
