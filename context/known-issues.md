# Known Issues & Tech Debt

Active bugs, limitations, and technical debt. Remove items when resolved.

---

## Architecture

1. **API key in localStorage** — Gemini API key stored in plain text. Acceptable for student tool, not for broader deployment.

2. **~~No component-level tests~~** ✅ (2026-03-16) — 81 tests total: `transmissionMath.ts` (52), ConceptCheck (11), CollapsibleSection (5), Tabs (5), page smoke tests (6), plus useChartExport hook (2). Canvas simulations still lack test coverage.

## Physics Simplifications

3. **Iron permeability linearized** — μᵣ = 5000 is a typical linearized value. Real iron is nonlinear (μᵣ ~ 100–10,000 depending on flux density). A note is shown in the UI.

4. **Ideal transformer model for I₂ and Z_ref** — CoupledCoilsSim uses ideal transformer equations for secondary current and reflected impedance even when k < 1. Only V₂ accounts for k. A note explains this in the UI.

5. **Half-wave dipole approximation** — Radiation resistance uses numerical integration that gives ≈73Ω (textbook value). For antenna lengths far from λ/2, the sinusoidal current distribution assumption becomes less accurate.

## UI/UX

6. **PWA icons missing** — Manifest references `pwa-192x192.png` and `pwa-512x512.png` but these don't exist in `/public/`.

7. **Pre-existing lint warnings** — Some files have pre-existing ESLint warnings from the initial build (unused variables, missing deps). Not introduced by audit work.

## Images — Unverified Wikimedia URLs

8. **5 images could not be verified** — Proxy environment blocked direct Wikimedia access during verification (2026-03-16). These may load fine or may be 404s. Need manual testing on the live site:
   - `Network_Analyzer_Agilent_8714ET.jpg` — in TransmissionLines.tsx, hash `f/f0/`
   - `Transformer_au_poste_electrique_de_Bondy.jpg` — in Transformers.tsx, hash `c/c1/`
   - `Toroidal_inductor.jpg` — in Transformers.tsx, hash `9/95/` (possibly missing)
   - `Ringing_on_unterminated_transmission_line.jpg` — in Transients.tsx, hash `f/f2/`
   - `Eye_diagram_of_a_4-level_signal.png` — in TransmissionLines.tsx, hash `2/21/`

   **Fix pattern if broken:** Use `python3 -c "import hashlib; print(hashlib.md5(b'Exact_Filename.ext').hexdigest())"` to get correct hash, then rebuild URL as `commons/thumb/{h[0]}/{h[:2]}/{filename}/{width}px-{filename}`.

## Deployment

9. **GitHub Pages vs Vercel may differ** — `vite.config.ts` uses `process.env.GITHUB_ACTIONS ? '/EM-AC-Lab-Module3/' : '/'`. This means GitHub Pages and Vercel have different asset paths. Both should work but PWA caching may behave differently.

10. **Feature branch not yet merged** — Branch `claude/audit-react-educational-apps-mqaVf` has 5 commits (LaTeX fixes, image fixes, GH Pages workflow) not yet in `main`. Create PR and merge to update live deployments.

## Resolved Issues

### ~~Broken Wikimedia image URLs~~ (2026-03-16)
- 3 images confirmed broken: SMA connectors, PCB NASA, Laser lab. Replaced with verified alternatives.
- `Dipole_antenna_drawing.svg` didn't exist. Replaced with `Dipole_antenna_ft_en.svg`.
- `GSM_base_station_4.jpg` had wrong extension case. Fixed to `.JPG`.

### ~~LaTeX formulas not rendering~~ (2026-03-16)
- ~200+ formulas across 6 pages had single backslashes in JSX string attributes (e.g., `\frac` instead of `\\frac`). KaTeX silently failed. All fixed.

### ~~Linter-corrupted LaTeX~~ (2026-03-16)
- Transients.tsx had formulas corrupted by linter (`\\\1rac`, `\\\1amma`). Fixed to proper `\\frac`, `\\Gamma`.

### ~~SmithChartSim React 19 lint errors~~ (2026-03-15)
- Self-referencing `useCallback` and ref writes during render. Fixed with module-scope helpers + `useEffect` + `stateRef`.

### ~~CoupledCoilsSim V2 ignoring k~~ (2026-03-15)
- Secondary voltage only showed ideal V₂. Fixed with `calculateActualSecondaryVoltage` and dual readouts.

### ~~Empty ResizeObservers~~ (2026-03-15)
- Removed from CoupledCoilsSim and TransmissionLineSim.
