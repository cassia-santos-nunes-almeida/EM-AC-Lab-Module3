import { useEffect } from 'react';
import { MathWrapper } from '@/components/common/MathWrapper';
import { PredictionGate } from '@/components/common/PredictionGate';
import { ConceptCheck } from '@/components/common/ConceptCheck';
import { CollapsibleSection } from '@/components/common/CollapsibleSection';
import { YourTurnPanel } from '@/components/common/YourTurnPanel';
import { SectionHook } from '@/components/common/SectionHook';
import { ModuleNavigation } from '@/components/common/ModuleNavigation';
import { FigureImage } from '@/components/common/FigureImage';
import { Tabs } from '@/components/common/Tabs';
import { useProgressStore } from '@/store/progressStore';
import { TransmissionLineSim } from '@/components/simulations/TransmissionLineSim';
import { StandingWaveQuiz } from '@/components/simulations/StandingWaveQuiz';
import { SmithChartSim } from '@/components/simulations/SmithChartSim';

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

      <Tabs tabs={[
        {
          label: 'Theory',
          content: (
            <div className="space-y-10">
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

        {/* Real-world connector and cable images */}
        <div className="grid gap-4 sm:grid-cols-2">
          <FigureImage
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Electronic_connectors._SMA%2C_SSMA%2C_U.FL.jpg/640px-Electronic_connectors._SMA%2C_SSMA%2C_U.FL.jpg"
            alt="Various RF coaxial connectors including SMA and SSMA types"
            caption="RF coaxial connectors (SMA, SSMA, U.FL): precision 50 Ω connectors designed to maintain characteristic impedance through the connection point."
            attribution="Megapixie, CC BY-SA 4.0 — Wikimedia Commons"
            sourceUrl="https://commons.wikimedia.org/wiki/File:Electronic_connectors._SMA,_SSMA,_U.FL.jpg"
          />
          <FigureImage
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/RG-59.jpg/640px-RG-59.jpg"
            alt="Cross-section of RG-59 75-ohm coaxial cable showing inner conductor and braided shield"
            caption="RG-59 coaxial cable (75 Ω): used for television and video. Compare its dimensions to a 50 Ω cable — the different Z₀ comes from the ratio of conductor diameters."
            attribution="FDominec, CC BY-SA 3.0 — Wikimedia Commons"
            sourceUrl="https://commons.wikimedia.org/wiki/File:RG-59.jpg"
          />
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

        <ConceptCheck
          data={{
            mode: 'multiple-choice',
            question: 'What \u0393 and VSWR indicate a perfectly matched load?',
            options: [
              { text: '\u0393 = 0, VSWR = 1', correct: true, explanation: 'Correct. When Z_L = Z\u2080, the reflection coefficient is zero and the standing wave ratio is 1 (no standing wave). All power is delivered to the load.' },
              { text: '\u0393 = 1, VSWR = \u221E', correct: false, explanation: 'These values correspond to a total reflection (open or short circuit), the opposite of a match.' },
              { text: '\u0393 = 0.5, VSWR = 3', correct: false, explanation: 'A non-zero \u0393 means there are reflections. A perfect match requires \u0393 = 0.' },
            ],
            hints: [
              'A "matched" load means Z_L = Z\u2080. Substitute into the \u0393 formula.',
            ],
          }}
        />
      </section>
            </div>
          ),
        },
        {
          label: 'Simulations',
          content: (
            <div className="space-y-10">
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

        <FigureImage
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Network_Analyzer_Agilent_8714ET.jpg/640px-Network_Analyzer_Agilent_8714ET.jpg"
          alt="Agilent vector network analyzer displaying S-parameter measurements on a Smith chart"
          caption="A Vector Network Analyzer (VNA) measuring impedance and displaying results on a Smith chart. This is the primary instrument for characterizing transmission line and antenna impedance in the lab."
          attribution="Binarysequence, CC BY-SA 4.0 — Wikimedia Commons"
          sourceUrl="https://commons.wikimedia.org/wiki/File:Network_Analyzer_Agilent_8714ET.jpg"
          className="sm:max-w-md"
        />

        <p className="text-sm text-slate-600 dark:text-slate-400">
          The Smith chart is a graphical tool that maps every possible complex impedance onto a circle.
          The center represents a matched load (&Gamma; = 0), the left edge is a short circuit (&Gamma; = &minus;1),
          and the right edge is an open circuit (&Gamma; = +1). Constant-resistance circles and constant-reactance
          arcs form the grid. Click anywhere on the chart to place an impedance point.
        </p>
        <SmithChartSim />

        <CollapsibleSection title="Matching Network Design" variant="inline">
          <div className="space-y-3 py-2">
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              When <MathWrapper formula="Z_L \neq Z_0" />, a matching network can be inserted to
              eliminate reflections. On the Smith chart, matching means transforming the load
              impedance to the center of the chart (<MathWrapper formula="\Gamma = 0" />).
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              Common techniques include <strong>quarter-wave transformers</strong> (a{' '}
              <MathWrapper formula="\lambda/4" /> section with{' '}
              <MathWrapper formula="Z_T = \sqrt{Z_0 Z_L}" />) and <strong>stub matching</strong>{' '}
              (adding a short- or open-circuited transmission line stub at the right point to cancel
              the reactive part of the impedance).
            </p>
          </div>
        </CollapsibleSection>

        <ConceptCheck
          data={{
            mode: 'multiple-choice',
            question: 'On the Smith chart, where is the short circuit located?',
            options: [
              { text: 'At the leftmost point (\u0393 = \u22121)', correct: true, explanation: 'Correct. A short circuit has Z_L = 0, giving \u0393 = (0 \u2212 Z\u2080)/(0 + Z\u2080) = \u22121. This maps to the far left of the Smith chart on the real axis.' },
              { text: 'At the center (\u0393 = 0)', correct: false, explanation: 'The center is the matched point (Z_L = Z\u2080). A short circuit is at the edge of the chart.' },
              { text: 'At the rightmost point (\u0393 = +1)', correct: false, explanation: 'The rightmost point is the open circuit (Z_L = \u221E, \u0393 = +1). The short circuit is at the opposite side.' },
            ],
            hints: [
              'Calculate \u0393 for Z_L = 0 and find where that maps on the chart.',
            ],
          }}
        />

        <YourTurnPanel
          scenario="Given Z_L = 75 + j50 \u03A9 and Z\u2080 = 50 \u03A9, calculate the reflection coefficient and VSWR, then locate the point on the Smith chart above."
          question="What is the VSWR for this load?"
          options={[
            {
              text: 'VSWR \u2248 2.0',
              correct: false,
              explanation: 'Close, but not quite. Calculate |\u0393| first from the complex Z_L and Z\u2080.',
            },
            {
              text: 'VSWR \u2248 2.6',
              correct: true,
              explanation: 'Correct! \u0393 = (75 + j50 \u2212 50)/(75 + j50 + 50) = (25 + j50)/(125 + j50). |\u0393| \u2248 0.45, so VSWR = (1 + 0.45)/(1 \u2212 0.45) \u2248 2.6.',
            },
            {
              text: 'VSWR \u2248 1.5',
              correct: false,
              explanation: 'That would correspond to |\u0393| \u2248 0.2. The reactive component j50 \u03A9 increases the mismatch significantly.',
            },
          ]}
          correctReveal={
            <div className="space-y-2">
              <MathWrapper
                formula="\Gamma = \frac{75 + j50 - 50}{75 + j50 + 50} = \frac{25 + j50}{125 + j50}"
                block
              />
              <MathWrapper
                formula="|\Gamma| = \frac{\sqrt{25^2 + 50^2}}{\sqrt{125^2 + 50^2}} = \frac{55.9}{134.6} \approx 0.415"
                block
              />
              <MathWrapper
                formula="\text{VSWR} = \frac{1 + 0.415}{1 - 0.415} \approx 2.42"
                block
              />
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Try clicking on the Smith chart above at the normalized impedance z = 1.5 + j1.0 to verify.
              </p>
            </div>
          }
          hints={['Normalize: z_L = Z_L/Z\u2080 = 1.5 + j1.0. Then \u0393 = (z_L \u2212 1)/(z_L + 1).']}
        />
      </section>
            </div>
          ),
        },
        {
          label: 'Practice',
          content: (
            <div className="space-y-10">
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
            </div>
          ),
        },
      ]} />

      <ModuleNavigation />
    </div>
  );
}
