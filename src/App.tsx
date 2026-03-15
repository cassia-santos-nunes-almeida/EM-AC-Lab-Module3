import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { ErrorBoundary } from './components/layout/ErrorBoundary';
import { Layout } from './components/layout/Layout';

// Retry dynamic imports once on failure (handles stale service worker cache)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lazyRetry(importFn: () => Promise<any>) {
  return lazy(() =>
    importFn().catch(() => {
      const reloaded = sessionStorage.getItem('chunk-reload');
      if (!reloaded) {
        sessionStorage.setItem('chunk-reload', '1');
        window.location.reload();
        return new Promise(() => {}); // never resolves — page is reloading
      }
      sessionStorage.removeItem('chunk-reload');
      return importFn();
    }),
  );
}

const Overview = lazyRetry(() => import('./components/modules/Overview').then(m => ({ default: m.Overview })));
const Transformers = lazyRetry(() => import('./components/modules/Transformers').then(m => ({ default: m.Transformers })));
const LumpedDistributed = lazyRetry(() => import('./components/modules/LumpedDistributed').then(m => ({ default: m.LumpedDistributed })));
const TransmissionLines = lazyRetry(() => import('./components/modules/TransmissionLines').then(m => ({ default: m.TransmissionLines })));
const Transients = lazyRetry(() => import('./components/modules/Transients').then(m => ({ default: m.Transients })));
const Antennas = lazyRetry(() => import('./components/modules/Antennas').then(m => ({ default: m.Antennas })));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-engineering-blue-200 dark:border-engineering-blue-800 border-t-engineering-blue-600 dark:border-t-engineering-blue-400 rounded-full animate-spin" />
    </div>
  );
}

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Layout>
        <Routes>
          <Route path="/" element={<ErrorBoundary><Suspense fallback={<PageLoader />}><Overview /></Suspense></ErrorBoundary>} />
          <Route path="/transformers" element={<ErrorBoundary><Suspense fallback={<PageLoader />}><Transformers /></Suspense></ErrorBoundary>} />
          <Route path="/lumped-distributed" element={<ErrorBoundary><Suspense fallback={<PageLoader />}><LumpedDistributed /></Suspense></ErrorBoundary>} />
          <Route path="/transmission-lines" element={<ErrorBoundary><Suspense fallback={<PageLoader />}><TransmissionLines /></Suspense></ErrorBoundary>} />
          <Route path="/transients" element={<ErrorBoundary><Suspense fallback={<PageLoader />}><Transients /></Suspense></ErrorBoundary>} />
          <Route path="/antennas" element={<ErrorBoundary><Suspense fallback={<PageLoader />}><Antennas /></Suspense></ErrorBoundary>} />
        </Routes>
      </Layout>
      <Analytics />
    </Router>
  );
}

export default App;
