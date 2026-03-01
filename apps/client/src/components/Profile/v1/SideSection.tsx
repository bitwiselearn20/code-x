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
  Pencil,
  DoorOpen,
} from "lucide-react";

import "./profile_styles.css";
import toast from "react-hot-toast";
import { ReactNode, useState, useRef, useEffect } from "react";
import ThemeSwitcher from "@/components/General/(Color Manager)/ThemeSwitcher";
import { useColors } from "@/components/General/(Color Manager)/useColors";
import EditProfileModal from "./EditProfileModal";
import KnowMoreProfileModal from "./KnowMoreProfileModal";
import EditLinksModal, { updateUserLinks } from "./EditLinksModal";

type PlatformProps = {
  icon: ReactNode;
  label: string;
  url: string;
};

type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  profileUrl: string;
  bannerUrl: string;
  headline: string;
  userInfo: string;
  resume?: string | null;
  githubUrl?: string;
  linkedinUrl?: string;
  leetcodeUrl?: string;
  codeForcesUrl?: string;
  mediumUrl?: string;
  portfolioUrl?: string;
};

const PLATFORM_CONFIG = [
  {
    key: "githubUrl",
    label: "GitHub",
    icon: Github,
  },
  {
    key: "linkedinUrl",
    label: "LinkedIn",
    icon: Linkedin,
  },
  {
    key: "leetcodeUrl",
    label: "LeetCode",
    icon: Code2,
  },
  {
    key: "codeForcesUrl",
    label: "Codeforces",
    icon: Code2,
  },
  {
    key: "mediumUrl",
    label: "Medium",
    icon: PenTool,
  },
  {
    key: "portfolioUrl",
    label: "Portfolio",
    icon: Globe,
  },
] as const;

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

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const [data, setData] = useState<User | null>(null);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const getData = async () => {
    try {
      const res = await fetch(backendUrl + "/api/v1/users/get-profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!res) throw new Error("Unable to get Data");

      const result = await res.json();
      // console.log("Data fetch success:", result.data);
      setData(result.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getData();
    console.log(data);
  }, []);

  const uploadProfilePic = async (file: File) => {
    const toastId = toast.loading("Uploading profile picture...");
    try {
      const formData = new FormData();
      formData.append("profilePic", file);

      const res = await fetch(`${backendUrl}/api/v1/users/update-ProfilePic`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const result = await res.json();

      if (!result.data?.profileUrl) {
        throw new Error(result.message || "Upload failed");
      }

      setData((prev) =>
        prev
          ? {
              ...prev,
              profileUrl: `${result.data.profileUrl}?t=${Date.now()}`,
            }
          : prev,
      );
      toast.success("Upload Success!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Unable to Upload", { id: toastId });
    }
  };
  const sanitizeLinksPayload = (payload: updateUserLinks) => {
    return Object.fromEntries(
      Object.entries(payload)
        .map(([key, value]) => [
          key,
          typeof value === "string" && value.trim() !== ""
            ? value.trim()
            : undefined,
        ])
        .filter(([, value]) => value !== undefined),
    ) as updateUserLinks;
  };
  const updatePlatformLinks = async (payload: updateUserLinks) => {
    const toastId = toast.loading("Updating links...");

    try {
      const cleanedPayload = sanitizeLinksPayload(payload);

      if (Object.keys(cleanedPayload).length === 0) {
        toast.error("Nothing to update", { id: toastId });
        return;
      }

      const res = await fetch(
        `${backendUrl}/api/v1/users/update-platform-links`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(cleanedPayload),
        },
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Update failed");
      }

      const result = await res.json();

      setData((prev) =>
        prev
          ? {
              ...prev,
              ...result.data,
            }
          : prev,
      );

      toast.success("Links updated successfully!", { id: toastId });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Unable to update links", {
        id: toastId,
      });
    }
  };

  const activePlatforms = data
    ? PLATFORM_CONFIG.filter(({ key }) => {
        const value = data[key];
        return typeof value === "string" && value.trim() !== "";
      })
    : [];

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [knowMoreOpen, setKnowMoreOpen] = useState(false);
  const [editLinksOpen, setEditLinksOpen] = useState(false);
  return (
    <div
      className={`${Colors.background.secondary} w-full min-h-full p-4 flex flex-col justify-between rounded-xl font-mono`}
    >
      {/* hidden file input  */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadProfilePic(file);
        }}
      />


      <div>
        <div className="flex justify-center mb-4">
          <div
            className={`
      relative w-50 h-50 rounded-full overflow-hidden
      ${Colors.background.primary}
      group cursor-pointer
      flex items-center justify-center
    `}
            onClick={() => fileInputRef.current?.click()}
          >
            {data?.profileUrl ? (
              <img
                src={data.profileUrl}
                alt="Profile"
                className="
        block
        w-full h-full
        object-cover
        rounded-full
        leading-none
        transition-all duration-200
        group-hover:blur-sm group-hover:opacity-60
      "
              />
            ) : (
              <User
                className="
        w-32 h-32
        text-white
        transition-all duration-200
        group-hover:blur-sm group-hover:opacity-60
      "
              />
            )}

            {/* Hover overlay */}
            <div
              className="
      absolute inset-0
      flex items-center justify-center
      bg-black/40
      opacity-0
      group-hover:opacity-100
      transition-opacity duration-200
    "
            >
              <Pencil className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div
          className={`${Colors.background.primary} rounded-xl px-4 py-3 flex items-center justify-between`}
        >
          <div>
            <p
              className={`${Colors.text.primary} font-mono text-2xl leading-none`}
            >
              {data?.name ?? "User"}
            </p>
            <p
              className={`text-md ${Colors.text.secondary} font-mono font-bold`}
            >
              {data?.username ?? "@username"}
            </p>
          </div>

          <div className="relative" ref={menuRef}>
            <Menu
              className={`${Colors.text.primary} w-8 h-8 cursor-pointer`}
              onClick={() => setOpen((prev) => !prev)}
            />

            {open && (
              <div
                className={`absolute right-0 top-8 z-50 w-48 rounded-xl ${Colors.background.secondary} backdrop-blur-sm ${Colors.border.defaultThin} shadow-lg`}
              >
                <MenuItem
                  label="Know More"
                  onClick={() => {
                    setKnowMoreOpen(true);
                    setOpen(false);
                  }}
                />
                <Divider />
                <MenuItem label="Add to Wishlist" />
                <Divider />
                <MenuItem
                  label="Edit Profile"
                  onClick={() => {
                    setEditOpen(true);
                    setOpen(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div
          className={`mt-6 ${Colors.background.primary} rounded-xl p-4 max-h-82 overflow-y-auto`}
        >
          <div className="flex items-center justify-between mb-2">
            <p className={`${Colors.text.primary} text-2xl font-mono`}>
              Other Platforms
            </p>
            <button
              type="button"
              onClick={() => {
                console.log("Edit platform links");
                setEditLinksOpen(true);
              }}
              className={`${Colors.text.secondary} hover:${Colors.text.primary} transition p-1`}
              aria-label="Edit platform links"
            >
              <Pencil
                size={18}
                className={`${Colors.properties.interactiveButton}`}
              />
            </button>
          </div>
          <div className={`${Colors.border.defaultThinBottom} mb-3`} />

          {activePlatforms.length === 0 ? (
            <p className={`${Colors.text.secondary} font-mono text-sm`}>
              No platforms added yet
            </p>
          ) : (
            activePlatforms.map(({ key, label, icon: Icon }) => (
              <Platform
                key={key}
                icon={<Icon />}
                label={label}
                url={data![key] as string}
              />
            ))
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <ThemeSwitcher />
      </div>

      {/* Bottom Buttons */}
      <div className="flex gap-3">
        <button
          className={`${Colors.background.special} ${Colors.properties.interactiveButton} flex-1 py-3 rounded-xl flex items-center justify-center`}
        >
          <DoorOpen className={`${Colors.text.inverted}`} /> <span className={`ml-2 ${Colors.text.inverted} font-semibold`}>Logout</span>
        </button>
        {/* <button
          className={`${Colors.background.special} ${Colors.properties.interactiveButton} flex-1 py-3 rounded-xl flex items-center justify-center`}
        >
          <MessageSquare className={`${Colors.text.inverted}`} />
        </button> */}
      </div>

      {/* Edit profile Modal  */}
      <EditProfileModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={(payload) => {
          console.log(payload);
          setEditOpen(false);
        }}
      />

      {/* Know more Modal  */}
      <KnowMoreProfileModal
        isOpen={knowMoreOpen}
        onClose={() => setKnowMoreOpen(false)}
        user={{
          name: data?.name ?? "",
          username: data?.username ?? "",
          role: data?.headline ?? "Developer",
          bio: data?.userInfo ?? "",
          email: data?.email ?? "",
          location: "Los Angeles, California",
          gender: "Male",
          dob: "12 Dec 1994",
          profileUrl: data?.profileUrl,
          bannerUrl: data?.bannerUrl,
          techStack: ["React", "Next.js", "Docker", "Java"],
        }}
      />

      {/* Edit links modal  */}
      <EditLinksModal
        isOpen={editLinksOpen}
        onClose={() => setEditLinksOpen(false)}
        initialValues={{
          githubUrl: data?.githubUrl,
          linkedinUrl: data?.linkedinUrl,
          leetcodeUrl: data?.leetcodeUrl,
          codeForcesUrl: data?.codeForcesUrl,
          mediumUrl: data?.mediumUrl,
          portfolioUrl: data?.portfolioUrl,
        }}
        onSave={(payload) => {
          updatePlatformLinks(payload);
          setEditLinksOpen(false);
        }}
      />
    </div>
  );
}

function Platform({ icon, label, url }: PlatformProps) {
  const Colors = useColors();
  return (
    <a
      href={url}
      target="blank"
      className={`flex items-center gap-3 ${Colors.text.primary} text-lg font-mono py-2 hover:opacity-70 transition`}
    >
      <span className="w-5 h-5">{icon}</span>
      <span>{label}</span>
    </a>
  );
}

function MenuItem({ label, onClick }: { label: string; onClick?: () => void }) {
  const Colors = useColors();

  return (
    <div
      onClick={onClick}
      className={`px-4 py-2 ${Colors.text.primary} rounded-xl font-mono text-sm cursor-pointer hover:opacity-80 transition`}
    >
      {label}
    </div>
  );
}

function Divider() {
  const Colors = useColors();
  return <div className={`mx-3 ${Colors.border.defaultThinBottom}`} />;
}
