# EM&AC Lab — Module 3: Transmission Lines & Antennas

Part of the three-module EM&AC Lab course: M1 (EM Fundamentals) → M2 (Circuit Analysis) → **M3 (Transmission Lines & Antennas)**.

## Operating Rules

* **Before claiming done:** run behavioural tests, not static-only. Run Vitest; for visual outputs, load the UI in a browser and check the actual rendering. State explicitly: `Tested: [X]. Not tested: [Y] because [Z].` See **P-TEST-01**.
* **Environment:** Windows UNC home via `Z:\`. Python is `python` not `python3` (**P-ENV-01**). Sub-agents are read-only on UNC — main agent performs writes (**P-ENV-05**). Always work from `Z:\`, never `\\maa1\...` (**P-ENV-09**). Short alias vs FQDN are distinct SMB caches (**P-ENV-10**).
* **Hooks:** limited PATH — no Python/Node interpreters in hook scripts (**P-ENV-06**).
* **Settings changes:** `.claude/settings.local.json` edits need session restart + Shift+Tab opt-in (**P-ENV-08**).
* Full rules: `.claude/skill/context_evaluator/shared-patterns.md`.

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

## Skills

| Skill | Purpose | Location |
|-------|---------|----------|
| context-evaluator | Session lifecycle, context loading, correction capture | `.claude/skill/context_evaluator/SKILL.md` |
| handover | Cross-chat session continuity via Notion | `.claude/skill/handover/SKILL.md` |
| refactor | Safe code refactoring with certainty levels | `.claude/skill/refactor/SKILL.md` |
| frontend-design | Educational app design guidelines | `.claude/skill/frontend-design/SKILL.md` |
| notebooklm-guide | Query textbook notebooks (Ulaby, Nilsson) for physics content | `.claude/skill/notebooklm-guide/SKILL.md` |
| academic-research | Literature search across 12+ databases (Scopus, WoS, ERIC, etc.) | `.claude/skill/academic-research/SKILL.md` |
| stop-slop | Remove AI writing patterns from prose | `.claude/skill/stop-slop/SKILL.md` |
| citation-verification | Verify academic citations and references | `.claude/skill/citation-verification/SKILL.md` |

## Reference

| Topic | File |
|-------|------|
| Architecture, tech stack, constraints, simulations | `.claude/skill/context_evaluator/context.md` |
| Current session state, pending tasks, blockers | `SESSION.md` |
| Accumulated corrections and hard constraints | `PATTERNS.md` |
| All design decisions with rationale | `.claude/skill/context_evaluator/decisions-log.md` |
| Communication and coding preferences | `.claude/skill/context_evaluator/personal-preferences.md` |
| Cross-project rules (synced from my-claude-skills) | `.claude/skill/context_evaluator/shared-patterns.md` |
| Legacy architecture decisions (original format) | `context/decisions.md` |

## Session Boundary Protocol

At **session end**, run both protocols in order:
1. **context_evaluator** — writes `SESSION.md` + `PATTERNS.md` (local project state)
2. **handover** — saves structured handover to Notion (cross-chat continuity)

At **session start**, context_evaluator loads local files automatically. Use handover **FETCH** only when resuming in a brand-new chat that lacks prior context.

## Task Decomposition

Before starting any non-trivial task, assess scope:
- If a task has 3+ deliverables, 2+ files, or 2+ skills — decompose into subtasks with dependency map before starting.
- Present the subtask list and proposed execution order before starting work.
- Report at each boundary: what was completed, what comes next, any blockers.

## Self-Verification

Before returning any output:
1. **Goal analysis** — State explicit and implicit goals.
2. **Assumption audit** — List inferences not directly stated in input.
3. **Gap identification** — What is missing, ambiguous, or likely to fall short?
4. **End-to-end self-test** — Test against all stated goals. For physics simulations: verify math against textbook, check edge cases, run tests.
5. **Pattern check** — Check `PATTERNS.md`. If output would trigger a known pattern, apply the fix automatically.

## Do Not Touch

- `src/utils/transmissionMath.ts` — Core physics engine, requires careful review and testing (52 tests) before any modification
