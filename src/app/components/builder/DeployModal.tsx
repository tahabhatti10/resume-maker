import { useEffect, useState } from "react";
import { Check, Loader2, Rocket, ExternalLink, Copy } from "lucide-react";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useBuilder } from "../../state/BuilderContext";

const STAGES = ["Generating site", "Optimizing assets", "Uploading to CDN", "Going live"];

export function DeployModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { resume } = useBuilder();
  const [stage, setStage] = useState(-1);
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setStage(-1);
      setUrl(null);
      return;
    }
    setStage(0);
    setUrl(null);
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      if (i >= STAGES.length) {
        clearInterval(timer);
        const slug =
          (resume.contact.name || "my-resume")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "") || "my-resume";
        setUrl(`https://${slug}.vercel.app`);
        setStage(STAGES.length);
        confetti({ particleCount: 100, spread: 65, origin: { y: 0.6 } });
      } else {
        setStage(i);
      }
    }, 900);
    return () => clearInterval(timer);
  }, [open, resume.contact.name]);

  const copy = () => {
    if (url) {
      navigator.clipboard?.writeText(url);
      toast.success("URL copied");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Rocket className="h-6 w-6" />
          </div>
          <DialogTitle>{url ? "Your site is live!" : "Deploying your site"}</DialogTitle>
          <DialogDescription>
            {url
              ? "Your resume website is published and ready to share."
              : "Hang tight while we publish your resume website."}
          </DialogDescription>
        </DialogHeader>

        {!url ? (
          <div className="space-y-3 py-2">
            {STAGES.map((s, i) => (
              <div key={s} className="flex items-center gap-3 text-sm">
                {i < stage ? (
                  <Check className="h-4 w-4 text-emerald-600" />
                ) : i === stage ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                ) : (
                  <span className="h-4 w-4 rounded-full border border-border" />
                )}
                <span className={i <= stage ? "" : "text-muted-foreground"}>{s}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2">
              <span className="truncate text-sm text-primary">{url}</span>
              <button onClick={copy} className="text-muted-foreground hover:text-foreground">
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <Button className="w-full" onClick={() => window.open(url, "_blank")}>
              <ExternalLink className="h-4 w-4" /> Visit site
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Demo deployment — this URL is illustrative.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
