import React from "react";
import ColouredCards from "./ColouredCards";
import { useColors } from "@/components/General/(Color Manager)/useColors";

export default function JobList() {
  const Colors = useColors();
  return (
    <div className={`${Colors.text.primary} font-mono p-2`}>
      <div>
        <h1 className="text-2xl">John Doe's Projects</h1>
        <div className={`${Colors.border.defaultThinBottom} mb-3`} />
      </div>
    </div>
  );
}


function JobCard({}){
    
}