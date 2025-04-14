import React, { ReactNode, Ref, useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Eye, EyeSlash } from "phosphor-react-native";

interface CustomInputProps {
  title?: string;
  placeholder: string;
  icon?: ReactNode;
  keyboard?:
    | "default"
    | "email-address"
    | "numeric"
    | "phone-pad"
    | "decimal-pad";
  isPassword?: boolean;
  style?: string;
  onChange?: (text: string) => void;
  value: string;
  disabled?: boolean;
  maxLength?: number;
  multiline?: boolean;
  border?: string;
  background?: string;
  paddingHorizontal?: string;
  paddingVertical?: string;
  activeBorder?: string;
  errorMessage?: string;
}

export const CustomInput = (
  {
    title,
    placeholder,
    icon,
    keyboard = "default",
    isPassword = false,
    style = "w-full",
    onChange,
    value,
    disabled = false,
    maxLength,
    multiline = false,
    border = "border-custom-light-blue-1",
    background = "bg-transparent",
    paddingHorizontal = "py-1",
    paddingVertical = "px-5",
    activeBorder = "border-custom-light-blue-1",
    errorMessage,
  }: CustomInputProps,
  ref: Ref<TextInput>
) => {
  const { colors, dark } = useTheme();
  const [secureText, setSecureText] = useState(isPassword);
  const [isFocused, setIsFocused] = useState(false);

  const toggleSecureText = () => {
    setSecureText(!secureText);
  };

  return (
    <View className={`mb-2 ${style}`}>
      {title && (
        <Text className="font-inter font-bold text-md capitalize opacity-75">
          {title}
        </Text>
      )}
      <View
        className={`mt-2 border ${
          isFocused ? activeBorder : border
        } ${background} rounded-2xl flex-row items-center gap-3 ${paddingHorizontal} ${paddingVertical}`}
      >
        <TextInput
          ref={ref}
          onChangeText={onChange}
          keyboardType={keyboard}
          placeholder={placeholder}
          placeholderTextColor={"#94a3b8"}
          secureTextEntry={secureText}
          style={{
            fontFamily: "Inter",
            color: "black",
          }}
          className={`flex-1`}
          value={value}
          editable={!disabled}
          maxLength={maxLength}
          multiline={multiline}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          importantForAutofill="no"
        />
        {isPassword ? (
          <Pressable onPress={toggleSecureText}>
            {secureText ? (
              <Eye size={20} color="#c0e5f7" />
            ) : (
              <EyeSlash size={20} color="#2fabe0" />
            )}
          </Pressable>
        ) : null}
      </View>
      {errorMessage && (
        <Text className="text-custom-error-2 font-inter text-xs">
          {errorMessage}
        </Text>
      )}
    </View>
  );
};
