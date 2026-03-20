# EM&AC Lab — Module 3: Transmission Lines & Antennas

> **Global rules:** see `../CLAUDE.md`. **Recurring corrections:** see `../PATTERNS.md`. **Session state:** see `../SESSION.md`.

Part of the three-module EM&AC Lab course: M1 (EM Fundamentals) → M2 (Circuit Analysis) → **M3 (Transmission Lines & Antennas)**.

## Build & Dev

```bash
npm run dev          # Start dev server (Vite)
npm run build        # TypeScript check + production build
npm run lint         # ESLint (incl. jsx-a11y accessibility)
npm test             # Vitest test suite (81 tests)
npm run preview      # Preview production build locally
```

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

## Content Bridges

- **Coupled coils** ← M2 transformer theory
- **EM waves** ← M1 wave propagation, Faraday/Maxwell
- **Impedance analysis** ← M2 Laplace transforms
- **Phasors** ← M1 phasor concepts

## Reference

- `context/decisions.md` — Architecture decisions log (7 ADRs)

## Do Not Touch

- `src/utils/transmissionMath.ts` — Core physics engine, requires careful review and testing (52 tests) before any modification
