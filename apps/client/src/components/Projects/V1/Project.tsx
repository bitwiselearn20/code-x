"use client";

import { useColors } from "@/components/General/(Color Manager)/useColors";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import UpdateProjectModal from "./UpdateProjectModal";
import DeleteProjectModal from "./DeleteProjectModal";
import type { Project } from "@/../server/utils/type";

export default function Project({ id }: { id: string }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const Colors = useColors();

  const getProjectById = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/v1/projects/get-project/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch project");

      const result = await res.json();
      console.log('Fetched Project:', result.data)
      console.log('Project media:', result.data.projectMedia)
      setProject(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id, backendUrl]);

  useEffect(() => {
    getProjectById();
  }, [getProjectById]);

  if (loading) return <div className={`${Colors.background.primary} p-6`}><p>Loading...</p></div>;
  if (error || !project) return <div className={`${Colors.background.primary} p-6`}><p className="text-red-500">{error || "Not found"}</p></div>;

  return (
    <div className={`flex flex-col p-6 ${Colors.background.primary} min-h-screen font-mono`}>
      <div className={`flex justify-between items-center p-4 rounded-lg mb-4 ${Colors.background.secondary}`}>
        <h2 className="text-2xl font-bold">{project.title}</h2>
        <div className="flex gap-2">
          <button 
            className={`${Colors.text.primary} ${Colors.background.primary} ${Colors.properties.interactiveButton} px-4 py-2 rounded-md font-semibold`} 
            onClick={() => setIsEditModalOpen(true)}
          >
            Edit Project
          </button>
          <button className={`${Colors.text.primary} ${Colors.background.primary} ${Colors.properties.interactiveButton} px-4 py-2 rounded-md font-semibold hover:text-red-500`} onClick={() => setIsDeleteModalOpen(true)}>
            Delete Project
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column */}
        <div className={`col-span-1 flex flex-col gap-6 ${Colors.background.secondary} p-4 rounded-lg`}>
          {project.coverImage && (
            <div className="aspect-video rounded-lg overflow-hidden">
              <img src={project.coverImage} alt={`${project.title} Cover`} className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <h3 className="text-lg mb-2 border-b pb-1">Description</h3>
            <p className="text-sm opacity-80">{project.description}</p>
          </div>
          <ul className="text-sm space-y-1">
            <li>Start: {project.startDate ? new Date(project.startDate).toLocaleDateString() : "N/A"}</li>
            <li>End: {project.endDate ? new Date(project.endDate).toLocaleDateString() : "Ongoing"}</li>
          </ul>
          <div className="flex flex-wrap gap-2">
            {project.skills?.map((skill, i) => (
              <span key={i} className="bg-white/20 text-xs px-2 py-1 rounded">{skill}</span>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className={`col-span-2 ${Colors.background.secondary} p-4 rounded-lg`}>
          <div className={`flex justify-between mb-4 ${Colors.border.defaultThinBottom} pb-2`}>
            <h3 className="text-lg font-semibold">Project Snippets</h3>
            <div className="flex gap-2">
              {project.repositoryUrl && (
                <Link href={project.repositoryUrl} target="_blank" className={`px-3 py-1 ${Colors.text.primary} ${Colors.background.accent} rounded-md font-semibold`}>Project Repo.</Link>
              )}
              {project.projectUrl && (
                <Link href={project.projectUrl} target="_blank" className={`px-3 py-1 ${Colors.text.inverted} ${Colors.background.special} rounded-md font-semibold`}>Visit Project</Link>
              )}
            </div>
          </div>
            <div>
              {project.projectMedias && project.projectMedias.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {project.projectMedias.map((media: any, index: number) => (
                    <div key={index} className="aspect-video rounded-lg overflow-hidden">
                      <img src={media.url} alt={media.alt || "Project Media"} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm opacity-80">No project snapshots available.</p>
              )}
            </div>
        </div>
      </div>

      <UpdateProjectModal
        project={project}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={getProjectById} // Corrected: re-fetch local project data
      />
      <DeleteProjectModal
        projectId={id}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={getProjectById} // Corrected: re-fetch local project data
      />
    </div>
  );
}