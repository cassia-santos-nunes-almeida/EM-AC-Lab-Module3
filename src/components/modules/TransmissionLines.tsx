import { useEffect } from 'react';
import { MathWrapper } from '../common/MathWrapper';
import { PredictionGate } from '../common/PredictionGate';
import { ConceptCheck } from '../common/ConceptCheck';
import { CollapsibleSection } from '../common/CollapsibleSection';
import { SectionHook } from '../common/SectionHook';
import { ModuleNavigation } from '../common/ModuleNavigation';
import { useProgressStore } from '../../store/progressStore';
import { TransmissionLineSim } from '../simulations/TransmissionLineSim';
import { StandingWaveQuiz } from '../simulations/StandingWaveQuiz';
import { SmithChartSim } from '../simulations/SmithChartSim';

/**
 * Section 3 page: Transmission Lines.
 *
 * Covers characteristic impedance, reflection coefficient, an interactive
 * transmission line simulation gated behind prediction questions, and a
 * standing wave identification quiz.
 */
export function TransmissionLines() {
  const markVisited = useProgressStore((s) => s.markVisited);
  useEffect(() => { markVisited('transmission-lines'); }, [markVisited]);

  return (
    <div className="space-y-10">
      {/* Page header */}
      <div>
        <p className="text-xs font-semibold text-engineering-blue-600 dark:text-engineering-blue-400 uppercase tracking-widest mb-1">
          Section 3
        </p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Transmission Lines
        </h1>
      </div>

      <SectionHook text="Every high-speed digital bus, every RF cable, and every PCB trace longer than a few centimetres behaves as a transmission line. Understanding impedance matching and reflections is the difference between a clean signal and a corrupted one." />

      {/* ================================================================
          3.1 — Characteristic impedance
          ================================================================ */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          3.1 &mdash; Characteristic Impedance
        </h2>

        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          When a wave travels down a transmission line, the ratio of voltage to current is
          fixed by the line&rsquo;s geometry &mdash; not by the source or load. That ratio is
          the <strong>characteristic impedance</strong> <MathWrapper formula="Z_0" />.
        </p>

        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          For a <strong>lossless</strong> line, it depends only on the per-unit-length
          inductance and capacitance:
        </p>

        <MathWrapper block formula="Z_0 = \\sqrt{\\frac{L'}{C'}}" />

        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          This is a real number, independent of frequency, line length, or what is connected
          at either end. It is a property of the line&rsquo;s cross-section and dielectric.
        </p>

        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
            Typical Values
          </p>
          <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
            <li>
              <strong>50 &Omega;</strong> &mdash; standard coaxial cable (RF, instrumentation)
            </li>
            <li>
              <strong>75 &Omega;</strong> &mdash; television / video coax (RG-6)
            </li>
            <li>
              <strong>100 &Omega;</strong> &mdash; differential pair (Ethernet, USB)
            </li>
          </ul>
        </div>

        <CollapsibleSection title="General case: lossy line" variant="inline">
          <div className="space-y-3 py-2">
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              When the line has series resistance <MathWrapper formula="R'" /> and shunt
              conductance <MathWrapper formula="G'" /> per unit length, the characteristic
              impedance becomes complex and frequency-dependent:
            </p>
            <MathWrapper
              block
              formula="Z_0 = \\sqrt{\\frac{R' + j\\omega L'}{G' + j\\omega C'}}"
            />
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              At high frequencies where <MathWrapper formula="\\omega L' \\gg R'" /> and{' '}
              <MathWrapper formula="\\omega C' \\gg G'" />, the lossy formula reduces to the
              lossless case above.
            </p>
          </div>
        </CollapsibleSection>
      </section>

      {/* ================================================================
          3.2 — Reflection coefficient
          ================================================================ */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          3.2 &mdash; Reflection Coefficient
        </h2>

        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          When a wave travelling along a line of impedance{' '}
          <MathWrapper formula="Z_0" /> encounters a load{' '}
          <MathWrapper formula="Z_L" />, part of the wave is reflected. The voltage
          reflection coefficient is:
        </p>

        <MathWrapper
          block
          formula="\\Gamma = \\frac{Z_L - Z_0}{Z_L + Z_0}"
        />

        <div className="space-y-3">
          {/* Open circuit */}
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <strong>Open circuit</strong> (<MathWrapper formula="Z_L = \\infty" />
              ): <MathWrapper formula="\\Gamma = +1" />. The reflected wave has the same
              amplitude and sign as the incident wave. Voltage doubles at the open end; current
              is zero.
            </p>
          </div>

          {/* Short circuit */}
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <strong>Short circuit</strong> (<MathWrapper formula="Z_L = 0" />
              ): <MathWrapper formula="\\Gamma = -1" />. The reflected wave inverts. Voltage
              is zero at the short; current doubles.
            </p>
          </div>

          {/* Matched */}
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <strong>Matched load</strong> (<MathWrapper formula="Z_L = Z_0" />
              ): <MathWrapper formula="\\Gamma = 0" />. No reflection at all. All power is
              delivered to the load. This is the ideal condition in most RF systems.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================
          3.3 — Transmission line simulation (gated)
          ================================================================ */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          3.3 &mdash; Transmission Line Simulation
        </h2>

        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          Before exploring the simulation, make two predictions about what you expect
          to see.
        </p>

        {/* Prediction Gate 1 */}
        <PredictionGate
          question="The load impedance equals Z\u2080. What do you expect the reflected wave to look like?"
          options={[
            { id: 'same-amplitude', label: 'Same amplitude' },
            { id: 'half-amplitude', label: 'Half amplitude' },
            { id: 'no-reflection', label: 'No reflection' },
            { id: 'double-amplitude', label: 'Double amplitude' },
          ]}
          getCorrectAnswer={() => 'no-reflection'}
          explanation={
            <span>
              When <MathWrapper formula="Z_L = Z_0" />, the reflection coefficient{' '}
              <MathWrapper formula="\Gamma = 0" />. All power is absorbed by the matched
              load &mdash; no reflection.
            </span>
          }
        >
          {/* Prediction Gate 2 */}
          <PredictionGate
            question="The line is open-circuited (Z\u2097 = \u221E). Predict the voltage at the load end."
            options={[
              { id: 'zero', label: 'Zero' },
              { id: 'source', label: 'Equal to source' },
              { id: 'double', label: 'Double the incident' },
              { id: 'half', label: 'Half' },
            ]}
            getCorrectAnswer={() => 'double'}
            explanation={
              <span>
                At an open circuit, <MathWrapper formula="\Gamma = +1" />. The reflected wave
                has the same amplitude and sign as the incident. Total voltage = incident +
                reflected = 2 &times; incident.
              </span>
            }
          >
            {/* Simulation */}
            <div className="space-y-6">
              <TransmissionLineSim />

              {/* "Does this make sense?" callout boxes */}
              <div className="space-y-3">
                <div className="bg-engineering-blue-50 dark:bg-engineering-blue-900/10 border-l-4 border-engineering-blue-400 dark:border-engineering-blue-600 rounded-r-lg p-4">
                  <p className="text-xs font-semibold text-engineering-blue-700 dark:text-engineering-blue-400 uppercase tracking-wide mb-1">
                    Does this make sense?
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    For a short circuit, <MathWrapper formula="\Gamma = -1" />. The voltage at
                    the load is zero. Is that consistent with what a short circuit means?
                  </p>
                </div>

                <div className="bg-engineering-blue-50 dark:bg-engineering-blue-900/10 border-l-4 border-engineering-blue-400 dark:border-engineering-blue-600 rounded-r-lg p-4">
                  <p className="text-xs font-semibold text-engineering-blue-700 dark:text-engineering-blue-400 uppercase tracking-wide mb-1">
                    Does this make sense?
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    A 50 &Omega; coaxial cable has <MathWrapper formula="Z_0 = 50\,\Omega" />{' '}
                    regardless of its length. Why does length not appear in the{' '}
                    <MathWrapper formula="Z_0" /> formula?
                  </p>
                </div>
              </div>
            </div>
          </PredictionGate>
        </PredictionGate>
      </section>

      {/* ================================================================
          3.4 — The Smith Chart
          ================================================================ */}
      <section id="smith-chart" className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="text-engineering-blue-600 dark:text-engineering-blue-400 font-mono text-sm">3.4</span>
          The Smith Chart
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          The Smith chart is a graphical tool that maps every possible complex impedance onto a circle.
          The center represents a matched load (&Gamma; = 0), the left edge is a short circuit (&Gamma; = &minus;1),
          and the right edge is an open circuit (&Gamma; = +1). Constant-resistance circles and constant-reactance
          arcs form the grid. Click anywhere on the chart to place an impedance point.
        </p>
        <SmithChartSim />
      </section>

      {/* ================================================================
          3.5 — Inverse problem: standing wave quiz
          ================================================================ */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          3.5 &mdash; Inverse Problem: Identifying Terminations
        </h2>

        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          In practice, engineers often measure the standing wave pattern on a line and work
          backwards to determine the load. Given each voltage envelope below, identify the
          termination condition.
        </p>

        <StandingWaveQuiz />

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 space-y-3">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Voltage Standing Wave Ratio (VSWR)
          </h3>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            The VSWR quantifies how much the voltage varies along the line:
          </p>
          <MathWrapper
            block
            formula="\\text{VSWR} = \\frac{1 + |\\Gamma|}{1 - |\\Gamma|}"
          />
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            A matched load gives VSWR = 1 (no standing wave). An open or short circuit gives
            VSWR = {'\u221E'}.
          </p>
        </div>

        <ConceptCheck
          data={{
            mode: 'multiple-choice',
            question: 'If VSWR = 3, what is |\u0393|?',
            options: [
              { text: '|\u0393| = 0.5', correct: true, explanation: 'Correct. Rearranging: |\u0393| = (VSWR \u2212 1)/(VSWR + 1) = (3 \u2212 1)/(3 + 1) = 0.5.' },
              { text: '|\u0393| = 0.33', correct: false, explanation: 'That would be |\u0393| = 1/VSWR. The correct formula is |\u0393| = (VSWR \u2212 1)/(VSWR + 1).' },
              { text: '|\u0393| = 3', correct: false, explanation: '|\u0393| must be between 0 and 1 for a passive load. VSWR = 3 corresponds to |\u0393| = 0.5.' },
            ],
            hints: [
              'Rearrange the VSWR formula to solve for |\u0393|: multiply both sides by (1 \u2212 |\u0393|).',
            ],
          }}
        />
      </section>

      <ModuleNavigation />
    </div>
  );
}
