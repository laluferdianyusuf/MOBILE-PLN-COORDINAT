import {
  BackHandler,
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import React, { useCallback, useEffect, useRef } from "react";
import { ClockClockwise, Plugs, PlugsConnected } from "phosphor-react-native";
import { Category } from "@/types/types";
import { ThemedView } from "@/components/ThemedView";
import CategoryItem from "@/components/CategoryItem";
import { router } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { category } from "@/utils/category";
import { useUserData } from "@/hooks/useUserHooks";
import { LoadingWave } from "@/components";
import CustomModal from "@/components/CustomModal";

const index = () => {
  const backPressCount = useRef(0);
  const backPressTimer = useRef<NodeJS.Timeout | null>(null);
  const isFocused = useIsFocused();
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    const handleBackPress = () => {
      if (backPressCount.current === 0) {
        backPressCount.current += 1;
        ToastAndroid.show("Tekan sekali lagi untuk keluar", ToastAndroid.SHORT);

        backPressTimer.current = setTimeout(() => {
          backPressCount.current = 0;
        }, 3000);

        return true;
      } else {
        clearTimeout(backPressTimer.current as NodeJS.Timeout);
        BackHandler.exitApp();
        return true;
      }
    };

    if (isFocused) {
      backPressCount.current = 0;
      BackHandler.addEventListener("hardwareBackPress", handleBackPress);
    } else {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
      clearTimeout(backPressTimer.current as NodeJS.Timeout);
    }

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
      clearTimeout(backPressTimer.current as NodeJS.Timeout);
    };
  }, [isFocused]);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleCloseModalPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const { user, validateUser, handleLogout, isLoading } = useUserData({
    closeModal: handleCloseModalPress,
  });

  useEffect(() => {
    validateUser();
  }, []);

  const handlePressItem = (item: Category) => {
    router.push({
      pathname: item.uri as any,
    });
  };

  return (
    <ThemedView className={`flex-1`}>
      {isLoading ? (
        <LoadingWave />
      ) : (
        <GestureHandlerRootView className="flex-1 justify-center">
          <BottomSheetModalProvider>
            <View className="flex-1">
              <ImageBackground
                source={require("@/assets/images/background.png")}
                resizeMode="cover"
                style={styles.imageBackground}
              >
                <View style={styles.overlay} />
                <View className="flex-row justify-between item-center">
                  <View className="flex-row items-center gap-3">
                    {user.role !== "guest" && (
                      <Pressable
                        className="p-2 rounded-full bg-gray-100"
                        onPress={() => router.push("/screens/history")}
                      >
                        <ClockClockwise size={32} color="#4b5563" />
                      </Pressable>
                    )}
                  </View>
                  <Pressable
                    className="p-2 rounded-full bg-custom-error-1"
                    onPress={handlePresentModalPress}
                  >
                    <PlugsConnected size={32} color="#de5757" />
                  </Pressable>
                </View>
                <View className="mt-[35px]">
                  <Text className="text-2xl text-custom-black-1 font-artegra-bold">
                    Hi {user.name},{" "}
                  </Text>
                  <Text className="text-2xl font-artegra-bold text-custom-black-1">
                    Pilih fitur yang kamu butuhkan.
                  </Text>
                </View>
              </ImageBackground>
              <View className="flex-1 bg-white px-6 py-6">
                <FlatList
                  data={category}
                  renderItem={({ item, index }) => (
                    <CategoryItem
                      item={item}
                      handlePress={() => handlePressItem(item)}
                    />
                  )}
                  keyExtractor={(item) => item.id}
                  numColumns={2}
                  columnWrapperStyle={{ gap: 5 }}
                  contentContainerStyle={{
                    rowGap: 5,
                  }}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            </View>

            <CustomModal
              onSubmit={handleLogout}
              onClose={handleCloseModalPress}
              title="Keluar dari aplikasi?"
              description="Semua data koordinat dan hasil perhitunganmu sudah tersimpan.
            Silakan kembali kapan saja!"
              submitText="Ya, Keluar"
              cancelText="Tidak, Tetap disini"
              ref={bottomSheetModalRef}
              icon={<Plugs size={50} color="#de5757" />}
            />
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    paddingTop: 64,
    paddingHorizontal: 24,
    paddingBottom: 24,
    position: "relative",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
});

export default index;
