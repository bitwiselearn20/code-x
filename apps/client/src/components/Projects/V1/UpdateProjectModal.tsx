"use client";

import { useState, useEffect, useRef } from "react";
import { useColors } from "../../General/(Color Manager)/useColors";
import toast from "react-hot-toast";
import { X, ImageIcon, Plus } from "lucide-react";
import type { Project } from "@/../server/utils/type";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  project: Project | null;
};

export default function UpdateProjectModal({
  isOpen,
  onClose,
  onSuccess,
  project,
}: Props) {
  const Colors = useColors();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [loading, setLoading] = useState(false);

  // existing cover image state
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null,
  );

    const modalRef = useRef<HTMLDivElement>(null);

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

  // --- NEW: Project Media State ---
  const [projectMedia, setProjectMedia] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [existingMediaPreviews, setExistingMediaPreviews] = useState<
    { id: string; url: string }[]
  >([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectUrl: "",
    repositoryUrl: "",
    startDate: "",
    endDate: "",
    skills: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (project && isOpen) {
      console.log("Loaded project into form:", project);
      setFormData({
        title: project.title || "",
        description: project.description || "",
        projectUrl: project.projectUrl || "",
        repositoryUrl: project.repositoryUrl || "",
        startDate: project.startDate
          ? new Date(project.startDate).toISOString().split("T")[0]
          : "",
        endDate: project.endDate
          ? new Date(project.endDate).toISOString().split("T")[0]
          : "",
        skills: project.skills ? project.skills.join(", ") : "",
      });
      setCoverImage(null);
      setCoverImagePreview(project.coverImage || null);
      // Reset new media
      setProjectMedia([]);
      setMediaPreviews([]);
      setExistingMediaPreviews(
        project.projectMedias
          ?.filter((media) => Boolean(media.id && media.url))
          .map((media) => ({ id: media.id as string, url: media.url })) || [],
      );
    }
  }, [project, isOpen]);

  if (!isOpen || !project) return null;

  // --- NEW: Media Change Handler ---
  function handleMediaChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setProjectMedia((prev) => [...prev, ...files]);

      // Generate previews
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setMediaPreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  function removeMediaItem(index: number) {
    setProjectMedia((prev) => prev.filter((_, i) => i !== index));
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function removeExistingMediaItem(mediaId: string) {
    if (!project) return;

    const toastId = toast.loading("Removing media...");
    try {
      const res = await fetch(
        `${backendUrl}/api/v1/projects/delete-project-media/${project.id}/${mediaId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.message || "Failed to delete media");
      }

      setExistingMediaPreviews((prev) =>
        prev.filter((media) => media.id !== mediaId),
      );

      toast.success("Media removed", { id: toastId });
    } catch (error: any) {
      toast.error(error.message || "Unable to remove media", { id: toastId });
    }
  }

  function handleCoverImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/png", "image/jpg", "image/jpeg"];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a valid image file (PNG, JPG, JPEG)");
        return;
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size should be less than 10MB");
        return;
      }
      setCoverImage(file);
      // Create preview
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
    if (!project) return;

    setLoading(true);
    const toastId = toast.loading("Updating project...");

    try {
      // 1. Update project details
      const res = await fetch(
        `${backendUrl}/api/v1/projects/update-project/${project.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            ...formData,
            skills: formData.skills
              ? formData.skills
                  .split(",")
                  .map((s) => s.trim())
                  .filter((s) => s !== "")
              : [],
          }),
        },
      );

      if (!res.ok) throw new Error("Failed to update project details");

      // 2. Upload Cover Image (Existing)
      if (coverImage) {
        const formDataImage = new FormData();
        formDataImage.append("coverImage", coverImage);
        await fetch(
          `${backendUrl}/api/v1/projects/update-cover-image/${project.id}`,
          {
            method: "PUT",
            credentials: "include",
            body: formDataImage,
          },
        );
      }

      // 3. --- NEW: Upload Project Media (Multiple) ---
      if (projectMedia.length > 0) {
        const formDataMedia = new FormData();
        projectMedia.forEach((file) => {
          formDataMedia.append("projectMedia", file); // Key matches controller req.files
        });

        const mediaRes = await fetch(
          `${backendUrl}/api/v1/projects/update-project-media/${project.id}`,
          {
            method: "PUT", // Or PUT, depending on your route
            credentials: "include",
            body: formDataMedia,
          },
        );

        if (!mediaRes.ok) throw new Error("Failed to upload project gallery");
      }

      toast.success("Project updated successfully!", { id: toastId });
      onSuccess();
      onClose();
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
    <div onClick={handleOutsideClick} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
      ref = {modalRef}
      onClick={(e) => e.stopPropagation()}
        className={`${Colors.background.secondary} ${Colors.text.primary} 
        w-[650px] max-h-[95vh] overflow-y-auto rounded-2xl p-6 shadow-2xl font-mono`}
      >
        <div
          className={`flex justify-between items-center mb-4 pb-2 ${Colors.border.defaultThickBottom}`}
        >
          <h2 className="text-xl font-semibold">Update Project</h2>
          <button
            onClick={onClose}
            className={`${Colors.text.primary} font-semibold hover:text-red-500 rounded ${Colors.properties.interactiveButton}`}
          >
            <X size={28} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs opacity-60 mb-1 block">
              Project Title
            </label>
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
            <label className="text-xs opacity-60 mb-1 block">Description</label>
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
              <label className="text-xs opacity-60 mb-1 block">Live URL</label>
              <input
                placeholder="https://..."
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
              <label className="text-xs opacity-60 mb-1 block">Repo URL</label>
              <input
                placeholder="https://github.com/..."
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs opacity-60 mb-1 block">
                Start Date
              </label>
              <input
                type="date"
                className={inputClass("startDate")}
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
              {errors.startDate && (
                <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
              )}
            </div>
            <div>
              <label className="text-xs opacity-60 mb-1 block">End Date</label>
              <input
                type="date"
                className={inputClass("endDate")}
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
              {errors.endDate && (
                <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs opacity-60 mb-1 block">
              Skills (Tags)
            </label>
            <input
              placeholder="React, TypeScript, Tailwind..."
              className={inputClass("skills")}
              value={formData.skills}
              onChange={(e) =>
                setFormData({ ...formData, skills: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-xs opacity-60 mb-1 block">
              Upload Cover Image
            </label>
            <div className="flex flex-col gap-2">
              {coverImagePreview ? (
                <div
                  className={`relative group ${Colors.border.specialThin} rounded-lg overflow-hidden`}
                >
                  <img
                    src={coverImagePreview}
                    alt="Cover preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeCoverImage}
                    className={`absolute top-2 right-2 bg-black/30 rounded-full p-1 hover:text-red-600 transition-colors ${Colors.properties.interactiveButton} ${Colors.text.primary} opacity-0 group-hover:opacity-100`}
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

          {/* --- NEW: Multiple Media Gallery Section --- */}
          <div>
            <label className={`text-xs opacity-60 mb-1 block`}>
              Project Project Snapshots
            </label>
            <div className="grid grid-cols-3 gap-3">
              {existingMediaPreviews.map((media, index) => (
                <div
                  key={media.id || `existing-${index}`}
                  className={`relative group aspect-video rounded-lg overflow-hidden ${Colors.border.specialThin}`}
                >
                  <img
                    src={media.url}
                    alt="Existing media"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingMediaItem(media.id)}
                    className={`absolute top-2 right-2 bg-black/30 rounded-full p-1 hover:text-red-600 transition-colors ${Colors.properties.interactiveButton} ${Colors.text.primary} opacity-0 group-hover:opacity-100`}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              {mediaPreviews.map((src, index) => (
                <div
                  key={`new-${index}`}
                  className="relative group aspect-video rounded-lg overflow-hidden border"
                >
                  <img
                    src={src}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeMediaItem(index)}
                    className={`absolute top-2 right-2 bg-black/30 rounded-full p-1 hover:text-red-600 transition-colors ${Colors.properties.interactiveButton} ${Colors.text.primary} opacity-0 group-hover:opacity-100`}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              <label
                className={`flex flex-col items-center justify-center aspect-video border-2 border-dashed rounded-lg cursor-pointer hover:bg-white/5 transition-all ${Colors.border.specialThin}`}
              >
                <Plus size={24} className="opacity-40" />
                <span className="text-[10px] opacity-40 uppercase mt-1">
                  Add Media
                </span>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleMediaChange}
                  accept="image/*,video/*,.pdf"
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`${Colors.background.special} ${Colors.text.inverted} 
              ${Colors.properties.interactiveButton} py-2 rounded-lg font-semibold 
              mt-4 disabled:opacity-50 transition-all`}
          >
            {loading ? "Saving Changes..." : "Update Project"}
          </button>
        </form>
      </div>
    </div>
  );
}
