import React, { useCallback, useEffect, useRef, useState } from "react";
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
  FileXls,
  MagnifyingGlass,
  Trash,
} from "phosphor-react-native";
import moment from "moment";
import { ThemedView } from "@/components/ThemedView";
import { BackButton, LoadingWave } from "@/components";
import "moment/locale/id";
import { useUserData } from "@/hooks/useUserHooks";
import { useHistoryData } from "@/hooks/useHistoryHooks";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import CustomModal from "@/components/CustomModal";
import EmptyItem from "@/components/EmptyItem";
import { generateAndShareExcel } from "@/utils/exportExcel";
import CustomModalUsers from "@/components/CustomModalUsers";

moment.locale("id");

export default function HistoryList() {
  const { user, validateUser, validateAllUsers, allUsers } = useUserData({});
  const router = useRouter();

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [query, setQuery] = useState<string>("");
  const [filteredData, setFilteredData] = useState<History[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  // modal refs
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const bottomSheetUserRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleCloseModalPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);
  const handleOpenUserModal = useCallback(() => {
    bottomSheetUserRef.current?.present();
  }, []);
  const handleCloseUserModal = useCallback(() => {
    bottomSheetUserRef.current?.dismiss();
  }, []);

  const {
    validateHistoryByUserId,
    history,
    isLoading: isHistoryLoading,
    deleteHistories,
  } = useHistoryData({
    user_id: selectedUser || user.userId,
    id: selectedItems,
    closeModal: handleCloseModalPress,
  });

  useEffect(() => {
    validateUser();
    validateAllUsers();
  }, []);

  useEffect(() => {
    if (user?.userId) {
      setSelectedUser(user.userId);
    }
  }, [user]);

  useEffect(() => {
    if (selectedUser) {
      setIsFetching(true);
      setFilteredData([]);
      validateHistoryByUserId().finally(() => {
        setIsFetching(false);
      });
    }
  }, [selectedUser]);

  useEffect(() => {
    if (query.trim() === "") {
      setFilteredData(history);
    } else {
      const q = query.toLowerCase();
      const filtered = history.filter(
        (item) =>
          (item.category ?? "").toLowerCase().includes(q) ||
          (item.description ?? "").toLowerCase().includes(q) ||
          (item.title ?? "").toLowerCase().includes(q) ||
          (item.type ?? "").toLowerCase().includes(q)
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
          params: { id: Number(item.id), title: item.title },
        })
      }
      className={`bg-custom-grey-5 p-3 px-4 rounded-3xl mb-3 flex-row justify-between items-center`}
    >
      <View className="flex-row items-center gap-3 flex-1">
        <Pressable
          onPress={() => handleSelected(String(item.id))}
          className={`w-5 h-5 rounded-full border  ${
            selectedItems.includes(String(item.id))
              ? "bg-custom-info-1 border-custom-info-2"
              : "bg-white border-gray-300"
          } `}
          disabled={user.role !== "supervisor"}
        />
        <View>
          <Text
            className="font-artegra-bold text-base"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.title}
          </Text>
          <View className="flex-row items-center gap-2">
            <Text className="text-xs text-gray-500 font-artegra">
              {moment(item.createdAt).format("hh:mm A")}
            </Text>
            {item.type && (
              <>
                <View className="w-[1px] h-1/2 bg-gray-500" />
                <Text
                  className="text-xs text-gray-500 font-artegra"
                  ellipsizeMode="tail"
                >
                  {item.type}
                </Text>
              </>
            )}
          </View>
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
            : item.category === "lwbp"
            ? "lwbp"
            : item.category === "wbp"
            ? "wbp"
            : item.category === "maps"
            ? "maps"
            : item.category === "saidi"
            ? "saidi"
            : item.category === "saifi"
            ? "saifi"
            : item.category === "ens"
            ? "ens"
            : item.category === "mcb_1_phase"
            ? "1 phase"
            : "3 phase"}
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

  const mapUserName = (name: string) => {
    switch (name) {
      case "Supervisor":
        return "SUPER ADMIN";
      case "ULP 1":
        return "ULP ALAS";
      case "ULP 2":
        return "ULP TALIWANG";
      case "ULP 3":
        return "ULP SAMAWAREA";
      case "ULP 4":
        return "EMPANG";
      default:
        return "User";
    }
  };

  return (
    <ThemedView className={`flex-1`}>
      <GestureHandlerRootView className="flex-1 justify-center">
        <BottomSheetModalProvider>
          <View className="pt-16 pb-6 px-6 flex-1">
            {/* Header */}
            <View className="flex-row items-center justify-between pb-4">
              <BackButton onBack={() => router.back()} />
              <Text className="font-artegra text-xl">Riwayat</Text>
            </View>

            {/* Search */}
            <View className="flex-row items-center border border-gray-300 rounded-2xl px-4 py-2 mb-4">
              <TextInput
                className="ml-2 flex-1 text-sm text-gray-600"
                placeholder="Cari data yang dibutuhkan..."
                placeholderTextColor={"#d1d5db"}
                value={query}
                onChangeText={setQuery}
              />
              <MagnifyingGlass size={20} color="#d1d5db" />
            </View>

            {/* Actions */}
            <View className="pb-3 flex-row justify-between">
              <View className="items-center flex-row gap-3">
                {user.role === "supervisor" && (
                  <Pressable
                    disabled={selectedItems.length < 1}
                    onPress={handlePresentModalPress}
                    className={`rounded-full border flex-row gap-1 items-center justify-center border-custom-error-1 px-2 ${
                      selectedItems.length > 0
                        ? "bg-custom-error-2 opacity-100"
                        : "bg-custom-error-1 opacity-50"
                    }`}
                  >
                    <Trash
                      size={10}
                      color={`${
                        selectedItems.length > 0 ? "white" : "#de5757"
                      }`}
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
                )}

                <Pressable
                  onPress={() => generateAndShareExcel(filteredData)}
                  className={`rounded-full border flex-row gap-1 items-center justify-center bg-custom-success-1 border-custom-success-2 px-2`}
                >
                  <FileXls size={10} color={`#47a855`} />
                  <Text className="font-artegra text-xs capitalize text-custom-success-2">
                    excel
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleOpenUserModal}
                  className={`rounded-full border flex-row gap-1 items-center justify-center bg-blue-100 border-blue-300 px-2`}
                  disabled={user.role !== "supervisor"}
                >
                  <Text className="font-artegra text-xs capitalize text-blue-500">
                    {selectedUser
                      ? mapUserName(
                          allUsers.find((u) => u.userId === selectedUser)
                            ?.name || "User"
                        )
                      : "User"}
                  </Text>
                </Pressable>
              </View>
              {user.role === "supervisor" && (
                <View className="items-center self-end flex-row-reverse gap-3">
                  <Pressable
                    onPress={toggleSelectAll}
                    className={`w-5 h-5 rounded-full border  ${
                      selectedItems.length === filteredData.length &&
                      filteredData.length > 0
                        ? "bg-custom-info-1 border-custom-info-2"
                        : "bg-white border-gray-300"
                    }`}
                  />
                  <Text className="font-artegra text-xs text-gray-400">
                    Semua
                  </Text>
                </View>
              )}
            </View>

            {isFetching || isHistoryLoading ? (
              <LoadingWave />
            ) : filteredData.length > 0 ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                {Object.entries(groupedHistory).map(([label, items]) => (
                  <View key={label} className="mb-4">
                    <View className="flex-row gap-3 mb-3 items-center">
                      {label === "Hari Ini" ? (
                        <CalendarCheck
                          size={15}
                          weight="light"
                          color="#6b7280"
                        />
                      ) : label === "Kemarin" ? (
                        <CalendarMinus
                          size={15}
                          weight="light"
                          color="#6b7280"
                        />
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
            ) : (
              <EmptyItem
                text="Tidak ada riwayat"
                desc="Silahkan buat pengukuran sudut dan perhitungan terlebih dahulu"
              />
            )}
          </View>

          <CustomModal
            onSubmit={deleteHistories}
            onClose={handleCloseModalPress}
            title="Yakin ingin menghapus data?"
            description="Data yang kamu pilih akan dihapus secara permanen dan tidak bisa dikembalikan. Pastikan kamu sudah mengeceknya dengan benar."
            submitText="Ya, Hapus Sekarang"
            cancelText="Tidak, Batalkan"
            ref={bottomSheetModalRef}
            icon={<Trash size={50} color="#de5757" />}
          />

          <CustomModalUsers
            onSubmit={() => {}}
            onClose={handleCloseUserModal}
            title="Pilih User"
            description="Pilih salah satu user untuk melihat riwayatnya"
            submitText=""
            cancelText="Tutup"
            ref={bottomSheetUserRef}
            icon={<></>}
          >
            <FlatList
              data={allUsers.filter((u) =>
                ["Supervisor", "ULP 1", "ULP 2", "ULP 3", "ULP 4"].includes(
                  u.name ?? ""
                )
              )}
              keyExtractor={(u) => String(u.id)}
              numColumns={2}
              contentContainerStyle={{ paddingVertical: 10 }}
              columnWrapperStyle={{ gap: 10, justifyContent: "flex-start" }}
              renderItem={({ item: u }) => {
                const label =
                  u.name === "Supervisor"
                    ? "SUPER ADMIN"
                    : u.name === "ULP 1"
                    ? "ULP ALAS"
                    : u.name === "ULP 2"
                    ? "ULP TALIWANG"
                    : u.name === "ULP 3"
                    ? "ULP SAMAWAREA"
                    : u.name === "ULP 4"
                    ? "EMPANG"
                    : null;

                return (
                  <Pressable
                    onPress={() => {
                      setSelectedUser(u.userId as string);
                      handleCloseUserModal();
                    }}
                    className="flex-1 p-3 rounded-xl mb-3 bg-gray-100"
                  >
                    <Text className="text-sm capitalize font-artegra text-center">
                      {label}
                    </Text>
                  </Pressable>
                );
              }}
            />
          </CustomModalUsers>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </ThemedView>
  );
}
