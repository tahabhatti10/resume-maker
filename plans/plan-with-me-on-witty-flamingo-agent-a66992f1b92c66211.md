# Resume Website Maker — Implementation Plan

Clean professional SaaS. Light, neutral, blue accent. React 18 + Tailwind v4 + shadcn UI in `src/app/components/ui/`. Backend mocked this pass (AI + payments), but every UI surface is complete and convincing.

## 0. Environment facts that constrain the design
- Entry is `src/app/App.tsx` (default export). It currently renders an empty centered div.
- `@` is aliased to `src` (see `vite.config.ts`). Use `@/app/...` imports.
- Theme is driven by CSS custom properties in `src/styles/theme.css` (`--primary`, `--accent`, `--ring`, etc.) exposed to Tailwind via `@theme inline`. The blue accent + user-chosen accent color is implemented by overriding these CSS vars at runtime (set on a wrapper element's `style`), NOT by hardcoding hex in components.
- `react-router` 7.13 is present. Per the make:react-router skill, use **Data mode**: `createBrowserRouter` + `RouterProvider`. Routes live in `src/app/routes.tsx`.
- shadcn primitives already exist: button, card, input, textarea, label, form (RHF wrapper), select, tabs, dialog, drawer, sheet, progress, switch, radio-group, badge, avatar, scroll-area, separator, sonner (toasts), tooltip, accordion, popover, slider, alert, skeleton. REUSE these; do not re-implement.
- `motion` (framer-motion v12) for animation; `sonner` for toasts; `lucide-react` for icons.

---

## 1. Central data model (TypeScript)

Lives in `src/app/lib/types.ts`. This is the single source of truth that BOTH the form and every template render.

```ts
// ---- Resume domain ----
export interface ContactInfo {
  fullName: string;
  headline: string;        // e.g. "Senior Frontend Engineer"
  email: string;
  phone?: string;
  location?: string;
  website?: string;
  avatarUrl?: string;      // data URL from upload, optional
}

export interface SocialLink {
  id: string;
  label: string;           // "GitHub", "LinkedIn", "Portfolio"
  url: string;
  icon?: string;           // lucide icon name key
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string;       // "2021-03" (month input) or free text
  endDate?: string;        // empty => "Present"
  current: boolean;
  description?: string;     // short blurb
  highlights: string[];    // bullet points
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  gpa?: string;
  details?: string;
}

export interface SkillGroup {
  id: string;
  category: string;        // "Languages", "Tools"
  items: string[];
}

export interface Project {
  id: string;
  name: string;
  url?: string;
  description?: string;
  tags: string[];
  highlights: string[];
}

export interface ResumeData {
  contact: ContactInfo;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: SkillGroup[];
  projects: Project[];
  links: SocialLink[];
}

// ---- Presentation / customization ----
export type TemplateId = 'minimal' | 'modern' | 'sidebar' | 'elegant' | 'spotlight';

export interface ThemeConfig {
  templateId: TemplateId;
  accent: string;          // hex, drives --primary/--ring overrides in preview + export
  font: 'sans' | 'serif' | 'mono';
  density: 'comfortable' | 'compact';
}

// ---- App / monetization ----
export type Tier = 'free' | 'pro';

export interface BuilderState {
  resume: ResumeData;
  theme: ThemeConfig;
  currentStep: number;     // onboarding wizard step index
  completedSteps: number[];
}
```

A `TemplateMeta` registry (in `src/app/lib/templates.ts`) describes each template for the picker:
```ts
export interface TemplateMeta {
  id: TemplateId;
  name: string;            // "Minimal"
  description: string;
  pro: boolean;            // gated behind Pro
  thumbnail: string;       // preview image / generated swatch
  Component: React.FC<TemplateProps>;
}
export interface TemplateProps { data: ResumeData; theme: ThemeConfig; }
```

`src/app/lib/sampleData.ts` exports `emptyResume` and a rich `sampleResume` (used to seed the live preview before the user types, and to power landing-page template thumbnails).

---

## 2. State architecture — Context providers (not state in App)

Three small React contexts so concerns can be swapped for real backends later.

### `BuilderProvider` — `src/app/state/BuilderContext.tsx`
- Holds `BuilderState` (resume + theme + wizard progress).
- Bridges to **react-hook-form**: the wizard uses ONE `useForm<ResumeData>` instance whose `defaultValues` come from the provider; on change (`watch` / `form.subscribe`) it pushes the live values up so the preview re-renders. The RHF form object is created in the Builder layout and shared via `FormProvider` (the existing `Form` component is `FormProvider`).
- Exposes: `resume`, `theme`, `setTheme`, `setTemplate`, `setAccent`, step nav (`goToStep`, `next`, `prev`), `completedSteps`.
- Persists to localStorage (see §8) via a `useEffect` debounce.

### `EntitlementProvider` — `src/app/state/EntitlementContext.tsx`
- Holds `tier: Tier`, `isPro`, and actions `upgrade()` / `downgrade()` / `restore()`.
- Backed by `src/app/lib/entitlements.ts` (localStorage read/write). This is the seam for real Stripe/Supabase later — components only call `useEntitlement()`.
- `canUseTemplate(id)`, `canUseAI` derived helpers.

### `AIProvider` — `src/app/state/AIContext.tsx`
- Holds chat `messages`, `isThinking`, `sendMessage(text, files?)`, and `applySuggestion(patch)`.
- Calls `src/app/lib/ai/mockAI.ts` (the swap seam for Claude). Mock returns canned, context-aware responses + structured `ResumeData` patches the user can apply into the form.

Provider nesting in `App.tsx`:
```
<EntitlementProvider>
  <BuilderProvider>
    <AIProvider>
      <RouterProvider router={router} />
      <Toaster />              // sonner
    </AIProvider>
  </BuilderProvider>
</EntitlementProvider>
```

---

## 3. Routing structure (`src/app/routes.tsx`)

`createBrowserRouter`:
```
/                      -> LandingPage          (marketing)
/pricing               -> PricingPage
/builder               -> BuilderLayout (Outlet + wizard chrome + live preview pane)
   /builder            index -> redirect to /builder/personal
   /builder/personal   -> StepPersonal
   /builder/summary    -> StepSummary
   /builder/experience -> StepExperience
   /builder/education  -> StepEducation
   /builder/skills     -> StepSkills
   /builder/projects   -> StepProjects
   /builder/links      -> StepLinks
   /builder/design     -> StepDesign        (template picker + accent/theme)
   /builder/export     -> StepExport        (HTML download + mock Vercel deploy)
*                      -> NotFound
```
The builder is a **two-pane layout**: left = current step form (Outlet), right = sticky `LivePreview`. On mobile, preview collapses into a Sheet/Drawer toggled by a "Preview" button. The wizard step order is a single array `WIZARD_STEPS` in `src/app/lib/wizard.ts` (path, label, icon, validate fields) — drives both the progress indicator and next/prev navigation.

---

## 4. File tree under `src/app/`

```
src/app/
  App.tsx                         # providers + RouterProvider + Toaster
  routes.tsx                      # createBrowserRouter config

  lib/
    types.ts                      # data model (§1)
    sampleData.ts                 # emptyResume, sampleResume
    templates.ts                  # TemplateMeta registry, TemplateProps
    wizard.ts                     # WIZARD_STEPS array + per-step field map
    entitlements.ts              # tier read/write (localStorage) — Stripe seam
    storage.ts                    # typed localStorage get/set/clear helpers
    id.ts                         # uid() for repeatable items
    export/
      htmlExport.ts               # ResumeData+theme -> full HTML string
      cssExport.ts                # per-template CSS string builders
      download.ts                 # Blob + anchor download helper
    ai/
      mockAI.ts                   # canned responses + resume patch suggestions
      mockParseResume.ts          # fake PDF/image -> ResumeData parse

  state/
    BuilderContext.tsx
    EntitlementContext.tsx
    AIContext.tsx

  pages/
    LandingPage.tsx
    PricingPage.tsx
    NotFound.tsx

  components/
    landing/
      Hero.tsx
      FeatureGrid.tsx
      TemplateGalleryPreview.tsx  # mini renders of templates w/ sampleResume
      PricingTeaser.tsx
      LandingCTA.tsx
      LandingNav.tsx
      LandingFooter.tsx
    builder/
      BuilderLayout.tsx           # 2-pane shell, FormProvider, step chrome
      WizardProgress.tsx          # stepper + progress bar (uses Progress ui)
      WizardFooter.tsx            # Back / Next / Save, validates current step
      LivePreview.tsx             # renders selected template w/ watched data
      PreviewToolbar.tsx          # device toggle (desktop/mobile), template quick-switch
      fields/
        RepeatableSection.tsx     # generic useFieldArray add/remove/reorder card list
        TagInput.tsx              # chip input for skills/tags/highlights
        AvatarUpload.tsx          # image -> data URL
        MonthRangeInput.tsx       # start/end + "current" switch
      steps/
        StepPersonal.tsx
        StepSummary.tsx
        StepExperience.tsx
        StepEducation.tsx
        StepSkills.tsx
        StepProjects.tsx
        StepLinks.tsx
        StepDesign.tsx            # TemplatePicker + ThemeCustomizer
        StepExport.tsx            # ExportPanel + DeployFlow
    templates/
      TemplateFrame.tsx           # wraps a template, injects accent via CSS vars
      TemplatePicker.tsx          # grid of TemplateMeta, locks pro ones
      ThemeCustomizer.tsx         # accent swatches, font, density
      MinimalTemplate.tsx         # free
      ModernTemplate.tsx          # free
      SidebarTemplate.tsx         # free
      ElegantTemplate.tsx         # PRO
      SpotlightTemplate.tsx       # PRO
    ai/
      AIAssistantPanel.tsx        # slide-over (Sheet) chat dock, gated by Pro
      AIMessageList.tsx
      AIComposer.tsx              # text input + file upload (PDF/image)
      AIFileChip.tsx              # uploaded file preview
      AISuggestionCard.tsx        # "Apply to resume" structured patch
      AILauncher.tsx              # floating button to open the panel
    monetization/
      UpgradeModal.tsx            # mock checkout (Dialog) -> sets tier=pro
      ProBadge.tsx                # small lock/Pro pill
      LockedOverlay.tsx           # blur + "Unlock with Pro" over gated content
      PricingTable.tsx            # free vs pro feature matrix (shared landing+pricing)
      AdSlot.tsx                  # placeholder ad; hidden when isPro
    shared/
      AppShell.tsx                # optional top bar for builder (logo, tier, account)
      Logo.tsx
      SectionHeading.tsx
      EmptyState.tsx
      DeviceFrame.tsx             # desktop/phone bezel for LivePreview
```

---

## 5. Live preview + template switching share ONE data model

- The wizard's single `useForm<ResumeData>` is the source. `LivePreview` reads the live values with `useWatch()` (or `form.watch()`), merges with `theme` from `BuilderContext`, and renders `theme.templateId` resolved through the `templates.ts` registry: `const { Component } = getTemplate(theme.templateId)`.
- Every template is a pure function of `TemplateProps { data, theme }`. Switching templates is just changing `theme.templateId` — same data, different component. No data transformation per template.
- Accent color: `TemplateFrame` sets inline CSS vars on its root (`style={{ '--tpl-accent': theme.accent }}`) and templates use `var(--tpl-accent)` (or Tailwind arbitrary `[color:var(--tpl-accent)]`). Same variable name is reused by the HTML export so on-screen == downloaded.
- Empty fields fall back to `sampleResume` placeholders (greyed) so the preview never looks broken while onboarding.
- Pro templates render normally inside the builder preview but show a `LockedOverlay` + watermark for free users, and are blocked at the export step until upgrade.

---

## 6. Export-to-HTML (client-side, real)

`src/app/lib/export/htmlExport.ts`:
- `buildResumeHtml(data, theme): string` returns a complete standalone document: `<!doctype html><html><head><meta><title>{name}</title><style>{css}</style></head><body>{markup}</body></html>`.
- Markup is generated by a **string-template per template id** (mirrors the React template visually but emits plain HTML — kept in the same family so they stay in sync). A small `esc()` helper HTML-escapes all user strings (XSS-safe output).
- CSS from `cssExport.ts`: a shared base (reset, typography, responsive container, media queries) + per-template rules, with the accent injected as `:root{--tpl-accent:{theme.accent}}`. Fonts via Google Fonts `<link>` or system stack based on `theme.font`. Fully responsive (the downloaded site works on mobile).
- `src/app/lib/export/download.ts`: `downloadHtml(filename, html)` -> `new Blob([html], {type:'text/html'})`, `URL.createObjectURL`, click a temporary `<a download>`, then `revokeObjectURL`. Also offer "Copy HTML" and "Preview in new tab" (`window.open` + `document.write` of the blob URL).
- `StepExport.tsx` shows: chosen template summary, "Download .html" (free for free templates; pro templates require upgrade), and the mock deploy panel.

### Mock "Deploy to Vercel"
- `DeployFlow` inside `StepExport`: button -> staged fake progress using `motion` + timers (e.g. "Uploading files" -> "Building" -> "Assigning domain"), each ~600-900ms, driven by a small state machine. Ends with a fake live URL like `https://{slug}-{rand}.vercel.app`, a copy button, "Visit" (opens the local blob preview instead), and a success toast + optional confetti (`canvas-confetti` is available). No network calls.

---

## 7. Paywall / Pro state + AI mock — swap seams

### Entitlements (Stripe/Supabase seam)
- All gating goes through `useEntitlement()`. `entitlements.ts` only touches localStorage today; later it becomes an API/Supabase call with the SAME interface, so components never change.
- `UpgradeModal` (mock checkout): plan toggle (monthly/annual), fake card fields (inputs, no validation needed beyond presence), "Pay $X" -> brief spinner -> `upgrade()` sets `tier='pro'`, persists, closes, success toast + confetti. Gated surfaces re-render reactively.
- Gating points: Pro templates in `TemplatePicker`/export, `AIAssistantPanel`, and `AdSlot` (hidden when pro). Each renders `LockedOverlay`/`ProBadge` and opens `UpgradeModal` on click when free.

### AI (Claude seam)
- `useAI()` -> `mockAI.ts`. `sendMessage` returns a Promise resolving after a simulated delay with: an assistant text message and optionally a `suggestion` (partial `ResumeData`). `AISuggestionCard` renders an "Apply" button that merges the patch into the RHF form (`form.reset({...current, ...patch})` or per-field `setValue`), which instantly updates the live preview.
- File/multimodal: `AIComposer` accepts drag/drop + file input (PDF/PNG/JPG). On upload, `mockParseResume.ts` returns a canned `ResumeData` after a fake "Reading your resume…" delay, surfaced as a suggestion to apply. UI shows file chips with name/size/type icon. The real swap = send file bytes + prompt to Claude with the same return shape.
- Later swap: replace `mockAI.ts`/`mockParseResume.ts` bodies with Anthropic SDK calls; message/suggestion types stay identical.

---

## 8. Persistence (localStorage)

`src/app/lib/storage.ts` — typed `load<T>(key, fallback)` / `save(key, value)` / `remove(key)` wrapped in try/catch (SSR/quota safe).

Keys:
- `rwm:builder` -> `BuilderState` (resume + theme + step), debounced save (~400ms) on change in `BuilderProvider`. Restored on mount so refresh keeps progress.
- `rwm:tier` -> `Tier`, written by `EntitlementProvider`.
- `rwm:ai` -> optional chat history (can stay in memory only; persist if desired).

A "Reset / Start over" action (in builder shell) clears `rwm:builder` and re-seeds `emptyResume`.

---

## 9. Visual direction (clean professional SaaS)

- Light, neutral surfaces (existing tokens: white bg, near-black `--primary`). Introduce a **blue accent** by overriding `--primary`/`--ring`/`--accent-foreground`-adjacent usage at the app wrapper (default accent `#2563eb`), and let `ThemeCustomizer` change the *resume* accent independently from the app chrome.
- Generous spacing, rounded-lg cards (`--radius` 0.625rem already set), subtle borders, `motion` for step transitions and preview cross-fade on template switch.
- Landing: full-bleed hero with product screenshot of the builder, feature grid w/ lucide icons, live template gallery (real template components at small scale with `sampleResume`), pricing teaser, footer. `AdSlot` placeholders interspersed (clearly labeled "Advertisement" dashed boxes) to demonstrate the free-tier ad experience.

---

## 10. Build order (single large pass)

1. **Foundations**: `lib/types.ts`, `lib/id.ts`, `lib/storage.ts`, `lib/sampleData.ts`, `lib/wizard.ts`.
2. **State**: `EntitlementContext`, `BuilderContext`, `AIContext`; wire providers + `RouterProvider` in `App.tsx`; `routes.tsx` with placeholder pages.
3. **Templates**: `TemplateProps`, `TemplateFrame`, the 3 free templates (Minimal/Modern/Sidebar), registry in `lib/templates.ts`. Verify they render `sampleResume`.
4. **Builder shell**: `BuilderLayout` (FormProvider + 2-pane), `WizardProgress`, `WizardFooter`, `LivePreview`, `PreviewToolbar`, shared field components (`RepeatableSection`, `TagInput`, `AvatarUpload`, `MonthRangeInput`).
5. **Wizard steps**: Personal -> Summary -> Experience -> Education -> Skills -> Projects -> Links, each with RHF validation. Confirm live preview updates.
6. **Design step**: `TemplatePicker` + `ThemeCustomizer` (+ add 2 Pro templates Elegant/Spotlight with locks).
7. **Export**: `htmlExport.ts` / `cssExport.ts` / `download.ts`, `StepExport` download flow, then `DeployFlow` mock.
8. **Monetization**: `EntitlementContext` gating, `UpgradeModal`, `LockedOverlay`, `ProBadge`, `AdSlot`, `PricingTable`. Apply gates to Pro templates + AI + ads.
9. **AI**: `mockAI.ts`, `mockParseResume.ts`, `AIAssistantPanel` + composer/file upload/suggestion cards + launcher; gate behind Pro.
10. **Marketing**: `LandingPage` (Hero/Features/Gallery/PricingTeaser/CTA/Nav/Footer + AdSlots), `PricingPage`, `NotFound`.
11. **Polish**: motion transitions, toasts, confetti, responsive/mobile preview Sheet, localStorage round-trip + reset, empty/placeholder states.

---

## Risks / decisions
- **Router**: skill mandates `createBrowserRouter`/`RouterProvider`. If the Make preview sandbox can't push real URLs, fall back to `createMemoryRouter` with the identical route tree (no other code changes).
- **RHF <-> preview sync**: use `useWatch` to avoid re-rendering the whole form on every keystroke; only `LivePreview` subscribes.
- **HTML/React template drift**: keep each template's React component and its HTML-string exporter colocated conceptually and reviewed together; share the CSS-var accent contract so on-screen and exported output match.
- **XSS in export**: escape all user input in `htmlExport` since output is a downloadable file.

## Critical files for implementation
- /workspaces/default/code/src/app/App.tsx
- /workspaces/default/code/src/app/lib/types.ts
- /workspaces/default/code/src/app/state/BuilderContext.tsx
- /workspaces/default/code/src/app/lib/export/htmlExport.ts
- /workspaces/default/code/src/app/components/builder/LivePreview.tsx
