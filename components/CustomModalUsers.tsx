import React, { useCallback, forwardRef, ReactNode } from "react";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { View, Text, Pressable } from "react-native";
import { Plugs } from "phosphor-react-native";

interface CustomModalProps {
  onSubmit: () => void;
  onClose: () => void;
  onChange?: (index: number) => void;
  title: string;
  description: string;
  submitText: string;
  cancelText: string;
  icon: ReactNode;
  children?: ReactNode;
}

const CustomModalUsers = forwardRef<BottomSheetModal, CustomModalProps>(
  (
    {
      onSubmit,
      onClose,
      onChange,
      title,
      description,
      submitText,
      cancelText,
      icon,
      children,
    },
    ref
  ) => {
    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close"
        />
      ),
      []
    );

    return (
      <BottomSheetModal
        containerStyle={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
        ref={ref}
        $modal
        enableDismissOnClose
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        onChange={onChange}
      >
        <BottomSheetView className="py-5 px-5">
          <Text className="font-artegra-bold text-xl mb-3 text-center">
            {title}
          </Text>
          <Text className="font-artegra text-gray-500 text-sm text-center mb-5">
            {description}
          </Text>
          {children}
          <View className="gap-4 flex-col w-full">
            <Pressable
              className="py-3 items-center justify-center"
              onPress={onClose}
            >
              <Text className="font-artegra-bold text-gray-500">
                {cancelText}
              </Text>
            </Pressable>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

export default CustomModalUsers;
