# Current Sprint: Image & LaTeX Fixes + Deployment

## Status: Needs PR merge

### Completed (Image & LaTeX Fix Sprint — 2026-03-16)
Branch: `claude/audit-react-educational-apps-mqaVf` — 5 commits ahead of main

- [x] Added GitHub Actions workflow for GitHub Pages deployment (`.github/workflows/deploy.yml`)
- [x] Fixed LaTeX backslash escaping across all 6 module pages (~200+ formulas)
  - All `\frac`, `\alpha`, `\times` etc. changed to `\\frac`, `\\alpha`, `\\times` in JSX string attributes
- [x] Replaced 3 confirmed-broken Wikimedia image URLs (SMA connectors, PCB NASA, Laser lab)
- [x] Replaced non-existent `Dipole_antenna_drawing.svg` with verified `Dipole_antenna_ft_en.svg`
- [x] Fixed `GSM_base_station_4.jpg` → `.JPG` (case-sensitive on Wikimedia)
- [x] Repaired linter-corrupted LaTeX in Transients.tsx (`\\\1rac` → `\\frac` etc.)

### Completed (Audit Implementation — 2026-03-15)
- [x] Created CoupledCoilsSim with animated magnetic field lines, k/N1/N2/ZL sliders
- [x] Added dual V2 readouts: ideal (k=1) and actual (k-dependent) secondary voltage
- [x] Added amber flux leakage warning banner when k < 0.9
- [x] Created interactive SmithChartSim with click-to-place impedance
- [x] Smith chart: constant-r circles, constant-x arcs, VSWR circle, Gamma vector
- [x] Smith chart: matching network stub calculator (quarter-wave + single stub)
- [x] Added `calculateComplexReflectionCoefficient` to transmissionMath.ts
- [x] Added `calculateActualSecondaryVoltage` to transmissionMath.ts
- [x] Created comprehensive test suite (52 edge-case tests for all math functions)
- [x] Refactored SmithChartSim for React 19 lint compliance (react-hooks/refs, react-compiler)
- [x] Refactored CoupledCoilsSim rAF loop for react-hooks/immutability compliance
- [x] Added progress persistence via useProgressStore (persisted to `emac-m3-progress`)
- [x] Unified dark mode with `emac-theme` localStorage key
- [x] Added cross-module URL env vars (VITE_MODULE*_URL)
- [x] Created cross-module navigation links in Sidebar

### Previously Completed (Initial Build)
- [x] Scaffold Vite + React 19 + TypeScript project
- [x] 6 module pages: Overview, Transformers, LumpedDistributed, TransmissionLines, Transients, Antennas
- [x] 7 canvas simulations: CoupledCoils, LadderAnimation, TransmissionLine, SmithChart, BounceDiagram, RadiationPattern, StandingWaveQuiz
- [x] transmissionMath.ts with all physics calculations
- [x] Shared components: MathWrapper, ConceptCheck, PredictionGate, CollapsibleSection, Tabs, AiTutor
- [x] Layout with responsive sidebar, dark mode toggle
- [x] PWA configuration with offline support
- [x] Error boundary with fallback UI

## Pending / Next Session
- [ ] **Create PR** for `claude/audit-react-educational-apps-mqaVf` → `main` (5 commits)
- [ ] **Verify deployments** after merge (both Vercel and GitHub Pages)
- [ ] **Manually test unverified images** — 6 Wikimedia images could not be verified via web search:
  - `Network_Analyzer_Agilent_8714ET.jpg` (TransmissionLines.tsx)
  - `Transformer_au_poste_electrique_de_Bondy.jpg` (Transformers.tsx)
  - `Toroidal_inductor.jpg` (Transformers.tsx — possibly missing)
  - `Ringing_on_unterminated_transmission_line.jpg` (Transients.tsx)
  - `Eye_diagram_of_a_4-level_signal.png` (TransmissionLines.tsx)
- [ ] Add component-level tests (only math utils tested so far)
- [ ] Add page-level integration tests
- [ ] Generate PWA icons (pwa-192x192.png, pwa-512x512.png)

## Test Status
- 52/52 tests passing (transmissionMath edge cases)
- Build: clean (no TypeScript errors)
- Lint: clean (no new errors introduced)
