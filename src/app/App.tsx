import { RouterProvider } from "react-router";
import { router } from "./routes";
import { BuilderProvider } from "./state/BuilderContext";
import { EntitlementProvider } from "./state/EntitlementContext";
import { AIProvider } from "./state/AIContext";
import { UpgradeProvider } from "./components/monetization/UpgradeModal";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <EntitlementProvider>
      <BuilderProvider>
        <AIProvider>
          <UpgradeProvider>
            <RouterProvider router={router} />
            <Toaster position="top-center" />
          </UpgradeProvider>
        </AIProvider>
      </BuilderProvider>
    </EntitlementProvider>
  );
}
