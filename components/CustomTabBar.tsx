import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { House, User, UserCircle } from "phosphor-react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const routes = [
    { name: "index", icon: House },
    { name: "explore", icon: UserCircle },
  ];

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const { options } = descriptors[route.key];
        const Icon = routes[index]?.icon || House;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            onPress={onPress}
            style={[styles.button, isFocused && styles.activeButton]}
          >
            <Icon size={24} color={isFocused ? "#000" : "#fff"} weight="fill" />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomTabBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "black",
    borderRadius: 30,
    paddingVertical: 6,
    padding: 2,
    position: "absolute",
    bottom: 10,
    left: 20,
    alignSelf: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  button: {
    marginHorizontal: 6,
    padding: 10,
    borderRadius: 999,
    backgroundColor: "#333333",
  },
  activeButton: {
    backgroundColor: "#ffffff",
  },
});
