import { DarkSemantic, LightSemantic } from "./SemanticColors";

type Semantic = typeof DarkSemantic;

export function applySemanticToCSS(
  semantic: Semantic
) {
  const root = document.documentElement;

  /* ---------- BACKGROUND ---------- */
  root.style.setProperty("--bg-primary", semantic.background.primary);
  root.style.setProperty("--bg-secondary", semantic.background.secondary);
  root.style.setProperty("--bg-accent", semantic.background.accent);
  root.style.setProperty("--bg-special", semantic.background.special);

  /* ---------- HERO ---------- */
  root.style.setProperty("--hero-primary", semantic.hero.primary);
  root.style.setProperty("--hero-primary-faded", semantic.hero.primaryFaded);

  /* ---------- TEXT ---------- */
  root.style.setProperty("--text-primary", semantic.text.primary);
  root.style.setProperty("--text-secondary", semantic.text.secondary);
  root.style.setProperty("--text-special", semantic.text.special);
  root.style.setProperty("--text-inverted", semantic.text.inverted); //-->

  /* ---------- BORDER ---------- */
  root.style.setProperty("--border-default", semantic.border.default);
  root.style.setProperty("--border-faded", semantic.border.faded);
  root.style.setProperty("--border-special", semantic.border.special);
  root.style.setProperty("--border-special-faded", semantic.border.specialFaded); //-->

  /* ---------- ICON ---------- */
  root.style.setProperty("--icon-primary", semantic.icon.primary);
  root.style.setProperty("--icon-secondary", semantic.icon.secondary);
  root.style.setProperty("--icon-special", semantic.icon.special);
  root.style.setProperty("--icon-inverted", semantic.icon.inverted); //-->

  /* ---------- ACCENT ---------- */
  root.style.setProperty("--accent-primary", semantic.accent.primary);
  root.style.setProperty("--accent-secondary", semantic.accent.secondary);
  root.style.setProperty("--accent-special", semantic.accent.special);

  /* ---------- HOVER ---------- */
  root.style.setProperty("--hover-special", semantic.hover.special);
  root.style.setProperty("--hover-text-special", semantic.hover.textSpecial);
}
