import { useEffect } from 'react';
import { MathWrapper } from '../common/MathWrapper';
import { PredictionGate } from '../common/PredictionGate';
import { SectionHook } from '../common/SectionHook';
import { ModuleNavigation } from '../common/ModuleNavigation';
import { useProgressStore } from '../../store/progressStore';
import { LadderAnimation } from '../simulations/LadderAnimation';

/**
 * Section 2 page: Lumped to Distributed.
 *
 * Covers the LC ladder network, its progressive subdivision into a continuous
 * transmission line, and the derivation of the telegrapher's equations from
 * Kirchhoff's laws applied to an infinitesimal segment.
 */
export function LumpedDistributed() {
  const markVisited = useProgressStore((s) => s.markVisited);
  useEffect(() => { markVisited('lumped-distributed'); }, [markVisited]);

  return (
    <div className="space-y-10">
      {/* ── Page header ────────────────────────────────────────────── */}
      <div>
        <p className="text-sm font-medium text-engineering-blue-600 dark:text-engineering-blue-400 mb-1">
          Section 2
        </p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          From Lumped Circuits to Distributed Systems
        </h1>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
          Every transmission line can be understood as the limiting case of an LC ladder network.
          This section shows how ordinary circuit elements, when subdivided to the infinitesimal
          limit, naturally produce wave equations.
        </p>
      </div>

      {/* ── 2.1 — The ladder network ──────────────────────────────── */}
      <section className="space-y-5">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          2.1 &mdash; The Ladder Network
        </h2>

        <SectionHook
          text="A coaxial cable, a PCB trace over a ground plane, even a pair of wires strung across
                a room — they all have distributed inductance and capacitance along their length.
                The ladder model lets us build intuition for how voltage and current propagate
                through such structures."
        />

        <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed space-y-4">
          <p>
            Start with the simplest possible model: a single series inductor{' '}
            <MathWrapper formula="L" /> followed by a shunt capacitor{' '}
            <MathWrapper formula="C" /> to ground. This is one LC section. If you
            apply a voltage step at the input, current flows through{' '}
            <MathWrapper formula="L" />, charges up <MathWrapper formula="C" />,
            and a delayed version of the input eventually appears at the output.
          </p>

          <p>
            Now split that single section into <em>two</em> sections, each with half the
            inductance and half the capacitance:
          </p>

          <MathWrapper
            formula="L_1 = L_2 = \frac{L_{\text{total}}}{2}, \qquad C_1 = C_2 = \frac{C_{\text{total}}}{2}"
            block
          />

          <p>
            The total inductance and capacitance are unchanged, but the signal now
            passes through two smaller LC stages. Repeat the subdivision:
            two becomes four, four becomes eight, eight becomes sixteen.
          </p>

          <MathWrapper
            formula="L_n = \frac{L_{\text{total}}}{N}, \qquad C_n = \frac{C_{\text{total}}}{N}"
            block
          />

          <p>
            At each stage, the individual components shrink, but the overall ladder
            stores the same total energy and presents the same impedance to the source.
            Something remarkable happens in the limit{' '}
            <MathWrapper formula="N \to \infty" />: the discrete ladder becomes a
            <strong> continuous transmission line</strong>.
          </p>

          <p className="font-semibold text-slate-800 dark:text-slate-200">
            Does the wave speed change as we subdivide?
          </p>

          <p>
            The wave speed on the ladder is determined by the per-unit-length inductance{' '}
            <MathWrapper formula="L' = L_{\text{total}} / \ell" /> and per-unit-length
            capacitance <MathWrapper formula="C' = C_{\text{total}} / \ell" />, where{' '}
            <MathWrapper formula="\ell" /> is the physical length:
          </p>

          <MathWrapper
            formula="v = \frac{1}{\sqrt{L' \cdot C'}}"
            block
          />

          <p>
            Subdividing increases <MathWrapper formula="N" /> but does not change{' '}
            <MathWrapper formula="L'" /> or <MathWrapper formula="C'" />.
            The wave speed is therefore <strong>independent of the number of sections</strong>.
          </p>
        </div>
      </section>

      {/* ── 2.2 — The ladder animation ────────────────────────────── */}
      <section className="space-y-5">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          2.2 &mdash; The Ladder Animation
        </h2>

        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Before watching the animation, make a prediction. This will help you pay
          attention to the right quantity as the ladder subdivides.
        </p>

        <PredictionGate
          question="If we split the LC ladder into 10x more sections (same total L and C), does the wave speed increase, decrease, or stay the same?"
          options={[
            { id: 'increases', label: 'Increases' },
            { id: 'decreases', label: 'Decreases' },
            { id: 'same', label: 'Stays the same' },
          ]}
          getCorrectAnswer={() => 'same'}
          explanation={
            <p>
              The wave speed{' '}
              <MathWrapper formula="v = 1/\sqrt{L' C'}" /> depends on the{' '}
              <em>per-unit-length</em> values <MathWrapper formula="L'" /> and{' '}
              <MathWrapper formula="C'" />. When you subdivide, the per-unit-length
              values stay the same because both total{' '}
              <MathWrapper formula="L" /> and total <MathWrapper formula="C" />{' '}
              are unchanged for the same physical length. More sections means
              smaller components, but the product{' '}
              <MathWrapper formula="L' \cdot C'" /> is invariant.
            </p>
          }
        >
          <div className="mt-6">
            <LadderAnimation />
          </div>
        </PredictionGate>
      </section>

      {/* ── 2.3 — Telegrapher's equations ─────────────────────────── */}
      <section className="space-y-5">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          2.3 &mdash; Telegrapher&rsquo;s Equations (Derivation Sketch)
        </h2>

        <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed space-y-4">
          <p>
            Take one infinitesimal segment of the ladder&mdash;a tiny length{' '}
            <MathWrapper formula="\Delta x" /> containing series inductance{' '}
            <MathWrapper formula="L' \Delta x" /> and shunt capacitance{' '}
            <MathWrapper formula="C' \Delta x" />. Apply Kirchhoff&rsquo;s voltage
            law (KVL) around the loop and Kirchhoff&rsquo;s current law (KCL) at
            the node.
          </p>

          <p>
            <strong>KVL</strong> gives the voltage drop across the series inductor:
          </p>

          <MathWrapper
            formula="\frac{\partial V}{\partial x} = -L' \frac{\partial I}{\partial t}"
            block
          />

          <p>
            <strong>KCL</strong> gives the current diverted through the shunt capacitor:
          </p>

          <MathWrapper
            formula="\frac{\partial I}{\partial x} = -C' \frac{\partial V}{\partial t}"
            block
          />

          <p>
            These are the <strong>telegrapher&rsquo;s equations</strong>. Taking{' '}
            <MathWrapper formula="\partial / \partial x" /> of the first and
            substituting the second yields the wave equation:
          </p>

          <MathWrapper
            formula="\frac{\partial^2 V}{\partial x^2} = L' C' \frac{\partial^2 V}{\partial t^2}"
            block
          />

          <p>
            The general solution is a superposition of forward and backward
            travelling waves:
          </p>

          <MathWrapper
            formula="V(x,t) = V^{+} f\!\left(t - \frac{x}{v}\right) + V^{-} g\!\left(t + \frac{x}{v}\right)"
            block
          />

          <p>
            where <MathWrapper formula="v = 1/\sqrt{L' C'}" /> is the propagation
            speed&mdash;the same quantity we saw remain constant during subdivision.
          </p>
        </div>

        {/* Callout box */}
        <div className="rounded-lg border-l-4 border-engineering-blue-500 bg-engineering-blue-50 dark:bg-engineering-blue-900/15 px-5 py-4">
          <p className="text-xs font-bold text-engineering-blue-700 dark:text-engineering-blue-400 uppercase tracking-wide mb-2">
            Key Insight
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            These are <strong>Kirchhoff&rsquo;s laws</strong>. Applied to an
            infinitesimal segment. The wave equation emerges from circuit analysis
            you already know.
          </p>
        </div>
      </section>

      {/* ── Module navigation ─────────────────────────────────────── */}
      <ModuleNavigation />
    </div>
  );
}
