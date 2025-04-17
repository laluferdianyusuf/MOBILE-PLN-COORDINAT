import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { History } from "@/types/types";
import {
  Calendar,
  CalendarCheck,
  CalendarMinus,
  MagnifyingGlass,
  Trash,
} from "phosphor-react-native";
import moment from "moment";
import { ThemedView } from "@/components/ThemedView";
import { BackButton } from "@/components";
import "moment/locale/id";
import { useUserData } from "@/hooks/useUserHooks";
import { useHistoryData } from "@/hooks/useHistoryHooks";

moment.locale("id");

export default function HistoryList() {
  const { user, validateUser } = useUserData({});
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [query, setQuery] = useState<string>("");
  const [filteredData, setFilteredData] = useState<History[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    validateHistoryByUserId,
    history,
    isLoading: isHistoryLoading,
    deleteHistories,
  } = useHistoryData({
    user_id: user.userId,
    id: selectedItems,
  });

  useEffect(() => {
    validateUser();
  }, []);

  useEffect(() => {
    validateHistoryByUserId();
  }, [user.userId]);

  useEffect(() => {
    if (query.trim() === "") {
      setFilteredData(history);
    } else {
      const filtered = history.filter((item) =>
        item.category!.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [query, history]);

  const handleSelected = (id: string) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((itemId) => itemId !== id)
        : [...prevSelected, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(
        filteredData
          .map((item) => item.id?.toString())
          .filter(Boolean) as string[]
      );
    }
  };

  const renderItem = ({ item }: { item: History }) => (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/screens/history/[id]",
          params: { id: String(item.id), title: item.title },
        })
      }
      className={`bg-custom-grey-5 p-3 px-4 rounded-3xl mb-3 flex-row justify-between items-center`}
    >
      <View className="flex-row items-center gap-3">
        <Pressable
          onPress={() => handleSelected(String(item.id))}
          className={`w-5 h-5 rounded-full border border-gray-300 ${
            selectedItems.includes(String(item.id)) ? "bg-blue-300" : "bg-white"
          } `}
        />
        <View>
          <Text className="font-artegra-bold text-base">{item.title}</Text>
          <Text className="text-xs text-gray-500 font-artegra">
            {moment(item.createdAt).format("hh:mm A")}
          </Text>
        </View>
      </View>
      <View className={`px-3 py-1 rounded-full ${item.background}`}>
        <Text className={`text-xs font-artegra text-gray-400`}>
          {item.category === "fuse_link"
            ? "link"
            : item.category === "fuse_link_branch"
            ? "link cabang"
            : item.category === "nh_fuse_substation"
            ? "NH fuse"
            : item.category === "balancer"
            ? "penyeimbang"
            : item.category === "maps"
            ? "maps"
            : "mcb"}
        </Text>
      </View>
    </Pressable>
  );

  const groupedHistory = filteredData.reduce((acc, item) => {
    const itemDate = moment(item.createdAt?.split("T")[0]);
    let group = itemDate.isSame(moment(), "day")
      ? "Hari Ini"
      : itemDate.isSame(moment().subtract(1, "day"), "day")
      ? "Kemarin"
      : itemDate.format("dddd, DD MMM YYYY");

    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {} as Record<string, History[]>);
  console.log(selectedItems);

  return (
    <ThemedView className={`flex-1`}>
      <View className="pt-16 pb-6 px-6 flex-1">
        <View className="flex-row items-center justify-between pb-4">
          <BackButton onBack={() => router.back()} />
          <Text className="font-artegra text-xl">Riwayat</Text>
        </View>
        <View className="flex-row items-center border border-gray-300 rounded-2xl px-4 py-2 mb-4">
          <TextInput
            className="ml-2 flex-1 text-sm text-gray-300"
            placeholder="Cari kategori..."
            placeholderTextColor={"#d1d5db"}
            value={query}
            onChangeText={setQuery}
          />
          <MagnifyingGlass size={20} color="#d1d5db" />
        </View>

        <View className=" pb-3 flex-row justify-between">
          <View className="items-center flex-row-reverse gap-3">
            <Pressable
              onPress={deleteHistories}
              className={`rounded-full border flex-row gap-1 items-center justify-center border-custom-error-1 px-2 ${
                selectedItems.length > 0 ? "bg-custom-error-2" : "bg-white"
              }`}
            >
              <Trash
                size={10}
                color={`${selectedItems.length > 0 ? "white" : "#de5757"}`}
              />
              <Text
                className={`font-artegra text-xs capitalize ${
                  selectedItems.length > 0
                    ? "text-white"
                    : "text-custom-error-2"
                }`}
              >
                hapus
              </Text>
            </Pressable>
          </View>
          <View className="items-center self-end flex-row-reverse gap-3">
            <Pressable
              onPress={toggleSelectAll}
              className={`w-5 h-5 rounded-full border border-gray-300 ${
                selectedItems.length === history.length
                  ? "bg-blue-300"
                  : "bg-white"
              }`}
            />
            <Text className="font-artegra text-xs text-gray-400">Semua</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {Object.entries(groupedHistory).map(([label, items]) => (
            <View key={label} className="mb-4">
              <View className="flex-row gap-3 mb-3 items-center">
                {label === "Hari Ini" ? (
                  <CalendarCheck size={15} weight="light" color="#6b7280" />
                ) : label === "Kemarin" ? (
                  <CalendarMinus size={15} weight="light" color="#6b7280" />
                ) : (
                  <Calendar size={15} weight="light" color="#6b7280" />
                )}
                <Text className="text-gray-500 text-xs font-artegra">
                  {label}
                </Text>
              </View>
              <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item) => String(item.id)}
                scrollEnabled={false}
              />
            </View>
          ))}
        </ScrollView>
      </View>
    </ThemedView>
  );
}
