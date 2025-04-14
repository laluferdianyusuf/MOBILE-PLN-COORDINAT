import { CustomInput } from "@/components";
import { ThemedView } from "@/components/ThemedView";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { registerAdmin, registerUser } from "@/redux/reducers";

interface RegisterScreenProps {
  isAdmin?: string;
}

interface RegisterFormData {
  email: string;
  username: string;
  password: string;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ isAdmin }) => {
  const dispatch: AppDispatch = useDispatch();
  const [apiError, setApiError] = useState<string>("");

  const registerSchema = z.object({
    email: z
      .string({
        required_error: "Email tidak boleh kosong",
      })
      .email("Format Email harus valid"),
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
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const handleRegister = async (data: RegisterFormData) => {
    try {
      if (isAdmin === "true") {
        const res = await dispatch(registerAdmin(data)).unwrap();
        console.log(res);
      } else {
        const res = await dispatch(registerUser(data)).unwrap();
        console.log(res);
      }
      router.push("/(auth)/login");
    } catch (error: any) {
      console.log(error);

      if (error?.message) {
        setApiError(error?.message);

        if (error?.message.includes("Username")) {
          setError("username", { message: "Incorrect username" });
        } else if (error?.message.includes("Email")) {
          setError("password", { message: "Incorrect password" });
        } else if (error?.message.includes("Password")) {
          setError("password", { message: "Incorrect password" });
        }
      } else {
        setApiError("An unexpected error occurred.");
      }
    }
  };

  const handleRouter = () => {
    if (isAdmin === "true") {
      router.back();
    } else {
      router.push({ pathname: "/(auth)/login" });
    }
  };
  return (
    <ThemedView className={`flex-1`}>
      <View className="pt-16 pb-6 px-6 flex-1 justify-center">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerClassName="gap-12 justify-center"
        >
          <View className="gap-3">
            <Text className="font-inter font-bold capitalize text-xl text-custom-light-blue-1">
              Daftarkan akunmu
            </Text>
            <Text className="font-inter text-justify text-custom-grey-2">
              Bergabunglah dengan kami! Daftarkan akun Anda untuk menikmati
              layanan lengkap Aduanku.
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
                name="email"
                render={({ field: { onChange, value } }) => (
                  <CustomInput
                    placeholder="Email"
                    value={value}
                    keyboard="email-address"
                    onChange={onChange}
                    icon={"mail-outline"}
                    border="border-custom-grey-3"
                    background="bg-custom-grey-3"
                    paddingHorizontal="py-3"
                    paddingVertical="px-5"
                    activeBorder="border-custom-light-blue-1"
                    errorMessage={errors.email?.message || apiError}
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
              onPress={handleSubmit(handleRegister)}
              className="bg-custom-light-blue-1 p-3 rounded-xl"
            >
              <Text className="font-inter text-white text-center">Daftar</Text>
            </Pressable>
          </View>
          <View className="gap-4">
            <View className="flex-row items-center justify-center gap-3">
              <View className="h-[2px] flex-1 bg-custom-grey-4" />
              <Text className="font-inter font-bold capitalize text-custom-grey-4">
                masuk ke akun
              </Text>
              <View className="h-[2px] flex-1 bg-custom-grey-4" />
            </View>
            <View className="flex-row items-center gap-1 justify-center">
              <Text className="font-inter capitalize text-custom-grey-2">
                sudah mempunyai akun ?
              </Text>
              <Pressable onPress={handleRouter}>
                <Text className="font-inter font-bold text-custom-light-blue-1 capitalize">
                  masuk
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    </ThemedView>
  );
};

export default RegisterScreen;
