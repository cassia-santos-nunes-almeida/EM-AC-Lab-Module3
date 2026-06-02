# PATTERNS — EM-AC-Lab-Module3

Accumulated corrections and hard rules for this project.
Every entry is a hard constraint, not a suggestion.

Cross-project rules are in `.claude/skill/context_evaluator/shared-patterns.md` —
when a rule here conflicts with shared-patterns, the project-specific rule wins.

---

## Physics (P-PHYS)

*No entries yet. Patterns will be captured as corrections arise during sessions.*

## UI/UX (P-UI)

### P-UI-01 — Guided-challenge steps must reference real, reachable controls
**Pattern:** Draft GuidedChallenge instructions referenced controls that did not
exist or could not be reached — e.g. a step assumed N₁ = 200 when the slider maxes
at 100 (Transformers), and a "drive it unstable" step used Γₗ = Γₛ = 0.95, which
never satisfies the exact Γₗ·Γₛ = 1 condition the label checks (Transients).
**Rule:** Before inlining a GuidedChallenge, inventory the target sim's actual
affordances (slider ranges, toggles, tabs, readouts) and confirm every instruction
maps to a control that exists AND a value it can actually reach. If a sim lives in
a "Simulations" tab, step 1 must say to open it.
**Scope:** All `GuidedChallenge` capstones across the 5 sections.
**First seen:** 2026-05 cross-module review (fixes in commit `f830994`).

### P-UI-02 — Active-recall components must expose store-wired progress callbacks
**Pattern:** `progressStore` defined `incrementConceptChecks` / `incrementHints` /
`markPredictionGate`, but ConceptCheck/PredictionGate accepted no callbacks and no
call site invoked the actions, so `emac-m3-progress` counters stayed at zero
forever (write-defined, never written).
**Rule:** When a component records learner activity that a counter tracks, it must
expose the callback (ConceptCheck `onComplete`/`onHint`, PredictionGate
`onPredict`) AND every call site must wire it to the store with the section id
(parity with M2). Add a test asserting the counter moves.
**Scope:** `ConceptCheck`, `PredictionGate`, the 5 module call sites, `progressStore`.
**First seen:** 2026-06-01 review follow-up (commit `ecb20c6`).

### P-UI-03 — Continuous rAF loops read params from a ref, not the dependency array
**Pattern:** A canvas sim's render `useCallback` listed every slider value in its deps,
so each slider change recreated `render` and tore down / restarted the
`requestAnimationFrame` loop (the loop already re-arms every frame via a `renderRef`).
**Rule:** For a CONTINUOUS rAF loop, hold the slider/derived values in a `paramsRef`
synced by a separate `useEffect(..., [those values])`, read `paramsRef.current` inside
render, and keep render's deps to the stable memoised draw helpers (or empty). The loop
is then created once and still picks up new params every frame. Verify in a browser that
sliders still drive the canvas (P-TEST-01).
**Scope:** `CoupledCoilsSim`, `TransmissionLineSim` (and any future continuous-loop sim).
**First seen:** 2026-06-01 review follow-up (commit `ecc66e0`).

## Build (P-BUILD)

*No entries yet.*

---

## Template for New Entries

```markdown
### P-[CATEGORY]-[NN] — [Short descriptive title]
**Pattern:** What kept happening — describe concretely.
**Rule:** The concrete fix. Imperative, unambiguous.
**Scope:** Which simulation(s) or context(s).
**First seen:** Session date or task name.
```

To add a new entry:
1. Pick the correct category (PHYS, UI, BUILD) or create a new one.
2. Use the next available number in that category.
3. Fill in all four fields. Be concrete — avoid vague language.
4. Never renumber existing entries. If an entry is retired, mark it `[RETIRED]`.
