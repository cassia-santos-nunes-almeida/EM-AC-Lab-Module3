import '@testing-library/jest-dom';

// jsdom does not implement ResizeObserver, which several canvas simulations
// (e.g. StandingWaveQuiz) attach on mount. Provide a no-op stub so components
// that observe their container can render in tests.
if (typeof globalThis.ResizeObserver === 'undefined') {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;
}
