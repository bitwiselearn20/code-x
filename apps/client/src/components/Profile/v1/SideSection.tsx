"use client";

import {
  User,
  Github,
  Linkedin,
  MessageSquare,
  UserPlus,
  Globe,
  PenTool,
  Code2,
  Menu,
} from "lucide-react";

import "./profile_styles.css"

import { ReactNode, useState, useRef, useEffect } from "react";
import ThemeSwitcher from "@/components/General/(Color Manager)/ThemeSwitcher";
import { useColors } from "@/components/General/(Color Manager)/useColors";

type PlatformProps = {
  icon: ReactNode;
  label: string;
};

const platformArray = [
  { icon: Github, label: "Github" },
  { icon: Code2, label: "Leetcode" },
  { icon: PenTool, label: "Medium" },
  { icon: Linkedin, label: "Linkedin" },
  { icon: Globe, label: "Portfolio" },
];



export default function SideSection() {
  const Colors = useColors();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  return (
    <div
      className={`${Colors.background.secondary} w-full min-h-full p-4 flex flex-col justify-between rounded-xl`}
    >
      <div>
        <div className="flex justify-center mb-4">
          <div
            className={`w-50 h-50 rounded-full ${Colors.background.primary} flex items-center justify-center`}
          >
            <User className={`w-32 h-32 ${Colors.text.primary}`} />
          </div>
        </div>

        <div
          className={`${Colors.background.primary} rounded-xl px-4 py-3 flex items-center justify-between`}
        >
          <div>
            <p className={`${Colors.text.primary} font-mono text-2xl leading-none`}>
              John Doe
            </p>
            <p className={`text-md ${Colors.text.secondary} font-mono font-bold`}>
              @username
            </p>
          </div>
          <div className="relative" ref={menuRef}>
            <Menu
              className={`${Colors.text.primary} w-8 h-8 cursor-pointer`}
              onClick={() => setOpen((prev) => !prev)}
            />

            {open && (
              <div className={`absolute right-0 top-8 z-50 w-48 rounded-xl ${Colors.background.secondary} backdrop-blur-sm ${Colors.border.defaultThin} shadow-lg`}>
                <MenuItem label="Know More" />
                <Divider />
                <MenuItem label="Add to Wishlist" />
                <Divider />
                <MenuItem label="Edit Profile" />
              </div>
            )}
          </div>
        </div>

        <div className="relative" ref={menuRef}></div>

        <div className={`mt-6 ${Colors.background.primary} rounded-xl p-4 max-h-82 overflow-y-scroll`}>
          <p className={`${Colors.text.primary} text-2xl font-mono mb-2`}>
            Other Platforms
          </p>
          <div className={`${Colors.border.defaultThinBottom} mb-3`} />

          {platformArray.map(({ icon: Icon, label }) => (
            <Platform key={label} icon={<Icon />} label={label} />
          ))}
        </div>
      </div>

      <ThemeSwitcher />

      {/* Bottom Buttons */}
      <div className="flex gap-3">
        <button
          className={`${Colors.background.special} ${Colors.properties.interactiveButton} flex-1 py-3 rounded-xl flex items-center justify-center`}
        >
          <UserPlus className={`${Colors.text.inverted}`} />
        </button>
        <button
          className={`${Colors.background.special} ${Colors.properties.interactiveButton} flex-1 py-3 rounded-xl flex items-center justify-center`}
        >
          <MessageSquare className={`${Colors.text.inverted}`} />
        </button>
      </div>
    </div>
  );
}

function Platform({ icon, label }: PlatformProps) {
  const Colors = useColors();
  return (
    <div className={`flex items-center gap-3 ${Colors.text.primary} text-lg font-mono py-1`}>
      <span className="w-5 h-5">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function MenuItem({ label }: { label: string }) {
  const Colors = useColors();
  return (
    <div className={`px-4 py-2 ${Colors.text.primary} rounded-xl font-mono text-sm cursor-pointer hover:opacity-80 transition`}>
      {label}
    </div>
  );
}

function Divider() {
  const Colors = useColors();
  return <div className={`mx-3 ${Colors.border.defaultThinBottom}`} />;
}
