import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { spacing, typeScale } from "../../constants/styles";

export default function TabTentang() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text
          style={styles.judulAplikasi}
          accessibilityLabel="Judul Aplikasi: Jelajah Aman"
        >
          Jelajah Aman
        </Text>
        <Text style={styles.versiAplikasi}>Versi 1.0.0</Text>
      </View>

      <View style={styles.pembuatContainer}>
        <Text style={styles.labelPembuat}>Dibuat Oleh:</Text>
        <Text style={styles.namaPembuat}>Azka Viero</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.sedang,
    gap: spacing.sedang,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: spacing.besar,
  },
  judulAplikasi: {
    fontWeight: "bold",
    fontSize: typeScale.judul,
    color: "#2B3A67",
  },
  versiAplikasi: {
    color: "#6D7278",
    fontSize: typeScale.keterangan,
    marginTop: spacing.kecil,
  },
  pembuatContainer: {
    backgroundColor: "#F4F7FA",
    padding: spacing.sedang,
    borderRadius: 8,
  },
  labelPembuat: {
    color: "#6D7278",
    fontSize: typeScale.subjudul,
  },
  namaPembuat: {
    fontWeight: "bold",
    marginTop: spacing.kecil,
    fontSize: typeScale.judul,
    color: "#2B3A67",
  },
});
