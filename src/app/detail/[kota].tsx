// src/app/detail/[kota].tsx
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import WeatherCard from "../../components/WeatherCard";
import { useAppTheme } from "../../context/ThemeContext";

export default function HalamanDetail() {
  const { kota } = useLocalSearchParams<{ kota: string }>();
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <WeatherCard kota={kota ?? "Kota"} suhu={29} tingkatAQI="BAIK" />
      <TouchableOpacity
        style={[styles.tombol, { backgroundColor: colors.tint }]}
        onPress={() => router.push("/tambah-favorit")}
      >
        <Ionicons name="heart-outline" size={18} color="#FFFFFF" />
        <Text style={styles.tombolTeks}>Tambahkan ke Favorit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  tombol: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  tombolTeks: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
