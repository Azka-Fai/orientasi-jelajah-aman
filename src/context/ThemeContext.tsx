// src/context/ThemeContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useColorScheme as useRNColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors, ThemeColors } from "../constants/theme";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => Promise<void>;
  warnaAktif: "light" | "dark";
  isDark: boolean;
  colors: ThemeColors;
}

const STORAGE_KEY = "@jelajah_aman:tema_mode";

const ThemeContext = createContext<ThemeContextType>({
  mode: "system",
  setMode: async () => {},
  warnaAktif: "light",
  isDark: false,
  colors: Colors.light,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useRNColorScheme();
  const [mode, setModeState] = useState<ThemeMode>("system");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((savedMode) => {
        if (
          savedMode === "light" ||
          savedMode === "dark" ||
          savedMode === "system"
        ) {
          setModeState(savedMode);
        }
      })
      .catch(() => {});
  }, []);

  async function setMode(newMode: ThemeMode) {
    setModeState(newMode);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, newMode);
    } catch {}
  }

  const warnaAktif: "light" | "dark" =
    mode === "system"
      ? systemScheme === "dark"
        ? "dark"
        : "light"
      : mode;

  const isDark = warnaAktif === "dark";
  const colors = Colors[warnaAktif];

  return (
    <ThemeContext.Provider
      value={{
        mode,
        setMode,
        warnaAktif,
        isDark,
        colors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
