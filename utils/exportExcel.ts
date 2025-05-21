import {
  cacheDirectory,
  EncodingType,
  writeAsStringAsync,
} from "expo-file-system";
import XLSX from "xlsx";
import { shareAsync, isAvailableAsync } from "expo-sharing";
import { ToastAndroid } from "react-native";

interface FilteredDataItem {
  Tanggal: string;
  Kategori: string;
  Judul: string;
  Deskripsi: string;
  Lokasi?: string;
  Nilai: string;
}

export const generateAndShareExcel = async (history: any[]) => {
  try {
    const formattedData = history.map((item) => {
      const lokasi = item?.value?.address ? item.value.address : undefined;

      return {
        Tanggal: item.createdAt,
        Kategori: item.category,
        Judul: item.title,
        Deskripsi: item.description,
        Lokasi: lokasi,
        Nilai: JSON.stringify(item?.value),
      };
    });

    const columns = Object.keys(formattedData[0]).filter(
      (key) =>
        key !== "Lokasi" ||
        formattedData.some((item) => item.Lokasi !== undefined)
    );

    const filteredData = formattedData.map((item) => {
      const filteredItem: any = {};
      columns.forEach(
        (column) =>
          (filteredItem[column] = item[column as keyof FilteredDataItem])
      );
      return filteredItem;
    });

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Riwayat");

    const wbout = XLSX.write(workbook, { type: "base64", bookType: "xlsx" });

    const fileName = `${cacheDirectory}PEKA Listrik-${Date.now()}.xlsx`;

    await writeAsStringAsync(fileName, wbout, {
      encoding: EncodingType.Base64,
    });

    if (await isAvailableAsync()) {
      await shareAsync(fileName, {
        mimeType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        dialogTitle: "Bagikan File Excel",
      });
      ToastAndroid.show("Berhasil dibagikan", ToastAndroid.SHORT);
    } else {
      ToastAndroid.show("Fitur berbagi tidak tersedia", ToastAndroid.SHORT);
    }
  } catch (error) {
    console.error("Gagal membuat atau membagikan file Excel:", error);
    ToastAndroid.show(
      "Gagal membuat atau membagikan file Excel",
      ToastAndroid.SHORT
    );
  }
};
