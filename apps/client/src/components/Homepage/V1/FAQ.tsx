"use client";

import { useState } from "react";
import { faqItems } from "@/lib/content/faq";

export function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 font-mono">
        <h2 className="title-react mb-4 text-center text-4xl font-bold text-white sm:text-5xl animate-fadeInUp">
          Frequently asked questions
        </h2>
        <p className="mb-10 text-center text-neutral-400 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          Industry Leaders have used Code-X to transition careers, secure
          promotions, and break into competitive industries.
        </p>
        <div className="space-y-3">
          {faqItems.map((item, index) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-900 shadow-lg transition-all duration-500 hover:shadow-2xl hover:shadow-neutral-700/30 hover:scale-[1.02] hover:border-neutral-600 animate-fadeInUp"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenId((prev) => (prev === item.id ? null : item.id))
                  }
                  className="flex w-full items-center gap-4 px-5 py-4 text-left font-medium text-white hover:bg-neutral-800 transition-all duration-300 group"
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-500 transform ${
                      isOpen 
                        ? "bg-white text-black rotate-90 scale-110" 
                        : "bg-neutral-600 text-white rotate-0 scale-100 group-hover:scale-110 group-hover:bg-neutral-500"
                    }`}
                  >
                    {isOpen ? (
                      <svg className="h-4 w-4 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    )}
                  </span>
                  <span className="flex-1 transition-all duration-300 group-hover:translate-x-1">{item.question}</span>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className={`border-t border-neutral-700 px-5 pb-5 pl-[3.25rem] pt-4 text-sm leading-relaxed text-neutral-400 transition-all duration-500 ${
                    isOpen ? 'translate-y-0' : '-translate-y-4'
                  }`}>
                    {item.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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
    </section>
  );
}
