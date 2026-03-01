"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useColors } from "@/components/General/(Color Manager)/useColors";
import EditProfileModal from "./EditProfileModal";
import { Plus } from "lucide-react";

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

export default function UserInfo() {
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const Colors = useColors();
  const resumeInputRef = useRef<HTMLInputElement>(null);

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
      console.log("Data fetch success:", result.data);
      setData(result.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && resumeOpen) {
        setResumeOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [resumeOpen]);

  const handleResumeUpload = async (file: File) => {
    const toastId = toast.loading("Uploading Resume...");
    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await fetch(`${backendUrl}/api/v1/users/upload-resume`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const result = await res.json();

      if (!result.data?.resume) {
        throw new Error(result.message || "Upload failed");
      }

      setData((prev) =>
        prev
          ? {
              ...prev,
              resume: `${result.data.resume}?t=${Date.now()}`,
            }
          : prev,
      );
      toast.success("Upload Success!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Unable to Upload", { id: toastId });
    }
  };

  const handleResumeDelete = async () => {
    const toastId = toast.loading("Deleting Resume...");
    try {
      const res = await fetch(`${backendUrl}/api/v1/users/delete-resume`, {
        method: "PUT",
        credentials: "include",
      });

      if (!res) throw new Error("Unable to delete");

      const result = await res.json();
      setData((prev) => (prev ? { ...prev, resume: null } : prev));
      setResumeOpen(false);
      toast.success("Delete Success!", { id: toastId });
    } catch (error) {
      console.log(error);
      toast.error("Unable to Delete", { id: toastId });
    }
  };

  const handleResumeButtonClick = () => {
    if (!data?.resume) {
      resumeInputRef.current?.click();
    } else {
      setResumeOpen(true);
    }
  };

  if (loading) {
    return <div className="font-mono">Loading...</div>;
  }

  if (data && !data.bannerUrl && !data.headline && !data.userInfo) {
    return (
      <div className="font-mono flex items-center justify-center h-full">
        <p className={`${Colors.text.secondary} text-sm`}>
          No profile information available.
        </p>
        <button className={`${Colors.properties.interactiveButton} ${Colors.border.specialThick} rounded-full p-6`} onClick={() => setIsEditModalOpen(true)}>
          <Plus className={`${Colors.text.special}`} size={40} />
        </button>
        <p className={`${Colors.text.secondary} text-sm`}>
          Tell others about yourself.
        </p>
      </div>
    );
  }

  return (
    <div className="font-mono">
      {/* Hidden resume input */}
      <input
        ref={resumeInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleResumeUpload(file);
        }}
      />

      {data?.bannerUrl && (
        <div>
          <Image
            src={data?.bannerUrl}
            alt="Banner"
            width={600}
            height={200}
            className="w-full relative inset-0 h-30 object-cover z-0 rounded-lg mb-4"
          />
        </div>
      )}

      <div
        className={`flex flex-col items-start gap-1 mb-4 ${Colors.text.primary}`}
      >
        <p className={`text-sm ${Colors.text.secondary} italic`}>
          {data?.headline}
        </p>
        <h2 className={`text-md`}>{data?.userInfo}</h2>
      </div>
      <div className="flex relative items-center justify-between bottom-0">
        <h1 className="text-xl font-semibold">{data?.email}</h1>
        <button
          onClick={handleResumeButtonClick}
          className={`${Colors.background.special} ${Colors.text.inverted} px-4 py-1 rounded-md font-semibold ${Colors.properties.interactiveButton}`}
        >
          {data?.resume ? "View Resume" : "Add Resume"}
        </button>
      </div>
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={(payload) => {
          console.log(payload);
          setIsEditModalOpen(false);
        }}
      />

      {/* Resume Modal */}
      {resumeOpen && data?.resume && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setResumeOpen(false);
            }
          }}
        >
          <div
            className={`${Colors.background.primary} w-[80%] h-[80%] rounded-xl p-4 relative`}
          >
            {/* Bottom actions */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              {/* Close - bottom left */}
              <button
                onClick={() => setResumeOpen(false)}
                className={`${Colors.properties.interactiveButton} ${Colors.background.primary} px-4 py-1 rounded-sm text-sm opacity-70 hover:opacity-100 transition ml-2`}
              >
                Close
              </button>

              {/* Update + Delete - bottom right */}
              <div className="flex gap-2 m-2">
                <button
                  onClick={() => resumeInputRef.current?.click()}
                  className={`${Colors.background.special} ${Colors.text.inverted} font-semibold px-4 py-1 rounded-sm text-sm ${Colors.properties.interactiveButton}`}
                >
                  Update
                </button>

                <button
                  onClick={() => {
                    handleResumeDelete();
                  }}
                  className={`${Colors.background.primary} hover:text-red-500 ${Colors.text.primary} font-semibold px-4 py-1 rounded-sm text-sm ${Colors.properties.interactiveButton}`}
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Resume display */}
            <iframe src={data.resume} className="w-full h-full rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
}
