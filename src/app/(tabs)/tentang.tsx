// src/app/(tabs)/tentang.tsx
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useAppTheme } from "../../context/ThemeContext";
import { spacing, typeScale } from "../../constants/styles";

export default function TabTentang() {
  const { colors } = useAppTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["bottom"]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* HEADER APLIKASI */}
        <View style={styles.headerContainer}>
          <View
            style={[
              styles.iconAppWrapper,
              { backgroundColor: colors.cardBackground, borderColor: colors.border },
            ]}
          >
            <Ionicons name="partly-sunny" size={48} color={colors.tint} />
          </View>
          <Text
            style={[styles.judulAplikasi, { color: colors.text }]}
            accessibilityLabel="Judul Aplikasi: Jelajah Aman"
          >
            Jelajah Aman
          </Text>
          <Text style={[styles.versiAplikasi, { color: colors.textSecondary }]}>
            Versi 1.0.0 • Pemrograman Berbasis Platform
          </Text>
        </View>

        {/* KARTU PROFIL PENGEMBANG */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <Ionicons name="person-circle-outline" size={24} color={colors.tint} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Informasi Mahasiswa
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.labelInfo, { color: colors.textSecondary }]}>
              Nama Pengembang
            </Text>
            <Text style={[styles.valueInfo, { color: colors.text }]}>
              Azka Viero
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <Text style={[styles.labelInfo, { color: colors.textSecondary }]}>
              Program Studi
            </Text>
            <Text style={[styles.valueInfo, { color: colors.text }]}>
              S1 Informatika
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <Text style={[styles.labelInfo, { color: colors.textSecondary }]}>
              Universitas
            </Text>
            <Text style={[styles.valueInfo, { color: colors.text }]}>
              UIN K.H. Abdurrahman Wahid Pekalongan
            </Text>
          </View>
        </View>

        {/* KARTU FITUR APLIKASI */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <Ionicons name="layers-outline" size={24} color={colors.tint} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Fitur Utama Aplikasi
            </Text>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="cloudy-outline" size={18} color={colors.tint} />
            <Text style={[styles.featureText, { color: colors.text }]}>
              Prakiraan cuaca real-time & Indeks Kualitas Udara (AQI)
            </Text>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="save-outline" size={18} color={colors.tint} />
            <Text style={[styles.featureText, { color: colors.text }]}>
              Penyimpanan offline-first dengan SQLite Database
            </Text>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="time-outline" size={18} color={colors.tint} />
            <Text style={[styles.featureText, { color: colors.text }]}>
              Riwayat 10 pencarian kota terakhir & daftar favorit
            </Text>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="color-palette-outline" size={18} color={colors.tint} />
            <Text style={[styles.featureText, { color: colors.text }]}>
              Dukungan Tema Dinamis (Terang, Gelap, & Ikuti Sistem)
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.sedang,
    gap: spacing.sedang,
  },
  headerContainer: {
    alignItems: "center",
    marginVertical: spacing.sedang,
  },
  iconAppWrapper: {
    width: 80,
    height: 80,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.kecil,
  },
  judulAplikasi: {
    fontWeight: "bold",
    fontSize: typeScale.judul,
  },
  versiAplikasi: {
    fontSize: typeScale.keterangan,
    marginTop: 4,
    textAlign: "center",
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: spacing.sedang,
    gap: spacing.kecil,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: spacing.kecil,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  labelInfo: {
    fontSize: typeScale.subjudul,
  },
  valueInfo: {
    fontSize: typeScale.subjudul,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 4,
  },
  featureText: {
    fontSize: 13,
    flex: 1,
  },
});
