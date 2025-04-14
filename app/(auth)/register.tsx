import React from "react";
import { useLocalSearchParams } from "expo-router";
import RegisterScreen from "../screens/RegisterScreen";

export default function register() {
  const { isAdmin } = useLocalSearchParams();

  return <RegisterScreen isAdmin={isAdmin as string} />;
}
