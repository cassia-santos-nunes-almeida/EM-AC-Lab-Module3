# EM&AC Lab — Module 3: Transmission Lines & Antennas

Part of the three-module EM&AC Lab course: M1 (EM Fundamentals) → M2 (Circuit Analysis) → **M3 (Transmission Lines & Antennas)**.

## Build & Dev

```bash
npm run dev          # Start dev server (Vite)
npm run build        # TypeScript check + production build
npm run lint         # ESLint (incl. jsx-a11y accessibility)
npm test             # Vitest test suite (52 tests)
npm run preview      # Preview production build locally
```

## Architecture

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| Styling | Tailwind CSS v4 (PostCSS) |
| State | Zustand (persisted to localStorage) |
| Routing | react-router-dom v7 (lazy-loaded pages) |
| Icons | lucide-react |
| Math | KaTeX via `MathWrapper` component |
| AI Tutor | Google Gemini API (client-side) |
| PWA | vite-plugin-pwa |
| Testing | Vitest |

## Key Directories

```
src/
├── components/
│   ├── common/        — Reusable: MathWrapper, ConceptCheck, PredictionGate, CollapsibleSection, Tabs, AiTutor, etc.
│   ├── layout/        — Layout shell, Sidebar, ErrorBoundary
│   ├── modules/       — Page-level components (6 pages, lazy-loaded)
│   └── simulations/   — Canvas simulations: SmithChartSim, CoupledCoilsSim, TransmissionLineSim, BounceDiagram, RadiationPatternSim, LadderAnimation, StandingWaveQuiz
├── constants/
│   └── modules.ts     — Cross-module URLs (reads VITE_MODULE*_URL env vars)
├── hooks/
│   └── useOnlineStatus.ts
├── store/
│   └── progressStore.ts — useThemeStore (persisted to `emac-theme`) + useProgressStore (persisted to `emac-m3-progress`)
├── types/
│   └── transmission.ts — Shared TypeScript interfaces for transmission line types
└── utils/
    ├── cn.ts              — clsx + tailwind-merge
    ├── transmissionMath.ts — All physics calculations (coupled coils, transmission lines, antennas, Smith chart)
    └── __tests__/
        └── transmissionMath.test.ts — 52 edge-case tests
```

## Conventions

- **Class merging**: Always use `cn()` from `src/utils/cn` for Tailwind classes
- **Dark mode**: Class-based (`.dark` on `<html>`). Uses `useThemeStore` persisted to `emac-theme` (shared key across all three modules). Every component MUST have `dark:` variants
- **Canvas simulations**: Use `requestAnimationFrame` in `useEffect` with cleanup via `cancelAnimationFrame`. Read state from refs (not closures) to satisfy React 19 `react-hooks/refs` rules
- **Math rendering**: Use `<MathWrapper formula="..." />` — never raw HTML or custom parsers
- **Icons**: Import from `lucide-react`
- **Components**: TypeScript + proper interfaces for all props
- **State**: Zustand store for cross-component state; local useState for component-internal state
- **Cross-module URLs**: Import from `src/constants/modules.ts`

## Physics Modules

| Route | Component | Simulations | Key Features |
|---|---|---|---|
| `/` | Overview | — | Course intro, learning objectives |
| `/transformers` | Transformers | CoupledCoilsSim | Animated coils, k/N1/N2/ZL sliders, dual V2 readouts, flux leakage warning |
| `/lumped-distributed` | LumpedDistributed | LadderAnimation | Lumped → distributed transition |
| `/transmission-lines` | TransmissionLines | TransmissionLineSim, SmithChartSim, StandingWaveQuiz | Z0, Γ, VSWR, interactive Smith chart with click-to-place |
| `/transients` | Transients | BounceDiagram | Multi-bounce transient analysis, steady-state convergence |
| `/antennas` | Antennas | RadiationPatternSim | Polar/Cartesian dipole patterns, directivity, HPBW |

## Key Math Functions (transmissionMath.ts)

**Coupled Coils:** `calculateMutualInductance`, `calculateSecondaryVoltage`, `calculateActualSecondaryVoltage`, `calculateSecondaryCurrent`, `calculateReflectedImpedance`

**Transmission Lines:** `calculateCharacteristicImpedance`, `calculateReflectionCoefficient`, `calculateVSWR`, `calculateWaveSpeed`, `calculatePropagationDelay`, `calculateWavelength`

**Bounce Diagrams:** `calculateBounceVoltages`, `calculateSteadyStateVoltage`

**Antennas:** `calculateRadiationPattern`, `calculateDirectivity`, `calculateRadiationResistance`, `calculateHPBW`

**Smith Chart:** `calculateComplexReflectionCoefficient`

## Cross-Module Integration

- **Dark mode**: Shared `emac-theme` localStorage key — toggling in any module affects all three
- **Navigation**: `src/constants/modules.ts` provides URLs to M1 and M2
- **Content bridges**: Coupled coils ← M2 transformer theory; EM waves ← M1 wave propagation; Impedance analysis ← M2 Laplace transforms

## Context Files

- `context/current-sprint.md` — Current work progress
- `context/decisions.md` — Architecture decisions log
- `context/known-issues.md` — Known bugs and tech debt

## Do Not Touch

- `src/utils/transmissionMath.ts` — Core physics engine, requires careful review and testing (52 tests) before any modification
