import { useState, useMemo } from "react";
import { lightTheme, darkTheme } from "../themes";

/**
 * Custom hook for theme management
 * Handles theme mode persistence and switching
 */
export const useTheme = () => {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("themeMode") || "light";
  });

  const theme = useMemo(() => {
    return mode === "light" ? lightTheme : darkTheme;
  }, [mode]);

  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("themeMode", newMode);
  };

  return { theme, mode, toggleTheme };
};
