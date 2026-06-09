import type { Metadata } from "next";
import Link from "next/link";
import { Award, CalendarDays } from "lucide-react";
import { achievements } from "@/lib/content";
import { defaultMetadata } from "@/lib/seo";

export const metadata: Metadata = defaultMetadata({
  title: "Achievements & Recognitions | Dr Olaosebikan",
  description: "Explore the awards, recognition, and clinical achievements of Dr Olaosebikan.",
  keywords: [
    "Dr Olaosebikan achievements",
    "rheumatology awards Lagos",
    "medical recognitions",
  ],
  path: "/publications/achievements",
});

export default function AchievementsPage() {
  const visibleAchievements = achievements.filter((achievement) => achievement.isPublished !== false);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <header className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700 ring-1 ring-blue-100">
            <Award className="h-4 w-4" aria-hidden="true" />
            Achievements
          </span>
          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            Achievements & Recognitions
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Professional awards, fellowships, conferences, and milestones earned over the years.
          </p>
        </header>

        <div className="mt-10">
          {visibleAchievements.length > 0 ? (
            <div className="relative">
              <div className="hidden sm:block absolute bottom-0 left-4 top-0 w-px bg-slate-200" />
              <div className="space-y-6">
                {visibleAchievements.map((achievement) => (
                  <article key={`${achievement.title}-${achievement.year}`} className="relative sm:pl-12">
                    <div className="absolute left-2.5 top-6 hidden h-3 w-3 rounded-full bg-blue-600 ring-4 ring-blue-50 sm:flex" />
                    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <h2 className="text-xl font-extrabold leading-snug text-slate-950">
                            {achievement.title}
                          </h2>
                          <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-600">
                            {achievement.organization ? (
                              <span className="rounded-full bg-slate-50 px-3 py-1 ring-1 ring-slate-200">
                                {achievement.organization}
                              </span>
                            ) : null}
                            <span className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-700 ring-1 ring-blue-100">
                              {achievement.year}
                            </span>
                          </div>
                        </div>
                      </div>
                      {achievement.description ? (
                        <p className="mt-4 leading-relaxed text-slate-700">
                          {achievement.description}
                        </p>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-white p-10 text-center shadow-sm">
              <h2 className="text-lg font-bold text-slate-950">No achievements available</h2>
              <p className="mt-2 text-sm text-slate-600">
                New achievements will appear here as they are published.
              </p>
              <Link href="/" className="mt-6 inline-flex items-center justify-center rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
                Back to Home
              </Link>
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Showing {visibleAchievements.length} achievement{visibleAchievements.length === 1 ? "" : "s"}.</p>
          <Link href="/appointments/book" className="inline-flex items-center gap-2 font-semibold text-blue-700 hover:text-blue-800">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            Book an appointment
          </Link>
        </div>
      </div>
    </section>
  );
}
