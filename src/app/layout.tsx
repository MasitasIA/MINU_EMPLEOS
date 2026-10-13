import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

// Componentes
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBanner } from "@/components/layout/AnnouncementBanner";
import { getSiteSettings } from "@/app/actions/settings";
import { SITE_URL } from "@/lib/supabase/config";

// Tipografías
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadatos para SEO
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Minú Empleos | Tu portal de trabajo en Guaminí",
    template: "%s | Minú Empleos",
  },
  description:
    "Portal local para la búsqueda de empleos y publicación de vacantes en pequeños negocios, asentado en la localidad de Guaminí y los alrededores.",
  openGraph: {
    title: "Minú Empleos | Guaminí",
    description: "Encuentra tu próximo trabajo en empresas locales.",
    url: "/",
    siteName: "Minú Empleos",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Minú Empleos | Guaminí",
    description: "Portal local para la disponibilidad de empleos en pequeños negocios, asentado en la localidad de Guaminí.",
  },
};

// Layout
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {settings?.announcement_active && settings?.announcement_text && (
          <AnnouncementBanner 
            text={settings.announcement_text} 
            url={settings.announcement_url}
            updatedAt={settings.updated_at}
          />
        )}
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

