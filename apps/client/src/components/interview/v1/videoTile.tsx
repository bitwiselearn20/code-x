import { useColors } from "@/components/General/(Color Manager)/useColors";

type VideoTileProps = {
  name: string;
};

export default function VideoTile({ name }: VideoTileProps) {
  const colors = useColors();

  const initial = name.charAt(0).toUpperCase();

  return (
    <div
      className={`relative flex h-52 items-center justify-center rounded-2xl overflow-hidden
        ${colors.background.secondary} ${colors.border.fadedThin}
        shadow-lg`}
    >
      {/* Avatar Circle */}
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center text-3xl font-semibold
          ${colors.background.accent} ${colors.text.inverted}`}
      >
        {initial}
      </div>

      {/* Name Label */}
      <div className="absolute bottom-4 left-4 px-3 py-1 text-sm rounded-lg backdrop-blur-sm bg-black/40">
        {name}
      </div>
    </div>
  );
}
