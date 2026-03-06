"use client";

import { useState, useEffect } from "react";
import { useColors } from "@/components/General/(Color Manager)/useColors";
import ProjectModal from "./ProjectModal";
import ProjectCardV2 from "./ProjectCardV2";
import { useRouter } from "next/navigation";
import type { Project } from "@/../server/utils/type";
import Spinner from "@/components/General/Spinner";

export default function JobList() {
  const Colors = useColors();
  const NO_OF_PROJECTS_TO_SHOW = 3;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loadedProjects, setLoadedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function getUserProjectsByBatch(
    offset: number = 0,
    pageSize: number = 10,
  ) {
    try {
      setLoading(true);
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
    finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    getUserProjectsByBatch(0, NO_OF_PROJECTS_TO_SHOW);
  }, []);

  function redirectToProjects() {
    router.push("/projects");
  }

  return (
    <div className={`${Colors.text.primary} font-mono h-full flex flex-col`}>
      <div className="flex items-center justify-between gap-3 mb-3">
        <h1 className="text-2xl">John Doe's Projects</h1>
        <button
          onClick={redirectToProjects}
          className={`${Colors.text.secondary} ${Colors.properties.interactiveButton} hover:underline text-sm`}
        >
          View All Projects
        </button>
      </div>
      <div className={`${Colors.border.defaultThinBottom} mb-4`} />

      {loading ? (
        <div className="flex justify-center items-center flex-1">
          <Spinner />
        </div>
      ) : !loading && loadedProjects.length === 0 ? (
        <p className={`text-sm ${Colors.text.secondary} opacity-80`}>No projects to display.</p>
      ) : (
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 pb-1">
            {loadedProjects.map((project) => (
              <div key={project.id} className="w-full">
                <ProjectCardV2
                  project={project}
                  onClick={() => setSelectedProject(project)}
                />
              </div>
            ))}
          </div>
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
