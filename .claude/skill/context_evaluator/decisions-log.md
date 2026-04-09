# Decisions Log — EM-AC-Lab-Module3

Chronological log of key decisions. Newest at top.

---

### 2026-04-09 — Onboarded to my-claude-skills system
**Decision:** Adopted centralized skill system with context-evaluator v2.0.0 + handover. Migrated from `../CLAUDE.md` references to self-contained project structure.
**Reason:** Enables session lifecycle management, cross-project pattern sync, and Notion handovers. Makes the module independent (no parent directory references).

### 2026-03-15 — React 19 canvas pattern: useEffect + stateRef
**Decision:** For canvas simulations, use `useEffect` animation loops that read state from a `stateRef` (updated via a separate `useEffect`), rather than `useCallback` with direct state captures.
**Reason:** React 19's `react-hooks/refs` rule forbids writing to refs during render. The `react-compiler` rule requires memoization patterns that self-referencing `useCallback` cannot satisfy.

### 2026-03-15 — Dual V2 readouts in CoupledCoilsSim
**Decision:** Show both "V2 (ideal, k=1)" and "V2 (actual)" readouts, with amber warning when k < 0.9.
**Reason:** The ideal transformer equation assumes perfect coupling (k=1). Showing only the ideal value when k < 1 is physically misleading.

### 2026-03-15 — Interactive Smith chart with click-to-place
**Decision:** Implement full interactive Smith chart with constant-r circles, constant-x arcs, VSWR circle, and click-to-place impedance.
**Reason:** The Smith chart is the most important graphical tool in RF/microwave engineering. Interactive exploration provides deeper understanding than static diagrams.

### 2026-03-15 — Complex reflection coefficient in transmissionMath
**Decision:** Add `calculateComplexReflectionCoefficient(ZLr, ZLi, Z0)` returning `{real, imag, magnitude, phaseDeg}`.
**Reason:** The scalar version only handles real loads. The Smith chart requires complex Gamma for arbitrary impedances. Edge case: when both ZL and Z0 are zero, return magnitude 1.

### 2026-03-15 — Shared emac-theme localStorage key
**Decision:** Use `emac-theme` as the localStorage key for dark mode across all three modules.
**Reason:** Students may have multiple module tabs open. Shared key provides consistent experience.

### 2026-03-15 — Progress store with section-level tracking
**Decision:** Create `useProgressStore` persisted to `emac-m3-progress` with section visits, prediction gates, concept checks, and hint usage.
**Reason:** Matches M1/M2 pattern. Section-level tracking provides finer-grained progress information.

### 2026-03-15 — Cross-module URL environment variables
**Decision:** Define `VITE_MODULE1_URL`, `VITE_MODULE2_URL`, `VITE_MODULE3_URL` in `.env` files, read via `src/constants/modules.ts`.
**Reason:** Hardcoded URLs break when deploying to different environments.

### Initial — React 19 + Vite + Tailwind v4
**Decision:** Same stack as M1 and M2 for consistency.

### Initial — transmissionMath.ts as single math module
**Decision:** All physics calculations in one file rather than split by topic.
**Reason:** Functions are tightly related (reflection coefficient feeds VSWR, feeds Smith chart).

### Initial — Canvas simulations in separate /simulations directory
**Decision:** Separate `src/components/simulations/` from `src/components/modules/`.
**Reason:** Simulations are complex canvas components (200-500 lines) that would bloat module pages.
