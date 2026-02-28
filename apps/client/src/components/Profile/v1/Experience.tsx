"use client";

import { useEffect, useState } from "react";
import {
  Briefcase,
  Building2,
  CalendarDays,
  ExternalLink,
  FileText,
  Plus,
  Upload,
  X,
} from "lucide-react";
import { useColors } from "@/components/General/(Color Manager)/useColors";
import toast from "react-hot-toast";

type UserExperience = {
  id: string;
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  offerLetter?: string | null;
  completionCertifiate?: string | null;
  startDate: string;
  endDate?: string | null;
  isOngoing: "ONGOING" | "COMPLETED";
  jobType: "REMOTE" | "OFFLINE" | "HYBRID" | "FREELANCE";
};

type User = {
  id: string;
  userExperiences?: UserExperience[];
};

export default function Experience() {
  const Colors = useColors();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [data, setData] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedExperience, setSelectedExperience] =
    useState<UserExperience | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingExperience, setEditingExperience] =
    useState<UserExperience | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [offerLetterFile, setOfferLetterFile] = useState<File | null>(null);
  const [completionCertificateFile, setCompletionCertificateFile] =
    useState<File | null>(null);

  const [form, setForm] = useState({
    companyName: "",
    jobTitle: "",
    jobDescription: "",
    startDate: "",
    endDate: "",
    isOngoing: "ONGOING" as "ONGOING" | "COMPLETED",
    jobType: "OFFLINE" as "REMOTE" | "OFFLINE" | "HYBRID" | "FREELANCE",
  });

  const [editForm, setEditForm] = useState({
    companyName: "",
    jobTitle: "",
    jobDescription: "",
    startDate: "",
    endDate: "",
    isOngoing: "ONGOING" as "ONGOING" | "COMPLETED",
    jobType: "OFFLINE" as "REMOTE" | "OFFLINE" | "HYBRID" | "FREELANCE",
  });

  const getData = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/v1/users/get-profile`, {
        credentials: "include",
      });
      const result = await res.json();
      setData(result.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/v1/users/add-experience`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...form,
          startDate: new Date(form.startDate),
          endDate:
            form.isOngoing === "ONGOING"
              ? null
              : form.endDate
                ? new Date(form.endDate)
                : null,
        }),
      });

      if (!res.ok) throw new Error("Failed to create experience");

      await getData();
      setIsOpen(false);
      setForm({
        companyName: "",
        jobTitle: "",
        jobDescription: "",
        startDate: "",
        endDate: "",
        isOngoing: "ONGOING",
        jobType: "OFFLINE",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    const toastId = toast.loading("Deleting experience...");
    setDeleting(true);

    try {
      const res = await fetch(
        `${backendUrl}/api/v1/users/delete-experience/${deleteId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        credentials: "include",
        },
      );

      if (!res.ok) throw new Error("Failed to delete");

      toast.success("Experience deleted", { id: toastId });
      setDeleteId(null);
      await getData(); // refresh list
    } catch (error) {
      console.error(error);
      toast.error("Delete failed", { id: toastId });
    } finally {
      setDeleting(false);
    }
  };

  const formatMonthYear = (dateValue?: string | null) => {
    if (!dateValue) return "Present";
    const parsedDate = new Date(dateValue);
    if (Number.isNaN(parsedDate.getTime())) return "Present";
    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const handleEditPlaceholder = (experienceId: string) => {
    const exp = data?.userExperiences?.find((item) => item.id === experienceId);
    if (!exp) return;

    setEditingExperience(exp);
    setEditForm({
      companyName: exp.companyName,
      jobTitle: exp.jobTitle,
      jobDescription: exp.jobDescription,
      startDate: toDateInputValue(exp.startDate),
      endDate: exp.endDate ? toDateInputValue(exp.endDate) : "",
      isOngoing: exp.isOngoing,
      jobType: exp.jobType,
    });
    setOfferLetterFile(null);
    setCompletionCertificateFile(null);
    setIsEditOpen(true);
  };

  const getDescriptionPreview = (description: string) => {
    const firstLine = description
      .split("\n")
      .find((line) => line.trim().length > 0);
    return firstLine?.trim() || "No description added.";
  };

  const openDocument = (url?: string | null) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const toDateInputValue = (dateValue?: string | null) => {
    if (!dateValue) return "";
    const parsedDate = new Date(dateValue);
    if (Number.isNaN(parsedDate.getTime())) return "";
    return parsedDate.toISOString().split("T")[0] ?? "";
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setEditingExperience(null);
    setOfferLetterFile(null);
    setCompletionCertificateFile(null);
  };

  const handleUpdateExperience = async () => {
    if (!editingExperience) return;

    const toastId = toast.loading("Updating experience...");
    setEditLoading(true);

    try {
      const formData = new FormData();

      formData.append("companyName", editForm.companyName);
      formData.append("jobTitle", editForm.jobTitle);
      formData.append("jobDescription", editForm.jobDescription);
      formData.append("startDate", editForm.startDate);
      formData.append("isOngoing", editForm.isOngoing);
      formData.append("jobType", editForm.jobType);

      if (editForm.isOngoing === "COMPLETED" && editForm.endDate) {
        formData.append("endDate", editForm.endDate);
      }

      if (offerLetterFile) {
        formData.append("offerLetter", offerLetterFile);
      }

      if (completionCertificateFile) {
        formData.append("completionCertificate", completionCertificateFile);
      }

      const res = await fetch(
        `${backendUrl}/api/v1/users/update-experience/${editingExperience.id}`,
        {
          method: "PUT",
          credentials: "include",
          body: formData,
        },
      );

      const result = await res.json();
      if (!res.ok || result.statusCode >= 400) {
        throw new Error(result.message || "Failed to update experience");
      }

      await getData();
      closeEditModal();
      toast.success("Experience updated", { id: toastId });
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to update experience", {
        id: toastId,
      });
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className={`${Colors.background.primary} rounded-xl p-4`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className={`${Colors.text.primary} font-mono text-xl`}>
          Experience
        </h2>

        <button
          onClick={() => setIsOpen(true)}
          className={`${Colors.background.special} ${Colors.text.inverted} ${Colors.properties.interactiveButton} flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm`}
        >
          <Plus size={16} />
          Add Experience
        </button>
      </div>

      {/* Experience List */}
      {data?.userExperiences && data.userExperiences.length > 0 ? (
        <div className="space-y-3 max-h-112 overflow-y-auto pr-1">
          {data.userExperiences.map((exp) => (
            <div
              key={exp.id}
              onClick={() => setSelectedExperience(exp)}
              className={`${Colors.background.secondary} rounded-lg p-4 ${Colors.border.defaultThin} cursor-pointer ${Colors.properties.interactiveButton}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p
                    className={`${Colors.text.primary} font-mono text-base font-semibold`}
                  >
                    {exp.jobTitle}
                  </p>
                  <p
                    className={`${Colors.text.secondary} text-sm font-mono mt-1`}
                  >
                    {exp.companyName}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditPlaceholder(exp.id);
                    }}
                    className={`${Colors.properties.interactiveButton} ${Colors.text.primary} text-xs font-mono px-3 py-1.5 rounded-md ${Colors.border.defaultThin}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteId(exp.id);
                    }}
                    className={`${Colors.properties.interactiveButton} text-red-500 text-xs font-mono px-3 py-1.5 rounded-md ${Colors.border.defaultThin}`}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span
                  className={`${Colors.background.primary} ${Colors.text.secondary} text-xs font-mono px-2 py-1 rounded-md ${Colors.border.defaultThin}`}
                >
                  {exp.jobType}
                </span>
                <span
                  className={`${Colors.background.primary} ${Colors.text.secondary} text-xs font-mono px-2 py-1 rounded-md ${Colors.border.defaultThin}`}
                >
                  {exp.isOngoing === "ONGOING" ? "Ongoing" : "Completed"}
                </span>
              </div>

              <p className={`${Colors.text.secondary} text-sm font-mono mt-3`}>
                {formatMonthYear(exp.startDate)} -{" "}
                {exp.isOngoing === "ONGOING"
                  ? "Present"
                  : formatMonthYear(exp.endDate)}
              </p>

              <p
                className={`${Colors.text.secondary} text-sm font-mono mt-3 truncate`}
                title={exp.jobDescription}
              >
                {getDescriptionPreview(exp.jobDescription)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className={`${Colors.text.secondary} text-sm font-mono`}>
          No experience added yet.
        </p>
      )}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div
            className={`${Colors.background.primary} w-full max-w-lg rounded-xl p-6`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className={`${Colors.text.primary} font-mono text-lg`}>
                Add Experience
              </h3>
              <X
                className="cursor-pointer opacity-70 hover:opacity-100"
                onClick={() => setIsOpen(false)}
              />
            </div>

            {/* Form */}
            <div className="space-y-3">
              <Input
                label="Company Name"
                value={form.companyName}
                onChange={(v) => setForm({ ...form, companyName: v })}
              />

              <Input
                label="Job Title"
                value={form.jobTitle}
                onChange={(v) => setForm({ ...form, jobTitle: v })}
              />

              <Textarea
                label="Job Description"
                value={form.jobDescription}
                onChange={(v) => setForm({ ...form, jobDescription: v })}
              />

              <Input
                label="Start Date"
                type="date"
                value={form.startDate}
                onChange={(v) => setForm({ ...form, startDate: v })}
              />

              {form.isOngoing === "COMPLETED" && (
                <Input
                  label="End Date"
                  type="date"
                  value={form.endDate}
                  onChange={(v) => setForm({ ...form, endDate: v })}
                />
              )}

              <Select
                label="Job Type"
                value={form.jobType}
                onChange={(v) => setForm({ ...form, jobType: v })}
              />

              <label
                className={`${Colors.text.primary} flex items-center gap-2 text-sm font-mono`}
              >
                <input
                  type="checkbox"
                  checked={form.isOngoing === "ONGOING"}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      isOngoing: e.target.checked ? "ONGOING" : "COMPLETED",
                      endDate: "",
                    })
                  }
                />
                Currently Working Here
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsOpen(false)}
                className={`flex-1 py-2 rounded-lg border font-mono ${Colors.properties.interactiveButton}`}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className={`${Colors.background.special} ${Colors.text.inverted} ${Colors.properties.interactiveButton} flex-1 py-2 rounded-lg font-mono`}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditOpen && editingExperience && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="absolute inset-0" onClick={closeEditModal} />

          <div
            className={`${Colors.background.primary} relative z-10 w-full max-w-2xl rounded-xl p-6 ${Colors.border.defaultThin}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`${Colors.text.primary} font-mono text-lg`}>
                Edit Experience
              </h3>
              <X
                className="cursor-pointer opacity-70 hover:opacity-100"
                onClick={closeEditModal}
              />
            </div>

            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              <Input
                label="Company Name"
                value={editForm.companyName}
                onChange={(v) => setEditForm({ ...editForm, companyName: v })}
              />

              <Input
                label="Job Title"
                value={editForm.jobTitle}
                onChange={(v) => setEditForm({ ...editForm, jobTitle: v })}
              />

              <Textarea
                label="Job Description"
                value={editForm.jobDescription}
                onChange={(v) =>
                  setEditForm({ ...editForm, jobDescription: v })
                }
              />

              <Input
                label="Start Date"
                type="date"
                value={editForm.startDate}
                onChange={(v) => setEditForm({ ...editForm, startDate: v })}
              />

              {editForm.isOngoing === "COMPLETED" && (
                <Input
                  label="End Date"
                  type="date"
                  value={editForm.endDate}
                  onChange={(v) => setEditForm({ ...editForm, endDate: v })}
                />
              )}

              <Select
                label="Job Type"
                value={editForm.jobType}
                onChange={(v) => setEditForm({ ...editForm, jobType: v })}
              />

              <label
                className={`${Colors.text.primary} flex items-center gap-2 text-sm font-mono`}
              >
                <input
                  type="checkbox"
                  checked={editForm.isOngoing === "ONGOING"}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      isOngoing: e.target.checked ? "ONGOING" : "COMPLETED",
                      endDate: e.target.checked ? "" : editForm.endDate,
                    })
                  }
                />
                Currently Working Here
              </label>

              <div
                className={`${Colors.background.secondary} rounded-lg p-4 ${Colors.border.defaultThin}`}
              >
                <p className={`${Colors.text.primary} text-sm font-mono mb-2`}>
                  Offer Letter
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <label
                    className={`${Colors.properties.interactiveButton} ${Colors.background.special} ${Colors.text.inverted} cursor-pointer rounded-lg px-3 py-2 text-xs font-mono inline-flex items-center gap-2`}
                  >
                    <Upload size={14} />
                    Upload New
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.ppt"
                      className="hidden"
                      onChange={(e) =>
                        setOfferLetterFile(e.target.files?.[0] || null)
                      }
                    />
                  </label>

                  {editingExperience.offerLetter ? (
                    <button
                      type="button"
                      onClick={() => openDocument(editingExperience.offerLetter)}
                      className={`${Colors.properties.interactiveButton} ${Colors.text.primary} rounded-lg px-3 py-2 text-xs font-mono ${Colors.border.defaultThin}`}
                    >
                      View Current
                    </button>
                  ) : (
                    <p className={`${Colors.text.secondary} text-xs font-mono`}>
                      Offer Letter not uploaded.
                    </p>
                  )}
                </div>
                {offerLetterFile && (
                  <p className={`${Colors.text.secondary} text-xs font-mono mt-2`}>
                    New file: {offerLetterFile.name}
                  </p>
                )}
              </div>

              <div
                className={`${Colors.background.secondary} rounded-lg p-4 ${Colors.border.defaultThin}`}
              >
                <p className={`${Colors.text.primary} text-sm font-mono mb-2`}>
                  Completion Certificate
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <label
                    className={`${Colors.properties.interactiveButton} ${Colors.background.special} ${Colors.text.inverted} cursor-pointer rounded-lg px-3 py-2 text-xs font-mono inline-flex items-center gap-2`}
                  >
                    <Upload size={14} />
                    Upload New
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.ppt"
                      className="hidden"
                      onChange={(e) =>
                        setCompletionCertificateFile(
                          e.target.files?.[0] || null,
                        )
                      }
                    />
                  </label>

                  {editingExperience.completionCertifiate ? (
                    <button
                      type="button"
                      onClick={() =>
                        openDocument(editingExperience.completionCertifiate)
                      }
                      className={`${Colors.properties.interactiveButton} ${Colors.text.primary} rounded-lg px-3 py-2 text-xs font-mono ${Colors.border.defaultThin}`}
                    >
                      View Current
                    </button>
                  ) : (
                    <p className={`${Colors.text.secondary} text-xs font-mono`}>
                      Completion Certificate not uploaded.
                    </p>
                  )}
                </div>
                {completionCertificateFile && (
                  <p className={`${Colors.text.secondary} text-xs font-mono mt-2`}>
                    New file: {completionCertificateFile.name}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeEditModal}
                disabled={editLoading}
                className={`flex-1 py-2 rounded-lg border font-mono ${Colors.properties.interactiveButton}`}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateExperience}
                disabled={editLoading}
                className={`${Colors.background.special} ${Colors.text.inverted} ${Colors.properties.interactiveButton} flex-1 py-2 rounded-lg font-mono`}
              >
                {editLoading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Experience Details Modal */}
      {selectedExperience && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div
            onClick={() => setSelectedExperience(null)}
            className="absolute inset-0"
          />

          <div
            onClick={(e) => e.stopPropagation()}
            className={`${Colors.background.primary} relative z-10 w-full max-w-3xl rounded-2xl p-6 ${Colors.border.defaultThin}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className={`${Colors.text.primary} font-mono text-2xl font-semibold`}>
                  {selectedExperience.jobTitle}
                </h3>
                <p className={`${Colors.text.secondary} font-mono text-sm mt-1`}>
                  {selectedExperience.companyName}
                </p>
              </div>

              <button
                onClick={() => setSelectedExperience(null)}
                className={`${Colors.properties.interactiveButton} ${Colors.text.secondary}`}
                aria-label="Close experience details"
              >
                <X size={20} />
              </button>
            </div>

            <div className={`my-5 h-px ${Colors.border.defaultThin}`} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`${Colors.background.secondary} rounded-xl p-4 ${Colors.border.defaultThin}`}>
                <p className={`${Colors.text.secondary} text-xs font-mono uppercase tracking-wide mb-2`}>
                  Company
                </p>
                <div className="flex items-center gap-2">
                  <Building2 size={16} className={Colors.text.special} />
                  <p className={`${Colors.text.primary} text-sm font-mono`}>
                    {selectedExperience.companyName}
                  </p>
                </div>
              </div>

              <div className={`${Colors.background.secondary} rounded-xl p-4 ${Colors.border.defaultThin}`}>
                <p className={`${Colors.text.secondary} text-xs font-mono uppercase tracking-wide mb-2`}>
                  Role
                </p>
                <div className="flex items-center gap-2">
                  <Briefcase size={16} className={Colors.text.special} />
                  <p className={`${Colors.text.primary} text-sm font-mono`}>
                    {selectedExperience.jobTitle}
                  </p>
                </div>
              </div>

              <div className={`${Colors.background.secondary} rounded-xl p-4 ${Colors.border.defaultThin}`}>
                <p className={`${Colors.text.secondary} text-xs font-mono uppercase tracking-wide mb-2`}>
                  Timeline
                </p>
                <div className="flex items-center gap-2">
                  <CalendarDays size={16} className={Colors.text.special} />
                  <p className={`${Colors.text.primary} text-sm font-mono`}>
                    {formatMonthYear(selectedExperience.startDate)} -{" "}
                    {selectedExperience.isOngoing === "ONGOING"
                      ? "Present"
                      : formatMonthYear(selectedExperience.endDate)}
                  </p>
                </div>
              </div>

              <div className={`${Colors.background.secondary} rounded-xl p-4 ${Colors.border.defaultThin}`}>
                <p className={`${Colors.text.secondary} text-xs font-mono uppercase tracking-wide mb-2`}>
                  Work Mode
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`${Colors.background.primary} ${Colors.text.secondary} text-xs font-mono px-2 py-1 rounded-md ${Colors.border.defaultThin}`}
                  >
                    {selectedExperience.jobType}
                  </span>
                  <span
                    className={`${Colors.background.primary} ${Colors.text.secondary} text-xs font-mono px-2 py-1 rounded-md ${Colors.border.defaultThin}`}
                  >
                    {selectedExperience.isOngoing === "ONGOING"
                      ? "Ongoing"
                      : "Completed"}
                  </span>
                </div>
              </div>
            </div>

            <div className={`${Colors.background.secondary} rounded-xl p-4 ${Colors.border.defaultThin} mt-4`}>
              <p className={`${Colors.text.secondary} text-xs font-mono uppercase tracking-wide mb-2`}>
                Description
              </p>
              <p className={`${Colors.text.primary} text-sm font-mono leading-6 whitespace-pre-wrap`}>
                {selectedExperience.jobDescription || "No description added."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className={`${Colors.background.secondary} rounded-xl p-4 ${Colors.border.defaultThin}`}>
                <p className={`${Colors.text.secondary} text-xs font-mono uppercase tracking-wide mb-3`}>
                  Offer Letter
                </p>
                <button
                  onClick={() => openDocument(selectedExperience.offerLetter)}
                  disabled={!selectedExperience.offerLetter}
                  className={`${Colors.background.special} ${Colors.text.inverted} ${Colors.properties.interactiveButton} w-full rounded-lg px-4 py-2 font-mono text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <FileText size={16} />
                  View Offer Letter
                  <ExternalLink size={14} />
                </button>
                {!selectedExperience.offerLetter && (
                  <p className={`${Colors.text.secondary} text-xs font-mono mt-2`}>
                    Offer Letter not uploaded.
                  </p>
                )}
              </div>

              <div className={`${Colors.background.secondary} rounded-xl p-4 ${Colors.border.defaultThin}`}>
                <p className={`${Colors.text.secondary} text-xs font-mono uppercase tracking-wide mb-3`}>
                  Completion Certificate
                </p>
                <button
                  onClick={() =>
                    openDocument(selectedExperience.completionCertifiate)
                  }
                  disabled={!selectedExperience.completionCertifiate}
                  className={`${Colors.background.special} ${Colors.text.inverted} ${Colors.properties.interactiveButton} w-full rounded-lg px-4 py-2 font-mono text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <FileText size={16} />
                  View Completion Certificate
                  <ExternalLink size={14} />
                </button>
                {!selectedExperience.completionCertifiate && (
                  <p className={`${Colors.text.secondary} text-xs font-mono mt-2`}>
                    Completion Certificate not uploaded.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* delete modal  */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div
            className={`${Colors.background.primary} w-full max-w-sm rounded-xl p-6`}
          >
            <h3 className={`${Colors.text.primary} font-mono text-lg`}>
              Delete Experience?
            </h3>

            <p className={`${Colors.text.secondary} text-sm font-mono mt-2`}>
              This action cannot be undone.
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="flex-1 py-2 rounded-lg border font-mono"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2 rounded-lg bg-red-600 text-white font-mono"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Reusable Inputs ---------- */

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  const Colors = useColors();

  return (
    <div>
      <label className={`${Colors.text.primary} text-sm font-mono mb-1 block`}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 rounded-lg ${Colors.background.secondary} ${Colors.text.primary} font-mono outline-none`}
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const Colors = useColors();

  return (
    <div>
      <label className={`${Colors.text.primary} text-sm font-mono mb-1 block`}>
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 rounded-lg h-24 ${Colors.background.secondary} ${Colors.text.primary} font-mono outline-none`}
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
}: {
  label: string;
  value: "REMOTE" | "OFFLINE" | "HYBRID" | "FREELANCE";
  onChange: (v: "REMOTE" | "OFFLINE" | "HYBRID" | "FREELANCE") => void;
}) {
  const Colors = useColors();

  return (
    <div>
      <label className={`${Colors.text.primary} text-sm font-mono mb-1 block`}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value as "REMOTE" | "OFFLINE" | "HYBRID" | "FREELANCE",
          )
        }
        className={`w-full px-3 py-2 rounded-lg ${Colors.background.secondary} ${Colors.text.primary} font-mono outline-none`}
      >
        <option value="OFFLINE">Offline</option>
        <option value="REMOTE">Remote</option>
        <option value="HYBRID">Hybrid</option>
        <option value="FREELANCE">Freelance</option>
      </select>
    </div>
  );
}
