"use client"

import { useColors } from "@/components/General/(Color Manager)/useColors";

export default function HeroLeft() {
  const Colors = useColors();
  return (
    <div className="flex flex-col justify-center space-y-8 max-w-2xl">
      
      {/* Headline */}
      <div className="space-y-2">
        <h1 className={`text-5xl md:text-6xl font-semibold tracking-tight leading-tight ${Colors.text.special} drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]`}>
          Review Code.
        </h1>
        <h1 className={`text-5xl md:text-6xl font-semibold tracking-tight leading-tight ${Colors.text.special} drop-shadow-[0_0_8px_rgba(16,185,129,0.6)] ml-20`}>
          Run Projects.
        </h1>
        <h1 className={`text-5xl md:text-6xl font-semibold tracking-tight leading-tight ${Colors.text.special} drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]`}>
          Decide Faster.
        </h1>
      </div>

      {/* CTA */}
      <div>
        <button
          className={`px-4 py-4 text-base rounded-xl ${Colors.border.specialThick} text-white bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all ${Colors.properties.interactiveButton}`}
        >
          Interview Smarter
        </button>
      </div>

      {/* Subtext */}
      <p className={`${Colors.text.secondary} text-lg leading-relaxed`}>
        One workspace to explore a candidate’s code and live project—
        side by side, in real time.
      </p>

    </div>
  )
}