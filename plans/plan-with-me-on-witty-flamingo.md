# Resume Website Maker — Implementation Plan

## Context

The user wants a **resume website maker SaaS**: form-based onboarding collects a user's
details, the app generates a professional, responsive, consistent resume *website*, lets the
user export/host it, and monetizes via **ad slots** and a **paywall** gating an **AI assistant**
that accepts files and other multimodal inputs.

**Reality check (scope of this build).** Figma Make produces a single front-end React + Tailwind
app. So this build delivers the full product UI and the genuinely client-side pieces, while the
parts that require external accounts/infra are mocked behind clean interfaces we can later make
real:

- **Real now:** onboarding wizard, live preview, multiple responsive templates, theme/accent
  customization, **client-side export of standalone HTML/CSS** (real Blob download), localStorage
  persistence.
- **Mocked now (UI complete, swappable later):** "Deploy to Vercel" flow (fake progress + fake
  URL), payments/paywall (no Stripe — flips a Pro flag), AI chatbot + resume-file parsing (canned
  responses), ad slots (placeholders).

**Decisions confirmed with user:** build everything in one pass with AI/payments mocked but UI
complete; visual direction = **clean professional SaaS (light, neutral, blue accent)**.

## Tech grounding (from the repo)

- `src/app/App.tsx` — empty default-export root; `@` aliases to `src`.
- Theme via CSS custom properties in `src/styles/theme.css` (`--primary`, `--ring`, …) exposed
  through `@theme inline`. The blue brand accent and the user-chosen template accent are applied
  as **runtime CSS-var overrides** (e.g. `--tpl-accent`), never hardcoded hex.
- shadcn-style primitives already exist in `src/app/components/ui/` (button, card, form (RHF
  wrapper), dialog, drawer, sheet, tabs, progress, sonner, badge, select, etc.) — **reuse, do not
  rebuild**.
- Installed: `react-router@7.13`, `react-hook-form@7.55`, `lucide-react`, `motion`, `sonner`,
  `canvas-confetti`. No `@make-kits` package present.
- Routing uses **react-router Data mode**: `createBrowserRouter` + `RouterProvider` (fall back to
  `createMemoryRouter` with the same route tree if the sandbox blocks URL pushes).

## Data model (single source of truth)

`src/app/lib/types.ts`:

- `ResumeData` — `contact` (name, title, email, phone, location, avatarUrl), `summary`,
  `experience[]` (company, role, start, end, current, bullets[]), `education[]`, `skills[]`
  (grouped), `projects[]` (name, desc, link), `links[]` (label, url). Every repeatable item has a
  stable `id` for React keys.
- `ThemeConfig` — `templateId`, `accent`, `font`, `density`.
- `Tier` — `'free' | 'pro'`.
- `TemplateMeta` registry in `src/app/lib/templates.ts`: each template is a pure
  `({ data, theme }) => JSX` function, marked `free` or `pro`.

## State (contexts = the future backend-swap seams)

`src/app/state/`:

- **BuilderContext** — holds `ResumeData` + `ThemeConfig` + wizard step/progress; bridges a single
  `useForm<ResumeData>` (RHF); persists to `localStorage` (debounced).
- **EntitlementContext** — `tier`, `isPro`, `upgrade()`, `restore()`; localStorage today,
  Stripe/Supabase later (same interface).
- **AIContext** — `messages`, `sendMessage(text, files)`, `applySuggestion(patch)`; backed by mock
  modules today, Claude later.

## Routing & pages

`src/app/pages/` via `src/app/routes.tsx`:

- `/` — Landing (marketing).
- `/pricing` — Pricing/paywall page.
- `/builder` — Builder workspace (wizard + live preview side-by-side; stacks on mobile).
- `/builder/export` — Export & deploy step (can be a sub-view/tab of builder).

## Component breakdown — `src/app/components/`

- `landing/` — `Hero`, `FeatureGrid`, `TemplateShowcase`, `PricingTeaser`, `Navbar`, `Footer`,
  `LandingAdSlot`.
- `builder/` — `BuilderLayout` (two-pane), `WizardNav` (progress + steps), `LivePreview`
  (reads form via `useWatch`, resolves template from registry, renders), `DesignStep`
  (template picker + accent/font/density controls), `ExportPanel`, `DeployModal` (mock Vercel).
  - `builder/steps/` — `ContactStep`, `SummaryStep`, `ExperienceStep`, `EducationStep`,
    `SkillsStep`, `ProjectsStep`, `LinksStep`.
  - `builder/fields/` — reusable RHF field wrappers + `RepeatableList` (add/remove/reorder).
- `templates/` — `TemplateMinimal`, `TemplateModern`, `TemplateSidebar` (free),
  `TemplateEditorial`, `TemplateCompact` (Pro). All consume `{ data, theme }`, fully responsive,
  use `--tpl-accent`.
- `ai/` — `AssistantPanel` (chat thread + composer), `FileDropzone` (PDF/image upload UI),
  `SuggestionCard` ("Apply" patches into the form). Pro-gated.
- `monetization/` — `UpgradeModal` (mock checkout → flips tier to pro + confetti), `ProBadge`,
  `ProGate` (wrapper that blurs/locks gated content for free users), `AdSlot`.
- `shared/` — `AccentProvider` (writes `--tpl-accent` CSS var), `EmptyState`, `SectionHeading`,
  `Logo`.

## Live preview + template switching

The wizard's single RHF form is the source of truth. `LivePreview` subscribes via `useWatch`,
looks up `theme.templateId` in the registry, and renders the matching template component.
Switching templates changes only one id — same data, different component. Accent flows through the
shared `--tpl-accent` CSS var, used identically on screen and in the exported HTML.

## Export (real, client-side)

`src/app/lib/export/htmlExport.ts` → `buildResumeHtml(data, theme)` returns a **complete
standalone, responsive, XSS-escaped HTML document** with per-template inline CSS and the accent
injected as a `:root` var. `src/app/lib/export/download.ts` does `Blob` +
`URL.createObjectURL` + anchor click. The "Deploy to Vercel" `DeployModal` is a staged-progress
state machine (building → uploading → live) ending in a fake `*.vercel.app` URL + confetti — no
network calls.

## Paywall, ads & AI mock

- All gating flows through `useEntitlement()`: Pro templates, the AI panel, and ad visibility
  (ads show for free users, hidden for Pro).
- `UpgradeModal` is a mock checkout that sets `tier = 'pro'` and persists it.
- AI: `src/app/lib/ai/mockAI.ts` returns canned assistant replies; `mockParseResume.ts` returns a
  canned `ResumeData` patch from an "uploaded" file, surfaced as a `SuggestionCard` the user can
  Apply directly into the form. Interfaces match a future Claude integration.

## Build order

1. Foundations: `types.ts`, `templates.ts` registry, `routes.tsx`, `AccentProvider`, app shell in
   `App.tsx` (RouterProvider).
2. State providers: Builder, Entitlement, AI contexts + localStorage persistence.
3. Three free templates rendering from a seeded sample `ResumeData`.
4. Builder shell + reusable fields + `RepeatableList`; wire RHF + live preview.
5. Wizard steps (all 7) with validation + progress.
6. Design step (template picker + accent/font/density) and the two Pro templates.
7. Export (`buildResumeHtml` + download) and mock Deploy modal.
8. Monetization: `ProGate`, `UpgradeModal`, `AdSlot`, Pro badges.
9. AI assistant panel + file dropzone + suggestion-apply.
10. Marketing landing + pricing pages.
11. Polish: responsive passes, motion transitions, toasts, empty states.

## Critical files

- `src/app/App.tsx` — RouterProvider + global providers.
- `src/app/lib/types.ts` — `ResumeData`, `ThemeConfig`, `Tier`, `TemplateMeta`.
- `src/app/lib/templates.ts` — template registry.
- `src/app/state/BuilderContext.tsx` — form/state/persistence hub.
- `src/app/components/builder/LivePreview.tsx` — data → template rendering.
- `src/app/lib/export/htmlExport.ts` — standalone HTML generation.

## Verification

- App boots in the Figma Make preview at `/` with the landing page; nav routes to `/builder`,
  `/pricing`.
- Filling wizard fields updates the live preview in real time; switching templates keeps data;
  changing accent recolors both preview and export.
- "Export HTML" downloads a standalone `.html` that opens and renders correctly stand-alone and is
  responsive at mobile/desktop widths.
- Free user sees ad slots and locked Pro templates/AI; "Upgrade" mock flips to Pro, hides ads,
  unlocks templates + AI; state survives reload (localStorage).
- AI panel: typing returns a mock reply; uploading a file surfaces an Apply-able suggestion that
  populates the form.
- Resize to mobile: builder stacks, preview remains usable, no horizontal overflow.
