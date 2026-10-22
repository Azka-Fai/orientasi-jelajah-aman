// src/services/riwayatPencarianStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface ItemRiwayatPencarian {
  id: number;
  nama: string;
  latitude: number;
  longitude: number;
  country?: string;
  waktu: number; // timestamp dalam milidetik
}

const KUNCI_RIWAYAT = "@jelajah_aman:riwayat_pencarian";
const MAKSIMAL_RIWAYAT = 10;

/**
 * Mengambil daftar riwayat pencarian terbaru (maksimal 10 item).
 */
export async function ambilRiwayatPencarian(): Promise<ItemRiwayatPencarian[]> {
  try {
    const raw = await AsyncStorage.getItem(KUNCI_RIWAYAT);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Menyimpan kota hasil pencarian ke penyimpanan lokal.
 * Membatasi maksimal 10 riwayat pencarian terakhir dan menempatkan
 * pencarian terbaru di urutan pertama (deduplikasi kota).
 */
export async function simpanKeRiwayatPencarian(
  kota: Omit<ItemRiwayatPencarian, "waktu">
): Promise<void> {
  try {
    if (!kota.nama || kota.nama.trim().length === 0) return;

    const daftar = await ambilRiwayatPencarian();

    // Hapus kota dengan nama yang sama jika sudah ada sebelumnya
    const tanpaDuplikat = daftar.filter(
      (item) => item.nama.toLowerCase().trim() !== kota.nama.toLowerCase().trim()
    );

    const itemBaru: ItemRiwayatPencarian = {
      id: kota.id,
      nama: kota.nama.trim(),
      latitude: kota.latitude,
      longitude: kota.longitude,
      country: kota.country || "",
      waktu: Date.now(),
    };

    // Letakkan di awal dan ambil maksimal 10
    const hasilBaru = [itemBaru, ...tanpaDuplikat].slice(0, MAKSIMAL_RIWAYAT);

    await AsyncStorage.setItem(KUNCI_RIWAYAT, JSON.stringify(hasilBaru));
  } catch {}
}

/**
 * Menghapus satu item dari riwayat pencarian berdasarkan nama kota.
 */
export async function hapusItemRiwayatPencarian(nama: string): Promise<void> {
  try {
    const daftar = await ambilRiwayatPencarian();
    const disaring = daftar.filter(
      (item) => item.nama.toLowerCase().trim() !== nama.toLowerCase().trim()
    );
    await AsyncStorage.setItem(KUNCI_RIWAYAT, JSON.stringify(disaring));
  } catch {}
}

/**
 * Menghapus seluruh riwayat pencarian dari penyimpanan lokal.
 */
export async function hapusSemuaRiwayatPencarian(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KUNCI_RIWAYAT);
  } catch {}
}
