// src/components/WeatherCard.tsx
import { StyleSheet, Text, View } from "react-native";
import { TingkatAQI, WeatherCardProps } from "../types/cuaca";
import { spacing, typeScale } from "../constants/styles";
import { useAppTheme } from "../context/ThemeContext";

const warnaPerTingkat: Record<TingkatAQI, string> = {
  BAIK: "#2E7D32",
  SEDANG: "#D97706",
  TIDAK_SEHAT: "#EA580C",
  BERBAHAYA: "#DC2626",
};

export default function WeatherCard({
  kota,
  suhu,
  tingkatAQI,
  indeksAQI,
}: WeatherCardProps) {
  const { colors } = useAppTheme();

  const teksAQI =
    indeksAQI !== undefined
      ? `AQI: ${indeksAQI} (${tingkatAQI})`
      : `AQI: ${tingkatAQI}`;
  const labelAksesibilitas =
    indeksAQI !== undefined
      ? `Cuaca ${kota}, suhu ${suhu} derajat, indeks kualitas udara ${indeksAQI}, kategori ${tingkatAQI}`
      : `Cuaca ${kota}, suhu ${suhu} derajat, kualitas udara ${tingkatAQI}`;

  return (
    <View
      accessible
      accessibilityLabel={labelAksesibilitas}
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        },
      ]}
    >
      <Text style={[styles.namaKota, { color: colors.text }]}>{kota}</Text>
      <Text style={[styles.suhu, { color: colors.text }]}>{suhu}°C</Text>
      <View style={styles.aqiContainer}>
        <View
          style={[
            styles.titikAQI,
            { backgroundColor: warnaPerTingkat[tingkatAQI] || colors.tint },
          ]}
        />
        <Text
          style={[
            styles.teksAQI,
            { color: warnaPerTingkat[tingkatAQI] || colors.textSecondary },
          ]}
        >
          {teksAQI}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.sedang,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  namaKota: {
    fontWeight: "bold",
    fontSize: typeScale.judul,
  },
  suhu: {
    fontSize: 36,
    fontWeight: "800",
  },
  aqiContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  titikAQI: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  teksAQI: {
    fontSize: typeScale.isi,
    fontWeight: "600",
  },
});
