import { Navbar } from "../components/landing/Navbar";
import { Hero } from "../components/landing/Hero";
import { FeatureGrid } from "../components/landing/FeatureGrid";
import { TemplateShowcase } from "../components/landing/TemplateShowcase";
import { PricingTeaser } from "../components/landing/PricingTeaser";
import { Footer } from "../components/landing/Footer";
import { AdSlot } from "../components/monetization/AdSlot";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <div className="mx-auto max-w-6xl px-5">
        <AdSlot label="Sponsored" height={90} />
      </div>
      <FeatureGrid />
      <TemplateShowcase />
      <div className="mx-auto max-w-6xl px-5 pb-4">
        <AdSlot label="Sponsored" height={90} />
      </div>
      <PricingTeaser />
      <Footer />
    </div>
  );
}
