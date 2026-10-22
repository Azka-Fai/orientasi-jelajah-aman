// src/utils/alertHelper.ts
import { Alert, Platform } from "react-native";

/**
 * Menampilkan dialog konfirmasi aksi (seperti penghapusan cache atau data).
 * Kompatibel untuk platform mobile (Expo Go) dan browser Web tanpa error.
 */
export function konfirmasiAksi(
  judul: string,
  pesan: string,
  onKonfirmasi: () => void,
  teksKonfirmasi: string = "Hapus"
) {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      const setuju = window.confirm(`${judul}\n\n${pesan}`);
      if (setuju) {
        onKonfirmasi();
      }
    } else {
      onKonfirmasi();
    }
  } else {
    Alert.alert(judul, pesan, [
      { text: "Batal", style: "cancel" },
      {
        text: teksKonfirmasi,
        style: "destructive",
        onPress: onKonfirmasi,
      },
    ]);
  }
}
