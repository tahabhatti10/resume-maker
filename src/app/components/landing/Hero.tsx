import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowRight, Sparkles, Zap, Globe } from "lucide-react";
import { Button } from "../ui/button";

export function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(55% 45% at 50% 0%, rgba(37, 99, 235, 0.12) 0%, transparent 70%)",
        }}
      />
      <div className="mx-auto max-w-4xl px-5 pb-16 pt-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI-assisted resume websites in minutes
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-balance text-5xl font-semibold tracking-tight">
            Turn your experience into a beautiful resume website
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-balance text-lg text-muted-foreground">
            Answer a few guided questions and Resumio builds a polished,
            responsive personal site you can publish or download — no design
            skills required.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" onClick={() => navigate("/builder")}>
              Build my resume <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/pricing")}
            >
              See pricing
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-primary" /> 5-minute setup
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-primary" /> Export & host anywhere
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" /> AI writing help
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
