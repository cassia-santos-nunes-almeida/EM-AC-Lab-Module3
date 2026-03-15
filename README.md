# EM&AC Lab — Module 3: Transmission Lines & Antennas

An interactive simulation suite for transmission line theory, coupled coils, Smith chart analysis, and antenna fundamentals. Built for engineering students at LUT University. This is the third and final module in the **EM&AC Lab** three-module course.

## Course Structure

This app is part of a three-module progressive learning sequence:

| Module | Focus | Description |
|---|---|---|
| [Module 1](https://em-ac-lab-module1.vercel.app/) | Electromagnetic Fundamentals | Maxwell's equations, field laws, EM waves, magnetic circuits |
| [Module 2](https://em-ac-lab-module.vercel.app/) | Circuit Analysis | Component physics, time/s-domain analysis, Laplace transforms |
| **Module 3 (this app)** | Transmission Lines & Antennas | Coupled coils, transmission line theory, Smith chart, antennas |

**Module 2 → Module 3:** Laplace transforms, impedance concepts, and transformer theory from Module 2 provide the foundation for coupled coils and transmission line impedance analysis here. **Module 1 → Module 3:** EM wave propagation and phasor concepts from Module 1 connect directly to standing waves and antenna radiation patterns.

## Modules

| Route | Module | Description |
|---|---|---|
| `/` | **Overview** | Course introduction, learning objectives, guided learning path |
| `/transformers` | **Transformers & Coupled Coils** | Interactive coupled coils simulation with adjustable k, N1, N2, ZL — dual V2 readouts (ideal vs actual) |
| `/lumped-distributed` | **Lumped vs Distributed** | Ladder animation showing transition from lumped to distributed circuit models |
| `/transmission-lines` | **Transmission Lines** | Characteristic impedance, reflection coefficient, VSWR, interactive Smith chart |
| `/transients` | **Transients & Bounce Diagrams** | Bounce diagram simulation for step-input transient analysis on transmission lines |
| `/antennas` | **Antennas** | Radiation pattern simulation, directivity, radiation resistance, HPBW for dipole antennas |

## Features

- **6 Interactive Simulations** — HTML5 Canvas animations with real-time parameter control
- **Interactive Smith Chart** — Click-to-place impedance, VSWR circles, constant-r/x contours, matching network calculator
- **Coupled Coils Simulator** — Animated magnetic field lines, dual V2 readouts with flux leakage warning
- **Bounce Diagram** — Multi-bounce transient voltage visualization with steady-state convergence
- **Radiation Pattern Viewer** — Polar and Cartesian dipole radiation patterns with adjustable antenna length
- **"Think it Through" Socratic Tutor** — AI chat (Google Gemini) that guides via questions
- **PredictionGate** — Students predict outcomes before accessing simulations
- **ConceptCheck** — Multiple-choice knowledge checks embedded throughout modules
- **Dark Mode** — Persisted theme toggle (shared `emac-theme` key across all three modules)
- **Progress Tracking** — Section visits, prediction gates, concept checks tracked in localStorage
- **PWA** — Installable with offline support

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| Styling | Tailwind CSS v4 |
| State | Zustand (persisted) |
| Routing | react-router-dom v7 |
| Icons | lucide-react |
| Math | KaTeX |
| AI Tutor | Google Gemini API |
| PWA | vite-plugin-pwa |
| Testing | Vitest |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Preview production build
npm run preview
```

### AI Tutor Setup

The AI Tutor uses Google Gemini. To enable it:

1. Get a free API key from [Google AI Studio](https://aistudio.google.com)
2. Click the chat icon in the sidebar
3. Enter your API key when prompted (stored in localStorage only)

### Cross-Module URLs

Copy `.env.example` to `.env` and configure module URLs:

```bash
VITE_MODULE1_URL=https://em-ac-lab-module1.vercel.app
VITE_MODULE2_URL=https://em-ac-lab-module.vercel.app
VITE_MODULE3_URL=https://em-ac-lab-module3.vercel.app
```

## Project Structure

```
src/
├── components/
│   ├── common/        — Reusable: MathWrapper, ConceptCheck, PredictionGate, Tabs, AiTutor, etc.
│   ├── layout/        — Layout shell, Sidebar, ErrorBoundary
│   ├── modules/       — Page-level components (6 pages, lazy-loaded)
│   └── simulations/   — Canvas simulations (SmithChart, CoupledCoils, BounceDiagram, etc.)
├── constants/         — Module URLs
├── hooks/             — useOnlineStatus
├── store/             — Zustand stores (theme + progress)
├── types/             — TypeScript interfaces (transmission line types)
└── utils/             — transmissionMath.ts (all physics calculations), cn.ts
```

## Cross-Module Features

- **Unified dark mode** — Theme preference syncs across all three modules via shared `emac-theme` localStorage key
- **Cross-module navigation** — Links between modules via configurable environment variables
- **Consistent pedagogy** — All modules use PredictionGate, ConceptCheck, CollapsibleSection, and Socratic tutor
- **Progress persistence** — Section visits, prediction gates, concept checks tracked in localStorage (`emac-m3-progress`)

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | TypeScript check + production build |
| `npm run lint` | ESLint with jsx-a11y accessibility rules |
| `npm test` | Run Vitest test suite (52 tests) |
| `npm run preview` | Serve production build locally |

## Disclaimer

This educational application was architected and generated using AI models. While designed to align with rigorous engineering standards, it may contain errors or simplifications. **Always cross-reference** all formulas, diagrams, and explanations with your official course reference books.

## License

© 2026 [CA/EM&CA], LUT University. Licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).

Provided for educational purposes within LUT University. Third-party materials used under Kopiosto License.
