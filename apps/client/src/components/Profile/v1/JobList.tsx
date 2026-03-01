"use client";

import { useState, useEffect } from "react";
import { useColors } from "@/components/General/(Color Manager)/useColors";
import ProjectModal from "./ProjectModal";
import JobCard from "./JobCard";
import { useRouter } from "next/navigation";
import type { Project } from "@/../server/utils/type";

export default function JobList() {
  const Colors = useColors();
  const NO_OF_PROJECTS_TO_SHOW = 5;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loadedProjects, setLoadedProjects] = useState<Project[]>([]);
  const router = useRouter();

  async function getUserProjectsByBatch(
    offset: number = 0,
    pageSize: number = 10,
  ) {
    try {
      const queryParams = new URLSearchParams({
        offset: offset.toString(),
        pageSize: pageSize.toString(),
      }).toString();

      const res = await fetch(
        `${backendUrl}/api/v1/projects/get-projects-by-batch?${queryParams}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch projects");
      }

      const result = await res.json();

      setLoadedProjects(result.data);
    } catch (error) {
      console.error("Error fetching project batch:", error);
    }
  }

  useEffect(() => {
    getUserProjectsByBatch(0, NO_OF_PROJECTS_TO_SHOW);
  }, []);

  function redirectToProjects() {
    router.push("/projects");
  }

  return (
    <div className={`${Colors.text.primary} font-mono p-2`}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">John Doe's Projects</h1>
        <button
          onClick={redirectToProjects}
          className={`${Colors.text.secondary} ${Colors.properties.interactiveButton} hover:underline text-sm`}
        >
          View All Projects
        </button>
      </div>
      <div className={`${Colors.border.defaultThinBottom} mb-3`} />

      {loadedProjects.length === 0 ? (
        <p className={`text-sm ${Colors.text.secondary} opacity-80`}>No projects to display.</p>
      ) : (
        <div className="h-65 overflow-y-auto">
          <ul>
            {loadedProjects.map((project) => (
              <li key={project.id}>
                <JobCard
                  project={project}
                  onClick={() => setSelectedProject(project)}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
