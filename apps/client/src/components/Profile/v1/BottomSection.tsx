import React from "react";
import JobList from "./JobList";
import { useColors } from "@/components/General/(Color Manager)/useColors";

export default function BottomSection() {
  const Colors = useColors();
  return (
    <div
      className={`${Colors.background.secondary} rounded-xl gap-4 p-4 pt-0 w-full h-full grid grid-cols-2`}
    >
      <div className={`${Colors.background.primary} rounded-xl p-2`}><JobList /></div>
      <div className={`${Colors.background.primary} rounded-xl p-4`}></div>
    </div>
  );
}
