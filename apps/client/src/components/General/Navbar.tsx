"use client";

import { useColors } from "@/components/General/(Color Manager)/useColors";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "HOME" },
  // { href: "/about", label: "ABOUT" },
  // { href: "/courses", label: "COURSE" },
  { href: "/services", label: "SERVICES" },
  { href: "/blog", label: "BLOG" },
  { href: "/contact", label: "CONTACT" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const Colors = useColors();

  return (
    <header className="top-0 z-50 px-4 pt-5 pb-2 sm:px-6 absolute w-full">
      <div className="mx-auto max-w-[75%] min-w-[320px] sm:max-w-2xl md:max-w-4xl lg:max-w-5xl">
        <div className="flex h-14 items-center justify-between rounded-3xl border border-neutral-700 bg-neutral-900 px-4 shadow-sm sm:px-5 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-neutral-700/20">
          <Link
            href="/"
            className="flex shrink-0 items-center justify-center text-white cursor-pointer font-bold text-lg relative group"
            aria-label="Home"
          >
            <span className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-2 inline-block">
              Code-X
            </span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
          </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-sm font-medium tracking-wide text-white group"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <span className="relative inline-block transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-105">
                {link.label}
              </span>
              <span 
                className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${
                  hoveredIndex === index ? 'w-full' : 'w-0'
                }`}
              ></span>
              <span className="absolute inset-0 -z-10 rounded-lg bg-white/5 scale-0 transition-transform duration-300 group-hover:scale-100"></span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-white sm:inline-block relative group overflow-hidden px-4 py-2 rounded-full border border-transparent hover:border-white/20 transition-all duration-300"
          >
            <span className="relative z-10 transition-all duration-300 group-hover:scale-105 inline-block">LOGIN</span>
            <span className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
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
        <div className="rounded-b-3xl border border-t-0 border-neutral-700 bg-neutral-900 md:hidden animate-slideDown overflow-hidden">
          <nav className="flex flex-col gap-2 px-4 py-4">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2 text-neutral-400 hover:text-white transition-all duration-300 hover:translate-x-2 hover:scale-105 relative group"
                onClick={() => setMenuOpen(false)}
                style={{
                  animation: `slideIn 0.3s ease-out ${index * 0.05}s both`
                }}
              >
                <span className="relative z-10">{link.label}</span>
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-white transition-all duration-300 group-hover:h-full"></span>
              </Link>
            ))}
            <Link
              href="/login"
              className="py-2 text-neutral-400 hover:text-white transition-all duration-300 hover:translate-x-2 hover:scale-105 relative group"
              onClick={() => setMenuOpen(false)}
              style={{
                animation: `slideIn 0.3s ease-out ${navLinks.length * 0.05}s both`
              }}
            >
              <span className="relative z-10">LOGIN</span>
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-white transition-all duration-300 group-hover:h-full"></span>
            </Link>
          </nav>
        </div>
      )}

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
    </header>
  );
}
