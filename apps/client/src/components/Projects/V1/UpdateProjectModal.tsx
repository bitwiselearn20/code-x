"use client";

import { useState, useEffect } from "react";
import { useColors } from "../../General/(Color Manager)/useColors";
import toast from "react-hot-toast";
import { X, Upload, ImageIcon } from "lucide-react";

type Project = {
  id: string;
  title: string;
  description: string;
  projectUrl?: string | null;
  repositoryUrl?: string | null;
  startDate?: string | Date | null;
  visibility: "PUBLIC" | "PRIVATE";
  publishStatus: "PUBLISHED" | "NOT_PUBLISHED";
  skills: string[];
};

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
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectUrl: "",
    repositoryUrl: "",
    startDate: "",
    visibility: "PUBLIC",
    publishStatus: "PUBLISHED",
    skills: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form when project prop changes or modal opens
  useEffect(() => {
    if (project && isOpen) {
      setFormData({
        title: project.title || "",
        description: project.description || "",
        projectUrl: project.projectUrl || "",
        repositoryUrl: project.repositoryUrl || "",
        startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : "",
        visibility: project.visibility,
        publishStatus: project.publishStatus,
        skills: project.skills ? project.skills.join(", ") : "",
      });
      // Reset cover image states when modal opens
      setCoverImage(null);
      setCoverImagePreview(null);
    }
  }, [project, isOpen]);

  if (!isOpen || !project) return null;

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
    if (!formData.description.trim()) newErrors.description = "Description is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    if(!project) return;

    setLoading(true);
    const toastId = toast.loading("Updating project...");

    try {
      // First update the project details
      const res = await fetch(`${backendUrl}/api/v1/projects/update-project/${project.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          skills: formData.skills
            ? formData.skills.split(",").map((s) => s.trim()).filter(s => s !== "")
            : [],
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to update project");
      }

      // If cover image is selected, upload it
      if (coverImage) {
        const formDataImage = new FormData();
        formDataImage.append("coverImage", coverImage);

        const imageRes = await fetch(`${backendUrl}/api/v1/projects/update-cover-image/${project.id}`, {
          method: "PUT",
          credentials: "include",
          body: formDataImage,
        });

        const imageResult = await imageRes.json();

        if (!imageRes.ok) {
          throw new Error(imageResult.message || "Failed to upload cover image");
        }
      }

      toast.success("Project updated successfully ✨", { id: toastId });
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

  const selectClass = `w-full appearance-none px-3 py-2 rounded-lg bg-transparent border
    ${Colors.border.specialThin} focus:outline-none focus:ring-2 cursor-pointer`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className={`${Colors.background.secondary} ${Colors.text.primary} 
        w-[650px] max-h-[95vh] overflow-y-auto rounded-2xl p-6 shadow-2xl font-mono`}
      >
        <div className={`flex justify-between items-center mb-4 pb-2 ${Colors.border.defaultThickBottom}`}>
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
            <label className="text-xs opacity-60 mb-1 block">Project Title</label>
            <input
              placeholder="Project Title"
              className={inputClass("title")}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="text-xs opacity-60 mb-1 block">Description</label>
            <textarea
              placeholder="Project Description"
              rows={4}
              className={inputClass("description")}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs opacity-60 mb-1 block">Live URL</label>
              <input
                placeholder="https://..."
                className={inputClass("projectUrl")}
                value={formData.projectUrl}
                onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs opacity-60 mb-1 block">Repo URL</label>
              <input
                placeholder="https://github.com/..."
                className={inputClass("repositoryUrl")}
                value={formData.repositoryUrl}
                onChange={(e) => setFormData({ ...formData, repositoryUrl: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-xs opacity-60 mb-1 block">Start Date</label>
            <input
              type="date"
              className={inputClass("startDate")}
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs opacity-60 mb-1 block">Skills (Tags)</label>
            <input
              placeholder="React, TypeScript, Tailwind..."
              className={inputClass("skills")}
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs opacity-60 mb-1 block">Upload Cover Image</label>
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
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs opacity-40">PNG, JPG, JPEG (MAX. 10MB)</p>
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

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs opacity-60 mb-1 block">Visibility</label>
              <select
                className={selectClass}
                value={formData.visibility}
                onChange={(e) => setFormData({ ...formData, visibility: e.target.value as any })}
              >
                <option value="PUBLIC">Public</option>
                <option value="PRIVATE">Private</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="text-xs opacity-60 mb-1 block">Status</label>
              <select
                className={selectClass}
                value={formData.publishStatus}
                onChange={(e) => setFormData({ ...formData, publishStatus: e.target.value as any })}
              >
                <option value="PUBLISHED">Published</option>
                <option value="NOT_PUBLISHED">Not Published</option>
              </select>
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