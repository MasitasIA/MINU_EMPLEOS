import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

// Componentes
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBanner } from "@/components/layout/AnnouncementBanner";
import { getUser } from "@/lib/session";
import { getSiteSettings } from "@/app/actions/settings";

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
  title: "Minú Empleos",
  description:
    "Portal local para la disponibilidad de empleos en pequeños negocios, asentado en la localidad de Guaminí y los alrededores",
};

// Layout
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
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
        <Navbar user={user} />
        <main className="flex-1">{children}</main>
        <Footer user={user} />
      </body>
    </html>
  );
}

