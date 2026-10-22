// src/components/StatusData.tsx
import { StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SumberData } from "../types/cache";
import { useAppTheme } from "../context/ThemeContext";

interface StatusDataProps {
  sumber: SumberData;
  disimpanPada: number;
}

function formatUmur(disimpanPada: number): string {
  const menit = Math.floor((Date.now() - disimpanPada) / 60000);
  if (menit < 1) return "baru saja";
  if (menit < 60) return `${menit} menit lalu`;
  const jam = Math.floor(menit / 60);
  if (jam < 24) return `${jam} jam lalu`;
  return `${Math.floor(jam / 24)} hari lalu`;
}

function labelSumber(sumber: SumberData): string {
  if (sumber === "jaringan") return "Data terbaru dari internet";
  if (sumber === "cache-segar") return "Data tersimpan (masih segar)";
  return "Mode offline - data tersimpan mungkin sudah usang";
}

function iconSumber(sumber: SumberData): keyof typeof Ionicons.glyphMap {
  if (sumber === "jaringan") return "globe-outline";
  if (sumber === "cache-segar") return "checkmark-circle-outline";
  return "cloud-offline-outline";
}

export default function StatusData({ sumber, disimpanPada }: StatusDataProps) {
  const { colors, isDark } = useAppTheme();
  const basi = sumber === "cache-basi";
  const label = labelSumber(sumber);
  const umur = formatUmur(disimpanPada);

  const warnaLatar = basi
    ? isDark
      ? "#3B2508"
      : "#FEF3E2"
    : isDark
    ? "#0B3828"
    : "#EAFBF6";

  const warnaTeks = basi
    ? isDark
      ? "#FBBF24"
      : "#B45309"
    : isDark
    ? "#34D399"
    : "#13795F";

  return (
    <View
      accessible
      accessibilityLabel={`${label}, diperbarui ${umur}`}
      style={[
        styles.container,
        {
          backgroundColor: warnaLatar,
          borderColor: isDark ? "rgba(255,255,255,0.08)" : "transparent",
        },
      ]}
    >
      <Ionicons name={iconSumber(sumber)} size={18} color={warnaTeks} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.label, { color: warnaTeks }]}>{label}</Text>
        <Text style={[styles.umur, { color: colors.textSecondary }]}>
          Diperbarui {umur}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
  },
  umur: {
    fontSize: 11,
    marginTop: 1,
  },
});
