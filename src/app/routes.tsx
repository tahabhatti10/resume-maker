import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { BuilderPage } from "./pages/BuilderPage";
import { PricingPage } from "./pages/PricingPage";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/builder", element: <BuilderPage /> },
  { path: "/pricing", element: <PricingPage /> },
  { path: "*", element: <LandingPage /> },
]);
