import {
  BackHandler,
  FlatList,
  Pressable,
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
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { category } from "@/utils/category";
import { useUserData } from "@/hooks/useUserHooks";
import { LoadingWave } from "@/components";

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
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    []
  );

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
            <BottomSheetModal
              containerStyle={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
              ref={bottomSheetModalRef}
              onChange={handleSheetChanges}
              $modal
              enableDismissOnClose={true}
              enablePanDownToClose={true}
              backdropComponent={renderBackdrop}
            >
              <BottomSheetView className="items-center py-5 px-5">
                <View className="p-4 bg-custom-error-1 rounded-full mb-5">
                  <Plugs size={50} color="#de5757" />
                </View>
                <Text className="font-artegra-bold text-xl mb-3">
                  Keluar dari aplikasi?
                </Text>

                <Text className="font-artegra text-gray-500 text-sm text-center mb-5">
                  Semua data koordinat dan hasil perhitunganmu sudah tersimpan.
                  Silakan kembali kapan saja!
                </Text>

                <View className="gap-4 flex-col w-full">
                  <Pressable
                    className="bg-custom-error-2 items-center justify-center py-3 rounded-full"
                    onPress={handleLogout}
                  >
                    <Text className="font-artegra-bold text-white">
                      Ya, Keluar
                    </Text>
                  </Pressable>
                  <Pressable
                    className="py-3 items-center justify-center"
                    onPress={handleCloseModalPress}
                  >
                    <Text className="font-artegra-bold text-gray-500">
                      Tidak, Tetap disini
                    </Text>
                  </Pressable>
                </View>
              </BottomSheetView>
            </BottomSheetModal>
            <View className="pt-16 pb-6 px-6 flex-1 gap-7">
              <View className="flex-row justify-between item-center">
                <Pressable
                  className="p-2 rounded-full bg-gray-100"
                  onPress={() => router.push("/screens/history")}
                >
                  <ClockClockwise size={32} color="black" />
                </Pressable>

                <Pressable
                  className="p-2 rounded-full bg-custom-error-1"
                  onPress={handlePresentModalPress}
                >
                  <PlugsConnected size={32} color="#de5757" />
                </Pressable>
              </View>
              <View className="mt-[35px]">
                <Text className="text-4xl font-artegra-bold capitalize">
                  Hi {user.username},{" "}
                </Text>
                <Text className="text-4xl font-artegra-bold">
                  Pilih fitur yang kamu butuhkan.
                </Text>
              </View>
              <View className="flex-1">
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
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      )}
    </ThemedView>
  );
};

export default index;
