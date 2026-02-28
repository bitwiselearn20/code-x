import { useColors } from "@/components/General/(Color Manager)/useColors";
import React from "react";

export default function InfoWithVids() {
    const Colors = useColors();
  return (
    <div className="flex flex-col gap-42 px-8 py-12 font-mono max-w-7xl mx-auto">
      {/* Section 1 - Video on Left */}
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-1">
          <video loop autoPlay muted className="w-3/4 rounded-lg shadow-lg">
            <source src="/videos/rocket.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="flex-1 space-y-4">
          <h3 className={`text-4xl font-bold ${Colors.text.special}`}>Live Coding Interviews</h3>
          <p className={`text-lg ${Colors.text.secondary}`}>
            Conduct technical interviews with real-time code execution across multiple 
            programming languages. Our isolated container environments support C, C++, 
            Java, Python, and Node.js, giving candidates a true development experience 
            while you assess their skills in real-time.
          </p>
        </div>
      </div>

      {/* Section 2 - Video on Right */}
      <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
        <div className="flex-1">
          <video loop autoPlay muted className="w-3/4 rounded-lg shadow-lg">
            <source src="/videos/cube.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="flex-1 space-y-4">
          <h3 className={`text-4xl font-bold ${Colors.text.special}`}>Video Conferencing & Analytics</h3>
          <p className={`text-lg ${Colors.text.secondary}`}>
            Integrated video conferencing keeps you connected with candidates face-to-face 
            while they code. Track performance metrics, review session recordings, and gain 
            data-driven insights with comprehensive analytics to make better hiring decisions 
            and improve your interview process.
          </p>
        </div>
      </div>

      {/* Section 3 - Video on Left */}
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-1">
          <video loop autoPlay muted className="w-3/4 rounded-lg shadow-lg">
            <source src="/videos/purple.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="flex-1 space-y-4">
          <h3 className={`text-4xl font-bold ${Colors.text.special}`}>Multi-Round Interview Management</h3>
          <p className={`text-lg ${Colors.text.secondary}`}>
            Manage complete hiring pipelines from DSA rounds to live projects and HR 
            interviews. Create job listings, track candidates through multiple rounds, 
            collaborate with your organization team, and streamline the entire recruitment 
            process from application to selection.
          </p>
        </div>
      </div>
    </div>
  );
}
