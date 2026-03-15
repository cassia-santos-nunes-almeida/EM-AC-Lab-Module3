# Known Issues & Tech Debt

Active bugs, limitations, and technical debt. Remove items when resolved.

---

## Architecture

1. **API key in localStorage** — Gemini API key stored in plain text. Acceptable for student tool, not for broader deployment.

2. **No component-level tests** — Only `transmissionMath.ts` has tests (52 tests). Canvas simulations and React components have no test coverage.

## Physics Simplifications

3. **Iron permeability linearized** — μᵣ = 5000 is a typical linearized value. Real iron is nonlinear (μᵣ ~ 100–10,000 depending on flux density). A note is shown in the UI.

4. **Ideal transformer model for I₂ and Z_ref** — CoupledCoilsSim uses ideal transformer equations for secondary current and reflected impedance even when k < 1. Only V₂ accounts for k. A note explains this in the UI.

5. **Half-wave dipole approximation** — Radiation resistance uses numerical integration that gives ≈73Ω (textbook value). For antenna lengths far from λ/2, the sinusoidal current distribution assumption becomes less accurate.

## UI/UX

6. **PWA icons missing** — Manifest references `pwa-192x192.png` and `pwa-512x512.png` but these don't exist in `/public/`.

7. **Pre-existing lint warnings** — Some files have pre-existing ESLint warnings from the initial build (unused variables, missing deps). Not introduced by audit work.

## Resolved Issues

### ~~SmithChartSim React 19 lint errors~~ (2026-03-15)
- Self-referencing `useCallback` and ref writes during render violated `react-hooks/immutability` and `react-hooks/refs`. Fixed by extracting pure helpers to module scope and using `useEffect` + `stateRef` pattern.

### ~~CoupledCoilsSim V2 ignoring k~~ (2026-03-15)
- Secondary voltage only showed ideal V₂ = V₁·N₂/N₁ regardless of coupling. Fixed by adding `calculateActualSecondaryVoltage` and dual readouts.

### ~~Empty ResizeObservers~~ (2026-03-15)
- CoupledCoilsSim and TransmissionLineSim had useEffect blocks with empty ResizeObserver callbacks. Removed since the rAF render loop already handles canvas sizing.
