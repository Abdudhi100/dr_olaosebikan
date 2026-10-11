import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader, SiteFooter } from "@/components/clinic/ClinicChrome";
import { AppointmentDraftProvider } from "@/components/booking/AppointmentDraftProvider";
import "@/components/clinic/clinic.css";
import "@fontsource/inter/latin-300.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import { JsonLd } from "@/components/JsonLd";
import { clinicJsonLd, defaultMetadata } from "@/lib/seo";
import site from "@/content/site.json";

export const metadata: Metadata = defaultMetadata({
  title: site.clinicName,
  description: site.metaDescription,
  keywords: site.metaKeywords,
  path: "/",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#002a30",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <JsonLd data={clinicJsonLd()} />
        <AppointmentDraftProvider>
          <SiteHeader />
          <main id="main-content" className="min-h-[65vh]">
            {children}
          </main>
          <SiteFooter />
        </AppointmentDraftProvider>
      </body>
    </html>
  );
}
