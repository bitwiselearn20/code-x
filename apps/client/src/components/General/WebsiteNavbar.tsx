"use client";

import { useColors } from "@/components/General/(Color Manager)/useColors";
import Link from "next/link";
import { useState, useEffect } from "react";
import { User } from "lucide-react";

type User = {
  profileUrl: string;
};

const navLinks = [
  { href: "/", label: "HOME" },
  { href: "/projects", label: "PROJECTS" },
  { href: "/jobs", label: "JOBS" },
];

export function WebsiteNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [data, setData] = useState<User | null>(null);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const getData = async () => {
      try {
        const res = await fetch(backendUrl + "/api/v1/users/get-profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (!res) throw new Error("Unable to get Data");
  
        const result = await res.json();
        // console.log("Data fetch success:", result.data);
        setData(result.data);
      } catch (err) {
        console.error(err);
      }
    };
  
    useEffect(() => {
      getData();
      console.log(data);
    }, []);


  return (
    <>
      {/* Handle/Trigger Area */}
      <div className="fixed top-0 left-0 right-0 h-8 z-50 group/navbar">
        {/* Visual Handle */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 transition-all duration-300 group-hover/navbar:translate-y-1">
          <div className="w-12 h-1 bg-neutral-600/50 rounded-full group-hover/navbar:bg-neutral-400/70 transition-all duration-300"></div>
        </div>
        
        {/* Navbar Container */}
        <div className="fixed top-0 left-0 right-0 px-4 pt-5 pb-2 sm:px-6 w-full transform -translate-y-full transition-all duration-500 ease-out group-hover/navbar:translate-y-0">
          <div className="mx-auto max-w-[75%] min-w-[320px] sm:max-w-2xl md:max-w-4xl lg:max-w-5xl">
        <div className="flex h-14 items-center justify-between rounded-3xl border border-neutral-700 bg-neutral-900/80 px-4 shadow-sm sm:px-5 backdrop-blur-sm transition-all duration-300 group-hover:shadow-lg group-hover:shadow-neutral-700/20 group-hover:bg-neutral-900">
          {/* Left: Codex Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center justify-center text-white cursor-pointer font-bold text-lg relative group/logo"
            aria-label="Home"
          >
            <span className="transition-all duration-300 group-hover/logo:scale-110 group-hover/logo:rotate-2 inline-block">
              Codex
            </span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover/logo:w-full"></span>
          </Link>

          {/* Middle: Nav Links */}
          <nav className="hidden items-center gap-8 md:flex absolute left-1/2 transform -translate-x-1/2">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sm font-medium tracking-wide text-white group/link"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <span className="relative inline-block transition-all duration-300 group-hover/link:-translate-y-1 group-hover/link:scale-105">
                  {link.label}
                </span>
                <span 
                  className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${
                    hoveredIndex === index ? 'w-full' : 'w-0'
                  }`}
                ></span>
                <span className="absolute inset-0 -z-10 rounded-lg bg-white/5 scale-0 transition-transform duration-300 group-hover/link:scale-100"></span>
              </Link>
            ))}
          </nav>

          {/* Right: Profile */}
          <div className="flex items-center gap-6">
            <Link
              href="/profile"
              className="hidden sm:flex items-center justify-center text-white relative group/profile overflow-hidden w-10 h-10 rounded-full border border-neutral-700 hover:border-white/40 transition-all duration-300"
              aria-label="Profile"
            >
              {data?.profileUrl ? (
                <img 
                  src={data.profileUrl} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 transition-all duration-300 group-hover/profile:scale-110" />
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="rounded p-2 text-neutral-400 md:hidden transition-all duration-300 hover:rotate-180 hover:text-white hover:scale-110 active:scale-95"
              aria-label="Menu"
            >
              <span className={`inline-block transition-all duration-300 ${menuOpen ? 'rotate-90 scale-110' : 'rotate-0'}`}>
                {menuOpen ? "✕" : "☰"}
              </span>
            </button>
          </div>
          </div>
        </div>

        {menuOpen && (
          <div className="rounded-b-3xl border border-t-0 border-neutral-700 bg-neutral-900/90 backdrop-blur-sm md:hidden animate-slideDown overflow-hidden">
          <nav className="flex flex-col gap-2 px-4 py-4">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2 text-neutral-400 hover:text-white transition-all duration-300 hover:translate-x-2 hover:scale-105 relative group/mobile"
                onClick={() => setMenuOpen(false)}
                style={{
                  animation: `slideIn 0.3s ease-out ${index * 0.05}s both`
                }}
              >
                <span className="relative z-10">{link.label}</span>
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-white transition-all duration-300 group-hover/mobile:h-full"></span>
              </Link>
            ))}
            <Link
              href="/profile"
              className="py-2 text-neutral-400 hover:text-white transition-all duration-300 hover:translate-x-2 hover:scale-105 relative group/mobile flex items-center gap-2"
              onClick={() => setMenuOpen(false)}
              style={{
                animation: `slideIn 0.3s ease-out ${navLinks.length * 0.05}s both`
              }}
            >
              {data?.profileUrl ? (
                <img 
                  src={data.profileUrl} 
                  alt="Profile" 
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <User className="w-5 h-5" />
              )}
              <span className="relative z-10">PROFILE</span>
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-white transition-all duration-300 group-hover/mobile:h-full"></span>
            </Link>
            </nav>
          </div>
        )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
