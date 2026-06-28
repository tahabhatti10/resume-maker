import { Link, useNavigate } from "react-router";
import { Crown } from "lucide-react";
import { Logo, BRAND_GRADIENT } from "../shared/Logo";
import { Button } from "../ui/button";
import { useEntitlement } from "../../state/EntitlementContext";
import { useUpgrade } from "../monetization/UpgradeModal";

export function Navbar() {
  const navigate = useNavigate();
  const { isPro } = useEntitlement();
  const { requestUpgrade } = useUpgrade();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link to="/">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
          <Link to="/pricing" className="hover:text-foreground">
            Pricing
          </Link>
          <a href="#templates" className="hover:text-foreground">
            Templates
          </a>
        </nav>
        <div className="flex items-center gap-2">
          {isPro ? (
            <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs text-amber-700">
              <Crown className="h-3.5 w-3.5" /> Pro
            </span>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => requestUpgrade()}
              className="hidden sm:inline-flex"
            >
              Go Pro
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => navigate("/builder")}
            className="border-0 text-white"
            style={{ background: BRAND_GRADIENT }}
          >
            Start building
          </Button>
        </div>
      </div>
    </header>
  );
}
