import {
  BackHandler,
  Dimensions,
  FlatList,
  Pressable,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import React, { useEffect, useRef } from "react";
import {
  BezierCurve,
  CarBattery,
  ClockClockwise,
  Compass,
  Intersection,
  Plugs,
  Question,
  SubsetOf,
  SupersetOf,
} from "phosphor-react-native";
import { Category } from "@/types/types";
import { ThemedView } from "@/components/ThemedView";
import CategoryItem from "@/components/CategoryItem";
import { router } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import { CopilotStep, useCopilot, walkthroughable } from "react-native-copilot";

const CopilotPressable = walkthroughable(Pressable);
const CopilotView = walkthroughable(View);

const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - 50) / 2;

const category: Category[] = [
  {
    id: "maps",
    name: "Peta Sudut",
    icon: <Compass size={35} color="black" />,
    desc: "More about teacher",
    primary: "bg-custom-info-1",
    color: "bg-custom-light-blue-1",
    uri: "/(category)/maps",
  },
  {
    id: "fuse_link",
    name: "Fuse Link",
    icon: <SubsetOf size={35} color="black" />,
    desc: "More about student",
    primary: "bg-custom-warning-1",
    color: "bg-custom-grey-5",
    uri: "/(category)/link",
  },
  {
    id: "fuse_link_branch",
    name: "Fuse Link Percabangan",
    icon: <SupersetOf size={35} color="black" />,
    desc: "More about attendance",
    primary: "bg-custom-success-1",
    color: "bg-custom-light-green-1",
    uri: "/(category)/branch",
  },
  {
    id: "nh_fuse_substation",
    name: "NH Fuse Gardu",
    icon: <Intersection size={35} color="black" />,
    desc: "More about calendar",
    primary: "bg-custom-indigo-1",
    color: "bg-custom-light-yellow-1",
    uri: "/(category)/substation",
  },
  {
    id: "mcb",
    name: "MCB",
    icon: <CarBattery size={35} color="black" />,
    desc: "More about calendar",
    primary: "bg-custom-indigo-1",
    color: "bg-custom-light-purple-1",
    uri: "/(category)/mcb",
  },
  {
    id: "balancer",
    name: "Penyeimbang Beban gardu",
    icon: <BezierCurve size={35} color="black" />,
    desc: "More about calendar",
    primary: "bg-custom-indigo-1",
    color: "bg-custom-error-1",
    uri: "/(category)/balancer",
  },
];

const index = () => {
  const backPressCount = useRef(0);
  const backPressTimer = useRef<NodeJS.Timeout | null>(null);
  const isFocused = useIsFocused();
  const { start } = useCopilot();

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

  const handlePressItem = (item: Category) => {
    router.push({
      pathname: item.uri as any,
    });
  };
  return (
    <ThemedView className={`flex-1`}>
      <View className="pt-16 pb-6 px-6 flex-1 gap-7">
        <View className="flex-row justify-between">
          <CopilotStep
            text="Klik di sini untuk melihat tips penggunaan aplikasi."
            order={1}
            name="bantuan"
          >
            <CopilotPressable
              className="p-2 rounded-full bg-gray-100"
              onPress={() => start()}
            >
              <Question size={32} color="black" />
            </CopilotPressable>
          </CopilotStep>
          <View className="flex-row items-center gap-3">
            <CopilotStep
              text="Ini tombol riwayat aktivitas."
              order={2}
              name="riwayat"
            >
              <CopilotPressable className="p-2 rounded-full bg-gray-100">
                <ClockClockwise size={32} color="black" />
              </CopilotPressable>
            </CopilotStep>

            <CopilotStep
              text="Keluar dari aplikasi dengan menekan ini."
              order={3}
              name="keluar"
            >
              <CopilotPressable className="p-2 rounded-full bg-custom-error-1">
                <Plugs size={32} color="#de5757" />
              </CopilotPressable>
            </CopilotStep>
          </View>
        </View>
        <View className="mt-[45px]">
          <Text className="text-5xl font-helvetica-regular">Hi User, </Text>
          <Text className="text-5xl font-helvetica-regular">
            How can i help you today?{" "}
          </Text>
        </View>
        <View className="flex-1">
          <FlatList
            data={category}
            renderItem={({ item, index }) => (
              <CopilotStep
                key={item.id}
                text={`Klik untuk membuka fitur ${item.name}`}
                order={5 + index}
                name={`fitur-${item.id}`}
              >
                <CopilotView style={{ width: ITEM_WIDTH }}>
                  <CategoryItem
                    item={item}
                    handlePress={() => handlePressItem(item)}
                  />
                </CopilotView>
              </CopilotStep>
            )}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={{ gap: 5 }}
            contentContainerStyle={{
              rowGap: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </ThemedView>
  );
};

export default index;
