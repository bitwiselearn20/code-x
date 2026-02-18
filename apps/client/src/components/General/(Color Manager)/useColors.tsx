import { text } from "stream/consumers";

export function useColors() {
  return {
    background: {
      primary: "bg-[var(--bg-primary)]",
      secondary: "bg-[var(--bg-secondary)]",
      accent: "bg-[var(--bg-accent)]",
      special: "bg-[var(--bg-special)]",

      heroPrimary: "bg-[var(--hero-primary)]",
      heroPrimaryFaded: "bg-[var(--hero-primary-faded)]",
      heroSecondary: "bg-[var(--hero-secondary)]",
      heroSecondaryFaded: "bg-[var(--hero-secondary-faded)]",
    },

    text: {
      primary: "text-[var(--text-primary)]",
      secondary: "text-[var(--text-secondary)]",
      special: "text-[var(--text-special)]",
      inverted: "text-[var(--text-inverted)]",
    },

    border: {
      defaultThin: "border border-[var(--border-default)]",
      fadedThin: "border border-[var(--border-faded)]",
      greenThin: "border border-[var(--border-green)]",
      specialThin: "border border-[var(--border-special)]",

      defaultThick: "border-2 border-[var(--border-default)]",
      fadedThick: "border-2 border-[var(--border-faded)]",
      greenThick: "border-2 border-[var(--border-green)]",
      specialThick: "border-2 border-[var(--border-special)]",
      
      defaultThinRight: "border border-[var(--border-default)]",
      fadedThinRight: "border border-[var(--border-faded)]",
      greenThinRight: "border border-[var(--border-green)]",
      specialThinRight: "border border-[var(--border-special)]",

      defaultThickRight: "border-2 border-[var(--border-default)]",
      fadedThickRight: "border-2 border-[var(--border-faded)]",
      greenThickRight: "border-2 border-[var(--border-green)]",
      specialThickRight: "border-2 border-[var(--border-special)]",

      defaultThinLeft: "border border-[var(--border-default)]",
      fadedThinLeft: "border border-[var(--border-faded)]",
      greenThinLeft: "border border-[var(--border-green)]",
      specialThinLeft: "border border-[var(--border-special)]",

      defaultThickLeft: "border-2 border-[var(--border-default)]",
      fadedThickLeft: "border-2 border-[var(--border-faded)]",
      greenThickLeft: "border-2 border-[var(--border-green)]",
      specialThickLeft: "border-2 border-[var(--border-special)]",

      defaultThinTop: "border border-[var(--border-default)]",
      fadedThinTop: "border border-[var(--border-faded)]",
      greenThinTop: "border border-[var(--border-green)]",
      specialThinTop: "border border-[var(--border-special)]",

      defaultThickTop: "border-2 border-[var(--border-default)]",
      fadedThickTop: "border-2 border-[var(--border-faded)]",
      greenThickTop: "border-2 border-[var(--border-green)]",
      specialThickTop: "border-2 border-[var(--border-special)]",

      defaultThinBottom: "border border-[var(--border-default)]",
      fadedThinBottom: "border border-[var(--border-faded)]",
      greenThinBottom: "border border-[var(--border-green)]",
      specialThinBottom: "border border-[var(--border-special)]",

      defaultThickBottom: "border-2 border-[var(--border-default)]",
      fadedThickBottom: "border-2 border-[var(--border-faded)]",
      greenThickBottom: "border-2 border-[var(--border-green)]",
      specialThickBottom: "border-2 border-[var(--border-special)]",
    },

    accent: {
      primary: "accent-[var(--accent-primary)]",
      secondary: "accent-[var(--accent-secondary)]",
      special: "accent-[var(--accent-special)]",
    },

    hover: {
      special: "hover:bg-[var(--hover-special)]",
      textSpecial: "hover:text-[var(--text-special)]",
    },

    properties: {
      interactiveButton: "cursor-pointer active:scale-95 transition-all duration-150 hover:opacity-90",
    }
  };
}
