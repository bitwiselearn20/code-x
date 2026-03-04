"use client";

import { useEffect, useRef, useState } from "react";
import { useColors } from "../../General/(Color Manager)/useColors";
import toast from "react-hot-toast";
import { X, ImageIcon } from "lucide-react";
import type { Project } from "@/../server/utils/type";
import { useRouter } from "next/navigation";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function AddProjectModal({ isOpen, onClose, onSuccess }: Props) {
  const Colors = useColors();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [loading, setLoading] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null,
  );
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectUrl: "",
    repositoryUrl: "",
    startDate: "",
    endDate: "",
    skills: "",
  });
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleCoverImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/png", "image/jpg", "image/jpeg"];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a valid image file (PNG, JPG, JPEG)");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size should be less than 10MB");
        return;
      }
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function removeCoverImage() {
    setCoverImage(null);
    setCoverImagePreview(null);
  }

  if (!isOpen) return null;

  function validate() {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";

    if (formData.startDate) {
      const startDate = new Date(`${formData.startDate}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (startDate > today) {
        newErrors.startDate = "Start date cannot be in the future";
      }

      if (formData.endDate) {
        const endDate = new Date(`${formData.endDate}T00:00:00`);
        if (startDate > endDate) {
          newErrors.startDate = "Start date cannot be later than end date";
          newErrors.endDate = "End date must be on or after start date";
        }
      }
    }

    if (formData.projectUrl && !formData.projectUrl.startsWith("http")) {
      newErrors.projectUrl = "Enter valid URL";
    }

    if (formData.repositoryUrl && !formData.repositoryUrl.startsWith("http")) {
      newErrors.repositoryUrl = "Enter valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const toastId = toast.loading("Creating project...");

    try {
      const res = await fetch(`${backendUrl}/api/v1/projects/create-project`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          skills: formData.skills
            ? formData.skills.split(",").map((s) => s.trim()).filter((s) => s !== "")
            : [],
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to create project");
      }

      if (coverImage) {
        const formDataImage = new FormData();
        formDataImage.append("coverImage", coverImage);
        await fetch(
          `${backendUrl}/api/v1/projects/update-cover-image/${result.data.id}`,
          {
            method: "PUT",
            credentials: "include",
            body: formDataImage,
          },
        );
      }

      toast.success("Project created successfully", { id: toastId });
      onSuccess();
      onClose();
      router.push(`/projects/${result.data.id}`);
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  function inputClass(field: string) {
    return `w-full px-3 py-2 rounded-lg bg-transparent border transition-all
      ${errors[field] ? "border-red-500" : Colors.border.specialThin}
      focus:outline-none focus:ring-2 focus:ring-offset-1`;
  }

  return (
    <div
      onMouseDown={handleOutsideClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div
        ref={modalRef}
        onMouseDown={(e) => e.stopPropagation()}
        className={`${Colors.background.secondary} ${Colors.text.primary} 
        w-[650px] max-h-[95vh] overflow-y-auto rounded-2xl p-6 shadow-2xl font-mono no-scrollbar`}
      >
        <div
          className={`flex justify-between items-center ${Colors.border.defaultThickBottom} pb-2 mb-6`}
        >
          <h2 className="text-xl font-semibold">Create New Project</h2>
          <button
            onClick={onClose}
            className="opacity-60 hover:opacity-100 transition p-1"
          >
            <X
              className={`${Colors.text.primary} hover:text-red-500 ${Colors.properties.interactiveButton}`}
              size={24}
            />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <input
              placeholder="Project Title"
              className={inputClass("title")}
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <textarea
              placeholder="Project Description"
              rows={4}
              className={`${inputClass("description")} no-scrollbar`}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
            <input
              placeholder="Live Project URL"
              className={inputClass("projectUrl")}
              value={formData.projectUrl}
              onChange={(e) =>
                setFormData({ ...formData, projectUrl: e.target.value })
              }
            />
            {errors.projectUrl && (
              <p className="text-red-500 text-xs mt-1">{errors.projectUrl}</p>
            )}
          </div>

          <div>
            <input
              placeholder="Repository URL"
              className={inputClass("repositoryUrl")}
              value={formData.repositoryUrl}
              onChange={(e) =>
                setFormData({ ...formData, repositoryUrl: e.target.value })
              }
            />
            {errors.repositoryUrl && (
              <p className="text-red-500 text-xs mt-1">
                {errors.repositoryUrl}
              </p>
            )}
          </div>
          </div>

          <div>
            <label className="text-sm mb-2 block">Start Date | End Date</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="date"
                  className={inputClass("startDate")}
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                />
                {errors.startDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.startDate}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="date"
                  className={inputClass("endDate")}
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                />
                {errors.endDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.endDate}
                  </p>
                )}
              </div>
            </div>
          </div>

          <input
            placeholder="Skills (comma separated)"
            className={inputClass("skills")}
            value={formData.skills}
            onChange={(e) =>
              setFormData({ ...formData, skills: e.target.value })
            }
          />

          <div>
            <label className="text-xs opacity-60 mb-1 block">
              Upload Cover Image
            </label>
            <div className="flex flex-col gap-2">
              {coverImagePreview ? (
                <div className="relative">
                  <img
                    src={coverImagePreview}
                    alt="Cover preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeCoverImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <label
                  className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-opacity-10 transition-all ${Colors.border.specialThin}`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImageIcon size={40} className="mb-3 opacity-60" />
                    <p className="mb-2 text-sm opacity-60">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs opacity-40">
                      PNG, JPG, JPEG (MAX. 10MB)
                    </p>
                  </div>
                  <input
                    id="coverImage"
                    type="file"
                    className="hidden"
                    accept="image/png,image/jpg,image/jpeg"
                    onChange={handleCoverImageChange}
                  />
                </label>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`${Colors.background.special} ${Colors.text.inverted} 
              ${Colors.properties.interactiveButton} py-2 rounded-lg font-semibold 
              mt-4 disabled:opacity-50 transition-opacity`}
          >
            {loading ? "Creating..." : "Create Project"}
          </button>
        </form>
      </div>
    </div>
  );
}
