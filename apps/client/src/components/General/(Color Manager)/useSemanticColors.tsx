"use client";

import { useTheme } from "@/components/General/(Color Manager)/ThemeController";
import { DarkSemantic, LightSemantic } from "@/components/General/(Color Manager)/SemanticColors";

export function useSemanticColors() {
  const { theme } = useTheme();

  return theme === "Dark" ? DarkSemantic : LightSemantic;
}
