# Architecture Decisions

Chronological log of key decisions. Newest at top.

---

### 2026-03-15 — React 19 canvas pattern: useEffect + stateRef
**Decision**: For canvas simulations, use `useEffect` animation loops that read state from a `stateRef` (updated via a separate `useEffect`), rather than `useCallback` with direct state captures.
**Reason**: React 19's `react-hooks/refs` rule forbids writing to refs during render. The `react-compiler` rule requires memoization patterns that self-referencing `useCallback` (where `render` calls `requestAnimationFrame(render)`) cannot satisfy. The stateRef pattern separates state synchronization from rendering.

### 2026-03-15 — Dual V2 readouts in CoupledCoilsSim
**Decision**: Show both "V₂ (ideal, k=1)" and "V₂ (actual)" readouts, with amber warning when k < 0.9.
**Reason**: The ideal transformer equation V₂ = V₁·N₂/N₁ assumes perfect coupling (k=1). Showing only the ideal value when k < 1 is physically misleading. The dual readout teaches students that flux leakage reduces the actual secondary voltage by a factor of k.

### 2026-03-15 — Interactive Smith chart with click-to-place
**Decision**: Implement a full interactive Smith chart (SmithChartSim) with constant-r circles, constant-x arcs, VSWR circle, and click-to-place impedance.
**Reason**: The Smith chart is the most important graphical tool in RF/microwave engineering. An interactive version where students can click to place impedance points and see Γ, VSWR, and normalized impedance in real time provides deeper understanding than static diagrams.

### 2026-03-15 — Complex reflection coefficient in transmissionMath
**Decision**: Add `calculateComplexReflectionCoefficient(ZLr, ZLi, Z0)` returning `{real, imag, magnitude, phaseDeg}`.
**Reason**: The scalar `calculateReflectionCoefficient` only handles real loads. The Smith chart requires complex Γ for arbitrary impedances ZL = R + jX. Edge case: when both ZL and Z0 are zero, return magnitude 1 (total reflection).

### 2026-03-15 — Shared emac-theme localStorage key
**Decision**: Use `emac-theme` as the localStorage key for dark mode across all three modules.
**Reason**: Students may have multiple module tabs open. A shared theme key means toggling dark mode in any module immediately affects the others on next render, providing a consistent experience.

### 2026-03-15 — Progress store with section-level tracking
**Decision**: Create `useProgressStore` persisted to `emac-m3-progress` with section visits, prediction gates, concept checks, and hint usage.
**Reason**: Matches the pattern established in M1 and M2. Section-level tracking (rather than page-level) provides finer-grained progress information.

### 2026-03-15 — Cross-module URL environment variables
**Decision**: Define `VITE_MODULE1_URL`, `VITE_MODULE2_URL`, `VITE_MODULE3_URL` in `.env` files, read via `src/constants/modules.ts`.
**Reason**: Hardcoded URLs break when deploying to different environments (localhost, GitHub Pages, Vercel). Environment variables allow each deployment to configure its own module URLs.

---

### Initial — React 19 + Vite + Tailwind v4
**Decision**: Same stack as M1 and M2 for consistency.
**Reason**: Students experience a unified interface across all three modules.

### Initial — transmissionMath.ts as single math module
**Decision**: All physics calculations in one file rather than split by topic.
**Reason**: The functions are tightly related (e.g., reflection coefficient feeds into VSWR, which feeds into Smith chart). A single file with clear section comments is easier to navigate than multiple small files.

### Initial — Canvas simulations in separate /simulations directory
**Decision**: Separate `src/components/simulations/` from `src/components/modules/`.
**Reason**: Simulations are complex canvas components (200-500 lines each) that would bloat the module pages. Separating them keeps module files focused on layout and pedagogy while simulations handle rendering.
