// src/components/IndikatorAQI.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LaporanUdara } from "../types/cuaca";
import { useAppTheme } from "../context/ThemeContext";

interface Props {
  laporan: LaporanUdara;
}

const warnaUntukTingkat = (tingkat: LaporanUdara["tingkat"]) => {
  switch (tingkat) {
    case "BAIK":
      return "#2E7D32";
    case "SEDANG":
      return "#F9A825";
    case "TIDAK_SEHAT":
      return "#EA580C";
    case "BERBAHAYA":
      return "#DC2626";
    default:
      return "#6B7280";
  }
};

export const IndikatorAQI: React.FC<Props> = ({ laporan }) => {
  const { colors } = useAppTheme();
  const { tingkat, indeksAQI } = laporan;
  const warna = warnaUntukTingkat(tingkat);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.bulatan,
          {
            backgroundColor: warna,
          },
        ]}
        accessibilityElementsHidden
      />
      <Text style={[styles.teks, { color: colors.text }]}>
        <Text style={{ color: warna, fontWeight: "700" }}>
          {tingkat.replace("_", " ")}
        </Text>
        {" — AQI: "}
        <Text style={{ fontWeight: "700" }}>{indeksAQI}</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  bulatan: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  teks: {
    fontSize: 13,
  },
});

export default IndikatorAQI;
