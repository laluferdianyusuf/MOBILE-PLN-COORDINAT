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
import { register } from "@/redux/reducers";

interface RegisterScreenProps {
  isAdmin?: string;
}

interface RegisterFormData {
  name: string;
  username: string;
  address: string;
  email: string;
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
    name: z
      .string({
        required_error: "Nama tidak boleh kosong",
      })
      .min(4, "Nama harus memiliki minimal 4 karakter"),
    username: z
      .string({
        required_error: "Username tidak boleh kosong",
      })
      .min(4, "Username harus memiliki minimal 4 karakter"),
    address: z
      .string({
        required_error: "Alamat tidak boleh kosong",
      })
      .startsWith("Jl.", "Alamat harus diawali dengan 'JL.'"),
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
      const res = await dispatch(register(data)).unwrap();
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
            <Text className="font-artegra-bold capitalize text-xl text-custom-light-blue-2">
              Daftarkan diri
            </Text>
            <Text className="font-artegra text-justify text-custom-grey-2">
              Bergabunglah dengan kami! Daftarkan diri untuk menikmati layanan
              lengkap.
            </Text>
          </View>
          <View className="gap-7">
            <View className="gap-3">
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <CustomInput
                    placeholder="Nama"
                    value={value}
                    keyboard="default"
                    onChange={onChange}
                    icon={"person-circle-outline"}
                    border="border-custom-grey-3"
                    background="bg-custom-grey-3"
                    paddingHorizontal="py-3"
                    paddingVertical="px-5"
                    activeBorder="border-custom-light-blue-1"
                    errorMessage={errors.name?.message || apiError}
                  />
                )}
              />
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
                name="address"
                render={({ field: { onChange, value } }) => (
                  <CustomInput
                    placeholder="Aalamat"
                    value={value}
                    keyboard="default"
                    onChange={onChange}
                    icon={"person-circle-outline"}
                    border="border-custom-grey-3"
                    background="bg-custom-grey-3"
                    paddingHorizontal="py-3"
                    paddingVertical="px-5"
                    activeBorder="border-custom-light-blue-1"
                    errorMessage={errors.address?.message || apiError}
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
              className="bg-custom-light-blue-2 p-3 rounded-xl"
            >
              <Text className="font-artegra text-white text-center">
                Daftar
              </Text>
            </Pressable>
          </View>
          <View className="gap-4">
            <View className="flex-row items-center justify-center gap-3">
              <View className="h-[2px] flex-1 bg-custom-grey-4" />
              <Text className="font-artegra-bold capitalize text-custom-grey-4">
                masuk ke akun
              </Text>
              <View className="h-[2px] flex-1 bg-custom-grey-4" />
            </View>
            <View className="flex-row items-center gap-1 justify-center">
              <Text className="font-artegra capitalize text-custom-grey-2">
                sudah mempunyai akun ?
              </Text>
              <Pressable onPress={handleRouter}>
                <Text className="font-artegra-bold text-custom-light-blue-2 capitalize">
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
