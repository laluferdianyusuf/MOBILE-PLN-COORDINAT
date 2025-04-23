import { Pressable, StyleSheet } from "react-native";
import React from "react";
import { ArrowRight, RocketLaunch } from "phosphor-react-native";

interface NextButtonProps {
  scrollTo: () => void;
  currentIndex: number;
  slidesLength: number;
}

const NextButton = ({
  scrollTo,
  currentIndex,
  slidesLength,
}: NextButtonProps) => {
  return (
    <Pressable
      onPress={scrollTo}
      className="py-2 justify-center w-12 h-12 items-center bg-gray-200 rounded-full"
    >
      {currentIndex === slidesLength - 1 ? (
        <RocketLaunch size={25} weight="bold" color="#6b7280" />
      ) : (
        <ArrowRight size={25} weight="bold" color="#6b7280" />
      )}
    </Pressable>
  );
};

export default NextButton;

const styles = StyleSheet.create({});
