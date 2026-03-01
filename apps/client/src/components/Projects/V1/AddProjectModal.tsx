"use client";

import { useEffect, useRef, useState } from "react";
import { useColors } from "../../General/(Color Manager)/useColors";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import type { Project } from "@/../server/utils/type";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function AddProjectModal({
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const Colors = useColors();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [loading, setLoading] = useState(false);
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

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  function validate() {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";

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
            ? formData.skills.split(",").map((s) => s.trim())
            : [],
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to create project");
      }

      toast.success("Project created successfully", { id: toastId });
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
    <div onMouseDown={handleOutsideClick}  className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        ref={modalRef} onMouseDown={(e) => e.stopPropagation()}
        className={`${Colors.background.secondary} ${Colors.text.primary} 
        w-[650px] max-h-[95vh] overflow-y-auto rounded-2xl p-6 shadow-2xl font-mono no-scrollbar`}
      >
        <div className={`flex justify-between items-center ${Colors.border.defaultThickBottom} pb-2 mb-6`}>
          <h2 className="text-xl font-semibold">Create New Project</h2>
          <button
            onClick={onClose}
            className="opacity-60 hover:opacity-100 transition p-1"
          >
            <X className={`${Colors.text.primary} hover:text-red-500 ${Colors.properties.interactiveButton}`} size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <input
              placeholder="Project Title"
              className={inputClass("title")}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <textarea
              placeholder="Project Description"
              rows={4}
              className={inputClass("description")}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          <input
            placeholder="Live Project URL"
            className={inputClass("projectUrl")}
            value={formData.projectUrl}
            onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
          />

          <input
            placeholder="Repository URL"
            className={inputClass("repositoryUrl")}
            value={formData.repositoryUrl}
            onChange={(e) => setFormData({ ...formData, repositoryUrl: e.target.value })}
          />

          <input
            type="date"
            className={inputClass("startDate")}
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />

          <input
            placeholder="Skills (comma separated)"
            className={inputClass("skills")}
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
          />

          <div className="flex gap-4">
            <div className="relative flex-1">
              <select
                className={selectClass}
                value={formData.visibility}
                onChange={(e) =>
                  setFormData({ ...formData, visibility: e.target.value })
                }
              >
                <option value="PUBLIC">Public</option>
                <option value="PRIVATE">Private</option>
              </select>
            </div>

            <div className="relative flex-1">
              <select
                className={selectClass}
                value={formData.publishStatus}
                onChange={(e) =>
                  setFormData({ ...formData, publishStatus: e.target.value })
                }
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
              mt-4 disabled:opacity-50 transition-opacity`}
          >
            {loading ? "Creating..." : "Create Project"}
          </button>
        </form>
      </div>
    </div>
  );
}