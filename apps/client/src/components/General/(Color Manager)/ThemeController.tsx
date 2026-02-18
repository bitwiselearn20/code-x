"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  DarkSemantic,
  LightSemantic,
} from "@/components/General/(Color Manager)/SemanticColors";
import { applySemanticToCSS } from "@/components/General/(Color Manager)/SemanticCSSVariables";

type Theme = "Light" | "Dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);


export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("Dark");
const THEME_STORAGE_KEY = "app-theme";

  // 1️⃣ Load theme from localStorage on first mount
  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;

    if (storedTheme === "Light" || storedTheme === "Dark") {
      setTheme(storedTheme);
    }
  }, []);

  // 2️⃣ Apply semantic colors + persist theme
  useEffect(() => {
    const semantic = theme === "Dark" ? DarkSemantic : LightSemantic;

    applySemanticToCSS(semantic);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "Dark" ? "Light" : "Dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
