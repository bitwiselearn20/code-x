import Image from "next/image";
import { testimonials } from "@/lib/content/testimonials";

export function Testimonials() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-2 text-center text-sm font-medium uppercase tracking-wider text-neutral-400">
          Success stories
        </h2>
        <h3 className="title-react mb-4 text-center text-4xl font-bold text-white sm:text-5xl">
          Success stories that inspire
        </h3>
        <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-neutral-400">
          Our learners have used Bitwise to transition careers, secure
          promotions, and break into competitive industries.
        </p>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="overflow-hidden rounded-2xl bg-neutral-900 p-6 shadow-lg border border-neutral-700"
            >
              <div className="relative h-24 w-24 overflow-hidden rounded-full">
                <Image
                  src={t.image}
                  alt={t.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <blockquote className="mt-5 text-lg text-neutral-200">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="mt-4">
                <div className="title-react text-lg font-bold text-white">{t.name}</div>
                <div className="text-base text-neutral-400">
                  {t.role} at {t.company}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
