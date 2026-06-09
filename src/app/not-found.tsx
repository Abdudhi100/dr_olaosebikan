import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Page not found</p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950">
          This page is not available
        </h1>
        <p className="mt-4 leading-relaxed text-slate-600">
          The page may have moved during the static-site migration.
        </p>
        <Link href="/" className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
          <Home className="h-5 w-5" aria-hidden="true" />
          Back to Home
        </Link>
      </div>
    </section>
  );
}
