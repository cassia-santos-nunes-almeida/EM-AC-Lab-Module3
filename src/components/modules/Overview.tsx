import { useEffect } from 'react';
import { Cable, Radio, Activity, Layers, Magnet, BookOpen, Target, GraduationCap } from 'lucide-react';
import { ModuleNavigation } from '@/components/common/ModuleNavigation';
import { FigureImage } from '@/components/common/FigureImage';
import { useProgressStore } from '@/store/progressStore';

export function Overview() {
  const markVisited = useProgressStore((s) => s.markVisited);
  useEffect(() => { markVisited('overview'); }, [markVisited]);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="bg-gradient-to-br from-engineering-blue-600 to-engineering-blue-800 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Cable className="w-7 h-7" />
          </div>
          <div>
            <p className="text-engineering-blue-200 text-sm font-medium">Module 3</p>
            <h1 className="text-3xl font-bold">Transmission Lines & Antennas</h1>
          </div>
        </div>
        <p className="text-engineering-blue-100 leading-relaxed max-w-3xl">
          In Module 2 you analyzed circuits assuming components are point-like and wires are ideal.
          That works — until signal wavelengths become comparable to physical dimensions. A 1 GHz
          signal has a wavelength of 30 cm. At that scale, a PCB trace is no longer "just a wire."
          This module is about what happens then — and how the same Kirchhoff laws from Module 2
          produce wave equations when applied to infinitesimally small segments.
        </p>
      </div>

      {/* Real-world context image */}
      <FigureImage
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/PCB_design_NASA.jpg/640px-PCB_design_NASA.jpg"
        alt="High-frequency printed circuit board with impedance-controlled traces and ground planes"
        caption="At GHz frequencies, PCB traces behave as transmission lines. Controlled-impedance routing (visible as precise trace widths and spacing) prevents signal reflections."
        attribution="NASA, Public Domain — Wikimedia Commons"
        sourceUrl="https://commons.wikimedia.org/wiki/File:PCB_design_NASA.jpg"
      />

      {/* Learning Outcomes */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-engineering-blue-600 dark:text-engineering-blue-400" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Learning Outcomes</h2>
        </div>
        <ul className="space-y-3">
          {[
            'Explain current changes in DC circuits with inductance and define mutual inductance.',
            'Model and analyze transmission lines using distributed parameters and core theoretical concepts.',
            'Identify essential methods for analyzing and describing transmission networks.',
            'Explain and compute transient phenomena in electrical circuits.',
            'Determine voltage or current changes, such as after step-voltage inputs to circuits.',
            'Discuss antenna functions and their applications.',
          ].map((outcome, i) => (
            <li key={i} className="flex items-start gap-3">
              <GraduationCap className="w-4 h-4 text-engineering-blue-500 shrink-0 mt-0.5" />
              <span className="text-sm text-slate-700 dark:text-slate-300">{outcome}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* RF test equipment context */}
      <FigureImage
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Optoelectronics_lab.jpg/640px-Optoelectronics_lab.jpg"
        alt="Electronics laboratory bench with oscilloscope, signal generator, and test equipment"
        caption="An electronics lab bench equipped with test instruments for measuring transmission line parameters — the tools engineers use to verify impedance matching, standing wave ratios, and signal integrity."
        attribution="Berserkerus, CC BY-SA 3.0 — Wikimedia Commons"
        sourceUrl="https://commons.wikimedia.org/wiki/File:Optoelectronics_lab.jpg"
      />

      {/* Section Overview */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-engineering-blue-600 dark:text-engineering-blue-400" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">What You'll Explore</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Magnet,
              title: 'Section 1: Transformers',
              desc: 'Mutual inductance, coupling coefficient, dot convention, and ideal transformer analysis.',
              path: '/transformers',
            },
            {
              icon: Layers,
              title: 'Section 2: Lumped to Distributed',
              desc: 'Watch an LC ladder network become a transmission line — the most important visualization in this module.',
              path: '/lumped-distributed',
            },
            {
              icon: Cable,
              title: 'Section 3: Transmission Lines',
              desc: 'Characteristic impedance, reflection coefficient, standing waves, and the core transmission line simulation.',
              path: '/transmission-lines',
            },
            {
              icon: Activity,
              title: 'Section 4: Transients',
              desc: 'Step response, bounce diagrams, and how signals settle on a transmission line.',
              path: '/transients',
            },
            {
              icon: Radio,
              title: 'Section 5: Antennas',
              desc: 'From transmission line to antenna — radiation patterns, directivity, and practical antenna types.',
              path: '/antennas',
            },
          ].map((section) => (
            <a
              key={section.path}
              href={section.path}
              className="group block p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-engineering-blue-300 dark:hover:border-engineering-blue-600 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <section.icon className="w-5 h-5 text-engineering-blue-600 dark:text-engineering-blue-400" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-engineering-blue-600 dark:group-hover:text-engineering-blue-400 transition-colors">
                  {section.title}
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{section.desc}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Reference Textbooks */}
      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-5">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Reference Textbooks</h3>
        <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
          <li>Ulaby, <em>Fundamentals of Applied Electromagnetics</em> — transmission lines, antennas, wave propagation</li>
          <li>Ida, <em>Engineering Electromagnetics</em> — field theory, distributed models</li>
          <li>Nilsson & Riedel, <em>Electric Circuits</em> — mutual inductance, transformers, circuit transients</li>
        </ul>
      </div>

      <ModuleNavigation />
    </div>
  );
}
