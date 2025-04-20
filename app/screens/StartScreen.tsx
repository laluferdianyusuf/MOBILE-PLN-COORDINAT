import { ThemedView } from "@/components/ThemedView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { Text, View, Image, Pressable } from "react-native";
import Swiper from "react-native-swiper";

const slides = [
  {
    image: require("@/assets/images/first.png"),
    title: "Selamat Datang di Ampere Pro",
    description:
      "Aplikasi teknisi PLN yang membantu mempermudah pekerjaan lapangan, mulai dari kalkulasi fuse, MCB, hingga pengukuran sudut di peta.",
  },
  {
    image: require("@/assets/images/second.png"),
    title: "Hitung Otomatis & Akurat",
    description:
      "Dapatkan hasil perhitungan fuse dan MCB secara instan dan tepat. Tidak perlu lagi menghitung manual, semua siap dalam genggaman Anda.",
  },
  {
    image: require("@/assets/images/third.png"),
    title: "Pantau Lokasi & Sudut Titik",
    description:
      "Gunakan fitur peta interaktif untuk menentukan titik dan sudut antar koordinat dengan mudah, serta simpan hasilnya ke histori.",
  },
];

const StartScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    if (activeIndex < slides.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else {
      AsyncStorage.setItem("hasSeenStartScreen", "true");
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const handleSkip = () => {
    AsyncStorage.setItem("hasSeenStartScreen", "true");
    onComplete();
  };

  return (
    <ThemedView className="flex-1">
      <View className="pt-16 pb-6 flex-1 gap-14 justify-center items-center">
        <View className="flex-row items-center justify-center pb-4">
          <Text className="font-artegra-bold text-xl">Ampere Pro</Text>
        </View>
        <Swiper
          loop={false}
          showsPagination={false}
          onIndexChanged={(index) => setActiveIndex(index)}
          index={activeIndex}
          scrollEnabled={true}
        >
          {slides.map((slide, index) => (
            <View
              key={index}
              className="items-center justify-center px-6 gap-4"
            >
              <View className="overflow-hidden">
                <Image
                  source={slide.image}
                  className="h-96 mb-4 z-50"
                  resizeMode="contain"
                />
              </View>
              <Text className="text-2xl px-3 font-artegra-bold mb-2 text-center">
                {slide.title}
              </Text>

              <Text className="text-center text-gray-400 px-4 font-artegra text-sm">
                {slide.description}
              </Text>
            </View>
          ))}
        </Swiper>
        <View className="flex-row gap-[2px] transition-all duration-150">
          {slides.map((_, index) => (
            <View
              key={index}
              className={` h-1 rounded-full ${
                activeIndex === index
                  ? "bg-[#2fabe0] w-5"
                  : "bg-custom-grey-2 w-2"
              }`}
            />
          ))}
        </View>
        <View className="flex-row justify-center items-center px-6">
          <Pressable
            className={`${
              activeIndex === slides.length - 1 ? "" : "opacity-0"
            } justify-center rounded-xl px-2 py-3 flex-row flex-1 items-center gap-3 bg-[#2fabe0]`}
            onPress={handleNext}
            disabled={activeIndex < slides.length - 1}
          >
            <Text className="font-artegra-bold text-white">
              {activeIndex === slides.length - 1 ? "Mulai Sekarang" : ""}
            </Text>
          </Pressable>
        </View>
      </View>
    </ThemedView>
  );
};

export default StartScreen;
