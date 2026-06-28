import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowRight, Sparkles, Zap, Globe, Star } from "lucide-react";
import { Button } from "../ui/button";
import { BRAND_GRADIENT } from "../shared/Logo";
import { getTemplate } from "../../lib/templates";
import { sampleResume, defaultTheme } from "../../lib/sampleData";

export function Hero() {
  const navigate = useNavigate();
  const { Component } = getTemplate("modern");

  return (
    <section className="relative overflow-hidden">
      {/* Colorful ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -left-24 -top-28 h-80 w-80 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #38bdf8, transparent 70%)" }}
        />
        <div
          className="absolute -right-20 top-0 h-96 w-96 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #818cf8, transparent 70%)" }}
        />
        <div
          className="absolute left-1/2 top-48 h-72 w-72 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #c084fc, transparent 70%)" }}
        />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:pt-24">
        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center lg:text-left"
        >
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold"
            style={{
              borderColor: "rgba(99, 102, 241, 0.25)",
              background: "rgba(99, 102, 241, 0.08)",
              color: "#4f46e5",
            }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI-assisted resumes in minutes
          </span>

          <h1 className="mx-auto mt-5 max-w-2xl font-serif text-5xl leading-[1.05] tracking-tight lg:mx-0 lg:text-6xl">
            Turn your experience into a{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: BRAND_GRADIENT }}
            >
              standout resume
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-balance text-lg text-muted-foreground lg:mx-0">
            Answer a few guided questions and Resumio builds a polished,
            responsive resume you can download as HTML or PDF — no design skills
            required.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Button
              size="lg"
              onClick={() => navigate("/builder")}
              className="border-0 text-white shadow-lg transition hover:opacity-90"
              style={{ background: BRAND_GRADIENT }}
            >
              Build my resume <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/pricing")}>
              See pricing
            </Button>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground lg:justify-start">
            <span className="flex items-center gap-1.5">
              <Zap className="h-4 w-4" style={{ color: "#0ea5e9" }} /> 5-minute setup
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="h-4 w-4" style={{ color: "#6366f1" }} /> Export HTML or PDF
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" style={{ color: "#9333ea" }} /> AI writing help
            </span>
          </div>
        </motion.div>

        {/* Product preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative mx-auto w-full max-w-md"
        >
          <div
            className="absolute -inset-6 -z-10 rounded-[2.5rem] opacity-30 blur-2xl"
            style={{ background: BRAND_GRADIENT }}
          />
          {/* Floating rating chip */}
          <div className="absolute -left-4 top-8 z-10 hidden rounded-2xl border border-border bg-card px-3 py-2 shadow-lg sm:block">
            <div className="flex items-center gap-1 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">Loved by job seekers</p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-2xl">
            <div className="flex items-center gap-1.5 border-b border-border bg-muted/50 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </div>
            <div className="h-[440px] overflow-hidden">
              <div
                style={{
                  width: 820,
                  transform: "scale(0.52)",
                  transformOrigin: "top left",
                  pointerEvents: "none",
                }}
              >
                <Component
                  data={sampleResume}
                  theme={{ ...defaultTheme, templateId: "modern", accent: "#4f46e5" }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
