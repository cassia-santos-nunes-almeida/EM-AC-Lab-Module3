# Context — EM-AC-Lab-Module3

## What This Is

Interactive web application for Module 3 (Transmission Lines & Antennas) of the EM&AC Lab course (BL30A0350) at LUT University. Students explore transmission line theory, transient analysis, Smith charts, and antenna radiation patterns through interactive simulations.

Part of a three-module series: M1 (EM Fundamentals) → M2 (Circuit Analysis) → **M3 (Transmission Lines & Antennas)**.

## Tech Stack

- **Framework:** React 19 + TypeScript + Vite 7
- **Styling:** Tailwind CSS v4 (CSS-only config) + clsx/tailwind-merge
- **State:** Zustand 5 (persisted stores for theme + progress)
- **Math rendering:** KaTeX
- **Charts:** Recharts
- **AI Tutor:** Google Gemini (`@google/generative-ai`)
- **Icons:** Lucide React
- **Routing:** React Router DOM (lazy-loaded routes)
- **PWA:** vite-plugin-pwa (offline detection)
- **Analytics:** Vercel Analytics
- **Testing:** Vitest + Testing Library (81 tests)
- **Linting:** ESLint with jsx-a11y accessibility plugin
- **Deployment:** Vercel

## Architecture

```
src/
├── components/
│   ├── common/        — Reusable: MathWrapper, ConceptCheck, PredictionGate, CollapsibleSection, Tabs, AiTutor
│   ├── layout/        — Layout shell, Sidebar, ErrorBoundary
│   ├── modules/       — 6 page-level components (lazy-loaded)
│   └── simulations/   — Canvas simulations (7 interactive sims)
├── constants/modules.ts — Cross-module URLs (VITE_MODULE*_URL env vars)
├── hooks/useOnlineStatus.ts
├── store/progressStore.ts — useThemeStore + useProgressStore
├── types/transmission.ts
└── utils/
    ├── cn.ts              — clsx + tailwind-merge
    └── transmissionMath.ts — All physics calculations (single file, 52 tests)
```

## Simulations

| Simulation | Page | What It Does |
|---|---|---|
| CoupledCoilsSim | /transformers | Animated coils, k/N1/N2/ZL sliders, dual V2 readouts, flux leakage warning |
| LadderAnimation | /lumped-distributed | Lumped-to-distributed transition visualization |
| TransmissionLineSim | /transmission-lines | Z0, reflection coefficient, VSWR visualization |
| SmithChartSim | /transmission-lines | Interactive Smith chart with click-to-place impedance |
| StandingWaveQuiz | /transmission-lines | Standing wave pattern quiz |
| BounceDiagram | /transients | Multi-bounce transient analysis, steady-state convergence |
| RadiationPatternSim | /antennas | Polar/Cartesian dipole patterns, directivity, HPBW |

## Key Math Functions (transmissionMath.ts)

- **Coupled Coils:** calculateMutualInductance, calculateSecondaryVoltage, calculateActualSecondaryVoltage, calculateSecondaryCurrent, calculateReflectedImpedance
- **Transmission Lines:** calculateCharacteristicImpedance, calculateReflectionCoefficient, calculateVSWR, calculateWaveSpeed, calculatePropagationDelay, calculateWavelength
- **Bounce Diagrams:** calculateBounceVoltages, calculateSteadyStateVoltage
- **Antennas:** calculateRadiationPattern, calculateDirectivity, calculateRadiationResistance, calculateHPBW
- **Smith Chart:** calculateComplexReflectionCoefficient

## Content Bridges

- **Coupled coils** ← M2 transformer theory
- **EM waves** ← M1 wave propagation, Faraday/Maxwell
- **Impedance analysis** ← M2 Laplace transforms
- **Phasors** ← M1 phasor concepts

## Key Constraints

- `transmissionMath.ts` is the core physics engine — requires careful review and testing (52 tests) before any modification
- Canvas simulations use the `useEffect + stateRef` pattern (React 19 compatibility — see decisions.md)
- Shared `emac-theme` localStorage key across all 3 modules
- Cross-module URLs come from environment variables, not hardcoded

## Never Suggest

- Splitting `transmissionMath.ts` into multiple files — functions are tightly coupled
- Removing dual V2 readouts in CoupledCoilsSim — pedagogically important
- Hardcoding module URLs — must use VITE_MODULE*_URL env vars
- Changing the `emac-theme` localStorage key — shared across M1/M2/M3

## Last Updated

2026-04-09
