import React, { useState } from "react";
import Image from "next/image";
import { useColors } from "@/components/General/(Color Manager)/useColors";
import { ExternalLink, Github, Calendar, Eye, Tag, Expand } from "lucide-react";

export default function ProjectCardV2({ project, onClick }: any) {
  const { 
    id,
    title, 
    coverImage, 
    description, 
    skills, 
    startDate, 
    endDate, 
    isOngoing,
    projectUrl,
    repositoryUrl,
    visibility,
    publishStatus,
    tags
  } = project;
  const [isFlipped, setIsFlipped] = useState(false);

  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };
  const Colors = useColors();

  return (
    <div
      className="group relative w-full aspect-video cursor-pointer transition-transform duration-300 hover:shadow-2xl hide-scrollbar overflow-hidden"
      style={{ perspective: "1000px" }}
      onClick={() => setIsFlipped((prev) => !prev)}
    >
      <div
        className="relative w-full h-full transition-transform duration-700 hide-scrollbar"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-xl md:rounded-2xl overflow-hidden shadow-lg"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${coverImage || ""})` }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

          {/* Status Badge */}
          {/* <div className="absolute top-3 right-3 md:top-4 md:right-4 flex gap-2 z-10">
            {isOngoing && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/90 text-white backdrop-blur-sm">
                Ongoing
              </span>
            )}
            {publishStatus === "PUBLISHED" && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/90 text-white backdrop-blur-sm">
                Published
              </span>
            )}
          </div> */}

          {/* Visibility Badge */}
          {/* {visibility && (
            <div className="absolute top-4 left-4 z-10">
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/20 backdrop-blur-sm">
                <Eye className="h-3 w-3 text-white" />
                <span className="text-white text-xs font-medium">{visibility}</span>
              </div>
            </div>
          )} */}

          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-10">
            <h1 className="text-white font-bold text-xl md:text-2xl mb-2 line-clamp-2">{title}</h1>
            
            {/* Date Range */}
            <div className="flex items-center gap-2 text-white/90 text-xs md:text-sm mb-3">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(startDate)} - {isOngoing ? "Present" : formatDate(endDate)}</span>
            </div>

            {/* Skills */}
            {skills && skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {skills.slice(0, 4).map((skill: string, index: number) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 rounded-md text-xs font-medium bg-white/20 text-white backdrop-blur-sm"
                  >
                    {skill}
                  </span>
                ))}
                {skills.length > 4 && (
                  <span className="px-2 py-1 rounded-md text-xs font-medium bg-white/20 text-white backdrop-blur-sm">
                    +{skills.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 z-20">
            <div className={`bg-neutral-100/40 ${Colors.border.defaultThick} backdrop-blur-sm rounded-full px-3 py-2 shadow-lg flex gap-3`}>
              {projectUrl && (
                <a 
                  href={projectUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className={`h-5 w-5 ${Colors.text.primary} hover:scale-110 transition-transform`} />
                </a>
              )}
              {repositoryUrl && (
                <a 
                  href={repositoryUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Github className={`h-5 w-5 ${Colors.text.primary} hover:scale-110 transition-transform`} />
                </a>
              )}
              <div onClick={onClick}>
                <Expand className={`h-5 w-5 ${Colors.text.primary} hover:scale-110 transition-transform`} />
              </div>
            </div>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-xl md:rounded-2xl overflow-hidden hide-scrollbar"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
          }}
        >
          <Image
            src={coverImage || "/images/placeholder.jpg"}
            alt={title}
            fill
            className="object-cover blur-sm"
          />
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          <div className="relative h-full p-4 md:p-6 flex flex-col text-white overflow-y-auto">
            {/* <h2 className="text-xl md:text-2xl font-bold mb-3">{title}</h2> */}
            
            {/* Description */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-white/80 mb-1">Description</h3>
              <p className="text-sm leading-relaxed">{description}</p>
            </div>

            {/* Project Details */}
            <div className="space-y-3">
              {/* Timeline */}
              <div>
                <h3 className="text-sm font-semibold text-white/80 mb-1">Timeline</h3>
                <p className="text-sm">{formatDate(startDate)} - {isOngoing ? "Present" : formatDate(endDate)}</p>
              </div>

              {/* Skills */}
              {skills && skills.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-white/80 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill: string, index: number) => (
                      <span 
                        key={index} 
                        className={`px-2 py-1 rounded-md text-xs ${Colors.background.secondary} backdrop-blur-sm`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {tags && tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-white/80 mb-2">Contributors</h3>
                  <div className="space-y-1">
                    {tags.map((tag: any, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        <Tag className="h-3 w-3" />
                        <span className="font-medium">{tag.role}</span>
                        <span className="text-white/70">- {tag.note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              {(projectUrl || repositoryUrl) && (
                <div>
                  <h3 className="text-sm font-semibold text-white/80 mb-2">Links</h3>
                  <div className="flex gap-3">
                    {projectUrl && (
                      <a 
                        href={projectUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-sm hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Live Project</span>
                      </a>
                    )}
                    {repositoryUrl && (
                      <a 
                        href={repositoryUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-sm hover:underline"
                      >
                        <Github className="h-4 w-4" />
                        <span>Repository</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
