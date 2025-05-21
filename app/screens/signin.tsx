import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { BackButton, CustomInput } from "@/components";
import { ThemedView } from "@/components/ThemedView";
import { login } from "@/redux/reducers";
import { AppDispatch } from "@/redux/store";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { z } from "zod";

interface LoginFormData {
  username: string;
  password: string;
  role?: string;
}

const signin: React.FC = ({}) => {
  const { role } = useLocalSearchParams();
  const dispatch: AppDispatch = useDispatch();
  const [apiError, setApiError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const loginSchema = z.object({
    username: z
      .string({
        required_error: "Username tidak boleh kosong",
      })
      .min(4, "Username harus memiliki minimal 4 karakter"),
    password: z
      .string({
        required_error: "Password tidak boleh kosong",
      })
      .min(8, "Password harus memiliki minimal 8 karakter"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        role: typeof role === "string" ? role : undefined,
      };
      await dispatch(login(payload)).unwrap();
      router.push("/(tabs)");
    } catch (error: any) {
      if (error?.message) {
        setApiError(error?.message);

        if (error?.message.includes("Username")) {
          setError("username", { message: "Incorrect username" });
        } else if (error?.message.includes("Password")) {
          setError("password", { message: "Incorrect password" });
        }
      } else {
        setApiError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView className={`flex-1`}>
      <View className="pt-16 pb-6 px-6 flex-1">
        <View className="">
          <BackButton onBack={() => router.back()} />
        </View>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerClassName="gap-12 justify-center"
        >
          <View className="gap-3">
            <Text className="font-artegra-bold capitalize text-xl text-custom-light-blue-2">
              Selamat Datang
            </Text>
            <Text className="font-artegra text-justify text-custom-grey-2">
              Selamat datang kembali! Masukkan username dan password Anda untuk
              mengakses akun Anda.
            </Text>
          </View>
          <View className="gap-7">
            <View className="gap-3">
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, value } }) => (
                  <CustomInput
                    placeholder="Username"
                    value={value}
                    keyboard="default"
                    onChange={onChange}
                    icon={"person-circle-outline"}
                    border="border-custom-grey-3"
                    background="bg-custom-grey-3"
                    paddingHorizontal="py-3"
                    paddingVertical="px-5"
                    activeBorder="border-custom-light-blue-1"
                    errorMessage={errors.username?.message || apiError}
                  />
                )}
              />
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <CustomInput
                    placeholder="Password"
                    value={value}
                    keyboard="default"
                    onChange={onChange}
                    icon={"lock-closed-outline"}
                    border="border-custom-grey-3"
                    background="bg-custom-grey-3"
                    paddingHorizontal="py-3"
                    paddingVertical="px-5"
                    activeBorder="border-custom-light-blue-1"
                    isPassword={true}
                    errorMessage={errors.password?.message || apiError}
                  />
                )}
              />
            </View>
            <Pressable
              onPress={handleSubmit(handleLogin)}
              className="bg-custom-light-blue-2 p-3 rounded-xl"
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="font-artegra text-white text-center">
                  Masuk
                </Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </ThemedView>
  );
};

export default signin;
