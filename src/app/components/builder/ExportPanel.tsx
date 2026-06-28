import { useState } from "react";
import { Download, FileCode2, Copy, Check, FileText, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useBuilder } from "../../state/BuilderContext";
import { useEntitlement, FREE_PDF_LIMIT } from "../../state/EntitlementContext";
import { useUpgrade } from "../monetization/UpgradeModal";
import { buildResumeHtml, suggestedFilename } from "../../lib/export/htmlExport";
import { downloadFile } from "../../lib/export/download";
import { BRAND_GRADIENT } from "../shared/Logo";
import { ProBadge } from "../monetization/ProBadge";

export function ExportPanel() {
  const { resume, theme } = useBuilder();
  const { isPro, canExportPdf, pdfExportsLeft, recordPdfExport } =
    useEntitlement();
  const { requestUpgrade } = useUpgrade();
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    const html = buildResumeHtml(resume, theme);
    downloadFile(suggestedFilename(resume), html, "text/html");
    toast.success("Resume HTML downloaded");
  };

  const handlePdf = () => {
    if (!canExportPdf) {
      requestUpgrade(
        "You've used your 3 free PDF exports. Upgrade to Pro for unlimited PDFs.",
      );
      return;
    }
    recordPdfExport();
    if (!isPro) {
      const left = pdfExportsLeft - 1;
      toast.message(
        left > 0
          ? `Free PDF export used — ${left} left`
          : "Last free PDF export used — upgrade for unlimited",
      );
    }
    const html = buildResumeHtml(resume, theme);
    const frame = document.createElement("iframe");
    frame.style.position = "fixed";
    frame.style.right = "0";
    frame.style.bottom = "0";
    frame.style.width = "0";
    frame.style.height = "0";
    frame.style.border = "0";
    document.body.appendChild(frame);
    const doc = frame.contentWindow?.document;
    if (!doc) return;
    doc.open();
    doc.write(html);
    doc.close();
    setTimeout(() => {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
      setTimeout(() => frame.remove(), 1000);
    }, 400);
    toast.success("Choose 'Save as PDF' in the print dialog");
  };

  const handleCopy = async () => {
    const html = buildResumeHtml(resume, theme);
    try {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      toast.success("HTML copied to clipboard");
    } catch {
      toast.error("Could not copy");
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-muted/30 p-5">
        <h3 className="font-medium">Your resume is ready 🎉</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Export a lightweight standalone HTML/CSS file, save it as a PDF, or copy
          the source to customize yourself.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <ExportCard
          gradient
          icon={<Download className="h-5 w-5" />}
          title="Download HTML"
          desc="A single responsive file you can keep, email, or host anywhere."
          action={
            <Button
              onClick={handleDownload}
              className="w-full border-0 text-white"
              style={{ background: BRAND_GRADIENT }}
            >
              <Download className="h-4 w-4" /> Download
            </Button>
          }
        />
        <ExportCard
          icon={<FileText className="h-5 w-5" />}
          title="Save as PDF"
          badge={!canExportPdf}
          desc={
            isPro
              ? "Open your resume in the print flow and save a polished PDF copy."
              : pdfExportsLeft > 0
                ? `Save a polished PDF copy — ${pdfExportsLeft} of ${FREE_PDF_LIMIT} free exports left.`
                : "You've used all 3 free PDF exports. Upgrade to Pro for unlimited PDFs."
          }
          action={
            <Button variant="outline" onClick={handlePdf} className="w-full">
              {canExportPdf ? (
                <>
                  <FileText className="h-4 w-4" /> Save PDF
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" /> Unlock PDF
                </>
              )}
            </Button>
          }
        />
        <ExportCard
          icon={<FileCode2 className="h-5 w-5" />}
          title="Copy source"
          desc="Grab the raw HTML/CSS to tweak or embed in your own project."
          action={
            <Button variant="outline" onClick={handleCopy} className="w-full">
              {copied ? (
                <>
                  <Check className="h-4 w-4" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" /> Copy HTML
                </>
              )}
            </Button>
          }
        />
      </div>
    </div>
  );
}

function ExportCard({
  icon,
  title,
  desc,
  action,
  gradient,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  action: React.ReactNode;
  gradient?: boolean;
  badge?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-5 transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            gradient ? "text-white" : "bg-primary/10 text-primary"
          }`}
          style={gradient ? { background: BRAND_GRADIENT } : undefined}
        >
          {icon}
        </span>
        {badge && <ProBadge />}
      </div>
      <span className="font-medium">{title}</span>
      <p className="flex-1 text-xs text-muted-foreground">{desc}</p>
      {action}
    </div>
  );
}
