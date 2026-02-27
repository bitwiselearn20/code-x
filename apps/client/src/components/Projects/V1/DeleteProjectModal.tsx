"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useColors } from "../../General/(Color Manager)/useColors";
import toast from "react-hot-toast";
import { X } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectId: string;
};

export default function DeleteProjectModal({
  isOpen,
  onClose,
  onSuccess,
  projectId,
}: Props) {
  const Colors = useColors();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [loading, setLoading] = useState(false);
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

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    const toastId = toast.loading("Deleting project...");

    try {
      const res = await fetch(
        `${backendUrl}/api/v1/projects/delete-project/${projectId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to delete project");
      }

      toast.success("Project deleted successfully", { id: toastId });
      onSuccess();
      onClose();
      router.push("/projects");

    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    } finally {
      setLoading(false);
    }
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
        w-[650px] max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl font-mono`}
      >
        <div className="flex flex-col justify-between items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold">Delete Project</h2>
          <div className="flex flex-col items-center gap-2">
            <p className={`${Colors.text.secondary} text-sm`}>Are you sure you want to delete this project?</p>
          <p className={`${Colors.text.secondary} text-sm font-semibold`}>Warning: This action is irreversible.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex justify-around items-center">
          <button
            type="submit"
            disabled={loading}
            className={`${Colors.background.special} ${Colors.text.inverted} 
              ${Colors.properties.interactiveButton} py-2 px-6 rounded-lg font-semibold 
              mt-4 disabled:opacity-50 transition-opacity`}
          >
            {loading ? "Deleting..." : "Delete Project"}
          </button>
          <button
            onClick={onClose}
            className={`${Colors.background.special} ${Colors.text.inverted} 
              ${Colors.properties.interactiveButton} py-2 px-6 rounded-lg font-semibold 
              mt-4 disabled:opacity-50 transition-opacity`}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
