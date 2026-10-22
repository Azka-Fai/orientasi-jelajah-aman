import AsyncStorage from "@react-native-async-storage/async-storage";
import { DataCuacaLengkap, DataKualitasUdara } from "../types/weather";
import {
  DataTersimpan,
  KotaUntukCache,
  RingkasanKotaTersimpan,
} from "../types/cache";

const KUNCI_PENYIMPANAN = "@jelajah_aman:cache_cuaca:web";

interface BarisCache {
  kunci: string;
  kota_id: number;
  nama_kota: string;
  latitude: number;
  longitude: number;
  cuaca_json: string;
  aqi_json: string;
  disimpan_pada: number;
}

export function buatKunci(latitude: number, longitude: number): string {
  return latitude.toFixed(2) + "," + longitude.toFixed(2);
}

async function ambilSemuaCache(): Promise<BarisCache[]> {
  const json = await AsyncStorage.getItem(KUNCI_PENYIMPANAN);
  return json ? (JSON.parse(json) as BarisCache[]) : [];
}

async function simpanSemuaCache(daftar: BarisCache[]): Promise<void> {
  await AsyncStorage.setItem(KUNCI_PENYIMPANAN, JSON.stringify(daftar));
}

export async function simpanCache(
  kota: KotaUntukCache,
  cuaca: DataCuacaLengkap,
  kualitasUdara: DataKualitasUdara
): Promise<void> {
  const daftar = await ambilSemuaCache();
  const kunci = buatKunci(kota.latitude, kota.longitude);
  const baris: BarisCache = {
    kunci,
    kota_id: kota.id,
    nama_kota: kota.nama,
    latitude: kota.latitude,
    longitude: kota.longitude,
    cuaca_json: JSON.stringify(cuaca),
    aqi_json: JSON.stringify(kualitasUdara),
    disimpan_pada: Date.now(),
  };
  const index = daftar.findIndex((item) => item.kunci === kunci);

  if (index === -1) {
    daftar.push(baris);
  } else {
    daftar[index] = baris;
  }

  await simpanSemuaCache(daftar);
}

export async function ambilCache(
  latitude: number,
  longitude: number
): Promise<DataTersimpan | null> {
  const kunci = buatKunci(latitude, longitude);
  const baris = (await ambilSemuaCache()).find((item) => item.kunci === kunci);
  if (!baris) return null;

  return {
    cuaca: JSON.parse(baris.cuaca_json) as DataCuacaLengkap,
    kualitasUdara: JSON.parse(baris.aqi_json) as DataKualitasUdara,
    disimpanPada: baris.disimpan_pada,
  };
}

export async function daftarKotaTersimpan(): Promise<RingkasanKotaTersimpan[]> {
  const daftar = await ambilSemuaCache();
  return daftar
    .sort((a, b) => b.disimpan_pada - a.disimpan_pada)
    .map((baris) => {
      const cuaca = JSON.parse(baris.cuaca_json) as DataCuacaLengkap;
      return {
        kunci: baris.kunci,
        id: baris.kota_id,
        nama: baris.nama_kota,
        latitude: baris.latitude,
        longitude: baris.longitude,
        disimpanPada: baris.disimpan_pada,
        suhu: cuaca?.saatIni?.suhu,
        kodeCuaca: cuaca?.saatIni?.kodeCuaca,
      };
    });
}

export async function hapusCacheKota(kunci: string): Promise<void> {
  const daftar = await ambilSemuaCache();
  await simpanSemuaCache(daftar.filter((item) => item.kunci !== kunci));
}

export async function bersihkanCacheLama(batasUmurMs: number): Promise<void> {
  const batasWaktu = Date.now() - batasUmurMs;
  const daftar = await ambilSemuaCache();
  await simpanSemuaCache(
    daftar.filter((item) => item.disimpan_pada >= batasWaktu)
  );
}

export async function hapusSemuaCache(): Promise<void> {
  await AsyncStorage.removeItem(KUNCI_PENYIMPANAN);
}
