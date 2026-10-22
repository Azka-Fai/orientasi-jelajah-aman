// src/app/tambah-favorit.tsx
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { tambahFavorit } from "../services/favoritStorage";
import { useAppTheme } from "../context/ThemeContext";

export default function ModalTambahFavorit() {
  const { id, nama, lat, lon } = useLocalSearchParams<{
    id: string;
    nama: string;
    lat: string;
    lon: string;
  }>();

  const { colors } = useAppTheme();

  async function simpan() {
    await tambahFavorit({
      id: Number(id),
      nama: nama || "Kota",
      latitude: Number(lat || 0),
      longitude: Number(lon || 0),
    });
    router.back();
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.iconWrapper,
            { backgroundColor: colors.backgroundElement },
          ]}
        >
          <Ionicons name="heart" size={36} color={colors.danger} />
        </View>

        <Text style={[styles.judul, { color: colors.text }]}>
          Tambah ke Favorit
        </Text>

        <Text style={[styles.deskripsi, { color: colors.textSecondary }]}>
          Apakah Anda ingin menyimpan kota{" "}
          <Text style={{ fontWeight: "700", color: colors.text }}>{nama}</Text> ke
          dalam daftar favorit untuk akses cepat?
        </Text>

        <View style={styles.tombolContainer}>
          <TouchableOpacity
            style={[styles.tombolBatal, { borderColor: colors.border }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.teksBatal, { color: colors.textSecondary }]}>
              Batal
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tombolSimpan, { backgroundColor: colors.tint }]}
            onPress={simpan}
          >
            <Ionicons name="checkmark" size={18} color="#FFFFFF" />
            <Text style={styles.teksSimpan}>Simpan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
    gap: 12,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  judul: {
    fontSize: 20,
    fontWeight: "bold",
  },
  deskripsi: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  tombolContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
    width: "100%",
  },
  tombolBatal: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
  },
  teksBatal: {
    fontSize: 14,
    fontWeight: "600",
  },
  tombolSimpan: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  teksSimpan: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
