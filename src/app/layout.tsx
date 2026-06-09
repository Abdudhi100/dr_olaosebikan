import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
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
  themeColor: "#0f172a",
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
        <Header />
        <main id="main-content" className="min-h-[65vh]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
