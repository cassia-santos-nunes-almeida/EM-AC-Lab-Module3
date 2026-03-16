import { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { MathWrapper } from '@/components/common/MathWrapper';
import { PredictionGate } from '@/components/common/PredictionGate';
import { ConceptCheck } from '@/components/common/ConceptCheck';
import { YourTurnPanel } from '@/components/common/YourTurnPanel';
import { ModuleNavigation } from '@/components/common/ModuleNavigation';
import { SectionHook } from '@/components/common/SectionHook';
import { useProgressStore } from '@/store/progressStore';
import { CoupledCoilsSim } from '@/components/simulations/CoupledCoilsSim';

/**
 * Section 1 page component: Transformers.
 *
 * Covers coupling coefficient, dot convention, ideal transformer analysis,
 * and an interactive coupled-coils simulation.
 */
export function Transformers() {
  const markVisited = useProgressStore((s) => s.markVisited);
  useEffect(() => { markVisited('transformers'); }, [markVisited]);

  return (
    <div className="space-y-10">
      {/* Page header */}
      <div>
        <p className="text-xs font-semibold text-engineering-blue-600 dark:text-engineering-blue-400 uppercase tracking-widest mb-1">
          Section 1
        </p>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Transformers &amp; Coupled Coils
        </h1>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
          Before we study waves on transmission lines, we need to understand what happens when
          two inductors share magnetic flux. That relationship — mutual inductance — is the
          foundation of every transformer and, ultimately, of distributed-parameter models.
        </p>
      </div>

      <SectionHook text="Every phone charger, laptop adapter, and power substation depends on transformers. Understanding how energy couples magnetically from one coil to another is the first step toward understanding how signals propagate along transmission lines." />

      {/* ────────────────────────────────────────────────────────── */}
      {/* 1.1 Coupling Coefficient & Dot Convention                */}
      {/* ────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          1.1 &mdash; Coupling Coefficient &amp; Dot Convention
        </h2>

        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          Imagine holding two coils side by side. When current flows through the first coil, it
          creates a magnetic field. Some of those field lines pass through the second coil —
          and by Faraday's law (Module 1), that changing flux induces a voltage. Move the coils
          closer together, and more flux links — the induced voltage increases. Pull them apart,
          and it decreases. Wrap them on the same iron core, and nearly all the flux links.
        </p>

        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          The <strong>coupling coefficient</strong> <MathWrapper formula="k" /> quantifies
          what fraction of one coil's flux links the other:
        </p>

        <MathWrapper
          formula="k = \frac{M}{\sqrt{L_1 L_2}}, \qquad 0 \le k \le 1"
          block
        />

        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <MathWrapper formula="k = 0" /> means no shared flux (completely decoupled);{' '}
          <MathWrapper formula="k = 1" /> means every flux line produced by one coil passes
          through the other (perfect coupling). In practice, iron-core power transformers
          achieve <MathWrapper formula="k \approx 0.95{-}0.99" />, while air-core RF
          transformers may have <MathWrapper formula="k \approx 0.1{-}0.5" />.
        </p>

        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mt-6">
          Dot Convention
        </h3>

        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          The <strong>dot convention</strong> tells us the relative polarity of the mutual
          voltage. If current enters the dotted terminal of one coil, the mutual voltage is
          positive at the dotted terminal of the other coil (aiding flux). If current enters
          the undotted terminal, the mutual voltage polarity reverses (opposing flux).
        </p>

        <div className="grid gap-6 sm:grid-cols-2 mt-4">
          {/* Aiding flux diagram */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
            <p className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide mb-3">
              Aiding Flux (Same Dot Terminals)
            </p>
            <svg viewBox="0 0 260 120" className="w-full h-auto" aria-label="Aiding flux dot convention diagram">
              {/* Primary coil */}
              <rect x="20" y="30" width="60" height="60" rx="4" fill="none" stroke="currentColor" className="text-slate-400 dark:text-slate-500" strokeWidth="1.5" />
              <text x="50" y="65" textAnchor="middle" className="text-slate-700 dark:text-slate-300 fill-current" fontSize="12" fontFamily="ui-sans-serif, system-ui">L&#x2081;</text>
              {/* Primary dot */}
              <circle cx="30" cy="30" r="4" className="fill-amber-500" />
              {/* Current arrow into dot */}
              <line x1="30" y1="10" x2="30" y2="26" stroke="currentColor" className="text-engineering-blue-600 dark:text-engineering-blue-400" strokeWidth="2" markerEnd="url(#arrowAid)" />
              <text x="38" y="18" className="text-engineering-blue-600 dark:text-engineering-blue-400 fill-current" fontSize="10" fontFamily="ui-sans-serif, system-ui">i&#x2081;</text>

              {/* Secondary coil */}
              <rect x="160" y="30" width="60" height="60" rx="4" fill="none" stroke="currentColor" className="text-slate-400 dark:text-slate-500" strokeWidth="1.5" />
              <text x="190" y="65" textAnchor="middle" className="text-slate-700 dark:text-slate-300 fill-current" fontSize="12" fontFamily="ui-sans-serif, system-ui">L&#x2082;</text>
              {/* Secondary dot */}
              <circle cx="170" cy="30" r="4" className="fill-amber-500" />
              {/* Positive voltage marker */}
              <text x="170" y="18" className="text-green-600 dark:text-green-400 fill-current" fontSize="11" fontWeight="bold" fontFamily="ui-sans-serif, system-ui">+</text>
              <text x="170" y="104" className="text-green-600 dark:text-green-400 fill-current" fontSize="11" fontWeight="bold" fontFamily="ui-sans-serif, system-ui">&minus;</text>

              {/* Mutual coupling lines */}
              <path d="M85 45 Q120 35 155 45" fill="none" stroke="currentColor" className="text-amber-500" strokeWidth="1.5" strokeDasharray="4 3" />
              <path d="M85 75 Q120 85 155 75" fill="none" stroke="currentColor" className="text-amber-500" strokeWidth="1.5" strokeDasharray="4 3" />
              <text x="120" y="62" textAnchor="middle" className="text-amber-600 dark:text-amber-400 fill-current" fontSize="10" fontFamily="ui-sans-serif, system-ui">M</text>

              <defs>
                <marker id="arrowAid" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                  <path d="M0,0 L8,3 L0,6 Z" className="fill-engineering-blue-600 dark:fill-engineering-blue-400" />
                </marker>
              </defs>
            </svg>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Current enters the dotted terminal of L&#x2081;. The induced voltage is positive at the
              dotted terminal of L&#x2082;.
            </p>
          </div>

          {/* Opposing flux diagram */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-3">
              Opposing Flux (Opposite Terminals)
            </p>
            <svg viewBox="0 0 260 120" className="w-full h-auto" aria-label="Opposing flux dot convention diagram">
              {/* Primary coil */}
              <rect x="20" y="30" width="60" height="60" rx="4" fill="none" stroke="currentColor" className="text-slate-400 dark:text-slate-500" strokeWidth="1.5" />
              <text x="50" y="65" textAnchor="middle" className="text-slate-700 dark:text-slate-300 fill-current" fontSize="12" fontFamily="ui-sans-serif, system-ui">L&#x2081;</text>
              {/* Primary dot at top */}
              <circle cx="30" cy="30" r="4" className="fill-amber-500" />
              {/* Current arrow into undotted terminal (bottom) */}
              <line x1="30" y1="110" x2="30" y2="94" stroke="currentColor" className="text-engineering-blue-600 dark:text-engineering-blue-400" strokeWidth="2" markerEnd="url(#arrowOpp)" />
              <text x="38" y="108" className="text-engineering-blue-600 dark:text-engineering-blue-400 fill-current" fontSize="10" fontFamily="ui-sans-serif, system-ui">i&#x2081;</text>

              {/* Secondary coil */}
              <rect x="160" y="30" width="60" height="60" rx="4" fill="none" stroke="currentColor" className="text-slate-400 dark:text-slate-500" strokeWidth="1.5" />
              <text x="190" y="65" textAnchor="middle" className="text-slate-700 dark:text-slate-300 fill-current" fontSize="12" fontFamily="ui-sans-serif, system-ui">L&#x2082;</text>
              {/* Secondary dot at top */}
              <circle cx="170" cy="30" r="4" className="fill-amber-500" />
              {/* Negative voltage at dot (opposing) */}
              <text x="170" y="18" className="text-amber-600 dark:text-amber-400 fill-current" fontSize="11" fontWeight="bold" fontFamily="ui-sans-serif, system-ui">&minus;</text>
              <text x="170" y="104" className="text-amber-600 dark:text-amber-400 fill-current" fontSize="11" fontWeight="bold" fontFamily="ui-sans-serif, system-ui">+</text>

              {/* Mutual coupling lines (crossed) */}
              <path d="M85 45 Q120 55 155 45" fill="none" stroke="currentColor" className="text-red-400 dark:text-red-500" strokeWidth="1.5" strokeDasharray="4 3" />
              <path d="M85 75 Q120 65 155 75" fill="none" stroke="currentColor" className="text-red-400 dark:text-red-500" strokeWidth="1.5" strokeDasharray="4 3" />
              <text x="120" y="62" textAnchor="middle" className="text-red-500 dark:text-red-400 fill-current" fontSize="10" fontFamily="ui-sans-serif, system-ui">&minus;M</text>

              <defs>
                <marker id="arrowOpp" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                  <path d="M0,0 L8,3 L0,6 Z" className="fill-engineering-blue-600 dark:fill-engineering-blue-400" />
                </marker>
              </defs>
            </svg>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Current enters the <em>undotted</em> terminal of L&#x2081;. The induced voltage is
              negative at the dotted terminal of L&#x2082; (flux opposes).
            </p>
          </div>
        </div>

        <ConceptCheck
          data={{
            mode: 'multiple-choice',
            question: 'Current enters the undotted terminal of the primary coil. What is the polarity of the induced voltage at the dotted terminal of the secondary?',
            options: [
              { text: 'Positive (aiding flux)', correct: false, explanation: 'Aiding flux occurs when current enters the dotted terminal. Here it enters the undotted terminal, so the flux opposes.' },
              { text: 'Negative (opposing flux)', correct: true, explanation: 'Correct. When current enters the undotted terminal, the mutual flux opposes, making the voltage negative at the secondary dot.' },
              { text: 'Zero — polarity depends only on k', correct: false, explanation: 'The coupling coefficient k determines the magnitude of mutual inductance, but the dot convention determines the sign.' },
            ],
            hints: [
              'Look at the opposing flux diagram above. Which terminal does the current enter?',
              'The dot convention rule: current into a dot creates positive voltage at the other dot. What happens when current enters the opposite terminal?',
            ],
          }}
        />
      </section>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 1.2 Ideal Transformer                                    */}
      {/* ────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          1.2 &mdash; Ideal Transformer
        </h2>

        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          An <strong>ideal transformer</strong> has perfect coupling (
          <MathWrapper formula="k = 1" />
          ), zero winding resistance, and infinite core permeability. Three key relationships
          follow directly from Faraday's law and energy conservation:
        </p>

        {/* Voltage ratio */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 space-y-2">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Voltage Ratio
          </p>
          <MathWrapper
            formula="\frac{V_2}{V_1} = \frac{N_2}{N_1}"
            block
          />
          <p className="text-xs text-slate-600 dark:text-slate-400">
            The secondary voltage scales linearly with the turns ratio.
          </p>
        </div>

        {/* Current ratio */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 space-y-2">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Current Ratio
          </p>
          <MathWrapper
            formula="\frac{I_2}{I_1} = \frac{N_1}{N_2}"
            block
          />
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Current scales inversely — power in equals power out.
          </p>
        </div>

        {/* Reflected impedance */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 space-y-2">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Reflected Impedance
          </p>
          <MathWrapper
            formula="Z_{\text{reflected}} = \left(\frac{N_1}{N_2}\right)^2 Z_L"
            block
          />
          <p className="text-xs text-slate-600 dark:text-slate-400">
            The load impedance "seen" by the source is scaled by the square of the turns ratio.
          </p>
        </div>

        {/* Worked example */}
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-5 space-y-3 mt-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-engineering-blue-500" />
            Worked Example
          </h3>

          <p className="text-sm text-slate-700 dark:text-slate-300">
            A transformer has <MathWrapper formula="N_1 = 100" /> turns,{' '}
            <MathWrapper formula="N_2 = 50" /> turns, and a load{' '}
            <MathWrapper formula="Z_L = 200\,\Omega" />. The source voltage is{' '}
            <MathWrapper formula="V_1 = 120\,\text{V}" />.
          </p>

          <div className="space-y-2 pl-4 border-l-2 border-engineering-blue-300 dark:border-engineering-blue-700">
            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
              Step 1: Turns ratio
            </p>
            <MathWrapper
              formula="\frac{N_1}{N_2} = \frac{100}{50} = 2"
              block
            />

            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
              Step 2: Secondary voltage
            </p>
            <MathWrapper
              formula="V_2 = V_1 \cdot \frac{N_2}{N_1} = 120 \cdot \frac{50}{100} = 60\,\text{V}"
              block
            />

            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
              Step 3: Reflected impedance
            </p>
            <MathWrapper
              formula="Z_{\text{reflected}} = \left(\frac{N_1}{N_2}\right)^2 Z_L = (2)^2 \times 200 = 800\,\Omega"
              block
            />

            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
              Step 4: Primary current
            </p>
            <MathWrapper
              formula="I_1 = \frac{V_1}{Z_{\text{reflected}}} = \frac{120}{800} = 0.15\,\text{A}"
              block
            />

            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
              Step 5: Secondary current
            </p>
            <MathWrapper
              formula="I_2 = I_1 \cdot \frac{N_1}{N_2} = 0.15 \times 2 = 0.30\,\text{A}"
              block
            />

            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
              Verify: Power balance
            </p>
            <MathWrapper
              formula="P_1 = V_1 I_1 = 120 \times 0.15 = 18\,\text{W} = V_2 I_2 = 60 \times 0.30 = 18\,\text{W} \;\checkmark"
              block
            />
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 1.3 Coupled Coils Simulation                             */}
      {/* ────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          1.3 &mdash; Coupled Coils Simulation
        </h2>

        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          Use the simulation below to explore how the coupling coefficient, turns counts, and
          load impedance affect transformer behavior. Before you start, make a prediction:
        </p>

        <PredictionGate
          question="If k = 0.9 and you double N\u2082 while keeping N\u2081 fixed, what happens to the secondary voltage?"
          options={[
            { id: 'doubles', label: 'Doubles' },
            { id: 'halves', label: 'Halves' },
            { id: 'same', label: 'Stays the same' },
            { id: 'quadruples', label: 'Quadruples' },
          ]}
          getCorrectAnswer={() => 'doubles'}
          explanation={
            <p>
              The voltage ratio is{' '}
              <MathWrapper formula="V_2 / V_1 = N_2 / N_1" />. Doubling{' '}
              <MathWrapper formula="N_2" /> doubles the ratio, so{' '}
              <MathWrapper formula="V_2" /> doubles.
            </p>
          }
        >
          <CoupledCoilsSim className="mt-4" />
        </PredictionGate>
      </section>

      {/* ────────────────────────────────────────────────────────── */}
      {/* Your Turn                                                 */}
      {/* ────────────────────────────────────────────────────────── */}
      <YourTurnPanel
        scenario="Given N\u2081 = 100, N\u2082 = 50, Z_L = 200\u03A9. You found Z_reflected = (100/50)\u00B2 \u00D7 200 = 800\u03A9. Now change the turns ratio to N\u2081 = 200, N\u2082 = 50."
        question="How does Z_reflected change?"
        options={[
          {
            text: 'Quadruples',
            correct: true,
            explanation:
              'Z_reflected = (N\u2081/N\u2082)\u00B2 \u00D7 Z_L. The turns ratio doubled from 2:1 to 4:1, so (4)\u00B2 = 16 vs (2)\u00B2 = 4. Z_reflected quadruples to 3200\u03A9.',
          },
          {
            text: 'Doubles',
            correct: false,
            explanation:
              'The reflected impedance depends on the square of the turns ratio, not linearly.',
          },
          {
            text: 'Stays the same',
            correct: false,
            explanation:
              'Z_reflected depends on the turns ratio, which changed from 2:1 to 4:1.',
          },
          {
            text: 'Halves',
            correct: false,
            explanation:
              'The turns ratio increased, so Z_reflected increases (not decreases).',
          },
        ]}
        correctReveal={
          <div className="space-y-1">
            <MathWrapper
              formula="Z_{\text{reflected}} = \left(\frac{200}{50}\right)^2 \times 200 = 16 \times 200 = 3200\,\Omega"
              block
            />
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Compared to the original 800 &Omega;, the reflected impedance quadrupled.
            </p>
          </div>
        }
      />

      {/* ────────────────────────────────────────────────────────── */}
      {/* Bridge Callout                                            */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-engineering-blue-50 to-indigo-50 dark:from-engineering-blue-900/20 dark:to-indigo-900/20 border border-engineering-blue-200 dark:border-engineering-blue-800 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <ArrowRight className="w-5 h-5 text-engineering-blue-600 dark:text-engineering-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-engineering-blue-700 dark:text-engineering-blue-400 uppercase tracking-wide mb-1">
              Looking Ahead
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              A transformer is two coupled inductors analyzed with Kirchhoff's laws. In the next
              section, we'll apply the same Kirchhoff's laws to an infinitesimal segment of a
              conductor pair — with distributed self-inductance and self-capacitance along its
              length — and the wave equation will appear. That's the transmission line.
            </p>
          </div>
        </div>
      </div>

      <ModuleNavigation />
    </div>
  );
}
