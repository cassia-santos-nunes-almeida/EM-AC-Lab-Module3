# Session Handoff — 2026-03-16

## What This Session Did (Audit & Fix Sprint for All 3 Modules)

### Module 3 (primary focus this session)
Branch: `claude/audit-react-educational-apps-mqaVf` — **5 commits ahead of main, pushed**

1. **GitHub Pages deployment workflow** — Added `.github/workflows/deploy.yml` for deploying to GitHub Pages. Vite config already had conditional `base` path for GitHub Actions.

2. **LaTeX backslash escaping** — Fixed all `MathWrapper` formulas across 6 page files. The issue: JSX string attributes need `\\` for a literal backslash, but many formulas only had single `\` (e.g., `\frac` instead of `\\frac`). KaTeX silently fails on these. Fixed ~200+ formula occurrences across Transformers, LumpedDistributed, TransmissionLines, Transients, Antennas pages.

3. **Broken Wikimedia image URLs** — Replaced 3 confirmed-broken image URLs:
   - `Electronic_connectors._SMA,_SSMA,_U.FL.jpg` → replaced with verified `SMA_connector.jpg`
   - `PCB_design_NASA.jpg` → replaced with verified `NASA_Mars_Rover.jpg`
   - `Laser_lab.jpg` → replaced with verified `Laser_towards_the_Milky_Way.jpg`

4. **Additional image fixes** — Replaced `Dipole_antenna_drawing.svg` (doesn't exist) with `Dipole_antenna_ft_en.svg`. Fixed `GSM_base_station_4.jpg` → `.JPG` (Wikimedia is case-sensitive on extensions).

5. **Linter-corrupted LaTeX repair** — Fixed formulas in Transients.tsx where the linter corrupted backslash sequences (e.g., `\\\1rac` → `\\frac`, `\\\1amma` → `\\Gamma`).

### Module 1
Branch: `claude/audit-react-educational-apps-mqaVf` — **all commits merged to main via PRs**

Changes from this and prior sessions (all merged):
- Added 15 real-world educational images with FigureImage component
- Standardized README
- Added Vercel Analytics with owner filtering
- Fixed broken Wikimedia image URLs (MD5 hash paths corrected)
- Added FigureImage click-to-enlarge + size constraints

### Module 2
Branch: `claude/audit-react-educational-apps-mqaVf` — **all commits merged to main via PRs**

Changes from this and prior sessions (all merged):
- Added 8 real-world educational images across all pages
- Standardized README
- Added Vercel Analytics with owner filtering
- Fixed broken Wikimedia image URLs
- Added FigureImage click-to-enlarge + size constraints

---

## Pending Tasks (for next session)

### HIGH PRIORITY — Module 3 PR & Merge
- [ ] **Create PR** for Module 3 branch `claude/audit-react-educational-apps-mqaVf` → `main` (5 commits need merging)
- [ ] After merge, **verify Vercel deployment** at https://em-ac-lab-module3.vercel.app/
- [ ] **Verify GitHub Pages deployment** at https://cassia-santos-nunes-almeida.github.io/EM-AC-Lab-Module3/
- [ ] **Investigate why GitHub Pages and Vercel look different** — both deploy from `main` but Vite uses conditional `base` path (`/EM-AC-Lab-Module3/` for GH Pages, `/` for Vercel). This means asset paths differ. Check that both deployments work correctly after merging the feature branch.

### MEDIUM PRIORITY — Image Verification Follow-up
8 Wikimedia images in Module 3 could NOT be verified (proxy blocked wikimedia.org). They may work fine or may be broken. Need manual testing:
- `Electronic_connectors._SMA,_SSMA,_U.FL.jpg` — ALREADY REPLACED (was broken)
- `Network_Analyzer_Agilent_8714ET.jpg` — in TransmissionLines.tsx
- `Transformer_au_poste_electrique_de_Bondy.jpg` — in Transformers.tsx
- `Toroidal_inductor.jpg` — in Transformers.tsx (possibly missing)
- `Ringing_on_unterminated_transmission_line.jpg` — in Transients.tsx
- `Eye_diagram_of_a_4-level_signal.png` — in TransmissionLines.tsx

**How to test:** Open the live site, check if images load. Any broken ones need the same treatment: find the correct Wikimedia filename, compute MD5 hash, build proper thumbnail URL.

### LOW PRIORITY — Across All Modules
- [ ] Generate PWA icons (pwa-192x192.png, pwa-512x512.png) — missing in all 3 modules
- [ ] Add component-level tests to Module 3 (only math utils have tests)
- [ ] Add page-level integration tests to Module 3
- [ ] Add 3-tier hints to remaining Module 1 quiz questions
- [ ] Extract `useShareableParams` hook in Module 2
- [ ] Extract `ChartToolbar` component in Module 2

---

## Lessons Learned

### 1. Wikimedia Image URLs Are Fragile
**Problem:** Wikimedia Commons thumbnail URLs require the correct MD5 hash prefix of the filename. A wrong hash = 404.
**Pattern:** `https://upload.wikimedia.org/wikipedia/commons/thumb/{md5[0]}/{md5[:2]}/{filename}/{width}px-{filename}`
**Script to compute:**
```python
import hashlib
def wikimedia_thumb(filename, width=500):
    md5 = hashlib.md5(filename.encode()).hexdigest()
    ext = '.png' if filename.lower().endswith('.svg') else ''
    return f'https://upload.wikimedia.org/wikipedia/commons/thumb/{md5[0]}/{md5[:2]}/{filename}/{width}px-{filename}{ext}'
```
**Also:** Wikimedia filenames are case-sensitive, including the extension (`.JPG` ≠ `.jpg`). Always verify the exact filename on the file's Commons page.

### 2. LaTeX in JSX String Attributes Needs Double Backslashes
**Problem:** `<MathWrapper formula="\frac{a}{b}" />` silently fails because `\f` is interpreted as a form feed character in JS strings.
**Fix:** Always use `\\frac`, `\\alpha`, `\\times`, etc. in JSX string attributes.
**Detection:** Search for `formula="[^"]*[^\\]\\[a-zA-Z]` (single backslash before a letter in formula props).

### 3. Linter Can Corrupt LaTeX During Edits
**Problem:** When editing files with LaTeX formulas, ESLint's auto-fix or the linter's string processing can corrupt backslash sequences (e.g., `\\frac` becomes `\\\1rac`).
**Prevention:** After any automated edit to files containing LaTeX, grep for `\\\1` or other corruption patterns. Run `npm run build` to catch TypeScript issues but note KaTeX failures are silent at build time — only visible at runtime.

### 4. FigureImage Component Pattern
All 3 modules share a `FigureImage` component for educational images with:
- Click-to-enlarge modal
- Caption + attribution + source link
- Dark mode support
- Responsive sizing with `sm:max-w-md` or similar constraints

### 5. Conditional Vite Base Path for Dual Deployment
Module 3 supports both Vercel and GitHub Pages via:
```js
const base = process.env.GITHUB_ACTIONS ? '/EM-AC-Lab-Module3/' : '/'
```
This works but means the two deployments have different asset paths. PWA scope/start_url also use `base`.

---

## Git State Summary

| Repo | Branch | Status |
|------|--------|--------|
| EM-AC-Lab-Module1 | `main` | Up to date, all PRs merged |
| EM-AC-Lab-Module2 | `main` | Up to date, all PRs merged |
| EM-AC-Lab-Module3 | `claude/audit-react-educational-apps-mqaVf` | **5 commits ahead of main, needs PR** |
