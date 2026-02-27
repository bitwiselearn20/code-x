"use client";

import { Facebook, Github, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";
import BitwiseImage from "@/app/images/BitwiseImage.png";
import { useColors } from "@/components/General/(Color Manager)/useColors";
import Image from "next/image";
import logo from "../../../public/images/Logo.png"

export default function Footer() {
  const Colors = useColors();

  return (
    <footer
      className="bg-neutral-950 border-t border-neutral-700 backdrop-blur-lg py-8 px-6 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Company Info & Social Media */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left animate-fadeInUp" style={{ animationDelay: '0s' }}>
          <Link href="/" className="transition-transform duration-300 hover:scale-110 inline-block mb-2">
            <Image src={logo} alt="Logo" height={40} className="transition-all duration-300 hover:brightness-125"/>
          </Link>
          <p className="text-sm max-w-62.5 mb-4 text-neutral-300 font-medium">
            Learn, Code, Grow.
          </p>
          <div className="flex space-x-4">
            <a
              href="#"
              aria-label="Facebook"
              className="transition-all duration-300 text-neutral-400 hover:text-blue-500 hover:scale-125 hover:-translate-y-1 active:scale-95"
            >
              <Facebook size={22} />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="transition-all duration-300 text-neutral-400 hover:text-pink-500 hover:scale-125 hover:-translate-y-1 active:scale-95"
            >
              <Instagram size={22} />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="transition-all duration-300 text-neutral-400 hover:text-blue-400 hover:scale-125 hover:-translate-y-1 active:scale-95"
            >
              <Linkedin size={22} />
            </a>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="text-center sm:text-left animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <h4 className="font-bold text-lg mb-4 text-white relative inline-block group">
            Quick Links
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
          </h4>
          <ul className="space-y-2 text-neutral-400">
            {["Home", "About", "Contact"].map((item, index) => (
              <li key={item} className="transition-all duration-300 hover:translate-x-2" style={{ animationDelay: `${0.2 + index * 0.05}s` }}>
                <a
                  href={`${item === "Home" ? "/" : item.toLowerCase()}`}
                  className="hover:text-white hover:font-semibold transition-all duration-200 relative group inline-block"
                >
                  <span className="relative z-10">{item}</span>
                  <span className="absolute left-0 bottom-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center sm:text-left animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
          <h4 className="font-bold text-lg mb-4 text-white relative inline-block group">
            Logins
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
          </h4>
          <ul className="space-y-2 text-neutral-400">
            {["Interviewer", "Interviewee"].map((item, index) => (
              <li key={item} className="transition-all duration-300 hover:translate-x-2" style={{ animationDelay: `${0.25 + index * 0.05}s` }}>
                <Link
                  href={`/login`}
                  className="hover:text-white hover:font-semibold transition-all duration-200 relative group inline-block"
                >
                  <span className="relative z-10">{item}</span>
                  <span className="absolute left-0 bottom-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="text-center sm:text-left animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <h4 className="font-bold text-lg mb-4 text-white relative inline-block group">
            Contact
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
          </h4>
          <ul className="space-y-2 text-neutral-400">
            <li className="transition-all duration-300 hover:translate-x-2 hover:text-neutral-200" style={{ animationDelay: '0.3s' }}>
              <p className="group cursor-pointer">
                <span className="font-semibold text-neutral-300">Email:</span> sales_support@codex.com
              </p>
            </li>
            <li className="transition-all duration-300 hover:translate-x-2 hover:text-neutral-200" style={{ animationDelay: '0.35s' }}>
              <p className="group cursor-pointer">
                <span className="font-semibold text-neutral-300">Phone:</span> +91 9787777547
              </p>
            </li>
            <li className="transition-all duration-300 hover:translate-x-2 hover:text-neutral-200" style={{ animationDelay: '0.4s' }}>
              <span className="font-semibold text-neutral-300">Address:</span> Banglore India
            </li>
          </ul>
        </div>
      </div>

      {/* Divider + Copyright */}
      <div
        className="mt-8 pt-3 border-t border-neutral-700 text-center text-sm text-neutral-400 animate-fadeInUp"
        style={{ animationDelay: '0.45s' }}
      >
        <p className="transition-colors duration-300 hover:text-neutral-200">
          &copy; {new Date().getFullYear()} Code-X. All rights reserved.
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out both;
        }
      `}</style>
    </footer>
  );
}
