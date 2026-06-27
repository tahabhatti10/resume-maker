import { useState } from "react";
import { Download, Rocket, FileCode2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useBuilder } from "../../state/BuilderContext";
import { buildResumeHtml, suggestedFilename } from "../../lib/export/htmlExport";
import { downloadFile } from "../../lib/export/download";
import { DeployModal } from "./DeployModal";

export function ExportPanel() {
  const { resume, theme } = useBuilder();
  const [deployOpen, setDeployOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    const html = buildResumeHtml(resume, theme);
    downloadFile(suggestedFilename(resume), html, "text/html");
    toast.success("Resume site downloaded");
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
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Your resume website is ready. Download the standalone HTML to host
        anywhere, copy the source, or publish it instantly.
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ExportCard
          icon={<Download className="h-5 w-5" />}
          title="Download HTML"
          desc="A single, responsive file you can host on any platform."
          action={
            <Button onClick={handleDownload} className="w-full">
              <Download className="h-4 w-4" /> Download
            </Button>
          }
        />
        <ExportCard
          icon={<Rocket className="h-5 w-5" />}
          title="Deploy to Vercel"
          desc="Publish to a live URL in one click."
          action={
            <Button
              variant="outline"
              onClick={() => setDeployOpen(true)}
              className="w-full"
            >
              <Rocket className="h-4 w-4" /> Deploy
            </Button>
          }
        />
        <ExportCard
          icon={<FileCode2 className="h-5 w-5" />}
          title="Copy source"
          desc="Grab the raw HTML/CSS to customize yourself."
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

      <DeployModal open={deployOpen} onOpenChange={setDeployOpen} />
    </div>
  );
}

function ExportCard({
  icon,
  title,
  desc,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  action: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border p-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </span>
      <span className="font-medium">{title}</span>
      <p className="flex-1 text-xs text-muted-foreground">{desc}</p>
      {action}
    </div>
  );
}
