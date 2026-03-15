# Project Reference — EM&AC Lab: Module 3

Detailed technical reference. For quick context, see `CLAUDE.md` instead.
For shared conventions, see `COURSE_GUIDELINES.md`.

---

## Stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Framework | React | 19.2.x | Functional components |
| Language | TypeScript | ~5.9.3 | Strict mode |
| Build tool | Vite | 7.3.x | `@vitejs/plugin-react`, `@` path alias |
| Styling | Tailwind CSS | 4.1.x | PostCSS plugin, `cn()` utility |
| Routing | React Router DOM | 7.x | BrowserRouter, lazy-loaded pages |
| Math | KaTeX | 0.16.x | Custom `MathWrapper` component |
| Icons | Lucide React | latest | Tree-shakeable SVG |
| AI | Google Generative AI SDK | latest | Gemini, API key in localStorage |
| State | Zustand | 5.x | `useThemeStore` + `useProgressStore` |
| PWA | vite-plugin-pwa | 1.0 | skipWaiting, cleanupOutdatedCaches |
| Testing | Vitest | 3.x | 52 tests, jsdom |
| Analytics | @vercel/analytics | latest | Auto page view tracking |

---

## Pages (5 content pages + 1 overview)

| Route | Page | Simulations |
|-------|------|-------------|
| `/` | Overview | — |
| `/transformers` | Transformers | CoupledCoilsSim |
| `/lumped-distributed` | LumpedDistributed | LadderAnimation |
| `/transmission-lines` | TransmissionLines | TransmissionLineSim, SmithChartSim, StandingWaveQuiz |
| `/transients` | Transients | BounceDiagram |
| `/antennas` | Antennas | RadiationPatternSim |

---

## Key Math Functions (transmissionMath.ts)

| Category | Functions |
|----------|-----------|
| Coupled Coils | `calculateMutualInductance`, `calculateSecondaryVoltage`, `calculateActualSecondaryVoltage`, `calculateSecondaryCurrent`, `calculateReflectedImpedance` |
| Transmission Lines | `calculateCharacteristicImpedance`, `calculateReflectionCoefficient`, `calculateVSWR`, `calculateWaveSpeed`, `calculatePropagationDelay`, `calculateWavelength` |
| Bounce Diagrams | `calculateBounceVoltages`, `calculateSteadyStateVoltage` |
| Antennas | `calculateRadiationPattern`, `calculateDirectivity`, `calculateRadiationResistance`, `calculateHPBW` |
| Smith Chart | `calculateComplexReflectionCoefficient` |

---

## Content Bridges to Other Modules

- **Coupled coils** ← M2 transformer theory
- **EM waves** ← M1 wave propagation, Faraday/Maxwell
- **Impedance analysis** ← M2 Laplace transforms
- **Phasors** ← M1 phasor concepts
