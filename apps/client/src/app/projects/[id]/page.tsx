'use client';

import Project from "@/components/Projects/V1/Project";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();

  return <Project id={params.id as string} />;
}