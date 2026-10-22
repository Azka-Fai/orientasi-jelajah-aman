// src/app/(tabs)/pengaturan.tsx
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

import { ThemeMode, useAppTheme } from "../../context/ThemeContext";
import { hapusSemuaCache } from "../../services/cacheRepository";
import { hapusSemuaRiwayatPencarian } from "../../services/riwayatPencarianStorage";
import { konfirmasiAksi } from "../../utils/alertHelper";

interface OpsiTema {
  id: ThemeMode;
  label: string;
  deskripsi: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const DAFTAR_OPSI_TEMA: OpsiTema[] = [
  {
    id: "light",
    label: "Terang",
    deskripsi: "Tampilan bersih dengan latar belakang cerah",
    icon: "sunny-outline",
  },
  {
    id: "dark",
    label: "Gelap",
    deskripsi: "Menghemat baterai dan nyaman untuk mata di malam hari",
    icon: "moon-outline",
  },
  {
    id: "system",
    label: "Ikuti Sistem",
    deskripsi: "Menyesuaikan otomatis dengan pengaturan perangkat",
    icon: "phone-portrait-outline",
  },
];

export default function TabPengaturan() {
  const { mode, setMode, colors, warnaAktif } = useAppTheme();
  const [pesan, setPesan] = useState<string | null>(null);

  function konfirmasiHapusSeluruhCache() {
    konfirmasiAksi(
      "Konfirmasi Hapus Semua Cache",
      "Apakah Anda yakin ingin menghapus seluruh data cuaca tersimpan dari perangkat?",
      async () => {
        await hapusSemuaCache();
        setPesan("Seluruh data cache cuaca berhasil dihapus.");
        setTimeout(() => setPesan(null), 4000);
      }
    );
  }

  function konfirmasiHapusSeluruhRiwayat() {
    konfirmasiAksi(
      "Konfirmasi Hapus Riwayat",
      "Apakah Anda yakin ingin menghapus seluruh riwayat pencarian kota?",
      async () => {
        await hapusSemuaRiwayatPencarian();
        setPesan("Seluruh riwayat pencarian kota berhasil dihapus.");
        setTimeout(() => setPesan(null), 4000);
      }
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["bottom"]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* PESAN NOTIFIKASI */}
        {pesan && (
          <View
            style={[
              styles.pesanBanner,
              { backgroundColor: colors.successBackground, borderColor: colors.success },
            ]}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={18}
              color={colors.success}
            />
            <Text style={[styles.pesanTeks, { color: colors.success }]}>
              {pesan}
            </Text>
          </View>
        )}

        {/* SEKSI 1: PENGATURAN TEMA (Tugas 4) */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Mode Tampilan (Tema)
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Pilih tema tampilan aplikasi sesuai preferensi Anda
          </Text>

          <View style={styles.cardList}>
            {DAFTAR_OPSI_TEMA.map((opsi) => {
              const isSelected = mode === opsi.id;
              return (
                <TouchableOpacity
                  key={opsi.id}
                  style={[
                    styles.cardOpsi,
                    {
                      backgroundColor: colors.cardBackground,
                      borderColor: isSelected ? colors.tint : colors.border,
                      borderWidth: isSelected ? 2 : 1,
                    },
                  ]}
                  onPress={() => setMode(opsi.id)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={`Pilih mode ${opsi.label}`}
                >
                  <View
                    style={[
                      styles.iconContainer,
                      {
                        backgroundColor: isSelected
                          ? colors.tint
                          : colors.backgroundElement,
                      },
                    ]}
                  >
                    <Ionicons
                      name={opsi.icon}
                      size={20}
                      color={isSelected ? "#FFFFFF" : colors.textSecondary}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.labelOpsi,
                        {
                          color: colors.text,
                          fontWeight: isSelected ? "700" : "600",
                        },
                      ]}
                    >
                      {opsi.label}
                    </Text>
                    <Text
                      style={[
                        styles.deskripsiOpsi,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {opsi.deskripsi}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.radioCircle,
                      {
                        borderColor: isSelected ? colors.tint : colors.border,
                        backgroundColor: isSelected ? colors.tint : "transparent",
                      },
                    ]}
                  >
                    {isSelected && (
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.statusTemaAktif, { color: colors.textMuted }]}>
            Tema aktif saat ini:{" "}
            <Text style={{ fontWeight: "700", color: colors.tint }}>
              {warnaAktif === "dark" ? "Gelap (Dark Mode)" : "Terang (Light Mode)"}
            </Text>
          </Text>
        </View>

        {/* SEKSI 2: KELOLA PENYIMPANAN & CACHE */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Penyimpanan & Data Lokal
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Pengelolaan cache SQLite dan riwayat pencarian di perangkat
          </Text>

          <View
            style={[
              styles.boxKelola,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.barisTindakan}
              onPress={konfirmasiHapusSeluruhCache}
            >
              <View
                style={[
                  styles.iconAksi,
                  { backgroundColor: colors.dangerBackground },
                ]}
              >
                <Ionicons
                  name="cloud-offline-outline"
                  size={18}
                  color={colors.danger}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.judulAksi, { color: colors.text }]}>
                  Hapus Seluruh Cache Cuaca
                </Text>
                <Text
                  style={[styles.subAksi, { color: colors.textSecondary }]}
                >
                  Bersihkan data cuaca offline yang tersimpan di SQLite
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.textMuted}
              />
            </TouchableOpacity>

            <View
              style={[styles.garisPemisah, { backgroundColor: colors.border }]}
            />

            <TouchableOpacity
              style={styles.barisTindakan}
              onPress={konfirmasiHapusSeluruhRiwayat}
            >
              <View
                style={[
                  styles.iconAksi,
                  { backgroundColor: colors.dangerBackground },
                ]}
              >
                <Ionicons
                  name="time-outline"
                  size={18}
                  color={colors.danger}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.judulAksi, { color: colors.text }]}>
                  Hapus Seluruh Riwayat Pencarian
                </Text>
                <Text
                  style={[styles.subAksi, { color: colors.textSecondary }]}
                >
                  Kosongkan daftar 10 riwayat pencarian terakhir
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* SEKSI 3: TENTANG APLIKASI */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Informasi Aplikasi
          </Text>
          <View
            style={[
              styles.boxInfo,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.barisInfo}>
              <Text style={{ color: colors.textSecondary }}>Aplikasi</Text>
              <Text style={{ fontWeight: "700", color: colors.text }}>
                Jelajah Aman
              </Text>
            </View>
            <View
              style={[styles.garisPemisah, { backgroundColor: colors.border }]}
            />
            <View style={styles.barisInfo}>
              <Text style={{ color: colors.textSecondary }}>Versi</Text>
              <Text style={{ fontWeight: "600", color: colors.text }}>1.0.0</Text>
            </View>
            <View
              style={[styles.garisPemisah, { backgroundColor: colors.border }]}
            />
            <View style={styles.barisInfo}>
              <Text style={{ color: colors.textSecondary }}>Basis Data</Text>
              <Text style={{ fontWeight: "600", color: colors.text }}>
                SQLite (Offline-First)
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 20,
  },
  pesanBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  pesanTeks: {
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionSubtitle: {
    fontSize: 13,
    marginBottom: 4,
  },
  cardList: {
    gap: 10,
  },
  cardOpsi: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    gap: 12,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  labelOpsi: {
    fontSize: 15,
  },
  deskripsiOpsi: {
    fontSize: 12,
    marginTop: 2,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  statusTemaAktif: {
    fontSize: 12,
    marginTop: 4,
  },
  boxKelola: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  barisTindakan: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  iconAksi: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  judulAksi: {
    fontSize: 14,
    fontWeight: "600",
  },
  subAksi: {
    fontSize: 12,
    marginTop: 2,
  },
  boxInfo: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
  },
  barisInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  garisPemisah: {
    height: 1,
  },
});
