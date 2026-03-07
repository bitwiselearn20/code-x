"use client";

import React from "react";
import JobListingPage from "./JobListingPage";
import { useColors } from "@/components/General/(Color Manager)/useColors";
import { WebsiteNavbar } from "@/components/General/WebsiteNavbar";

const JobsV1 = () => {

    const Colors = useColors();
  return (
      <div className="flex-1">
      <WebsiteNavbar />
        <JobListingPage />
      </div>
  );
};

export default JobsV1;