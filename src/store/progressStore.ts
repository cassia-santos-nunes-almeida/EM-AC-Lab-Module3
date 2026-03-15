import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light' as Theme,
      toggleTheme: () =>
        set((state) => {
          const next = state.theme === 'light' ? 'dark' : 'light';
          applyTheme(next);
          return { theme: next };
        }),
    }),
    {
      name: 'emac-theme',
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.theme);
      },
    }
  )
);

/** Progress tracking for a single section. */
interface SectionProgress {
  visited: boolean;
  predictionGatesAnswered: number;
  predictionGatesCorrect: number;
  conceptChecksCompleted: number;
  hintsUsed: number;
}

function defaultProgress(): SectionProgress {
  return {
    visited: false,
    predictionGatesAnswered: 0,
    predictionGatesCorrect: 0,
    conceptChecksCompleted: 0,
    hintsUsed: 0,
  };
}

interface ProgressState {
  sections: Record<string, SectionProgress>;
  markVisited: (sectionId: string) => void;
  markPredictionGate: (sectionId: string, correct: boolean) => void;
  incrementConceptChecks: (sectionId: string) => void;
  incrementHints: (sectionId: string) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      sections: {},
      markVisited: (sectionId) =>
        set((state) => ({
          sections: {
            ...state.sections,
            [sectionId]: {
              ...(state.sections[sectionId] ?? defaultProgress()),
              visited: true,
            },
          },
        })),
      markPredictionGate: (sectionId, correct) =>
        set((state) => {
          const prev = state.sections[sectionId] ?? defaultProgress();
          return {
            sections: {
              ...state.sections,
              [sectionId]: {
                ...prev,
                predictionGatesAnswered: prev.predictionGatesAnswered + 1,
                predictionGatesCorrect: prev.predictionGatesCorrect + (correct ? 1 : 0),
              },
            },
          };
        }),
      incrementConceptChecks: (sectionId) =>
        set((state) => {
          const prev = state.sections[sectionId] ?? defaultProgress();
          return {
            sections: {
              ...state.sections,
              [sectionId]: {
                ...prev,
                conceptChecksCompleted: prev.conceptChecksCompleted + 1,
              },
            },
          };
        }),
      incrementHints: (sectionId) =>
        set((state) => {
          const prev = state.sections[sectionId] ?? defaultProgress();
          return {
            sections: {
              ...state.sections,
              [sectionId]: {
                ...prev,
                hintsUsed: prev.hintsUsed + 1,
              },
            },
          };
        }),
    }),
    { name: 'emac-m3-progress' }
  )
);
