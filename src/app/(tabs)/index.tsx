// src/app/(tabs)/index.tsx
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AtribusiCuaca from "../../components/AtribusiCuaca";
import SearchBox from "../../components/SearchBox";
import StatusData from "../../components/StatusData";
import WeatherCard from "../../components/WeatherCard";
import { labelKodeCuaca } from "../../constants/weatherCodes";
import { useAppTheme } from "../../context/ThemeContext";
import { useDebounce } from "../../hooks/use-debounce";
import {
  bersihkanCacheLama,
  daftarKotaTersimpan,
  hapusCacheKota,
} from "../../services/cacheRepository";
import {
  ambilCuacaOfflineFirst,
  BATAS_CACHE_MS,
} from "../../services/cuacaRepository";
import { ambilSemuaFavorit } from "../../services/favoritStorage";
import { cariKota } from "../../services/geocodingService";
import {
  ambilKoordinatSaatIni,
  mintaIzinLokasi,
} from "../../services/locationService";
import { simpanKeRiwayatPencarian } from "../../services/riwayatPencarianStorage";
import { konversiTingkatAQI } from "../../services/weatherAdapter";
import { HasilCuacaOffline, RingkasanKotaTersimpan } from "../../types/cache";
import { KotaFavorit } from "../../types/favorit";
import { HasilGeocoding } from "../../types/geocoding";
import { konfirmasiAksi } from "../../utils/alertHelper";

export default function HalamanUtama() {
  const { colors } = useAppTheme();

  const [teksCari, setTeksCari] = useState("");
  const [hasilPencarian, setHasilPencarian] = useState<HasilGeocoding[]>([]);
  const [kotaTerpilih, setKotaTerpilih] = useState<HasilGeocoding | null>(null);
  const [hasil, setHasil] = useState<HasilCuacaOffline | null>(null);
  const [kotaTersimpan, setKotaTersimpan] = useState<RingkasanKotaTersimpan[]>(
    [],
  );
  const [daftarFavorit, setDaftarFavorit] = useState<KotaFavorit[]>([]);
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [pesanError, setPesanError] = useState<string | null>(null);
  const [pesanLokasi, setPesanLokasi] = useState<string | null>(null);

  const teksTertunda = useDebounce(teksCari, 500);
  const requestIdRef = useRef(0); // pencegah race condition
  const paramsTerakhir = useRef<string | null>(null);

  // Menerima parameter pencarian otomatis saat ditekan dari Tab Riwayat (Tugas 2)
  const params = useLocalSearchParams<{
    cariKota?: string;
    lat?: string;
    lon?: string;
    id?: string;
  }>();

  const muatKotaTersimpan = useCallback(async () => {
    const daftar = await daftarKotaTersimpan();
    setKotaTersimpan(daftar);
  }, []);

  const muatFavorit = useCallback(async () => {
    const daftar = await ambilSemuaFavorit();
    setDaftarFavorit(daftar);
  }, []);

  // Saat aplikasi dibuka: buang cache > 7 hari, lalu tampilkan daftar tersimpan
  useEffect(() => {
    bersihkanCacheLama(BATAS_CACHE_MS)
      .then(muatKotaTersimpan)
      .catch(() => {});
  }, [muatKotaTersimpan]);

  useFocusEffect(
    useCallback(() => {
      muatKotaTersimpan();
      muatFavorit();
    }, [muatFavorit, muatKotaTersimpan]),
  );

  const sudahDiFavorit =
    kotaTerpilih !== null &&
    daftarFavorit.some((kota) => kota.id === kotaTerpilih.id);

  useEffect(() => {
    if (teksTertunda.trim().length === 0) {
      setHasilPencarian([]);
      return;
    }
    if (
      kotaTerpilih &&
      kotaTerpilih.name.toLowerCase().trim() ===
        teksTertunda.toLowerCase().trim()
    ) {
      setHasilPencarian([]);
      return;
    }
    cariKota(teksTertunda)
      .then(setHasilPencarian)
      .catch(() => setHasilPencarian([]));
  }, [teksTertunda, kotaTerpilih]);

  const pilihKota = useCallback(
    async (kota: HasilGeocoding, paksaPerbarui = false) => {
      setKotaTerpilih(kota);
      setHasilPencarian([]);
      const idSaatIni = ++requestIdRef.current;
      setSedangMemuat(true);
      setPesanError(null);

      // Simpan pencarian ke riwayat lokal (maksimal 10 item) - Tugas 2
      if (kota.name && kota.name !== "Lokasi Saat Ini") {
        simpanKeRiwayatPencarian({
          id: kota.id,
          nama: kota.name,
          latitude: kota.latitude,
          longitude: kota.longitude,
          country: kota.country,
        }).catch(() => {});
      }

      try {
        const data = await ambilCuacaOfflineFirst(
          {
            id: kota.id,
            nama: kota.name,
            latitude: kota.latitude,
            longitude: kota.longitude,
          },
          { paksaPerbarui },
        );
        if (idSaatIni !== requestIdRef.current) return;
        setHasil(data);
        muatKotaTersimpan();
      } catch (err) {
        if (idSaatIni !== requestIdRef.current) return;
        setHasil(null);
        setPesanError(
          "Belum ada data tersimpan dan tidak ada koneksi internet. Sambungkan internet lalu coba lagi.",
        );
      } finally {
        if (idSaatIni === requestIdRef.current) setSedangMemuat(false);
      }
    },
    [muatKotaTersimpan],
  );

  // Tangani navigasi otomatis dari tab Riwayat jika ada param
  useEffect(() => {
    if (params.cariKota && params.lat && params.lon) {
      const kunciUnik = `${params.cariKota}_${params.lat}_${params.lon}`;
      if (paramsTerakhir.current !== kunciUnik) {
        paramsTerakhir.current = kunciUnik;
        setTeksCari(params.cariKota);
        pilihKota({
          id: Number(params.id || -1),
          name: params.cariKota,
          latitude: Number(params.lat),
          longitude: Number(params.lon),
          country: "",
        });
      }
    }
  }, [params.cariKota, params.lat, params.lon, params.id, pilihKota]);

  async function gunakanLokasiSaatIni() {
    const status = await mintaIzinLokasi();
    if (status === "denied") {
      setPesanLokasi(
        "Izin lokasi ditolak. Silakan cari kota secara manual di atas.",
      );
      return;
    }
    if (status === "unavailable") {
      setPesanLokasi(
        "Layanan lokasi tidak aktif di perangkat ini. Silakan cari kota secara manual.",
      );
      return;
    }
    setPesanLokasi(null);
    const koordinat = await ambilKoordinatSaatIni();
    pilihKota({
      id: -1,
      name: "Lokasi Saat Ini",
      latitude: koordinat.latitude,
      longitude: koordinat.longitude,
      country: "",
    });
  }

  function konfirmasiHapusCache(kunci: string, nama: string) {
    konfirmasiAksi(
      "Konfirmasi Hapus Cache",
      `Apakah Anda yakin ingin menghapus data cuaca offline untuk kota ${nama}?`,
      async () => {
        await hapusCacheKota(kunci);
        muatKotaTersimpan();
        if (kotaTerpilih && kotaTerpilih.name === nama) {
          setHasil(null);
        }
      },
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
        {/* KOTAK PENCARIAN */}
        <SearchBox onCari={setTeksCari} nilaiAwal={teksCari} />

        {/* TOMBOL LOKASI SAAT INI */}
        <TouchableOpacity
          style={[
            styles.tombolLokasi,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            },
          ]}
          onPress={gunakanLokasiSaatIni}
        >
          <Ionicons
            name="navigate-circle-outline"
            size={20}
            color={colors.tint}
          />
          <Text style={[styles.teksTombolLokasi, { color: colors.tint }]}>
            Gunakan Lokasi Saat Ini
          </Text>
        </TouchableOpacity>

        {pesanLokasi && (
          <View
            style={[
              styles.bannerInfo,
              {
                backgroundColor: colors.dangerBackground,
                borderColor: colors.danger,
              },
            ]}
          >
            <Ionicons
              name="alert-circle-outline"
              size={18}
              color={colors.danger}
            />
            <Text style={[styles.bannerTeks, { color: colors.danger }]}>
              {pesanLokasi}
            </Text>
          </View>
        )}

        {/* HASIL AUTOCOMPLETE PENCARIAN */}
        {hasilPencarian.length > 0 && (
          <View
            style={[
              styles.dropdownHasil,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              },
            ]}
          >
            {hasilPencarian.map((kota, idx) => (
              <TouchableOpacity
                key={kota.id}
                style={[
                  styles.itemPencarian,
                  idx < hasilPencarian.length - 1 && {
                    borderBottomColor: colors.border,
                    borderBottomWidth: 1,
                  },
                ]}
                onPress={() => {
                  setTeksCari(kota.name);
                  pilihKota(kota);
                }}
              >
                <Ionicons
                  name="location-outline"
                  size={18}
                  color={colors.tint}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={[styles.namaKotaPencarian, { color: colors.text }]}
                  >
                    {kota.name}
                  </Text>
                  <Text
                    style={[
                      styles.negaraKotaPencarian,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {kota.country || "Tidak ada keterangan wilayah"}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* LOADING INDICATOR */}
        {sedangMemuat && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.tint} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Memuat data cuaca & kualitas udara...
            </Text>
          </View>
        )}

        {/* PESAN ERROR DENGAN TOMBOL COBA LAGI */}
        {pesanError && (
          <View
            style={[
              styles.errorCard,
              {
                backgroundColor: colors.dangerBackground,
                borderColor: colors.danger,
              },
            ]}
          >
            <Ionicons name="cloud-offline" size={24} color={colors.danger} />
            <Text style={[styles.errorTeks, { color: colors.danger }]}>
              {pesanError}
            </Text>
            <TouchableOpacity
              style={[styles.tombolAksi, { backgroundColor: colors.danger }]}
              onPress={() => kotaTerpilih && pilihKota(kotaTerpilih, true)}
            >
              <Text style={styles.tombolAksiTeks}>Coba Lagi</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* HASIL TAMPILAN CUACA TERPILIH */}
        {hasil && kotaTerpilih && !sedangMemuat && (
          <View style={styles.hasilCuacaContainer}>
            <StatusData
              sumber={hasil.sumber}
              disimpanPada={hasil.disimpanPada}
            />

            <WeatherCard
              kota={kotaTerpilih.name}
              suhu={hasil.cuaca.saatIni.suhu}
              tingkatAQI={konversiTingkatAQI(hasil.kualitasUdara.indeksAQI)}
              indeksAQI={hasil.kualitasUdara.indeksAQI}
            />

            <View
              style={[
                styles.detailKondisiBox,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.barisDetail}>
                <Ionicons
                  name="partly-sunny-outline"
                  size={18}
                  color={colors.tint}
                />
                <Text
                  style={[styles.labelDetail, { color: colors.textSecondary }]}
                >
                  Kondisi Cuaca:
                </Text>
                <Text style={[styles.nilaiDetail, { color: colors.text }]}>
                  {labelKodeCuaca(hasil.cuaca.saatIni.kodeCuaca)}
                </Text>
              </View>

              <View
                style={[styles.garisTipis, { backgroundColor: colors.border }]}
              />

              <View style={styles.barisDetail}>
                <Ionicons
                  name="speedometer-outline"
                  size={18}
                  color={colors.tint}
                />
                <Text
                  style={[styles.labelDetail, { color: colors.textSecondary }]}
                >
                  Kecepatan Angin:
                </Text>
                <Text style={[styles.nilaiDetail, { color: colors.text }]}>
                  {hasil.cuaca.saatIni.kecepatanAngin} km/j
                </Text>
              </View>
            </View>

            {/* TOMBOL PERBARUI & TAMBAH FAVORIT */}
            <View style={styles.tombolGrup}>
              <TouchableOpacity
                style={[styles.tombolAksi, { backgroundColor: colors.tint }]}
                onPress={() => pilihKota(kotaTerpilih, true)}
              >
                <Ionicons name="refresh-outline" size={18} color="#FFFFFF" />
                <Text style={styles.tombolAksiTeks}>Perbarui Sekarang</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tombolAksiSecondary,
                  {
                    backgroundColor: sudahDiFavorit
                      ? colors.dangerBackground
                      : colors.cardBackground,
                    borderColor: sudahDiFavorit ? colors.danger : colors.border,
                  },
                ]}
                disabled={sudahDiFavorit}
                onPress={() =>
                  router.push({
                    pathname: "/tambah-favorit",
                    params: {
                      id: String(kotaTerpilih.id),
                      nama: kotaTerpilih.name,
                      lat: String(kotaTerpilih.latitude),
                      lon: String(kotaTerpilih.longitude),
                    },
                  })
                }
              >
                <Ionicons
                  name={sudahDiFavorit ? "heart" : "heart-outline"}
                  size={18}
                  color={sudahDiFavorit ? colors.danger : colors.tint}
                />
                <Text
                  style={[
                    styles.tombolSecondaryTeks,
                    { color: sudahDiFavorit ? colors.danger : colors.tint },
                  ]}
                >
                  {sudahDiFavorit ? "Sudah di Favorit" : "Tambahkan ke Favorit"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* DAFTAR CACHE TERSIMPAN DI PERANGKAT (OFFLINE FIRST - TUGAS 3) */}
        {kotaTersimpan.length > 0 && (
          <View style={styles.seksiTersimpan}>
            <View style={styles.seksiTersimpanHeader}>
              <Ionicons name="save-outline" size={18} color={colors.tint} />
              <Text style={[styles.judulTersimpan, { color: colors.text }]}>
                Tersimpan di Perangkat (Bisa Dibuka Offline)
              </Text>
            </View>

            <View style={styles.daftarKotaTersimpan}>
              {kotaTersimpan.map((k) => (
                <View
                  key={k.kunci}
                  style={[
                    styles.itemKotaTersimpan,
                    {
                      backgroundColor: colors.cardBackground,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.itemKotaTersimpanKonten}
                    onPress={() => {
                      setTeksCari(k.nama);
                      pilihKota({
                        id: k.id,
                        name: k.nama,
                        latitude: k.latitude,
                        longitude: k.longitude,
                        country: "",
                      });
                    }}
                  >
                    <Ionicons
                      name="cloud-done-outline"
                      size={20}
                      color={colors.tint}
                    />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.namaKotaTersimpan,
                          { color: colors.text },
                        ]}
                      >
                        {k.nama}
                      </Text>
                      {k.suhu !== undefined && (
                        <Text
                          style={[
                            styles.suhuKotaTersimpan,
                            { color: colors.textSecondary },
                          ]}
                        >
                          Suhu: {k.suhu}°C
                          {k.kodeCuaca !== undefined
                            ? ` • ${labelKodeCuaca(k.kodeCuaca)}`
                            : ""}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>

                  {/* Tombol Hapus Cache per item dengan Alert (Tugas 3) */}
                  <TouchableOpacity
                    style={[
                      styles.tombolHapusCacheIcon,
                      { backgroundColor: colors.dangerBackground },
                    ]}
                    onPress={() => konfirmasiHapusCache(k.kunci, k.nama)}
                    accessibilityLabel={`Hapus cache data cuaca ${k.nama}`}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={16}
                      color={colors.danger}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        <AtribusiCuaca />
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
  tombolLokasi: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  teksTombolLokasi: {
    fontSize: 14,
    fontWeight: "700",
  },
  bannerInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  bannerTeks: {
    fontSize: 13,
    flex: 1,
  },
  dropdownHasil: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  itemPencarian: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 10,
  },
  namaKotaPencarian: {
    fontSize: 15,
    fontWeight: "600",
  },
  negaraKotaPencarian: {
    fontSize: 12,
    marginTop: 2,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
  },
  errorCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    gap: 12,
  },
  errorTeks: {
    fontSize: 13,
    textAlign: "center",
  },
  hasilCuacaContainer: {
    gap: 12,
  },
  detailKondisiBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  barisDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  labelDetail: {
    fontSize: 13,
  },
  nilaiDetail: {
    fontSize: 13,
    fontWeight: "700",
  },
  garisTipis: {
    height: 1,
  },
  tombolGrup: {
    gap: 10,
  },
  tombolAksi: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  tombolAksiTeks: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  tombolAksiSecondary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  tombolSecondaryTeks: {
    fontSize: 14,
    fontWeight: "700",
  },
  seksiTersimpan: {
    gap: 10,
    marginTop: 8,
  },
  seksiTersimpanHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  judulTersimpan: {
    fontSize: 15,
    fontWeight: "bold",
  },
  daftarKotaTersimpan: {
    gap: 8,
  },
  itemKotaTersimpan: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  itemKotaTersimpanKonten: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  namaKotaTersimpan: {
    fontSize: 15,
    fontWeight: "700",
  },
  suhuKotaTersimpan: {
    fontSize: 12,
    marginTop: 2,
  },
  tombolHapusCacheIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
