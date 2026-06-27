import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Crown,
  Eye,
  Wand2,
} from "lucide-react";
import { Logo } from "../components/shared/Logo";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "../components/ui/sheet";
import { WizardNav } from "../components/builder/WizardNav";
import { wizardSteps } from "../components/builder/wizardSteps";
import { LivePreview } from "../components/builder/LivePreview";
import { AssistantPanel } from "../components/ai/AssistantPanel";
import { AdSlot } from "../components/monetization/AdSlot";
import { ProGate } from "../components/monetization/ProGate";
import { useEntitlement } from "../state/EntitlementContext";
import { useUpgrade } from "../components/monetization/UpgradeModal";
import { useBuilder } from "../state/BuilderContext";

export function BuilderPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const { isPro } = useEntitlement();
  const { requestUpgrade } = useUpgrade();
  const { loadSample } = useBuilder();

  const Current = wizardSteps[step].Component;
  const progress = ((step + 1) / wizardSteps.length) * 100;
  const isLast = step === wizardSteps.length - 1;

  return (
    <div className="flex h-screen flex-col bg-muted/30">
      {/* Top bar */}
      <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-border bg-background px-4">
        <div className="flex items-center gap-3">
          <Link to="/">
            <Logo />
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={loadSample}
            className="hidden sm:inline-flex"
          >
            Load sample
          </Button>

          {/* Mobile preview */}
          <Sheet open={previewOpen} onOpenChange={setPreviewOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden">
                <Eye className="h-4 w-4" /> Preview
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[85vh] p-0">
              <SheetTitle className="sr-only">Resume preview</SheetTitle>
              <SheetDescription className="sr-only">
                A live preview of your resume website.
              </SheetDescription>
              <div className="h-full bg-muted/30">
                <LivePreview />
              </div>
            </SheetContent>
          </Sheet>

          {/* AI assistant */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Sparkles className="h-4 w-4" /> AI
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full p-0 sm:max-w-md">
              <SheetTitle className="sr-only">AI Assistant</SheetTitle>
              <SheetDescription className="sr-only">
                Chat with the AI assistant to draft and import resume details.
              </SheetDescription>
              {isPro ? (
                <AssistantPanel />
              ) : (
                <div className="flex h-full items-center justify-center p-6">
                  <ProGate reason="The AI assistant is a Pro feature.">
                    <div className="h-[480px] w-full">
                      <AssistantPanel />
                    </div>
                  </ProGate>
                </div>
              )}
            </SheetContent>
          </Sheet>

          {isPro ? (
            <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs text-amber-700">
              <Crown className="h-3.5 w-3.5" /> Pro
            </span>
          ) : (
            <Button size="sm" onClick={() => requestUpgrade()}>
              Go Pro
            </Button>
          )}
        </div>
      </header>

      {/* Body */}
      <div className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[230px_1fr_1fr]">
        {/* Wizard nav */}
        <aside className="border-b border-border bg-background p-3 lg:border-b-0 lg:border-r">
          <WizardNav current={step} onSelect={setStep} />
          {!isPro && (
            <div className="mt-4 hidden lg:block">
              <AdSlot height={200} />
            </div>
          )}
        </aside>

        {/* Step content */}
        <main className="flex flex-col overflow-hidden bg-background">
          <div className="flex-shrink-0 px-6 pt-5">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">{wizardSteps[step].label}</h1>
              <span className="text-sm text-muted-foreground">
                Step {step + 1} of {wizardSteps.length}
              </span>
            </div>
            <Progress value={progress} className="mt-3" />
          </div>
          <div className="flex-1 overflow-auto px-6 py-5">
            <Current />
          </div>
          <div className="flex flex-shrink-0 items-center justify-between border-t border-border px-6 py-3">
            <Button
              variant="outline"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            {isLast ? (
              <Button onClick={() => navigate("/")}>
                <Wand2 className="h-4 w-4" /> Finish
              </Button>
            ) : (
              <Button onClick={() => setStep((s) => Math.min(wizardSteps.length - 1, s + 1))}>
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </main>

        {/* Live preview (desktop) */}
        <section className="hidden bg-muted/30 lg:block">
          <LivePreview />
        </section>
      </div>
    </div>
  );
}
