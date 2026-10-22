// src/components/SearchBox.tsx
import { useEffect, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppTheme } from "../context/ThemeContext";

interface SearchBoxProps {
  onCari: (teks: string) => void;
  nilaiAwal?: string;
}

export default function SearchBox({ onCari, nilaiAwal = "" }: SearchBoxProps) {
  const { colors } = useAppTheme();
  const [teks, setTeks] = useState(nilaiAwal);

  useEffect(() => {
    setTeks(nilaiAwal);
  }, [nilaiAwal]);

  function handleChange(nilaiBaru: string) {
    setTeks(nilaiBaru);
    onCari(nilaiBaru);
  }

  function handleClear() {
    setTeks("");
    onCari("");
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        },
      ]}
    >
      <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
      <TextInput
        placeholder="Cari nama kota..."
        placeholderTextColor={colors.textMuted}
        value={teks}
        onChangeText={handleChange}
        accessibilityLabel="Cari cuaca untuk kota yang dimasukkan"
        style={[
          styles.input,
          {
            color: colors.text,
          },
        ]}
      />
      {teks.length > 0 && (
        <TouchableOpacity onPress={handleClear} accessibilityLabel="Hapus teks pencarian">
          <Ionicons name="close-circle" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
});
