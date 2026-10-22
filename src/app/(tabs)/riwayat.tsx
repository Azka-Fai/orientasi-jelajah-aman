// src/app/(tabs)/riwayat.tsx
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { labelKodeCuaca } from "../../constants/weatherCodes";
import { useAppTheme } from "../../context/ThemeContext";
import {
  daftarKotaTersimpan,
  hapusCacheKota,
} from "../../services/cacheRepository";
import { ambilSemuaFavorit, hapusFavorit } from "../../services/favoritStorage";
import {
  ambilRiwayatPencarian,
  hapusItemRiwayatPencarian,
  hapusSemuaRiwayatPencarian,
  ItemRiwayatPencarian,
} from "../../services/riwayatPencarianStorage";
import { RingkasanKotaTersimpan } from "../../types/cache";
import { KotaFavorit } from "../../types/favorit";
import { konfirmasiAksi } from "../../utils/alertHelper";

function formatWaktuLalu(timestamp: number): string {
  const selisihDetik = Math.floor((Date.now() - timestamp) / 1000);
  if (selisihDetik < 60) return "Baru saja";
  const menit = Math.floor(selisihDetik / 60);
  if (menit < 60) return `${menit} mnt lalu`;
  const jam = Math.floor(menit / 60);
  if (jam < 24) return `${jam} jam lalu`;
  const hari = Math.floor(jam / 24);
  return `${hari} hari lalu`;
}

type TabKategori = "riwayat" | "cache" | "favorit";

export default function TabRiwayat() {
  const { colors, isDark } = useAppTheme();

  const [tabAktif, setTabAktif] = useState<TabKategori>("riwayat");
  const [daftarRiwayat, setDaftarRiwayat] = useState<ItemRiwayatPencarian[]>([]);
  const [daftarCache, setDaftarCache] = useState<RingkasanKotaTersimpan[]>([]);
  const [daftarFavorit, setDaftarFavorit] = useState<KotaFavorit[]>([]);

  const muatSemuaData = useCallback(async () => {
    const [riwayat, cache, favorit] = await Promise.all([
      ambilRiwayatPencarian(),
      daftarKotaTersimpan(),
      ambilSemuaFavorit(),
    ]);
    setDaftarRiwayat(riwayat);
    setDaftarCache(cache);
    setDaftarFavorit(favorit);
  }, []);

  useFocusEffect(
    useCallback(() => {
      muatSemuaData();
    }, [muatSemuaData])
  );

  function bukaKotaDiBeranda(kota: {
    id: number;
    nama: string;
    latitude: number;
    longitude: number;
  }) {
    router.push({
      pathname: "/(tabs)",
      params: {
        cariKota: kota.nama,
        lat: String(kota.latitude),
        lon: String(kota.longitude),
        id: String(kota.id),
      },
    });
  }

  // --- Handlers Riwayat Pencarian ---
  function konfirmasiHapusItemRiwayat(nama: string) {
    konfirmasiAksi(
      "Hapus Riwayat",
      `Hapus "${nama}" dari riwayat pencarian?`,
      async () => {
        await hapusItemRiwayatPencarian(nama);
        const data = await ambilRiwayatPencarian();
        setDaftarRiwayat(data);
      }
    );
  }

  function konfirmasiHapusSemuaRiwayat() {
    konfirmasiAksi(
      "Bersihkan Riwayat",
      "Hapus semua riwayat pencarian terakhir?",
      async () => {
        await hapusSemuaRiwayatPencarian();
        setDaftarRiwayat([]);
      }
    );
  }

  // --- Handlers Cache Kota Offline (Tugas 3) ---
  function konfirmasiHapusCache(kunci: string, nama: string) {
    konfirmasiAksi(
      "Konfirmasi Hapus Cache",
      `Apakah Anda yakin ingin menghapus data cuaca tersimpan untuk kota ${nama}? Data ini tidak lagi tersedia secara offline sampai diunduh kembali.`,
      async () => {
        await hapusCacheKota(kunci);
        const data = await daftarKotaTersimpan();
        setDaftarCache(data);
      }
    );
  }

  // --- Handlers Favorit ---
  function konfirmasiHapusFavorit(id: number, nama: string) {
    konfirmasiAksi(
      "Konfirmasi Hapus Favorit",
      `Yakin ingin menghapus ${nama} dari daftar favorit?`,
      async () => {
        await hapusFavorit(id);
        const data = await ambilSemuaFavorit();
        setDaftarFavorit(data);
      }
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["bottom"]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Navigasi Kategori (Tab Segmented Bar) */}
        <View
          style={[
            styles.segmentContainer,
            { backgroundColor: colors.backgroundElement },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.segmentButton,
              tabAktif === "riwayat" && {
                backgroundColor: colors.cardBackground,
                elevation: 2,
                shadowColor: colors.cardShadow,
              },
            ]}
            onPress={() => setTabAktif("riwayat")}
          >
            <Ionicons
              name="time-outline"
              size={16}
              color={tabAktif === "riwayat" ? colors.tint : colors.textSecondary}
            />
            <Text
              style={[
                styles.segmentText,
                {
                  color:
                    tabAktif === "riwayat"
                      ? colors.tint
                      : colors.textSecondary,
                  fontWeight: tabAktif === "riwayat" ? "700" : "500",
                },
              ]}
            >
              Riwayat ({daftarRiwayat.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentButton,
              tabAktif === "cache" && {
                backgroundColor: colors.cardBackground,
                elevation: 2,
                shadowColor: colors.cardShadow,
              },
            ]}
            onPress={() => setTabAktif("cache")}
          >
            <Ionicons
              name="cloud-offline-outline"
              size={16}
              color={tabAktif === "cache" ? colors.tint : colors.textSecondary}
            />
            <Text
              style={[
                styles.segmentText,
                {
                  color:
                    tabAktif === "cache" ? colors.tint : colors.textSecondary,
                  fontWeight: tabAktif === "cache" ? "700" : "500",
                },
              ]}
            >
              Cache ({daftarCache.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentButton,
              tabAktif === "favorit" && {
                backgroundColor: colors.cardBackground,
                elevation: 2,
                shadowColor: colors.cardShadow,
              },
            ]}
            onPress={() => setTabAktif("favorit")}
          >
            <Ionicons
              name="heart-outline"
              size={16}
              color={tabAktif === "favorit" ? colors.tint : colors.textSecondary}
            />
            <Text
              style={[
                styles.segmentText,
                {
                  color:
                    tabAktif === "favorit" ? colors.tint : colors.textSecondary,
                  fontWeight: tabAktif === "favorit" ? "700" : "500",
                },
              ]}
            >
              Favorit ({daftarFavorit.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* KONTEN 1: RIWAYAT PENCARIAN TERAKHIR (Tugas 2) */}
        {tabAktif === "riwayat" && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Riwayat Pencarian
                </Text>
                <Text
                  style={[styles.sectionSubtitle, { color: colors.textSecondary }]}
                >
                  Maksimal 10 pencarian terakhir di perangkat
                </Text>
              </View>
              {daftarRiwayat.length > 0 && (
                <TouchableOpacity
                  onPress={konfirmasiHapusSemuaRiwayat}
                  style={[
                    styles.tombolHapusSemua,
                    { backgroundColor: colors.dangerBackground },
                  ]}
                >
                  <Text style={{ color: colors.danger, fontSize: 12, fontWeight: "600" }}>
                    Hapus Semua
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {daftarRiwayat.length === 0 ? (
              <View
                style={[
                  styles.emptyCard,
                  { backgroundColor: colors.cardBackground, borderColor: colors.border },
                ]}
              >
                <Ionicons
                  name="search-outline"
                  size={40}
                  color={colors.textMuted}
                />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  Belum ada riwayat pencarian.
                </Text>
                <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>
                  Cari kota pada Beranda untuk melihat cuaca di sini.
                </Text>
              </View>
            ) : (
              <View style={styles.listContainer}>
                {daftarRiwayat.map((item, index) => (
                  <View
                    key={`${item.nama}-${index}`}
                    style={[
                      styles.itemCard,
                      {
                        backgroundColor: colors.cardBackground,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.itemContent}
                      onPress={() => bukaKotaDiBeranda(item)}
                      accessibilityLabel={`Buka cuaca kota ${item.nama}`}
                    >
                      <View
                        style={[
                          styles.iconWrapper,
                          { backgroundColor: colors.backgroundElement },
                        ]}
                      >
                        <Ionicons
                          name="time-outline"
                          size={20}
                          color={colors.tint}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.namaKota, { color: colors.text }]}>
                          {item.nama}
                        </Text>
                        <Text
                          style={[
                            styles.keteranganItem,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {item.country ? `${item.country} • ` : ""}
                          {formatWaktuLalu(item.waktu)}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.tombolAksiIcon,
                        { backgroundColor: colors.backgroundElement },
                      ]}
                      onPress={() => konfirmasiHapusItemRiwayat(item.nama)}
                      accessibilityLabel={`Hapus ${item.nama} dari riwayat`}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color={colors.danger}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* KONTEN 2: PENGHAPUSAN CACHE KOTA & SUHU OFFLINE (Tugas 3) */}
        {tabAktif === "cache" && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Data Cache Cuaca Tersimpan
                </Text>
                <Text
                  style={[styles.sectionSubtitle, { color: colors.textSecondary }]}
                >
                  Tersimpan di SQLite lokal, dapat dibuka saat offline
                </Text>
              </View>
            </View>

            {daftarCache.length === 0 ? (
              <View
                style={[
                  styles.emptyCard,
                  { backgroundColor: colors.cardBackground, borderColor: colors.border },
                ]}
              >
                <Ionicons
                  name="cloud-offline-outline"
                  size={40}
                  color={colors.textMuted}
                />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  Tidak ada data cache cuaca tersimpan.
                </Text>
                <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>
                  Buka Beranda saat online untuk menyimpan cache otomatis.
                </Text>
              </View>
            ) : (
              <View style={styles.listContainer}>
                {daftarCache.map((item) => (
                  <View
                    key={item.kunci}
                    style={[
                      styles.itemCard,
                      {
                        backgroundColor: colors.cardBackground,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.itemContent}
                      onPress={() => bukaKotaDiBeranda(item)}
                      accessibilityLabel={`Buka cache cuaca kota ${item.nama}`}
                    >
                      <View
                        style={[
                          styles.iconWrapper,
                          { backgroundColor: colors.backgroundElement },
                        ]}
                      >
                        <Ionicons
                          name="cloudy-night-outline"
                          size={20}
                          color={colors.tint}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                          <Text style={[styles.namaKota, { color: colors.text }]}>
                            {item.nama}
                          </Text>
                          {item.suhu !== undefined && (
                            <View
                              style={[
                                styles.badgeSuhu,
                                { backgroundColor: colors.backgroundElement },
                              ]}
                            >
                              <Text
                                style={{
                                  fontSize: 12,
                                  fontWeight: "700",
                                  color: colors.tint,
                                }}
                              >
                                {item.suhu}°C
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text
                          style={[
                            styles.keteranganItem,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {item.kodeCuaca !== undefined
                            ? `${labelKodeCuaca(item.kodeCuaca)} • `
                            : ""}
                          Tersimpan {formatWaktuLalu(item.disimpanPada)}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {/* Tombol Hapus Cache per item dengan Alert Konfirmasi */}
                    <TouchableOpacity
                      style={[
                        styles.tombolHapusCache,
                        { backgroundColor: colors.dangerBackground },
                      ]}
                      onPress={() => konfirmasiHapusCache(item.kunci, item.nama)}
                      accessibilityLabel={`Hapus cache data cuaca ${item.nama}`}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={16}
                        color={colors.danger}
                      />
                      <Text
                        style={[
                          styles.teksHapusCache,
                          { color: colors.danger },
                        ]}
                      >
                        Hapus Cache
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* KONTEN 3: KOTA FAVORIT */}
        {tabAktif === "favorit" && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Daftar Kota Favorit
                </Text>
                <Text
                  style={[styles.sectionSubtitle, { color: colors.textSecondary }]}
                >
                  Kota pilihan yang disimpan untuk akses cepat
                </Text>
              </View>
            </View>

            {daftarFavorit.length === 0 ? (
              <View
                style={[
                  styles.emptyCard,
                  { backgroundColor: colors.cardBackground, borderColor: colors.border },
                ]}
              >
                <Ionicons
                  name="heart-outline"
                  size={40}
                  color={colors.textMuted}
                />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  Belum ada kota favorit yang disimpan.
                </Text>
                <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>
                  Pilih kota di Beranda dan tekan "Tambahkan ke Favorit".
                </Text>
              </View>
            ) : (
              <View style={styles.listContainer}>
                {daftarFavorit.map((item) => (
                  <View
                    key={item.id}
                    style={[
                      styles.itemCard,
                      {
                        backgroundColor: colors.cardBackground,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.itemContent}
                      onPress={() => bukaKotaDiBeranda(item)}
                      accessibilityLabel={`Buka cuaca favorit ${item.nama}`}
                    >
                      <View
                        style={[
                          styles.iconWrapper,
                          { backgroundColor: colors.backgroundElement },
                        ]}
                      >
                        <Ionicons
                          name="heart"
                          size={20}
                          color={colors.danger}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.namaKota, { color: colors.text }]}>
                          {item.nama}
                        </Text>
                        <Text
                          style={[
                            styles.keteranganItem,
                            { color: colors.textSecondary },
                          ]}
                        >
                          Lat: {item.latitude.toFixed(2)}, Lon:{" "}
                          {item.longitude.toFixed(2)}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.tombolAksiIcon,
                        { backgroundColor: colors.backgroundElement },
                      ]}
                      onPress={() => konfirmasiHapusFavorit(item.id, item.nama)}
                      accessibilityLabel={`Hapus ${item.nama} dari favorit`}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color={colors.danger}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
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
    gap: 16,
  },
  segmentContainer: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 12,
    gap: 4,
  },
  segmentButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 6,
  },
  segmentText: {
    fontSize: 13,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  tombolHapusSemua: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  emptyCard: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: "600",
  },
  emptySubtext: {
    fontSize: 12,
    textAlign: "center",
  },
  listContainer: {
    gap: 10,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  itemContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  namaKota: {
    fontSize: 16,
    fontWeight: "700",
  },
  badgeSuhu: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  keteranganItem: {
    fontSize: 12,
    marginTop: 2,
  },
  tombolAksiIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  tombolHapusCache: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  teksHapusCache: {
    fontSize: 12,
    fontWeight: "700",
  },
});
