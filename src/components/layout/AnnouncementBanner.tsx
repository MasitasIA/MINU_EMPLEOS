"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Link from "next/link";

interface AnnouncementBannerProps {
  text: string;
  url: string | null;
  updatedAt: string;
}

export function AnnouncementBanner({
  text,
  url,
  updatedAt,
}: AnnouncementBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Generamos un ID único basado en el texto y la fecha de actualización
    // Así, si cambian el anuncio, vuelve a aparecer aunque lo hayan cerrado antes.
    const bannerId = `banner_closed_${updatedAt}`;

    if (localStorage.getItem(bannerId) !== "true") {
      setIsVisible(true);
    }
  }, [updatedAt]);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    const bannerId = `banner_closed_${updatedAt}`;
    localStorage.setItem(bannerId, "true");
  };

  const Content = () => (
    <div className="flex items-center justify-center text-sm font-medium">
      <span className="truncate">{text}</span>
      {url && (
        <span className="ml-2 inline-flex font-bold hover:underline">
          Ver más &rarr;
        </span>
      )}
    </div>
  );

  return (
    <div className="relative bg-primary text-background px-4 py-2 sm:px-6 lg:px-8">
      {url ? (
        <Link
          href={url}
          className="block hover:opacity-90 transition-opacity pr-6"
        >
          <Content />
        </Link>
      ) : (
        <div className="pr-6">
          <Content />
        </div>
      )}
      <button
        type="button"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-black/10 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        onClick={handleClose}
        aria-label="Cerrar anuncio"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
