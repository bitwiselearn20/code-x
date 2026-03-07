"use client";

import { useState, useRef, useEffect } from "react";
import JobListPanel from "./JobListPanel";
import { useColors } from "@/components/General/(Color Manager)/useColors";
import JobDetailsPanel from "./JobDetailsPanel";
import { getAllJobs } from "@/api/jobs/getAllJobs";
import { getJobById } from "@/api/jobs/getJobById";

export interface Job {
  id: string;

  jobRole: string;
  jobDescription: string;

  jobType: "REMOTE" | "OFFLINE" | "HYBRID" | "FREELANCE";

  payment: string;

  startDate: string;
  endDate: string;

  createdAt: string;

  organization: {
    id: string;
    name: string;
    logo: string;
  };

  interviewer?: {
    name: string;
    headline?: string;
  };

  totalApplicants?: number;
}

export default function JobListingPage() {
  const Colors = useColors();

  const containerRef = useRef<HTMLDivElement | null>(null);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);

  const [leftWidth, setLeftWidth] = useState(28);
  const [isDragging, setIsDragging] = useState(false);

  const startDragging = () => setIsDragging(true);
  const stopDragging = () => setIsDragging(false);

  const onDrag = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const newWidth = (e.clientX / containerWidth) * 100;

    if (newWidth >= 20 && newWidth <= 40) {
      setLeftWidth(newWidth);
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const data = await getAllJobs();
        setJobs(data);

        if (data.length > 0) {
          setSelectedJob(data[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch jobs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const fetchJobById = async (jobId: string) => {
  try {
    const data = await getJobById(jobId);
    setSelectedJob(data.job);
  } catch (error) {
    console.error("Error fetching job:", error);
  }
};

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        Loading jobs...
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={onDrag}
      onMouseUp={stopDragging}
      onMouseLeave={stopDragging}
      className={`flex h-full w-full ${Colors.background.secondary} ${Colors.text.primary}`}
    >
      <div style={{ width: `${leftWidth}%` }} className="h-full">
        <JobListPanel
          jobs={jobs}
          selectedJob={selectedJob}
          setSelectedJob={fetchJobById}
        />
      </div>

      <div
        onMouseDown={startDragging}
        className="
w-0.5
cursor-col-resize
bg-neutral-700
hover:bg-neutral-500
transition
"
      />

      <div style={{ width: `${100 - leftWidth}%` }} className="h-screen">
        <JobDetailsPanel job={selectedJob} />
      </div>
    </div>
  );
}
