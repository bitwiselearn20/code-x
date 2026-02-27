"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useColors } from "../../General/(Color Manager)/useColors";
import ProjectCard from "./ProjectCard";
import Spinner from "@/components/General/Spinner";
import AddProjectModal from "./AddProjectModal";

const PAGE_SIZE = 6;

type Project = {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  projectUrl?: string;
  repositoryUrl?: string;
  startDate?: string;
  visibility?: "PUBLIC" | "PRIVATE";
  publishStatus?: "PUBLISHED" | "NOT_PUBLISHED";
  skills?: string[];
};

export default function ProjectsV1() {
  const Colors = useColors();
  const [projects, setProjects] = useState<Project[]>([]);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function getAllProjects() {
    try {
      const res = await fetch(
        backendUrl + "/api/v1/projects/get-all-projects",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );
      if (!res.ok) {
        throw new Error("Failed to fetch projects");
      }
      const result = await res.json();
      console.log("Fetched projects:", result.data);
      setProjects(result.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }

  useEffect(() => {
    getAllProjects();
  }, []);

  // const [visibleProjects, setVisibleProjects] = useState(
  //   allProjects.slice(0, PAGE_SIZE),
  // );
  // const [page, setPage] = useState(1);
  // const [loading, setLoading] = useState(false);

  // const observerRef = useRef<HTMLDivElement | null>(null);

  // const loadMore = useCallback(() => {
  //   if (loading) return;
  //   setLoading(true);

  //   setTimeout(() => {
  //     const nextPage = page + 1;
  //     const nextItems = allProjects.slice(0, nextPage * PAGE_SIZE);

  //     setVisibleProjects(nextItems);
  //     setPage(nextPage);
  //     setLoading(false);
  //   }, 2000); // simulate API delay
  // }, [page, loading, allProjects]);

  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       if (
  //         entries[0].isIntersecting &&
  //         visibleProjects.length < allProjects.length
  //       ) {
  //         loadMore();
  //       }
  //     },
  //     { threshold: 1 },
  //   );

  //   if (observerRef.current) {
  //     observer.observe(observerRef.current);
  //   }

  //   return () => observer.disconnect();
  // }, [loadMore, visibleProjects.length, allProjects.length]);

  return (
    <div
      className={`${Colors.text.primary} ${Colors.background.primary}
      min-h-screen w-full flex flex-col items-center gap-8 py-16 font-mono tracking-tight`}
    >
      <div
        className={`${Colors.background.secondary}
        w-4/5 mx-auto rounded-xl p-4 flex items-center justify-between`}
      >
        <h1 className="text-2xl font-semibold">Projects</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className={`${Colors.background.special} ${Colors.text.inverted} ${Colors.properties.interactiveButton} px-4 py-2 font-semibold rounded-lg`}
        >
          Add New Project
        </button>
      </div>

      <div className="w-4/5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project: Project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* Spinner */}
      {/* {loading && (
        <div className="py-2">
          <Spinner />
        </div>
      )} */}

      {/* Sentinel */}
      {/* <div ref={observerRef} className="h-10" /> */}
      <AddProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={getAllProjects}
      />
    </div>
  );
}
