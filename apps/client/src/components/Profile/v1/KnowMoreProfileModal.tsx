"use client";

import {
  X,
  MapPin,
  Mail,
  Calendar,
  Phone,
  User as UserIcon,
  Pencil,
} from "lucide-react";
import { useColors } from "@/components/General/(Color Manager)/useColors";
import { JSX, use, useRef, useState } from "react";
import toast from "react-hot-toast";

type UserProfile = {
  name: string;
  username: string;
  headline?: string;
  role?: string;
  bio?: string;
  email?: string;
  location?: string;
  dob?: string;
  phone?: string;
  gender?: string;
  profileUrl?: string;
  bannerUrl?: string;
  techStack?: string[];
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
};

export default function KnowMoreProfileModal({ isOpen, onClose, user }: Props) {
  const Colors = useColors();
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [localBanner, setLocalBanner] = useState<string | undefined>(
    user?.bannerUrl,
  );

  if (!isOpen || !user) return null;

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const uploadBanner = async (file: File) => {
    const toastId = toast.loading("Uploading banner...");

    try {
      const formData = new FormData();
      formData.append("Banner", file);

      const res = await fetch(`${backendUrl}/api/v1/users/update-banner`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const result = await res.json();
      console.log(result);
      if (!result.data?.bannerUrl) {
        throw new Error("Banner upload failed");
      }

      setLocalBanner(`${result.data.bannerUrl}?t=${Date.now()}`);
      toast.success("Banner updated!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Unable to upload banner", { id: toastId });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 md:px-6">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* MODAL */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          relative w-full max-w-6xl rounded-3xl
          ${Colors.background.primary}
          ${Colors.border.defaultThin}
          shadow-2xl
          overflow-hidden
        `}
      >
        {/* HIDDEN BANNER INPUT */}
        <input
          ref={bannerInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadBanner(file);
          }}
        />

        {/* HEADER / BANNER */}
        <div
          className="relative h-48 group cursor-pointer"
          onClick={() => bannerInputRef.current?.click()}
        >
          {user.bannerUrl ? (
            <img
              src={user.bannerUrl}
              className="
                w-full h-full object-cover
                transition-all duration-300
                group-hover:blur-sm group-hover:opacity-70
              "
              alt="banner"
            />
          ) : (
            <div
              className={`
                w-full h-full
                ${Colors.background.secondary}
              `}
            />
          )}

          {/* Banner Hover Overlay */}
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
            <div
              className={`
                flex items-center gap-2
                ${Colors.text.primary}
                text-sm font-mono
              `}
            >
              <Pencil size={16} />
              {localBanner ? "Update banner" : "Upload banner"}
            </div>
          </div>

          {/* CLOSE (stopPropagation FIX) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className={`
              absolute top-6 right-6 z-10
              text-red-500
              transition
            `}
          >
            <X size={22} />
          </button>

        </div>

        {/* MAIN */}
        <div className="px-5 py-6 md:px-10 md:pt-8 md:pb-10">
          {/* NAME SECTION */}
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-center gap-6 min-w-0">
              <div
                className={`
                  w-36 h-36 rounded-full
                  overflow-hidden shrink-0
                  ${Colors.background.secondary}
                  border-4 ${Colors.border.defaultThin}
                  shadow-xl
                `}
              >
                {user.profileUrl ? (
                  <img
                    src={user.profileUrl}
                    className="w-full h-full object-cover"
                    alt="profile"
                  />
                ) : (
                  <UserIcon
                    className={`w-full h-full p-9 ${Colors.text.inverted}`}
                  />
                )}
              </div>

              <div className="min-w-0">
                <h1
                  className={`
                    text-4xl font-bold tracking-tight
                    ${Colors.text.primary}
                  `}
                >
                  {user.name}
                </h1>
                <p className={`${Colors.text.secondary} text-base font-medium mt-1`}>
                  @{user.username}
                </p>

                {user.headline && (
                  <p
                    className={`
                      mt-3 text-base font-semibold
                      ${Colors.text.special}
                    `}
                  >
                    {user.headline}
                  </p>
                )}

                {user.role && (
                  <p className={`${Colors.text.secondary} text-sm mt-2`}>
                    {user.role}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              className={`
                shrink-0 mt-2 h-11 w-11 rounded-full
                flex items-center justify-center
                ${Colors.background.secondary}
                ${Colors.border.defaultThin}
                ${Colors.text.secondary}
                hover:${Colors.text.primary}
                transition
                ${Colors.properties.interactiveButton}
              `}
              aria-label="Edit profile"
            >
              <Pencil size={18} />
            </button>
          </div>

          {/* DIVIDER */}
          <div className={`mt-6 h-px ${Colors.border.defaultThin}`} />

          {/* CONTENT */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* LEFT INFO CARD */}
            <div
              className={`
                rounded-2xl p-6 space-y-5
                ${Colors.background.secondary}
                ${Colors.border.defaultThin}
              `}
            >
              <Info icon={<MapPin />} text={user.location} />
              <Info icon={<Mail />} text={user.email} />
              <Info icon={<Calendar />} text={user.dob} />
              <Info icon={<Phone />} text={user.phone} />
              <Info icon={<UserIcon />} text={user.gender} />
            </div>

            {/* RIGHT CONTENT */}
            <div
              className={`
                lg:col-span-2 rounded-2xl p-6
                ${Colors.background.secondary}
                ${Colors.border.defaultThin}
              `}
            >
              {user.bio && (
                <p
                  className={`
                    text-sm leading-relaxed
                    ${Colors.text.primary}
                  `}
                >
                  {user.bio}
                </p>
              )}

              <div className={`my-6 h-px ${Colors.border.defaultThin}`} />

              {user.techStack && user.techStack.length > 0 && (
                <>
                  <p
                    className={`
                      font-mono mb-4 flex items-center gap-2
                      ${Colors.text.primary}
                    `}
                  >
                    <span className={Colors.text.special}>{"</>"}</span>
                    Tech Stack
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {user.techStack.map((tech) => (
                      <span
                        key={tech}
                        className={`
                          px-5 py-2 rounded-full text-sm
                          ${Colors.background.primary}
                          ${Colors.border.defaultThin}
                          ${Colors.text.primary}
                        `}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------- INFO ROW -------- */

function Info({ icon, text }: { icon: JSX.Element; text?: string }) {
  const Colors = useColors();
  if (!text) return null;

  return (
    <div className="flex items-center gap-4 text-sm">
      <span className={Colors.text.special}>{icon}</span>
      <span className={Colors.text.primary}>{text}</span>
    </div>
  );
}
