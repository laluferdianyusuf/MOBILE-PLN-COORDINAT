import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { BackButton, CustomInput } from "@/components";
import { ThemedView } from "@/components/ThemedView";
import { changePassword } from "@/redux/reducers";
import { AppDispatch } from "@/redux/store";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { z } from "zod";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Password sekarang tidak boleh kosong"),
    password: z.string().min(8, "Password baru minimal 8 karakter"),
    reTypePassword: z.string().min(8, "Konfirmasi password minimal 8 karakter"),
  })
  .refine((data) => data.password === data.reTypePassword, {
    message: "Password baru dan konfirmasi tidak sama",
    path: ["reTypePassword"],
  });

type ChangePasswordData = z.infer<typeof changePasswordSchema>;

const PasswordScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch: AppDispatch = useDispatch();
  const [apiError, setApiError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordData) => {
    setIsLoading(true);
    try {
      const payload = { ...data, id };
      await dispatch(changePassword(payload)).unwrap();
      ToastAndroid.show("Berhasil mengganti password", ToastAndroid.SHORT);
      router.push("/(tabs)");
    } catch (error: any) {
      setApiError(error || "Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView className="flex-1">
      <View className="pt-16 pb-6 px-6 flex-1">
        <BackButton onBack={() => router.back()} />
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerClassName="gap-12 justify-center"
        >
          <View className="gap-3">
            <Text className="font-artegra-bold text-xl text-custom-light-blue-2">
              Ganti Password
            </Text>
            <Text className="font-artegra text-custom-grey-2">
              Masukkan password saat ini dan password baru Anda.
            </Text>
          </View>

          <View className="gap-7">
            <View className="gap-3">
              <Controller
                control={control}
                name="currentPassword"
                render={({ field: { onChange, value } }) => (
                  <CustomInput
                    placeholder="Password Saat Ini"
                    value={value}
                    keyboard="default"
                    onChange={onChange}
                    icon="lock-closed-outline"
                    isPassword
                    border="border-custom-grey-3"
                    background="bg-custom-grey-3"
                    paddingHorizontal="py-3"
                    paddingVertical="px-5"
                    activeBorder="border-custom-light-blue-1"
                    errorMessage={errors.currentPassword?.message || ""}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <CustomInput
                    placeholder="Password Baru"
                    value={value}
                    keyboard="default"
                    onChange={onChange}
                    icon="lock-closed-outline"
                    isPassword
                    border="border-custom-grey-3"
                    background="bg-custom-grey-3"
                    paddingHorizontal="py-3"
                    paddingVertical="px-5"
                    activeBorder="border-custom-light-blue-1"
                    errorMessage={errors.password?.message || ""}
                  />
                )}
              />

              <Controller
                control={control}
                name="reTypePassword"
                render={({ field: { onChange, value } }) => (
                  <CustomInput
                    placeholder="Ulangi Password Baru"
                    value={value}
                    keyboard="default"
                    onChange={onChange}
                    icon="lock-closed-outline"
                    isPassword
                    border="border-custom-grey-3"
                    background="bg-custom-grey-3"
                    paddingHorizontal="py-3"
                    paddingVertical="px-5"
                    activeBorder="border-custom-light-blue-1"
                    errorMessage={errors.reTypePassword?.message || apiError}
                  />
                )}
              />
            </View>

            <Pressable
              onPress={handleSubmit(onSubmit)}
              className="bg-custom-light-blue-2 p-3 rounded-xl"
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="font-artegra text-white text-center">
                  Simpan Perubahan
                </Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </ThemedView>
  );
};

export default PasswordScreen;
