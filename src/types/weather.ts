import { TingkatAQI } from "./cuaca";

// src/types/weather.ts
export interface CuacaSaatIni {
  suhu: number;
  kodeCuaca: number;
  kecepatanAngin: number;
  waktu: string;
}
export interface PrakiraanHarian {
  tanggal: string[];
  suhuMaksimal: number[];
  suhuMinimal: number[];
  kodeCuaca: number[];
}
export interface DataCuacaLengkap {
  saatIni: CuacaSaatIni;
  harian: PrakiraanHarian;
}
export interface DataKualitasUdara {
  indeksAQI: number;
  pm25: number;
  pm10: number;
}

export interface WeatherCardProps {
  kota: string;
  suhu: number;
  tingkatAQI: TingkatAQI;
  indeksAQI?: number; // baru: angka asli dari API, opsional
}
