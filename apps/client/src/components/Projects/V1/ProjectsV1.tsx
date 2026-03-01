"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useColors } from "../../General/(Color Manager)/useColors";
import ProjectCard from "./ProjectCard";
import Spinner from "@/components/General/Spinner";
import AddProjectModal from "./AddProjectModal";
import type { Project } from "@/../server/utils/type";

const PAGE_SIZE = 6;

export default function ProjectsV1() {
  const Colors = useColors();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  // Add a ref to track if initial load is done
  const isInitialLoad = useRef(true);

  const observerRef = useRef<HTMLDivElement | null>(null);

  const getUserProjectsByBatch = useCallback(
    async (currentOffset: number) => {
      if (loading || !hasMore) return;

      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          offset: currentOffset.toString(),
          pageSize: PAGE_SIZE.toString(),
        }).toString();

        const res = await fetch(
          `${backendUrl}/api/v1/projects/get-projects-by-batch?${queryParams}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          },
        );

        if (!res.ok) throw new Error("Failed to fetch projects");

        const result = await res.json();
        const newProjects = result.data;

        if (newProjects.length < PAGE_SIZE) {
          setHasMore(false);
        }

        setProjects((prev) => [...prev, ...newProjects]);
        // Update offset AFTER setting projects
        setOffset((prev) => prev + PAGE_SIZE);
      } catch (error) {
        console.error("Error fetching project batch:", error);
      } finally {
        setLoading(false);
      }
    },
    [loading, hasMore, backendUrl],
  );

  // Initial Load
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      getUserProjectsByBatch(0);
    }
  }, []);

  // Intersection Observer
  useEffect(() => {
    // Don't set up observer until after initial load
    if (isInitialLoad.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading && hasMore) {
          getUserProjectsByBatch(offset);
        }
      },
      { threshold: 0.1 },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [offset, hasMore, loading]); // Keep getUserProjectsByBatch out of deps

  const handleRefresh = () => {
    setProjects([]);
    setOffset(0);
    setHasMore(true);
    isInitialLoad.current = true; // Reset initial load flag
    getUserProjectsByBatch(0);
  };

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
        {projects.map((project: Project, index) => (
          // Using project.id is best, but if duplicate IDs exist, combine with index
          <ProjectCard key={`${project.id}-${index}`} project={project} />
        ))}
      </div>

      {/* Sentinel & Loading Indicator */}
      <div
        ref={observerRef}
        className="w-full flex justify-center py-8 min-h-10"
      >
        {loading && <Spinner />}
        {/* {!hasMore && projects.length > 0 && (
          <p className="opacity-50 text-sm">No more projects to show.</p>
        )} */}
      </div>

      <AddProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleRefresh} // Reset and reload to show newest project at top
      />
    </div>
  );
}
