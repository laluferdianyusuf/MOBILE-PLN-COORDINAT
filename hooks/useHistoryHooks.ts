import {
  generateHistory,
  getAllHistoryByUserId,
  getAllHistoryByCategory,
  deleteHistory,
} from "@/redux/reducers/historyReducer";
import { AppDispatch } from "@/redux/store";
import { History, User } from "@/types/types";
import { useState } from "react";
import { ToastAndroid } from "react-native";
import { useDispatch } from "react-redux";

interface UseHistoryDataProps {
  id?: string[];
  user_id?: string;
  closeModal?: () => void;
  value?: any;
}

export function useHistoryData({
  id,
  user_id,
  closeModal,
  value,
}: UseHistoryDataProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingGenerate, setIsLoadingGenerate] = useState<boolean>(false);
  const [history, setIsHistory] = useState<History[]>([]);
  console.log("id", id);

  const generateNewHistory = async () => {
    setIsLoadingGenerate(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        id: user_id!,
        data: value,
      };

      const res = await dispatch(generateHistory(payload)).unwrap();

      ToastAndroid.show("Berhasil menyimpan data", ToastAndroid.SHORT);
      setSuccess("History created successfully");

      await validateHistoryByUserId();
    } catch (error: any) {
      const errorMsg = error?.message || "Gagal menyimpan data";
      ToastAndroid.show(errorMsg, ToastAndroid.SHORT);
      setError(errorMsg);
    } finally {
      closeModal?.();
      setIsLoadingGenerate(false);
    }
  };

  const validateHistoryByUserId = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await dispatch(
        getAllHistoryByUserId({ id: user_id! })
      ).unwrap();

      setIsHistory(res.data.history || []);
      setSuccess("Histories validated successfully");
    } catch (error) {
      setError("Error validate");
    } finally {
      setIsLoading(false);
    }
  };

  const validateHistoryByCategory = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await dispatch(
        getAllHistoryByCategory({ id: user_id! })
      ).unwrap();

      setIsHistory(res.data.history || []);
      setSuccess("Histories validated successfully");
    } catch (error) {
      setError("Error validate");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteHistories = async () => {
    if (!id) {
      ToastAndroid.show("ID tidak ditemukan", ToastAndroid.SHORT);
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(deleteHistory({ data: id })).unwrap();

      ToastAndroid.show("Berhasil menghapus riwayat", ToastAndroid.SHORT);
      await validateHistoryByUserId();
      await validateHistoryByCategory();
    } catch (error: any) {
      ToastAndroid.show(
        error?.message || "Gagal menghapus riwayat",
        ToastAndroid.SHORT
      );
      console.log(error);
    } finally {
      closeModal?.();
      setIsLoading(false);
    }
  };

  return {
    validateHistoryByUserId,
    history,
    error,
    success,
    isLoading,
    deleteHistories,
    generateNewHistory,
    isLoadingGenerate,
    validateHistoryByCategory,
  };
}
