"use client";

import { X, Download, FileText } from "lucide-react";
import { useEffect } from "react";

interface ResumeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeUrl: string | null;
  candidateName: string;
}

export function ResumeViewerModal({ isOpen, onClose, resumeUrl, candidateName }: ResumeViewerModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen || !resumeUrl) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6">
      <div className="relative flex h-full max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden radius-predefined bg-white shadow-2xl ring-1 ring-border">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-surface-muted">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center radius-predefined bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                CV de {candidateName}
              </h2>
              <p className="text-sm text-foreground-muted">Visor de Documentos</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="flex items-center gap-2 radius-button bg-surface px-4 py-2 text-sm font-bold text-foreground ring-1 ring-border hover:bg-surface-muted transition-colors"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Descargar PDF</span>
            </a>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center radius-button text-foreground-muted hover:bg-surface-muted hover:text-foreground transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-surface-muted p-2 sm:p-4">
          <iframe
            src={`${resumeUrl}#view=FitH`}
            className="h-full w-full radius-predefined bg-white shadow-sm ring-1 ring-border"
            title={`CV de ${candidateName}`}
          />
        </div>
      </div>
    </div>
  );
}
