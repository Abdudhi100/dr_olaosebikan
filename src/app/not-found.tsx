import type { Metadata } from "next";
import Link from "next/link";
import { Home } from "lucide-react";
import { buttonStyles } from "@/lib/styles";

export const metadata: Metadata = {
  title: "Page not found | Dr Olaosebikan",
  description: "The requested page could not be found.",
  alternates: {
    canonical: null,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <section className="bg-surface-page">
      <div className="mx-auto max-w-wide px-4 py-10 sm:px-6 sm:py-14">
        <div className="max-w-reading">
          <p className="text-sm font-semibold text-brand-primary">Page not found</p>
          <h1 className="mt-3 text-page-title tracking-normal text-text-primary sm:text-page-title-lg">
            This page is not available
          </h1>
          <p className="mt-4 text-body text-text-secondary">
            The page may have moved during the static-site migration.
          </p>
          <Link href="/" className={`${buttonStyles.primarySmall} mt-7 w-full sm:w-auto`}>
            <Home className="h-4 w-4" aria-hidden="true" />
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
