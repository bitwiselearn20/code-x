import { useColors } from "@/components/General/(Color Manager)/useColors";
import RadarChart from "./RadarChart";
import Skills from "./Skills";
import Resume from "./Resume";
import UserInfo from "./UserInfo";

export default function TopSection() {
  const Colors = useColors();
  return (
    <div
      className={`${Colors.background.secondary} rounded-xl gap-4 p-4 w-full h-full grid grid-cols-3`}
    >
      <div className={`${Colors.background.primary} col-span-1 rounded-xl p-2`}> <RadarChart /></div>
      <div className={`${Colors.background.primary} col-span-2 rounded-xl p-4`}><UserInfo /></div>
    </div>
  );
}
