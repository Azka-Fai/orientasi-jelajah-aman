// app/(tabs)/_layout.tsx (diperbarui)
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen name="index" options={{ title: "Beranda" }} />
      <Tabs.Screen name="riwayat" options={{ title: "Riwayat" }} />
      <Tabs.Screen name="pengaturan" options={{ title: "Pengaturan" }} />

      {/* --- (Instruksi Latihan No. 2) --- */}
      <Tabs.Screen name="tentang" options={{ title: "Tentang" }} />
      {/* -------------------------------------------------- */}
    </Tabs>
  );
}
