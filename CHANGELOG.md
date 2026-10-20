# 📋 MindScroll AI — Changelog

All notable changes and upgrades to MindScroll AI are documented in this file.

## [3.1.0] - UI Bug Fixes (Navbar Overlap, Section Stacking, Result Screen Clean-Up)

### 🛠️ 1. Navbar Overlap Fix
- **CSS Variable `--nav-h`**: Added `--nav-h: 80px` on `:root` and assigned `padding-top: var(--nav-h)` to `<main>` across all pages so content never starts under the navbar.
- **Scroll Alignment**: Added `scroll-padding-top: var(--nav-h)` to `<html>` and `scroll-margin-top: var(--nav-h)` to sections and anchor targets.
- **Navbar Opacity & Z-Index**: Set `<header>` to `fixed top-0 left-0 right-0 z-50` with solid surface background at 90% opacity plus `backdrop-blur-md` so content cleanly scrolls underneath without text bleeding through.
- **Mobile Bottom Tab Bar Padding**: Added `pb-[calc(var(--tab-bar-h)+env(safe-area-inset-bottom)+1.5rem)]` on mobile so bottom cards/buttons are never occluded by the tab bar.

### 🛠️ 2. Section Stacking & Overflow Fix
- **Sticky Breakdown Prevention**: Replaced `overflow-x: hidden` with `overflow-x: clip` on `html` and `body` in `src/index.css`.
- **Section Audit**: All sections on the Home page (`LandingPage.tsx`) audited and confirmed as `position: relative`, eliminating negative margins and unpinned stacking conflicts.

### 🛠️ 3. Result Screen Clean-Up & AA Contrast
- **Zero Orbit Rings / Dots / Mesh**: Removed all 3D orbs, mesh spheres, and scatter dot elements from the Result screen. Exactly one accent color (orange) allowed.
- **Proportional Gauge Arc**: Arc strictly scales between min (`3.6`) and max (`9.4`) cohort bounds.
- **High-Contrast Score Digits**: Score number uses `text-fg` (`var(--fg)`) for maximum readability, restricting status band colors strictly to the sweeping arc and the badge.
- **Verified AA Contrast**: Darkened light mode amber `--status-moderate` to `#92400E` for verified > 6.6:1 contrast against `#FAF7F2` cream background.
- **Clean Single Scale Line**: Replaced separate "Min / Scale / Max" labels with a unified single line: `"Scale: 3.6 (minimum) – 9.4 (maximum)"`.

---

## [3.0.0] - Visual Layer Rebuild From Scratch & Universal Theme System

### 🔍 Step 0 Diagnosis: Root Causes of Broken Theme Switch & Palette Issues
1. **Invalid Tailwind Dark Mode Selector Configuration**: In `package.json`, Tailwind was on version `3.4.17`. In `tailwind.config.js`, `darkMode` was misconfigured as `['class', '[data-theme="dark"]']`, which is invalid syntax for Tailwind v3 (required: `['selector', '[data-theme="dark"]']`).
2. **Hardcoded Body Background in `index.html`**: The `<body>` tag contained `<body class="bg-[#0A0A0A] text-[#EDEDED]...">`, forcing near-black background and white text via inline high-specificity utility classes regardless of HTML `data-theme` state.
3. **Pervasive Hardcoded Colors Across Components**: Over 25 components in `src/` hardcoded raw Hex and Tailwind color classes (`bg-[#0A0A0A]`, `bg-[#121214]`, `text-white`, `border-white/10`, `text-zinc-400`, `bg-zinc-900`, `text-orange-500`, `text-purple-400`, etc.), leaving light theme unstyled and dark-locked.
4. **Three.js & Visual FX Layer Clutter**: Heavy canvas layers, 3D particle spheres, noise overlays, and aurora glows hardcoded fixed alpha values and multi-color purple/violet gradients, violating the single-accent design system.

---

### 🎨 Step 1 & 2: Design Tokens & Theme Engine
- **Single Source of Truth (`data-theme`)**: The `data-theme` attribute on `<html>` controls all styles.
- **Pre-Paint Theme Script**: Inline script in `index.html` reads `localStorage` (or matches system preference) and sets `data-theme` and `color-scheme` before first paint, eliminating flash of unstyled content.
- **Strict Design Tokens (`src/styles/tokens.css`)**:
  - **Dark**: `--bg: #0B0B0C`, `--surface: #141416`, `--surface-2: #1C1C1F`, `--line: rgba(255,255,255,0.08)`, `--fg: #F5F3EF`, `--muted: #A1A1A8`, `--accent: #FF6A1F`, `--accent-fg: #1A0B02`, `--accent-soft: rgba(255,106,31,0.14)`.
  - **Light**: `--bg: #FAF7F2`, `--surface: #FFFFFF`, `--surface-2: #F3EEE6`, `--line: rgba(26,20,16,0.10)`, `--fg: #1A1410`, `--muted: #6B625A`, `--accent: #D94A00`, `--accent-fg: #FFFFFF`, `--accent-soft: rgba(217,74,0,0.10)`.
  - **AA-Tuned Status Colors**: Good (`--status-good`), Moderate (`--status-moderate`), Attention (`--status-attention`), Concern (`--status-concern`).
  - **Chart Palette**: Accent orange + neutral greys + teal for positive restoration values.
  - **Rule Enforcement**: Exactly one accent color. No purple/violet, no multi-color glows. Subtle accent-to-transparent glow allowed.
- **View Transitions Circular Reveal**: `useTheme` uses `document.startViewTransition` with a smooth circular clip-path reveal originating from click coordinates, with an automatic 200ms fallback for reduced motion or unsupported browsers.
- **Keyboard Shortcut**: Press `T` from any page (ignoring form inputs) to seamlessly toggle themes.

---

### 🧱 Step 3 & Phase 2: App Shell & Editorial Pages
- **Clean Responsive Navigation (`Navbar.tsx`)**:
  - Desktop: Top navbar with brand mark, Home, Predict, What-If, Insights, Model, backend status dot, assessment history drawer button, and Sun/Moon morph toggle.
  - Mobile: Bottom tab bar with safe-area insets (`env(safe-area-inset-bottom)`), fixed height, and touch targets.
- **Base Components (`src/components/ui/`)**:
  - `Button`: Primary, ghost, secondary, and accent-soft variants.
  - `Card`: Clean surface tokens with subtle hairline borders.
  - `Input`: Accessible inputs with labels, errors, and helper text.
  - `Slider`: Range slider with live value badges and tick markers.
  - `Segmented`: Sliding segmented control for stress levels and options.
  - `Badge`: Token-based status tags for score bands and model cards.
  - `Skeleton`: Pulse placeholder using `bg-surface-2`.
  - `Toast`: Polite notification system using tokens and SVG icons.
- **Fluid Typography**: Space Grotesk for headlines, Inter for body, styled with responsive `clamp()` and container max-width 1200px.
- **Rebuilt Pages**:
  1. **Landing Page**: Statement hero (`"The scroll leaves a mark. Quantify it."`), Bento stat cards, Proof Numbers Strip with live ease-out `CountUp`, 4-step `HowItWorksStepper`, Platform name ticker, and final CTA.
  2. **Predictor Wizard**: 4 steps, large step counter `"02 / 04"`, live value sliders, segmented stress selector, and sticky Next/Back navigation bar on mobile.
  3. **Result Page**: Rebuilt SVG `ScoreGauge` reading CSS variable status colors, "What's driving your score" Recharts bar chart with growth animations, 3 targeted lifestyle recommendations, educational disclaimer, and copy/download controls.
  4. **What-If Simulator**: Real-time counterfactual calculations, live sliders, baseline vs simulated score comparison, and delta score badges.
  5. **Insights Dashboard**: Bento grid with histogram area chart, sleep vs score chart, platform usage chart, Pearson correlation matrix heatmap, and mobile filter drawer.
  6. **Model Card**: Benchmarking table with automatic conversion to cards on mobile, expandable feature pipeline details, hyperparameter specifications, ethical boundaries, and FAQ accordions.
  7. **Footer & 404**: Clean editorial footer with academic disclaimer and links; friendly 404 page.

---

### ✨ Phase 3: Motion & Micro-Interactions
- **Lenis Smooth Scrolling**: Zero-friction viewport scrolling.
- **Smooth Page Transitions**: `AnimatePresence` with transform and opacity (no layout thrashing).
- **Desktop Micro-interactions**: Magnetic buttons (`MagneticButton`) and subtle 3D card tilt (`TiltCard`), strictly scoped to desktop pointers with reduced motion guards.
- **Minimal Animated Background (`BackgroundGlow`)**: One soft theme-aware radial accent glow + SVG fine film grain.
- **One-time Preloader (`Preloader`)**: 0-100% counter running once per session (`sessionStorage`), respecting `prefers-reduced-motion`.

---

### ✅ Verification & Testing
- **Playwright Theme Test (`tests/theme.spec.ts`)**:
  - Asserts `html[data-theme]` flips between `light` and `dark`.
  - Asserts computed body background color switches between `rgb(250, 247, 242)` and `rgb(11, 11, 12)`.
  - Asserts theme persistence in `localStorage` across page reload.
  - **Result**: `ok 1 ... 1 passed (3.1s)`.
- **Cross-Viewport Multi-Theme Screenshot Suite (`scripts/capture-screenshots.mjs`)**:
  - Captured 36 screenshots across all 6 pages at 390px (mobile), 768px (tablet), and 1440px (desktop) in both light and dark themes.
  - Confirmed 0 horizontal scroll overflow warnings (`scrollWidth === clientWidth`).
- **Production Build Validation**:
  - `npm run build` passes with zero TypeScript errors and zero warnings (`✓ built in 15.20s`).

---

## [2.2.0] - Creative Direction Audit
- Initial feature telemetry exploration and pipeline prototypes.

## [2.1.0] - Vercel Multi-Service Deployment
- Multi-service root rewrites and ASGI FastAPI integration.

## [1.0.0] - Initial Release
- Scikit-learn Random Forest model pipeline.
