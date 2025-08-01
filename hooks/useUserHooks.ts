import { currentUser, getAllUsers, logout } from "@/redux/reducers";
import { AppDispatch } from "@/redux/store";
import { User } from "@/types/types";
import { router } from "expo-router";
import { useState } from "react";
import { ToastAndroid } from "react-native";
import { useDispatch } from "react-redux";

interface UserDataProps {
  id?: number;
  closeModal?: () => void;
}
export function useUserData({ id, closeModal }: UserDataProps) {
  const [user, setUser] = useState<User>({});
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const validateUser = async () => {
    setIsLoading(true);
    try {
      const res = await dispatch(currentUser()).unwrap();
      setUser(res.data.user);
    } catch (error) {
      ToastAndroid.show(
        "Gagal memuat pengguna buka ulang aplikasi",
        ToastAndroid.SHORT
      );
      router.replace({ pathname: "/screens/home" });
    } finally {
      setIsLoading(false);
    }
  };

  const validateAllUsers = async () => {
    setIsLoading(true);
    try {
      const res = await dispatch(getAllUsers()).unwrap();
      if (res.data) {
        if (Array.isArray(res.data.user)) {
          setAllUsers(res.data.user);
        } else if (Array.isArray(res.data)) {
          setAllUsers(res.data);
        } else {
          setAllUsers([]);
        }
      } else {
        setAllUsers([]);
      }
    } catch (error) {
      ToastAndroid.show(
        "Gagal memuat pengguna buka ulang aplikasi",
        ToastAndroid.SHORT
      );
      router.replace({ pathname: "/screens/home" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await dispatch(logout()).unwrap();
      ToastAndroid.show("Berhasil keluar", ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show("Gagal keluar", ToastAndroid.SHORT);
    } finally {
      setIsLoading(false);
      if (closeModal) {
        closeModal();
      }
      router.replace("/screens/home");
    }
  };

  return {
    validateUser,
    validateAllUsers,
    user,
    allUsers,
    isLoading,
    handleLogout,
  };
}
