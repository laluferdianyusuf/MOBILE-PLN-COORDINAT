import { Pressable } from "react-native";
import React from "react";
import { ArrowLeft } from "phosphor-react-native";

interface NextButtonProps {
  prevTo: () => void;
  currentIndex: number;
  slidesLength: number;
}

const PrevButton = ({
  prevTo,
  currentIndex,
  slidesLength,
}: NextButtonProps) => {
  return (
    <Pressable
      disabled={currentIndex < 1}
      onPress={prevTo}
      className="justify-center w-12 h-12 items-center rounded-full py-2 bg-gray-200"
    >
      <ArrowLeft
        size={25}
        weight="bold"
        color={currentIndex < 1 ? "#d1d5db" : "#6b7280"}
      />
    </Pressable>
  );
};

export default PrevButton;
